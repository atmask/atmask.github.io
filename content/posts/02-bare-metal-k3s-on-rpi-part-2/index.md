---
title: 'Part 2: Building a Bare-metal Kubernetes Cluster on Raspberry Pis'
tags: ["kubernetes", "raspberry pi", "k3s", "clusters", "homelab", "ansible", "tailscale", "networking", "pi-hole", "cloud"]
ShowToc: true
date: '2024-07-10T20:30:55-04:00'
draft: true 
---
# Big Idea

In part 1 of this post, I covered the basics of getting started building my Kubernetes cluster on Raspberry Pis. In particular, I laid out my goals and requirements, the build list, the network topology and setup, and the installation of K3s on each of the nodes. I recommend going back and checking out that post first if you haven't already ([Part 1: Building a Bare-metal Kubernetes Cluster on Raspberry Pis](https://blog.fallow.app/posts/02-bare-metal-k3s-on-rpi-part-1/)).

A summary from that post is that I created the subnet `10.100.0.0/24` on my home network for the cluster network. Using DHCP I reserved a small address space of IPs for my nodes and statically assigned the node IPs from within that range. Of my four RPis, three wil be part of the cluster. The fourth node will not run as part of the cluster but will instead run a TailScale subnet router and Pi-Hole for DNS resolution on the cluster network.

In this post, I will review how I configured the Nginx Ingress controller and Cert-Manager for managing HTTPs traffic to my cluster. I will also cover my persistent storage solution that implements PV's in Kubernetes using an SMB share. Finally, I will briefly show my backup strategy that leverages rclone and Backblaze B2 storage. 

As usual, all of my configurations for deploying charts can be found on my GitHub: https://github.com/atmask/helm-charts/tree/main

# Load-Balancing, Ingress, and SSL/TLS Management

Now that, I had my cluster up and running with a CNI installed (I'll do more posts about Calico CNI in the future) I wanted to get the networking setup to access services on my cluster. To achieve this, I added three different installations to my cluster: MetalLB, Nginx Ingress, and Cert-Manager. 

Kubernetes has a resource type called Services. Services function as load balancers by providing a single IP for balancing traffic among a backing set of ephemeral pods running a workload. Kubernetes services resources have a few kinds, namely, ClusterIP, NodePort, and LoadBalancer. There are default implementations for the first two service types in Kubernetes but none for LoadBalancer-type services. Most major cloud providers you use will have their own implementation with their Kubernetes offerings that will configure a Load Balancer with a public IP from their platform to manage the incoming traffic to your service. MetalLB is a solution for those running their own Kubernetes clusters to support services of type LoadBalancer. 

Nginx-Ingress is an Nginx-based solution for managing network traffic entering the cluster. To use the nginx ingress controller, you expose it behind a LoadBalancer. All incoming traffic can then be routed based on various routing rules such as the path to other services in the cluster. This has the advantage of having single point for managing TLS termination and in cloud environments can save you the cost additional LBs would incur if you exposed each service via an LB.

Finally, Cert-Manager. Cert-Manager is an X.509 certificate management service for Kubernetes. It integrates nicely with Let's Encrypt for automatically generating and rotating SSL/TLS certs on domains that you own. It also (with some configuration) integrates with Nginx Ingress for automatically provisioning and managing certificates for new domains and subdomains. 


## MetalLB Concepts

#### IPPools
MetalLB is not able to give you IP addresses out of thin air. This means that you will need to tell it which IP addresses it can alloacte to LoadBalancer services by defining IPPools for your MetalLB installation to use. This IPPool should not overlap with the IP range that the DHCP is configured to assign IPs from. This is where it may be helpful to share the network topolgy again:
![network diagram](images/network4.png)


#### External Announcements and Layer 2 Routing
MetalLB can assign an IP to your LoadBalancer Kubernetes service, however, it also need to make the network outside of your cluster pod-traffic aware of these IPs and to make them routable. MetalLB has two different modes for achieving this goal: BGP and Layer 2. I will focus on Layer 2 mode as that is what I am running and familiar with.

MetalLB in Layer 2 mode works by taking an available IP from the IPPool that you previous allocated and assigning that IP to a node in your cluster. From an outside perspective, it look as if the node has multiple IPs on the network. This is called Layer 2 mode because of how it makes use of ARP (address resolution protocol). ARP is a protocol that takes place in layer 2 of the OSI networking model. In short, ARP works by the source machine sending out a broadcast message for the destination IP of the packet it is trying to route. If a machine has that IP leased then it responds to the original ARP request by returning its mac address. The mac adress is then used in layer 2 networking to send the packet on to the node in the cluster.

![arp diagram](images/arp.png)

Once the packet is routed to the a node in the cluster then `kube-proxy` takes over and routes the packet to one of the services. `kubey-proxy` is an agent that manages iptables in the cluster to support the routing of packaets from the virtual ips of services to the ips of pods assigned via the CNI. This may be the subject of another post in the future but for now I'd refer you to this article: [Kube-Proxy: Waht is it and How it Works](https://medium.com/@amroessameldin/kube-proxy-what-is-it-and-how-it-works-6def85d9bc8f)


#### Deploying MetalLB

Now, to the fun part! MetalLB can be deployed via Helm charts to you cluster. The Helm chart can be found on Artifact Hub. The first install of the MetalLB chaty aditionally installs custom CRDs to the cluster. CRDs are "Custom Resource Definitions" and allow for the creation custom resources like pods or deployments but more relevant to a speicifc application. In the case of MetalLB we care about the `IPAddressPool` and `L2Advertisement` CRDs. After the initial install of the chart we will want to deploy and `IPAddressPool` resource to to tell MetalLB what IP range we have set aside in our subnet for LoadBalancer IPs. We will also deploy an `L2Advertisement` resource that tells Metallb to advertise ips in that pool via Layer 2 networking.

I prefer to use Helm's subcharting functionality to keep all of my chart configurations and version in VCS over time but, in general, the installation process would look like this:
```bash
helm install -n metallb metallb oci://registry-1.docker.io/bitnamicharts/metallb --create-namespace
```

Then create the `IPAddressPool` in `ippool.yaml`
```yaml
# The address-pools lists the IP addresses that MetalLB is
# allowed to allocate. You can have as many
# address pools as you want.
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  # A name for the address pool. Services can request allocation
  # from a specific address pool using this name.
  name: lb-ip-pool
  namespace: metallb-system
spec:
  # A list of IP address ranges over which MetalLB has
  # authority. You can list multiple ranges in a single pool, they
  # will all share the same settings. Each range can be either a
  # CIDR prefix, or an explicit start-end range of IPs.
  addresses:
  - 10.100.0.50-10.100.0.75
```

and the `L2Advertisement` in `advertisement-l2.yaml`
```yaml
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: ip-pool-advertisement
  namespace: metallb-system
spec:
  ipAddressPools:
  - lb-ip-pool
```

then apply both files to the cluster:
```bash
kubectl apply -n metallb -f ippool.yaml
kubectl apply -n metallb -f advertisement-l2.yaml
```

>**Note:** This is the quick and dirty way to do this. I reccommend checking out my repo linked at the start of this article to see how subchartting can be used for maintaining the configuration of third-party charts.

#### Validate with LoadBalancer
If you don't have any applications deployed and want to validate that the metallb installation is wokring you can apply the following LoadBalancer Service to you cluster and verify that an IP from your `IPPool` is attached to the service and an `external-ip`
```yaml
### lb-svc.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```
and apply with `kubectl apply -f lb-svc.yaml`. Then use `kubectl get svc` to verify that an external-ip has been assigned to the service named "my-service".


## Deploying Nginx-Ingress

Now that we can provision IPs for an implementation of LoadBalancer-type services we can move on to our installation of Nginx Ingress. Yes, technically, NodePort could have been used instead of setting up MetalLB but this is about leraning new things! The Nginx Ingresss controller will act as a single point of entry for all traffic to workloads running in my cluster. Nginx Ingress supports host and path-based routing and I will make use of this when setting DNS records for my apps later on. A large benefit of using Nginx Ingress as a single point of entry for all incoming traffic is that I can integrat Nginx Ingress with Cert-Manager so that it is also the single point for managing all TLS termination of incoming traffic. This reduces the management overhead for me.

As with MetalLB, my configuration of the Nginx Ingress controller chart can be found in my charts repo linked at the top of this post. There is a lot less configuration to do for this deployment. I will provide a quick and dirty installation here as well though. All that you need to configure via the values file is the service resource that will act as the load balancer to the ingress controller.
```yaml
### nginx-ingress-values.yaml
controller:
service:
    enabled: true
    type: "LoadBalancer"
    annotations:
      metallb.universe.tf/address-pool: lb-ip-pool # Add the annotation so that metallb will use the previously configured ippool
```

and then install:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install -n nginx-ingress nginx-ingress ingress-nginx/ingress-nginx -f nginx-ingress-values.yaml --create-namespace
```
Hura-ah! The Nginx Ingress controller should now be installed. It will watch of the creation `ingress` resources in the cluster. `ingress` resources are typically deployed with your application and configure how the Nginx Ingress Controller should route traffic to that application.


## Configuring Cert-Manager

As of right now, with MetalLB and the Nginx Ingress controller set up, I would be ready to access my applications. The problem is, any web browser will give me a page saying that the page I am trying to access is insecure and I would have to click through to access my applications. This is an annoyance and so I have setup Cert-Manager to solve this problem. 

Cert-Manager is a tool that can be integrated Nginx Ingress to automatically provision and rotate SSL/TLS certs for your domains. The SSL/TLS certs are used to encrypt the HTTP traffic between your servers and clients. This is what give us HTTPs.

An important thing to know before setting up Cert-Manager is that SSL/TLS certificates can _only be issued for domains that you own_. When Cert-Manager goes to provision or rotate a cert for your service it must pass one of two tests known as ACME challenges (DNS-01 or HTTP-01) to verify that you are the owner of the domain for which you are provisioning a certificate.

#### Installing Cert-Manager


## Local DNS Management with Pi-Hole



# Persistent Storage


### Creating the SMB share

### Setting up the SMB CSI Driver

### Creating a PVC


# Backups with rsync and Backblaze