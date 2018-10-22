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

## Install Node

[Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
```
wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
## Install cec-utils and libcec (if not already installed)
```
sudo apt-get install cec-utils
```

Testing cec-utils:
```
echo 'SUBSYSTEM=="vchiq",GROUP="video",MODE="0660"' > /etc/udev/rules.d/10-vchiq-permissions.rules
usermod -a -G video YourUnprivilegedUser
```
Log off, log back in.
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

Et voilà !
