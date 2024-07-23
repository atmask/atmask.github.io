---
title: 'Understanding CIDR Block and IPv4 Addressing'
tags: ["networking", "explainer", "cloud", "IP"]
ShowToc: true
date: '2024-07-22T20:01:16-04:00'
draft: true
---
# Big Idea

In 1981, RFC 791 was published. This document outlined the `Internet Protocol` and the IPv4 addressing scheme that would be used to uniquely identify and locate machines on the internet. Little did the engineers at that time realize that magnitude od devices that would one day be connected to the the internet.

The goal of this post will be to give an overview of of IPv4 address. My goal is to incrementally cover three main topics so that you can better understand IPv4 networking. First, I will go over the parts of an IPv4 address, Second I will review how to convert between base10 and binary representations and IPv4 addressed, Third, I will delve into how CIDR blocks and subnet masks are used for subnetting network.