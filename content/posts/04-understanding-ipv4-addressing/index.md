---
title: 'Understanding CIDR Blocks and IPv4 Addressing'
tags: ["networking", "explainer", "cloud", "IP"]
ShowToc: true
date: '2024-07-29T20:01:16-04:00'
draft: flse
---
# Big Idea

The goal of this post will be to give an overview of how IPv4 addresses. My goal is to incrementally cover three main topics so that you can better understand IPv4 networking. First, I will go over the parts of an IPv4 address, Second I will review how to convert between base 10 and binary representations and IPv4 addressed, Third, I will delve into how CIDR blocks and subnet masks are used for subnetting network.


# Background & History

Before diving into the anatomy of IPv4 let's turn back the page. In 1981, RFC 791 was published. This document outlined the `Internet Protocol` and the IPv4 addressing scheme that would be used to uniquely identify and locate machines on the internet.

The ability to uniquely identify devices on a network is incredibly important. This ability is how we route packages from one machine to other across a network. On a single network a single IP must be uniquely assigned to a single device for seamless communication. The IP address which we will explore today is one part or a larger layered model (known as the OSI model) that facilitate the transfer of data over a network.

Engineers at the time that RCF 791 was published did not realize that magnitude od devices that would one day be connected to the the internet. This has become a problem in recent times as there are a fixed number of globally unique IPv4 addresses. As the number of devices as grown to surpass the number of available IPs engineers have had to apply solution such a Network Address Translation (NAT) to use IPs more effectivley. This is exhaustion of IPv4 addresses has also led to a second standard in IP addressing known as IPv6 which is becoming increasingly common. IPv6 functions in a similar fashion to IPv4 but has rougly 3.4×10^38 address compared to IPv4's approxiamtely 4x10^9 addresses. 


# Anatomy of IPv4

An IPv4 address that you see may look like the following: `192.168.0.2`. This address represents 32-bits but in a base 10 format. Those 32 bits are divided into 4 groups known as octets. Each octet contains 8 bits. These four octet correspond to the four '.' separated parts of the IP address in our example. When working with IPv4, it is often easier to convert the base 10 represenation of the IP address into binary. This means that we could represent the above IP as follows:

<div style="text-align: center;" markdown="1">

`192.168.0.2`

`1100 0000 - 1010 1000 - 0000 0000  - 0000 0010`
</div>

The lowest value in an octet is 0. In binary, this would correspond to an octect of all 0 bits: `0000 0000`. The highest value in an octet is 255. This is the highest number that can be represented with 8 bits (2^8-1): `1111 1111`. We subtract 1 from 2^8 since 2^8 represents the total unique values that can be represented with 8 bits, however, 0 is one of those values that can be represented meaning the values range from 0-255 (i.e. 2^8-1).


# Subnetting IPv4

It is common, when working with IP addresses in the cloud, that you want to create groups of sequential IPs that you can dedicate to a certan use. Often when people will talk about these groups you will hear things like "IP space", "CIDR block", "subnet", or "address range". The key idea is that you want to a broad range of IPs and divide those IPs in an effective way. This always involve balancing two variables: the number of subnets you want to create and the number of devices in each subnet. This segues into the next idea which is that each 32 bit IPv4 address is divided into two parts. A network portion and a host portion. 

Let's say we have a network consisting of all of the IP addresses between `10.0.0.0` to `10.255.255.255`. In that range of IPs, we see that the leading octet always has a value of 10 on the network (ex. `10.0.0.1`, `10.100.29.0`). This is because the first octet, that is the first 8 bits of this IP address, are fixed and represent the **network portion** of the IP address. The following 3 octects can change in value and represent the **host portion** of the IP. Let's look at this in binary:
<div style="text-align: center;" markdown="1">

10.0.0.0

**0000 0110** - 1010 1000 - 0000 0000  - 0000 0010 

(The leading 8 bits in bold are fixed and make up the network protion of the address)
</div>

In this example the host portion allows 16,777,216 hosts. It is very likely that we don't want to dedicate all of those addresses to a single project. Instead we want to partition out a section of IPs for our use-case. 

### CIDR Notation

When it comes to dividing an IP into the network portion and the host portion, the network portion is always represented by a some leading number of bits. How many leading bits are fixed is often up to you, the developer to decide. This means that we need a standard way to tell others how many leading bits are fixed and represent the network portion of the address. To solve this problem we will introduce CIDR notation. CIDR notation, stands for Classless Inter-domain Routing, and is a standard way to tell others how many leading bits make up the network portion of an address. The name, classless inter-domain routing is a nod to an earlier and antiquated method of partitioning IP addresses known as class-based routing. 

Using CIDR notation you will append an `/x` to the end of your network IP. The value of `x` dictates how many leading bits dictate the network portion of the address. In the example above we would represent our address range of `10.0.0.0` to `10.255.255.255` as `10.0.0.0/8`.













