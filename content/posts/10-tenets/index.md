---
title: 'Tenets of Engineering'
tags: ["SRE", "Systems", "Engineering Management", "opinion"]
ShowToc: false
date: '2025-02-06T21:07:51-05:00'
draft: false
---

# Big Idea

I am getting to the stage of my career know where I have started picking up guiding principles that guide my socio-technical endeavors. I am sure I will continue to learn more and add them here or come back revise these with more wisdom and insight but what I want to start here is a collection of tenets. These tenets are not implementation details or design patterns but are more like paradigms for how we relate to problems, the natural systems that emerge from people thrown into teams, and more.


# Tenets
1. In systems we see hierarchy emerge naturally. In this hierarchy, be it teams or software, look down for functionality and up for vision. This is how an organization scales, this is how code modularizes. [^1]

2. When you encounter an unknown problem in a system don't jump to trying to fix the problem. First _get visibility_ of the data that shows the problem. Second, _fix_ the data with your changes. Third, _validate_ that the data is corrected. [^2]

3. The goal of a DevOps environment is the goal of creating an environment in which change is safe. [^3]



[^1]: I first heard the astute summary "down for functionality and up for vision" from [Charity Majors' interview with the Kubernetes Podcast](https://kubernetespodcast.com/episode/230-observability_engmgmt/) (~6 min mark)
[^2]: Learned this from a great mentor and Sr. developer while I was a working through school
[^3]: Many teams rarely realize how paralyzed their velocity is by the fear that change means instability. The problem is that instability is not a result of change but a result of insufficent controls around how change is managed.

