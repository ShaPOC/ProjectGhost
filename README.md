<p align="center">
  <a href="http://projectghost.nl">
    <img src="http://projectghost.nl/assets/img/ghost_transparant.png"/>
  </a>
</p>

# Ghost

Uniting hackers and common folk ...

* Version 0.1 ( Stable Spectre )
* Root folder / found inside src/

## What is it?

A small device making it possible for common folk to join the magical world of hackers. We use the Arduino Yun to easily create a device which will make it possible for everyone to perform a MITM attack over WiFi.

## Authenticaion
The development version of Ghost currently contains default data and passwords.
They can ofcourse be found inside the different files in this git, but for the sake of easy usage, here they are.

                | Username          | Password
--------------- | ----------------- | -----------------
SSH             | root              | wD6ejDxLE4UW8ycQQBrv
WiFi            | Ghost             | tN1V68Oy28gw43718043

## Installation

Before proceeding, make sure you have a fresh Arduino Yun device. Either use a new, recently bought one or perform a complete factory reset.

### Upgrade to the latest version
----------------------

Initial check; Is the latest version of OpenWRT installed? The White LED for USB should be lit when powered on for example and the ON LED should be steady green when on.
Also a special Arduino OpenWRT should be installed and not Linino! If you do not have this latest version, upgrade with this guide: http://arduino.cc/en/Tutorial/YunSysupgrade using a download from http://arduino.cc/en/Main/Software (you can find it under the Other Software header).

### Fix some initial problems
----------------------

* First connect to the open Wifi which should be called something like; Arduino-Yun-XXXXXXXXXXXX.
* When connected, log into the OpenWRT Linux system by typing ”ssh root@arduino.local” in the terminal. When it asks for a password, enter ”arduino” and press enter.
* When logged in, type: ”nano /etc/opkg.conf” to edit the opkg configuration. Remove the check signature option by putting a # (hash) sign in front of it. Or just remove the line completely. Now to save the file, we press CTRL+X and press Y.
* Now test if we can update the package list by typing: ”opkg update”. If it says something like: Updated list of available packages, then we’re good to go!

### Extend the rootfs
----------------------

Before, this would be quite a pain to accomplish. But luckily, Federico Fissore & Federico Vanzati created a great Arduino sketch which will do it all automatically.
All you need to know can be found here: http://arduino.cc/en/Tutorial/ExpandingYunDiskSpace. Just follow this guide completely to extend the rootfs.

### Install required packages
----------------------

The following packages are not installed by default, but are required for every piece of Ghost to function. Open up the console by typing ”ssh root@arduino.local” in the terminal.
Now insert the following commands;

* opkg update
* opkg install git node node-serialport node-socket.io node-socket.io-client nodogsplash

We also require the installation of some specific packages not available on the default opkg servers. These packages serve mainly as drivers for the extra required Wireless adapter.
We install them by inserting the following commands;

* cd /tmp
* wget http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2x00-lib_3.3.8%2B2014-01-23.1-1_ar71xx.ipk http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2x00-usb_3.3.8%2B2014-01-23.1-1_ar71xx.ipk http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2800-lib_3.3.8%2B2014-01-23.1-1_ar71xx.ipk http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2800-usb_3.3.8%2B2014-01-23.1-1_ar71xx.ipk
* opkg install kmod-rt2x00-lib_3.3.8\+2014-01-23.1-1_ar71xx.ipk kmod-rt2x00-usb_3.3.8\+2014-01-23.1-1_ar71xx.ipk kmod-rt2800-lib_3.3.8\+2014-01-23.1-1_ar71xx.ipk kmod-rt2800-usb_3.3.8\+2014-01-23.1-1_ar71xx.ipk

After all this, it’s probably a good idea to just reboot the entire thing. You can do this by either typing ”reboot” in the console or … unplug and replug it.

### Install optional developer packages
----------------------

The following packages are really useful for developers who want to improve or change Ghost settings. For example, some of the packages make it possible for you to connect through SFTP to the Ghost for easy file transfer and management.

Open up the console by typing ”ssh root@arduino.local” in the terminal. Now insert the following commands;

* opkg update
* opkg install vsftpd openssh-sftp-server