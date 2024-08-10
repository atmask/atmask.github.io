---
title: 'Intro to K8s Autoscaling'
tags: ["explainer", "cloud", "kubernetes", "autoscaling"]
ShowToc: true
date: '2024-08-09T19:57:08-04:00'
draft: true
---
# Big Idea

Autoscaling is a key technology that builds on the elasticity of distributed cloud computing. To understand autoscaling in the Kubernetes environment, it will be important to understand the basic enabling technologies: containerization and distributed computing. By leveraging hese two technologies, Kubernetes supports horizontal pod autoscaling (hpa) and cluster autoscaling. In this post I will dive into some brief background on Containerization and distributed computing (just enough to be dangerous) and then take a more focused look at the horizontal autoscaling functionality of Kubernetes. 

# Containers and Distirbuted Computing

As I mentioned before, I want to touch briefly on the enabling technologies of autoscaling in the Kubernetes envrionment specifically. These two technologies are containers and distirbuted computation. Let's look at each in turn...

### Containers

Containers are often compared to VMs. They are both technologies that virtualize the resources of an underlying machine. Virtualization means that one homogenous resource is "virtually" represented as multiple resources. Unlike a VM which which virtualizes an entire machine including the hardware layers, a container on the other hand, virtualizes the execution environment (os, packages, libraries). Whereas the VM is equivalent to creating a habitable environment on Mars, a container is equivalent to putting on a space suit.  

What the container represents is a unit of deployment. It wraps an application so that it can be deployed and run predicatably on any machine without being concerned about the details of the underlying machine on which the container runs. One of these underlying details that a container is not concerned about is other containers running on the machine. This means that the container is an isolated execution environment consuming virtualized resources from an underlying physical machine


### Distributed Computing

Distributed computing is a natural product of the boom of networking technology that came out of the Bay area in the 80's and 90's. It was the end of the era of mainframe computing, in which time-sharing was a key mechnism for partitioning the computation of a single machine among many users by sharing processing time. With improving network capabilities and an increasingly available fleet of machine often with idle compute, companies tried to develop tools that presented a collection of machines as a single service. For many years this was stumbling breakthroughs with new technologies like remote procedure calls (RPC), network file systems (NFS), Andrew File System (AFS), Locus, Sprite, Plan 9, and on. 

The goal that many of these early systems tried to achieve was distributing an application acorss many machines. They attempted to present a single OS interface for many machines. In this paradigm, the process was the unit of distirbution.

Over more time than I care to write about here, the paradigm evolved. There was a shift away from trying to distribute processes across machine and towards distributing computation that was embarassingly parallel across machines.

> 📖 **Embarrassingly parallel tasks** are tasks that it takes relativlely little to no work to split the problem in parallel execution environments to run computation. If needed, results produced by tasks executed in parallel can be aggregated afterwards.

A perfect example for a computation unit to run in parallel across many machines is the modern container. Applications run across a fleet of machines and stateless HTTP requests can get handled by an application in any container or applications can consume from a central queue and process large numbers of jobs in parallel.

### Kubernetes

With a better understanding of containers and distributed computing it may be easier to step back and look at Kubernetes. Kubernetes, labelled as a container orechstraion system, is tool that presents a single interface (control plane) for users to run container-based applications across a large collection of nodes.

# Autoscaling

Cloud providers have a signifcant amount of computational resources at their disposal. As result, these providers, give user's a benefit known as elatisity. **Elastisity** is the ability to provision or de-allocated resources on demand and based on need. This is a unique feature of cloud environments that contrasts the often slow acquisition time and upfront captial that needs to beinvested to procure on-prem equipment.

Autoscaling is data-driven approach to provisioning and de-provisioning resources based on active load on a system at a given point in time. The two forms of autoscaling that we will look at further on are horizontal pod autocaling and cluster autoscaling. These are both forms of autoscaling in Kubernetes that would be descrbed as forms of horizontal scaling. **Horizontal scaling**, sometimes known as scaling out, refers to the addition of more discrete computation units (i.e. add more nodes or pods). In contrast, **vertical scaling**, also known as scaling up, means increasing the available hardware capabilites of the existing machines (add more cpu, memory).

### Horizontal Pod Autoscaling (HPA)

#### Scaling Based on Resource Metrics
In order to scale a pod based on resource metrics (cpu/memory). You need to specify resources requests on a pod. These resource requests are used by the Cluster Scheduler to determine whether there are any nodes with sufficient resources for this pod. The scalable resource metrics available by default in Kubernetes are the ratio between the container's actual resource usage and requested usage.

> 💡 **Important**: It is a common misperception when seeing a pod's % cpu usage or % memory usage to assume that the ratio is with respect to the resources available on the underlying node. In reality, more often that not this value is with respect to the resources requests specified on the pod spec.


### Cluster Autoscaling

By default, you can manually configure the number of nodes running in your Kubernetes cluster. What cloud providers also support is the functionality of cluster autoscaling. 


#### Provisiong New Nodes


#### De-provisioning Nodes


#### Expanders

Often times you will have multiple node pools available in your cluster. These node pools could contain different sizes of node or nodes with differnet capabilities and hardware specifications. In this case the questions of how the Cluster Autoscaler selects which node pool to scale arises.

Cluster Autoscaler implementations in the various cloud providers support a configuration for expanders. Expanders are strategies for solving this problem. Often there will be expanders for scaling based on the following:
- `price`: scale the node pool with the cheapest node type available.
- `priority`: scale node pools based on user assigned priority 
- `random`
- `least-waste`: Scalse the node pool that would have the least idle CPU after all the pending pods are scheduled

For a full overview of expanders read up [here](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders)



### CA Profile