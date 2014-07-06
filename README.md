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
opkg install git screen node node-serialport node-socket.io node-socket.io-client nodogsplash wshaper ettercap
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

### Install dsniff
----------------------

Dsniff cannot be installed through opkg but we can fetch it from the trunk of OpenWRT, so that's pretty great!
To do so, open up the console by typing ”ssh root@arduino.local” in the terminal. Now insert the following commands;

```
cd /tmp
```
```
wget http://downloads.openwrt.org/snapshots/trunk/ar71xx/packages/dsniff_2.4b1-3_ar71xx.ipk http://downloads.openwrt.org/snapshots/trunk/ar71xx/packages/libnids_1.24-1_ar71xx.ipk http://downloads.openwrt.org/snapshots/trunk/ar71xx/packages/libpcap_1.5.3-1_ar71xx.ipk
```
```
opkg install dsniff_2.4b1-3_ar71xx.ipk libnids_1.24-1_ar71xx.ipk libpcap_1.5.3-1_ar71xx.ipk
```
> Just so you know, the libnids and libpcap libraries are too old for Urlsnarf to work, so we need these updated versions as well.

### Install SSLStrip
----------------------

Open up the console by typing ”ssh root@arduino.local” in the terminal. Now insert the following commands;

```
opkg update
```
```
opkg install python twisted zope-interface twisted-web libopenssl python-openssl pyopenssl iptables-mod-nat-extra
```

And now we stumble-upon a tiny problem. The installed zope-interface, twisted and twisted-web frameworks are incredibly ancient.
And newer versions are not yet available for this OS / CPU Architecture. But wait,... we cross-compiled them, so they are!

In the folder software/upgrades you will find the new versions in .ipk package.
Transfer them to the Ghost;

```
scp /(folder-containing-ipk-files)/* root@ghost.local:/overlay
```

and then when inside ghost, go to the folder we copied them to;

```
cd /overlay
```

and execute them using the following commands;

```
opkg install --force-overwrite zope-interface_3.8.0-1_ar71xx.ipk twisted_11.1.0-1_ar71xx.ipk twisted-web_11.1.0-1_ar71xx.ipk
```

It may seem strange to force overwrite, but in this case we use newer and better libraries, so it's okay. Besides, there are no
other dependencies at this point.

Continue with installing SSLStrip by inserting the following commands;

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

### Install Ghost SSLSplit
----------------------
Momentarely we have a Beta version of SSLSplit running on our Ghost.
It's in development here; https://github.com/ShaPOC/ProjectGhost/tree/master/software/sslsplit

Althought we have not tested it thoroughly, we have tested it's stability and it's working fine.
To install it, insert the following commands:

```
opkg update
```
```
opkg install libevent2 libevent2-core libevent2-extra libevent2-openssl libevent2-pthreads openssl-util iptables-mod-nat-extra
```
```
sysctl -w net.ipv4.ip_forward=1
```
Now we need to download the specific SSLSplit version for Ghost available in the software folder of this git.
You can use SCP (secure copy protocol) over SSH to place the folder sslstrip into the /tmp folder of the Arduino Yun.
So logout or open another terminal screen and insert the command;

```
scp -r (sslsplit bin location) root@arduino.local:/tmp
```
```
mv /tmp/sslsplit /usr/bin/sslsplit
```
```
chmod 755 /usr/bin/sslsplit
```

And after all this, you will be able to run SSLSplit on your OpenWRT Arduino Yun! Run:
```
sslsplit -h
```
To find out the possibilities of this great MITM tool. If you want to intercept SSL connections properly, then you will
need to generate a Root Certificate for the client to trust. Below you will find the commands to generate these certificates.

```
mkdir /etc/ssh; cd /etc/ssh
```
```
openssl genrsa -out ca.key 4096
```
```
openssl req -new -x509 -days 1826 -key ca.key -out ca.crt
```

[travis-url]: https://travis-ci.org/ShaPOC/ProjectGhost
[travis-image]: https://travis-ci.org/ShaPOC/ProjectGhost.svg?branch=master