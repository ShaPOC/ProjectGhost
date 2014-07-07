#
#   ______     __  __     ______     ______     ______
#  /\  ___\   /\ \_\ \   /\  __ \   /\  ___\   /\__  _\
#  \ \ \__ \  \ \  __ \  \ \ \/\ \  \ \___  \  \/_/\ \/
#   \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\    \ \_\
#    \/_____/   \/_/\/_/   \/_____/   \/_____/     \/_/
#
#!/bin/sh
 
# /etc/config/show_wifi_clients.sh
# Shows MAC, IP address and any hostname info for all connected wifi devices
# written for openwrt 12.09 Attitude Adjustment

# list all wireless network interfaces 
# (for MAC80211 driver; see wiki article for alternative commands)
for interface in `iw dev | grep Interface | cut -f 2 -s -d" "`
do
  # for each interface, get mac addresses of connected stations/clients
  maclist=`iw dev $interface station dump | grep Station | cut -f 2 -s -d" "`
  # for each mac address in that list...
  for mac in $maclist
  do
    # If a DHCP lease has been given out by dnsmasq,
    # save it.
    ip="UNKN"
    host=""
    ip=`cat /tmp/dhcp.leases | cut -f 2,3,4 -s -d" " | grep $mac | cut -f 2 -s -d" "`
    host=`cat /tmp/dhcp.leases | cut -f 2,3,4 -s -d" " | grep $mac | cut -f 3 -s -d" "`
    # ... show the mac address:
    echo -e "$ip|$host|$mac"
  done
done
