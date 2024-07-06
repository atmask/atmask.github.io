---
title: 'Bare Metal K3s on Rpi'
tags: ["kubernetes", "raspberry pi", "k3s", "clusters", "homelab", "ansible", "tailscale", "networking", "pi-hole", "cloud"]
date: '2024-07-05T20:01:16-04:00'
draft: false
---

# Big Idea

![cluster](images/cluster.png)

From the start of my career I have been fascinated by Kubernetes. I love distributed systems and the rich history of how we have arrived where we are today with distributed system. We are living in the active evolution of our understanding of a vision for cloud computing. In the early years the vision was to present a homogenous Unix-like interface for managing an underlying collection of servers such as BOINC. Now we live in the world of many small virtualized unix environments distributed across servers, sharing compute. 

One of the main drivers for our current state has been the advent of containerization and container orchestration. The goal of this blog is to go over the considerations and design of my baremetal Raspberry Pi Kubernetes cluster. This project was my adventure in going beyond being a user of Kubernetes services from Cloud Provider to understanding the physical magic behind the scenes.


# Architecture and Requirements

Before diving into the build list, architecture, and design for my build I want to review what, for me, were goals and requirements for setting up this project. 

### Portability
First, portability. I am in a season of live that is nomadic. I'm in different apartments for a year or two  at a time. I want a build that I can easily unplug, bring somewhere else, and plug-in without needing any extra steps for set up. 

### Isolation & Security
Second, and closely rleated, isolation. I want the network that my cluster runs on to be on a subnet isolated from the LAN network to which it connects. I want all IPs to be in their own non-overlapping address space. I also don't want my service publicly available or available to anyone connected to the LAN of my home network. They should only be accessible via VPN connection to the cluster network or via wireless/wired connection to the cluster LAN.

### HTTPs
My third requirement is that all of my services should be available over an HTTPs connection. Sure, the VPN is encrpyted, however, I want TLS termination at the cluster and not the only the VPN. Further, I don't want browsers complaining that the site I am visiting is not secure. That is a bother for me and red flag for any firends or family who connect to my services.

### DNS
Lastly, I want my services acessible via DNS records when a user is connected via VPN. I want the DNS server to sit on the LAN network and become the primary DNS server for users when they connect to the network. This keeps my A records off of public DNS servers.


# Build List
The following is my build list for the project:

- [UCTronics RPi CLuster Case](https://www.amazon.ca/UCTRONICS-Upgraded-Enclosure-Raspberry-Compatible/dp/B09S11Q684/ref=sr_1_4?crid=JEX54GWP1JOC&dib=eyJ2IjoiMSJ9.C3MConprGuDjhcyor3xqbHFZTaOYZQ-UMXrywALspdi5SDWO1Y-sxxMRB3z7amREyELAPupHf69L9M0_G6tXn6-eTOy3oFlSRUIhCTcblHSS83Ybn9AOklxMtFUxUUjyEIzgQ55EoAzs2k4aBAdiq3LjLorJwixpeA2lcnQ0ASsZKZmKcsLxN71W4tF8eZyrDuyV2rqy1jPP1ULJoX2kTgTKjnDKSb7gomFYg37cI1r8BPEU_08oIDUHYRJb40ZIqjnUrh8zC9kDpdL0HTpd5veHNOy4vwbqCbKoVQa9xxY.TuM3a7L5F5Lg9ZPACoqnV1JD-cb_h72fsiNueHpHLek&dib_tag=se&keywords=raspberry+pi+cluster+case&qid=1720281735&sprefix=raspberry+pi+cluster+cas%2Caps%2C300&sr=8-4) x1 
- [Raspberry Pi 4b 8Gb](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) x1
- [Rapsberry Pi 4b 2Gb](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) x3
- [1 TB SSD](https://www.amazon.ca/dp/B07LG1QZR8?psc=1&ref=ppx_yo2ov_dt_b_product_details) x1
- [SATA to USB 3.0 Adapter](https://www.amazon.ca/dp/B0C3CRVLCL?psc=1&ref=ppx_yo2ov_dt_b_product_details) x 1
- [TP-Link 5 port Gigabit PoE Network Switch](https://www.amazon.ca/TP-Link-TL-SG1005P-Gigabit-Ethernet-Desktop/dp/B076HZFY3F/ref=sr_1_5?crid=GOMB14TBDH4M&dib=eyJ2IjoiMSJ9.rFy2gUfUpSpNlta74Vt4L7FuHCFtqLlYxHkzGfeaHqfVvdsgsliKExRvTLZfUVOZsJMi6oV_oeiBYjJdc2Ua_d1O9TOlRuSTlxZ0uURcW-Ho48Sac0I01w-HGElUcmY20FcR77wO4VBxcUM9JZ_DoP95RgkPdyIEnUCr_i9yQjEL8Ehb7Mb-Xa-1okeV4VV059LynJa_4W4GCCft1z8wmyg8brwDJViqZCjj6DG4ntWbnoakArdMK_UyexcLV_PDAoFfL_EL8oRz3yDI7CH8tx4ewngLL4atMH26c0he-fQ.v3DpWQNo3aLZ6l1y5IfHnv12MRZ-LPJWjYLpn3H1YJI&dib_tag=se&keywords=PoE&qid=1720282349&sprefix=poe%2Caps%2C153&sr=8-5) x1
- [TP-Link Nano Router](https://www.amazon.ca/TP-Link-TL-WR802N-Wireless-Repeater-300Mbps/dp/B00TQEX8BO/ref=sr_1_7?crid=PDF9HEJ98DVH&dib=eyJ2IjoiMSJ9.KvQ5dyqiNZlOnIsE0BDB9vz-N3ufqlD5goF5RYeXPxn6OF42YXBAlyW2oAtM3n0D8WTKEqcpO6_0mMsUFoZpzFk5YE2XI4r7-_4mC0b-WdkabUp_L8vIkkx9CmG_g2gL_6Srnx6Q6AO36fY1L4z3tg9tB-Xz-8P1cc-EE7tFSALy0BRZa1PPUgbcuWEJaifE3ZcJ1k9jwFDiBpPJ4TgRukyoXAMZekuvOR2Y0mDcdFxbkgYvS5GQ-dY9HdeG56me_TTno__LS8Py-dB-32N_gy4TSELaPbeCnIgnhdDqegg.dC74wSQ2lqQESwGyzGGA2w6ck6SzE4lhHcApK2mE2N4&dib_tag=se&keywords=TP-Link+nano&qid=1720282387&sprefix=tp-link+nano%2Caps%2C159&sr=8-7) x1
- [0.3M Ethernet Cables](https://www.amazon.ca/dp/B01JO3FM7Y/?coliid=I2M4BPL0WE6NVE&colid=3NYBNJHEPFCR4&psc=1&ref_=list_c_wl_lv_ov_lig_dp_it) x4
- [RPi PoE Hat](https://www.amazon.ca/dp/B082ZLDMZ6?psc=1&ref=ppx_yo2ov_dt_b_product_details) x4
> **Note:** I do not receive any commission when you purchase via the above the links. These are just what worked for my build and are what I recommend.



# Configuring Networking
With a project like this you need to start small and work up. Realistically, this means breaking up your end goal into small problems that you can manageably troubleshoot and solve as you go. Trying to take on too much with so many variables and unknowns in one swing will be fatal for a project of this kind.

### Static Node IPs

### DHCP Settings

### Validate TailScale Connectivity

# Persistent Storage


# Configuring Persistent Storage



# Load-Balancing, Ingress, and SSL/TLS Management


### Configuring MetalLB

### Validate with LoadBalancer


### Configuring Nginx-Ingress


### Configureing Cert-Manager


### DNS Management
