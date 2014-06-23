<p align="center">
  <a href="http://projectghost.nl">
    <img src="http://projectghost.nl/assets/img/ghost_transparant.png"/>
  </a>
</p>

# Ghost [![Build Status][travis-image]][travis-url]

Uniting hackers and common folk ...

* Version 0.1 ( Stable Spectre )
* Root folder / found inside src/

## What is it?

A small device making it possible for common folk to take a sneakpeek inside the magical world of hackers. We use the Arduino Yun to create a device which will make it possible for everyone to easily simulate a MITM attack over WiFi.

## Authentication
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
* When logged in, type:
```
nano /etc/opkg.conf 
```
* Remove the check signature option by putting a # (hash) sign in front of it. Or just remove the line completely. Now to save the file, we press CTRL+X and press Y.

* Now test if we can update the package list by typing:
```
opkg update
```

> If it says something like: Updated list of available packages, then we’re good to go!

### Extend the rootfs
----------------------

Before, this would be quite a pain to accomplish. But luckily, Federico Fissore & Federico Vanzati created a great Arduino sketch which will do it all automatically.
All you need to know can be found here: http://arduino.cc/en/Tutorial/ExpandingYunDiskSpace. Just follow this guide completely to extend the rootfs.

> Small tip: Do not perform the extend over WiFi, use USB instead. If for some reason the Arduino software doesn't recognize the device, then try a different USB cable!

### Install required packages
----------------------

The following packages are not installed by default, but are required for every piece of Ghost to function. Open up the console by typing ”ssh root@arduino.local” in the terminal.
Now insert the following commands;

```
opkg update
```
```
opkg install git screen node node-serialport node-socket.io node-socket.io-client nodogsplash wshaper
```

We also require the installation of some specific packages not available on the default opkg servers. These packages serve mainly as drivers for the extra Wireless adapter.
We install them by inserting the following commands;

```
cd /tmp
```
```
wget http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2x00-lib_3.3.8%2B2014-01-23.1-1_ar71xx.ipk http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2x00-usb_3.3.8%2B2014-01-23.1-1_ar71xx.ipk http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2800-lib_3.3.8%2B2014-01-23.1-1_ar71xx.ipk http://downloads.arduino.cc/openwrtyun/1/packages/kmod-rt2800-usb_3.3.8%2B2014-01-23.1-1_ar71xx.ipk
```
```
opkg install kmod-rt2x00-lib_3.3.8\+2014-01-23.1-1_ar71xx.ipk kmod-rt2x00-usb_3.3.8\+2014-01-23.1-1_ar71xx.ipk kmod-rt2800-lib_3.3.8\+2014-01-23.1-1_ar71xx.ipk kmod-rt2800-usb_3.3.8\+2014-01-23.1-1_ar71xx.ipk
```

After all this, it’s probably a good idea to just reboot the entire thing. You can do this by either typing ”reboot” in the console or … unplug and replug it.

### Install optional developer packages
----------------------

The following packages are really useful for developers who want to improve or change Ghost settings. For example, some of the packages make it possible for you to connect through SFTP to the Ghost for easy file transfer and management.

Open up the console by typing ”ssh root@arduino.local” in the terminal. Now insert the following commands;

```
opkg update
```
```
opkg install vsftpd openssh-sftp-server
```

### Install Ghost SSLSplit

Momentarely we have a Alpha version of SSLSplit running on our Ghost.
It's in development here; https://github.com/ShaPOC/ProjectGhost/tree/master/software/sslsplit

There is no easy guide to using this yet, but there will be soon.
For now, if you want to experiment, download the Binary to your Arduino Yun and test it out using the instructions as found on http://www.roe.ch/SSLsplit.

### Install SSLStrip (Deprecated - Optional)
----------------------
__WARNING: This installation tutorial remains in the readme for this repository only for reference! You should always prefer the Ghost build of SSLSplit when using Ghost!__

Open up the console by typing ”ssh root@arduino.local” in the terminal. Now insert the following commands;

```
opkg update
```
```
opkg install python twisted zope-interface twisted-web libopenssl python-openssl pyopenssl iptables-mod-nat-extra
```

Now we need to download the specific SSLStrip version for Ghost available in the software folder of this git.
You can use SCP (secure copy protocol) over SSH to place the folder sslstrip into the /tmp folder of the Arduino Yun.
So logout or open another terminal screen and insert the command;

```
scp -r (sslstrip folder location) root@arduino.local:/tmp
```

> If fore some reason you do not want to use the Ghost version, then use the original. But in this case we will not
guarantee that it will work flawlessly with your yun.
```
cd /tmp
```
```
wget http://www.thoughtcrime.org/software/sslstrip/sslstrip-0.9.tar.gz
```
```
tar -xzvf sslstrip-0.9.tar.gz; mv sslstrip-0.9 sslstrip
```
> This way the latest version is downloaded and unpacked in the same place you would find it when using the SCP command as shown above

And then we can start to install. So log back into the console and insert the following commands;

```
cd /tmp/sslstrip
```
```
python ./setup.py install
```
```
echo "1" > /proc/sys/net/ipv4/ip_forward
```

But ofcourse, this is not all. Because Zope Interface is installed just a little bit differently on OpenWRT, we need a symlink to help SSLStrip out a little bit.

```
ln -s /usr/lib/python2.7/site-packages/zope/interface/__init__.py /usr/lib/python2.7/site-packages/zope/__init__.py
```

[travis-url]: https://travis-ci.org/ShaPOC/ProjectGhost
[travis-image]: https://travis-ci.org/ShaPOC/ProjectGhost.svg?branch=master