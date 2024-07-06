---
title: 'Bare Metal K3s on Rpi'
tags: ["kubernetes", "raspberry pi", "k3s", "clusters", "homelab", "ansible", "tailscale", "networking", "pi-hole"]
date: '2024-07-05T20:01:16-04:00'
draft: true
---
# Big Idea



# Build List

- [UCTronics RPi CLuster Case](https://www.amazon.ca/UCTRONICS-Upgraded-Enclosure-Raspberry-Compatible/dp/B09S11Q684/ref=sr_1_4?crid=JEX54GWP1JOC&dib=eyJ2IjoiMSJ9.C3MConprGuDjhcyor3xqbHFZTaOYZQ-UMXrywALspdi5SDWO1Y-sxxMRB3z7amREyELAPupHf69L9M0_G6tXn6-eTOy3oFlSRUIhCTcblHSS83Ybn9AOklxMtFUxUUjyEIzgQ55EoAzs2k4aBAdiq3LjLorJwixpeA2lcnQ0ASsZKZmKcsLxN71W4tF8eZyrDuyV2rqy1jPP1ULJoX2kTgTKjnDKSb7gomFYg37cI1r8BPEU_08oIDUHYRJb40ZIqjnUrh8zC9kDpdL0HTpd5veHNOy4vwbqCbKoVQa9xxY.TuM3a7L5F5Lg9ZPACoqnV1JD-cb_h72fsiNueHpHLek&dib_tag=se&keywords=raspberry+pi+cluster+case&qid=1720281735&sprefix=raspberry+pi+cluster+cas%2Caps%2C300&sr=8-4) x1 
- [Raspberry Pi 4b 8Gb](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) x1
- [Rapsberry Pi 4b 2Gb](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) x3
- [1 TB SSD](https://www.amazon.ca/dp/B07LG1QZR8?psc=1&ref=ppx_yo2ov_dt_b_product_details) x1
- [SATA to USB 3.0 Adapter](https://www.amazon.ca/dp/B0C3CRVLCL?psc=1&ref=ppx_yo2ov_dt_b_product_details) x 1
- [TP-Link 5 port Gigabit PoE Network Switch](https://www.amazon.ca/TP-Link-TL-SG1005P-Gigabit-Ethernet-Desktop/dp/B076HZFY3F/ref=sr_1_5?crid=GOMB14TBDH4M&dib=eyJ2IjoiMSJ9.rFy2gUfUpSpNlta74Vt4L7FuHCFtqLlYxHkzGfeaHqfVvdsgsliKExRvTLZfUVOZsJMi6oV_oeiBYjJdc2Ua_d1O9TOlRuSTlxZ0uURcW-Ho48Sac0I01w-HGElUcmY20FcR77wO4VBxcUM9JZ_DoP95RgkPdyIEnUCr_i9yQjEL8Ehb7Mb-Xa-1okeV4VV059LynJa_4W4GCCft1z8wmyg8brwDJViqZCjj6DG4ntWbnoakArdMK_UyexcLV_PDAoFfL_EL8oRz3yDI7CH8tx4ewngLL4atMH26c0he-fQ.v3DpWQNo3aLZ6l1y5IfHnv12MRZ-LPJWjYLpn3H1YJI&dib_tag=se&keywords=PoE&qid=1720282349&sprefix=poe%2Caps%2C153&sr=8-5) x1
- [TP-Link Nano Router](https://www.amazon.ca/TP-Link-TL-WR802N-Wireless-Repeater-300Mbps/dp/B00TQEX8BO/ref=sr_1_7?crid=PDF9HEJ98DVH&dib=eyJ2IjoiMSJ9.KvQ5dyqiNZlOnIsE0BDB9vz-N3ufqlD5goF5RYeXPxn6OF42YXBAlyW2oAtM3n0D8WTKEqcpO6_0mMsUFoZpzFk5YE2XI4r7-_4mC0b-WdkabUp_L8vIkkx9CmG_g2gL_6Srnx6Q6AO36fY1L4z3tg9tB-Xz-8P1cc-EE7tFSALy0BRZa1PPUgbcuWEJaifE3ZcJ1k9jwFDiBpPJ4TgRukyoXAMZekuvOR2Y0mDcdFxbkgYvS5GQ-dY9HdeG56me_TTno__LS8Py-dB-32N_gy4TSELaPbeCnIgnhdDqegg.dC74wSQ2lqQESwGyzGGA2w6ck6SzE4lhHcApK2mE2N4&dib_tag=se&keywords=TP-Link+nano&qid=1720282387&sprefix=tp-link+nano%2Caps%2C159&sr=8-7) x1
- [0.3M Ethernet Cables](https://www.amazon.ca/dp/B01JO3FM7Y/?coliid=I2M4BPL0WE6NVE&colid=3NYBNJHEPFCR4&psc=1&ref_=list_c_wl_lv_ov_lig_dp_it) x4
- [RPi PoE Hat](https://www.amazon.ca/dp/B082ZLDMZ6?psc=1&ref=ppx_yo2ov_dt_b_product_details) x4
> **Note:** I do not receive any comission when you purchase via the above the links. These are just whate worked for my build and are what I reccomend.


# Architecture and Requirements



# Configuring Networking
With a project like this you need to start small and work up. Realistically, this means brekaing up your end goal into small problems that you can mangeably troubleshoot and solve as you go. Trying to take on too much with so many variables and unknowns in one swing will be fatal for a project of this kind.

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
