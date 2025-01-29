---
title: Minimalistic server environment.
post-image: https://pxreyoeukohfhvbwcbgd.supabase.co/storage/v1/object/public/post%20images//desk.avif
description: Home server environment... why not?
tags:
- Proxmox
- Nginx
- Home Server
- Alpine Linux
- Ubuntu
- Home Assistant
- OpenVPN
- dnsmasq
- Grafana
- Prometheus
- phpMyAdmin
- MySQL
- MariaDB
- SSH
- SFTP
- Node.js
- Samba
---

Hi! I'd like to share an example of a simple home server environment. Some time ago, I published an article explaining how to use an old phone as a server to host a Node.js backend. This solution is fully functional and can be quite efficient in most cases. In my home network, I use various devices such as smart bulbs, NodeMCU boards, Raspberry Pi Pico (which controls devices and automations—one even controls an RC car via a mobile phone), phones, PCs, laptops, tablets, TVs, printers, Chromecasts, cameras, and more.

The core of my network is a mini PC stack (for example, an HP EliteDesk) running Proxmox. The main unit handles basic tasks such as:

-   VPN (OpenVPN) to access my LAN,
-   DNS (dnsmasq) to improve internal traffic handling,
-   Nginx to route all incoming traffic (reverse proxy, SSL certificate management, CORS handling, etc.),
-   Home Assistant (a VM with Home Assistant OS),
-   Random game servers (Zomboid, Minecraft, etc.).

I also run databases (MariaDB and MongoDB) along with phpMyAdmin. I've set up simple storage accessible from a container (a bound disk on Proxmox running Ubuntu) via Samba, FTP or JellyFinn if I need to share files with others. The rest of the setup consists of various web applications and websites (using Apache, Nginx, Node, Jekyll, and WordPress).

Everything that could be wired is connected via Ethernet cable. On top of that, I use a basic home router and manageable Zyxel switches. In short, I host about ten to thirty LXC containers per host. Containers hosting minor, isolated services use Alpine Linux. This lightweight, tailored solution keeps each container minimal, with 256–512 MB of RAM and 8 GB of storage space per instance. Each container has a mirror. Greater and more complex applications with more dependencies are hosted on Ubuntu LXC instances. I’ve created my own templates with preinstalled tools such as Midnight Commander, Git, and others.

My goal was to create a minimalist and efficient ecosystem. Security is always a priority, but I aimed to optimize the environment without introducing any major vulnerabilities.

I have numerous subdomains for use within my local network, such as `phpmyadmin.mydomain.com`, and a few visible to the outside world, managed by Nginx mainly to handle backend requests. For example:

    const targetURL = 'https://lastfmfiddler.tomektomasik.pl';

      const response = await axios.get(`${targetURL}/userInfo?user=${username}`);

To access the code of my applications, I use SSH. I'm always trying to remove the root user and access everything via SSH, with key additionally secured by a password. Sometimes I use a different port, so my connection strings are stored in .sh or .bat files to make my life easier. For my convenience and mainly because of my laziness, I use SFTP over FileZilla client. To make changes to my apps, I access them via SSH Explorer inside VS Code.
To monitor my small environment I'm using Prometheus and Grafana.


![https://pxreyoeukohfhvbwcbgd.supabase.co/storage/v1/object/public/post%20images//grafana.avif](https://pxreyoeukohfhvbwcbgd.supabase.co/storage/v1/object/public/post%20images//grafana.avif)


In the future, I will try to describe the process of configuring individual elements as well as the most common issues, which will always be plentiful...