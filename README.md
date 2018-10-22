# roon-cec-controller-extension

Roon CEC Controller Extension should allow you to control [Roon](https://roonlabs.com/howroonworks.html) Core (Play, Next, Previous, Pause) from your Amplifier Remote connected to a [Roon Bridge](https://kb.roonlabs.com/RoonBridge) via HDMI using CEC protocol.

It relies on 
  * the [Node Roon API](https://github.com/RoonLabs/node-roon-api)
  * [libcec](https://github.com/Pulse-Eight/libcec)
  * [NPM hdmi-cec] (https://www.npmjs.com/package/hdmi-cec)

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
## Install cec-utils and libcec
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
