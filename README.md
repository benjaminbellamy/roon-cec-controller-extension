# roon-cec-controller-extension

Roon CEC Controller Extension should allow you to control [Roon](https://roonlabs.com/howroonworks.html) Core (⏮, ⏪, ▶️, ⏯, ⏸, ⏹, ⏩, ⏭ ) from your audio amplifier remote control, having your amplifier connected to a [Roon Bridge](https://kb.roonlabs.com/RoonBridge) via HDMI using CEC protocol.

You should install this extension on a device connected to your HDMI amplifier, probably your Roon Bridge (although you may have the Roon Bridge and the Roon Core on the same computer).

_**NB**: This extension is heavily inspired by [roon-extension-powermate](https://github.com/RoonLabs/roon-extension-powermate)._

![Roon CEC Controller Extension Schematic](https://raw.githubusercontent.com/benjaminbellamy/roon-cec-controller-extension/master/images/roon-cec-controller-extension.png)

It relies on 
  * the [Node Roon API](https://github.com/RoonLabs/node-roon-api)
  * [hdmi-cec](https://www.npmjs.com/package/hdmi-cec) which relies on [libcec](https://github.com/Pulse-Eight/libcec)

It should work with any device that supports libcec:
  * [Raspberry Pi](https://www.raspberrypi.org/)
  * [Vero4K+](https://osmc.tv/vero/)
  * [Pulse-Eight USB-CEC Adapter](https://www.pulse-eight.com/p/104/usb-hdmi-cec-adapter)
  * [Pulse-Eight Intel NUC CEC Adapter](https://www.pulse-eight.com/p/154/intel-nuc-hdmi-cec-adapter)
  * Some Exynos SoCs
  * NXP TDA995x
  * Odroid C2 (Amlogic S905)

This is a work in progress (but it works for me).
Use at your own risks.

**Todo**:
  * Add volume control from Roon Core to the amplifier.
  * Display music titles on Amplifier
  * Power on amplifier / switch source automatically

## Install Node

[Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
```
wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
## Install CEC components

### Install cec-utils and libcec (if not already installed)
```
sudo apt-get install cec-utils
```

### Oh no, it doesn't work!
If you see the following error message while running the program, you probably have to take a closer look at the two following paragraphs.
```
events.js:183
      throw er; // Unhandled 'error' event
      ^

Error: read ECONNRESET
    at _errnoException (util.js:992:11)
    at Pipe.onread (net.js:618:25)
```

### Raspberry Pi: /dev/vchiq permission errors
If you are on Raspberry Pi, you probable need to do these:
```
echo 'SUBSYSTEM=="vchiq",GROUP="video",MODE="0660"' > /etc/udev/rules.d/10-vchiq-permissions.rules
usermod -a -G video YourUnprivilegedUser
```
Log off, log back in.

### Pulse-Eight adapter: '/dev/ttyACM0': Permission denied
If you are using a [Pulse-Eight Intel NUC CEC Adapter](https://www.pulse-eight.com/p/154/intel-nuc-hdmi-cec-adapter), you probably want to add the current user to _dialout_ group so that you have access to `/dev/ttyACM0`:
```
usermod -a -G dialout USERNAME
```
Log off, log back in.

#### Testing cec-utils
```
echo "scan" | cec-client -s -d 1
```

## Install and run roon-cec-controller-extension
```
git clone https://github.com/benjaminbellamy/roon-cec-controller-extension.git
cd roon-cec-controller-extension/
npm install
node .
```
Open Roon Control software, go to _Setting_, then _Extensions_ and enable _Roon CEC Controller_.

## Run as a service
### Using systemd (Linux)
- Edit `roon-cec-controller-extension.service` so that `ExecStart` directories match your configuration.
- Copy `roon-cec-controller-extension.service` to `/etc/systemd/system/`:
```
sudo cp roon-cec-controller-extension.service /etc/systemd/system/
```
- Give access to _nobody_ to your CEC hardware, for instance on NUC:
```
usermod -a -G dialout nobody
```
- Run the service:
```
systemctl start roon-cec-controller-extension.service 
```


Et voilà !
