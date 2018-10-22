# roon-cec-controller-extension

Roon CEC Controller Extension should allow you to control [Roon](https://roonlabs.com/howroonworks.html) Core (Play, Next, Previous, Pause) from your Amplifier Remote connected to a [Roon Bridge](https://kb.roonlabs.com/RoonBridge) via HDMI using CEC protocol.

You should install this extension on a device connected to your HDMI amplifier, probably your Roon Bridge (although you may have the Roon Bridge and the Roon Core on the same computer).

![Roon CEC Controller Extension Schematic](https://raw.githubusercontent.com/benjaminbellamy/roon-cec-controller-extension/master/images/roon-cec-controller-extension.png)

It relies on 
  * the [Node Roon API](https://github.com/RoonLabs/node-roon-api)
  * [libcec](https://github.com/Pulse-Eight/libcec)
  * [hdmi-cec](https://www.npmjs.com/package/hdmi-cec)

It should work with:
  * Raspberry Pi
  * Vero4K+
  * Pulse-Eight USB-CEC Adapter
  * Pulse-Eight Intel NUC CEC Adapter
  * Some Exynos SoCs
  * NXP TDA995x
  * Odroid C2 (Amlogic S905)

This is a work in progress.
Use at your own risks.

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
