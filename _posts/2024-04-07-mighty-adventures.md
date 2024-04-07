---
title: Mighty adventures!
layout: post
description: Monsters that you can summon by performing the alchemical process of
  turning an old brick into a magnificent server.
post-image: https://pxreyoeukohfhvbwcbgd.supabase.co/storage/v1/object/public/post%20images/phone.jpg
tags:
- Node.js
- Termux
- TWRP
- Android
- SuperSu
- Magisk
- nginx
- CORS
- LineageOS
- Acme.sh
- Certbot
- ADB
- DNS
- DDNS
- SSL
---

Mighty adventures you can experience, being someone like me.

Reading this post may help you avoid some of the problems if you ever decide to convert an old phone into a server. I did it because I am crazy. Don't be like me.


While trying to get my vintage [LG G2 d802](https://www.gsmarena.com/lg_g2-5543.php) to work as a server, I stumbled across a few difficulties that consumed several hours of time, which I am perpetually short of. The first obstacle was a damaged display, which meant I had to use a mouse during the initial setup (luckily it already had USB OTG). In addition, the phone had a screen lock on (pattern). It was returned to me in this condition, by the previous owner. I did not want to do a hard reset to avoid losing data. The phone had debug mode disabled and could not be seen through [ADB](https://developer.Android.com/tools/adb). It dawned on me that the phone should have [TWRP](https://twrp.me/about/) installed. So I finally pressed the magic combination used for a hard reset (volume down + power on a turned-off phone and pressing power again when the logo appears). I selected the restore option and.... eureka! To my eyes appeared the TWRP logo. I ran TWRP's file explorer and deleted several files responsible for storing the screen lock.

  

- password.key
- pattern.key
- locksettings.db
- locksettings.db-shm
- locksettings.db-wal

  

I restarted the phone and the lock did not appear. I made a copy of the phone's contents and this time performed a hard reset.

  

From that point on, it should have been smooth sailing… or so I thought. Another obstacle was the Android version itself: 5.0.2 "[Lolipop.](https://pl.wikipedia.org/wiki/Android_Lollipop)" This was the latest version the manufacturer had released. Unfortunately, the Termux, to work properly, needs Android version at least 7.0. And here I made my first major mistake. Instead of trying to upgrade the Android, I decided to install a [relic version of Termux](https://github.com/termux/termux-app/wiki/Termux-on-Android-5-or-6). After running it, it turned out that half of the packages did not work, or would not download.... There was no way out, there had to be some way to update the Android.... I searched the forums and found a promising candidate, it was [LineageOS](https://lineageos.org/). However, it turned out that the developers no longer supported the system for the LG G2 and removed the files from the site. However, [XDA](https://xdaforums.com/) did not fail and I managed to find a man who was developing the project on the side. I found what I wanted, but Intuition told me not to install the latest version on such an old phone. I chose [Lineage OS version 15.1 with Android 8.1.0](https://xdaforums.com/t/rom-lineageos-15-1-official-g2-d800-d801-d802-d803.3707239/), which was one of the few good decisions I made during the process. In order to install Lineage I needed to update TWRP to version 3.3.1-0. I downloaded "some" version and tried to install, unfortunately, an error appeared during the process.

The phone caught a [bootloop](https://en.wikipedia.org/wiki/Bootloop), and I already knew that I had turned it into a brick. That was indeed the case. Normally I would have thrown it out the window, unfortunately I have a grille in it (did I tell you I'm crazy?), so there was another problem to solve. I had to go to the basement to get a hacksaw. It turned out that I was too lazy to get up from my chair and fatigue myself to get the tools, so I decided to resurrect the ill-fated phone. Fortunately, after removing the lock, I enabled developer mode and debugging and made sure the phone had root ([Super SU](https://en.wikipedia.org/wiki/SuperSU)). This allowed me to complete the next steps. There was nothing left for me to do but to find and install the drivers for the chip (Qualcomm) and expect to detect it in a state that would save me from taking the phone apart and making a jumper.

After connecting the phone via USB, a million partitions appeared in the system, and happily the chipset signature indicated grace. All that was left was to run [SRKtool_2.0](https://xdaforums.com/t/tool-srk-tool-2-1-root-unbrick-utility-backup-20150507.3079076/) and run the repair process, after which I was able to (finally) install a working TWRP and LineageOS and again root the phone, this time using the [MAGISK](https://github.com/topjohnwu/Magisk) package.

The next steps I took are described in [this](https://www.tomektomasik.pl/blog/nodejs-server-on-your-mobile-device) post.

  

Several configurations still need to be done to get the server working properly and allow it to handle queries.

1. In the [DNS](https://pl.wikipedia.org/wiki/Domain_Name_System) settings, we add an "A" record and a subdomain pointing to the [IP](https://en.wikipedia.org/wiki/IP_address#Public_address). (which must be public and static) of our router. Otherwise, you will have to use solutions such as [DDNS](https://pl.wikipedia.org/wiki/DDNS).
2. We need to do "[forwarding](https://en.wikipedia.org/wiki/Port_forwarding)", redirecting requests from ports 80 (HTTP) and 443 (HTTPS) to the device with the server (in this case, the phone.).
3. If we want to run more than one application we will need a reverse proxy server (we can use, for example, [nginx](https://www.nginx.com/) for this).
4. If we want to redirect a domain/subdomain, we need to redirect it and the DNS provider accordingly, then configure our nginx to send queries to the appropriate server on the local network (using local address and port, example: 192.168.0.15:3000).
5. We'd also probably want to install an [SSL](https://pl.wikipedia.org/wiki/Transport_Layer_Security) certificate and run an auto-renewal script, which with termux may not be as easy as you might think. The most common practice today is to use [Certbot](https://certbot.eff.org/) for this purpose, or you can use the [acme.sh](https://github.com/acmesh-official/acme.sh) script, which is typically a Unix solution. Such scripts allow automatic certificate renewal. You must remember that it must be executed on the same host on which the ssl-enabled server is located, if you have more ssl-enabled machines it may be easy to make a mistake.
6. We need to bypass Unix security to allow the server to operate on the required ports, which carries a lot of security risks that we also need to consider.
7. Finally, we need to configure our server's response to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers, which in this case we do on our reverse proxy (when there is no need to do so, because, for example, we host one application we add CORS support directly in it. For example, in the case of single node express middleware application).

  

That's all, you may have found tips here that you found useful. With this post, I wanted to point out that every process is fraught with pitfalls and can create problems, but problems are something we deal with more easily every time. It is something inevitable. It's time for you to like them.
