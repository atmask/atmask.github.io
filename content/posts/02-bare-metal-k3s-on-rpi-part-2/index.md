---
title: 'Part 2: Buidling a Bare-metal Kubernetes Cluster on Raspberry Pis'
tags: ["kubernetes", "raspberry pi", "k3s", "clusters", "homelab", "ansible", "tailscale", "networking", "pi-hole", "cloud"]
ShowToc: true
date: '2024-07-10T20:30:55-04:00'
draft: true
---
# Big Idea

In part 1 of this post ...

# Load-Balancing, Ingress, and SSL/TLS Management

Now that, I had my cluster up and running with a CNI installed (I'll do more posts about Calico CNI in the future) I wanted to get the networking setup to access services on my cluster. To achieve this, I added three different installations to my cluster: MetalLB, Nginx Ingress, and Cert-Manager. 

Kubernetes has a resource type called Services. Services function as load balancers by providing a single IP for balancing traffic among a backing set of ephemeral pods running a service. Services have a few kinds, namely, ClusterIP, NodePort, and LoadBalancer. There are default implementations for the first two service types in Kubernetes but none for LoadBalancer-type services. Most major cloud providers you use will have their own implementation with a Kubernetes offering that will assign a public IP to an LB for ingress traffic to your services. MetalLB is a solution for those running their own Kubernetes clusters to support services of type LoadBalancer. 

Nginx-Ingress is an Nginx-based solution for managing network traffic entering the cluster. To use the nginx ingress controller, you expose it behind a LoadBalancer. All incoming traffic can then be routed based on various routing rules such as the path to other services in the cluster. This has the advantage of having single point for managing TLS termination and in cloud environments can save you the cost additional LBs would incur if you exposed each service via an LB.

Finally, Cert-Manager. Cert-Manager is an X.509 certificate management service for Kubernetes. It integrates nicely with Let's Encrypt for automatically generating and rotating SSL/TLS certs on domains that you own. It also (with some configuration) integrates with Nginx Ingress for automatically provisioning and managing certificates for new domains and subdomains. 


### Configuring MetalLB

Ensure it is in the LAN but outside of the DHCP address range to avoid collisions

### Validate with LoadBalancer


### Configuring Nginx-Ingress


### Configureing Cert-Manager


### Local DNS Management with Pi-Hole



# Persistent Storage


### Creating the SMB share

### Setting up the SMB CSI Driver

### Creating a PVC


# Backups with rsync and Backblaze
