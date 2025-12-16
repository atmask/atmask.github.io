---
title: "Immich: Up & Running"
tags: ["immich", "postgres", "kubernetes", "homelab", "storage", "SMB", "NFS"]
ShowToc: true
date: 2025-12-14T22:43:07-05:00
draft: false
---

# Overview

I recently started hosting [Immich](https://github.com/immich-app) on my homelab. If you're not familiar with Immich, it is a self-hosted Google Photos replacement.
If you want to learn more I highly reccomend giving a listen to [this podcast interview](https://selfhosted.show/110?t=1198) with the creator of Immich on the Self-Hosted podcast.

The goal of this post is to cover how I set this up and some of the obstacles I faced in the process.

# Immich Architecture and Storage

There wasn't much to plan out before deploying Immich. The main pain point came with respect to getting Postgres running up on my cluster prior to deploying Immich which I'll cover more below.

## Components

Immich ships two workloads:

- **server:** This is the primary Immich server. It's written in Typescript, manages database operations, serves the web client (built with SvelteKit), and coordinates with the machine learning workload.

- **machine learning:** This workload is an HTTP Python service using FastAPI. It processes images running facial detection, recognition, and OCR.

## Datastores

### Postgres

Immich requires a backing Postgres database for storing all user data and media metadata. However, the official Helm chart for Immich does not ship with a postgres deployment to get up and running.

Given that I will likely have other applications use Postgres for their backing database in the future I decided to investigate Postgres operators for managing Postgres installations on my cluster. After some brief searching it appeared that general concensus was that [CloudNative Postgres](https://cloudnative-pg.io/) (CNPG) was the encumbent Postgres operator of choice.

### Redis

The official Immich chart deploys with Valkey as a dependency. Valkey, which is a Redis compatible caching service, is used as the broker for BullMQ for job queues.

### Photo Storage

Photos are stored to my external SMB share running from TrueNas. I have a few free TB here that should be sufficient to get me started.

# Hurddles, Lessons Learned, and Gotchas

### Configuring Postgres Correctly for Immich

There is no very well-documented configurations at the moment for how to set up Postgres for Immich. I believe part of this is due the recent migration Immich underwent away from the pgvecto.rs extension to vectorchord leacing lots of material outdated. In addition to this, I had to figure out how to map all of these configurations properly to the cnpg `Cluster` CRD's spec.

After some trial and error I was able to get a working spec for the backing postgres instance with the vectorchore extension:

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: immich-database
spec:
  instances: 1

  storage:
    storageClass: truenas-postgres
    size: 5Gi

  imageName: ghcr.io/tensorchord/cloudnative-vectorchord:16.9-0.4.3

  postgresql:
    shared_preload_libraries:
      - "vchord.so"

  managed:
    roles:
      - name: { { .Values.database.user.username } }
        superuser: true
        login: true

  bootstrap:
    initdb:
      database: { { .Values.database.user.database } }
      owner: { { .Values.database.user.username } }
      secret:
        name: { { .Values.database.user.secretName } }
      postInitSQL:
        - CREATE EXTENSION vchord CASCADE;
        - CREATE EXTENSION earthdistance CASCADE;
```

The user creds can be configured in a referenced secret as follows:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: { { .Values.database.user.secretName } }
stringData:
  username: { { .Values.database.user.username | quote } }
  password: { { .Values.database.user.password | quote } }
  database: { { .Values.database.user.database | quote } }
```

### Postgres Needs Posix Semantics

I have largely been using a storage class backed by the SMB CSI driver for persistent storage. Without much thought on the weekend that I went to deploy Immich I deployed Postgres using the same storage class. This was when I learned that Postgres cannot run on top of SMB due to the lack of POSIX semantics supported by SMB (make sense. Windows.). So, [in the fashion of Yak shaving](https://www.hanselman.com/blog/yak-shaving-defined-ill-get-that-done-as-soon-as-i-shave-this-yak), I deployed the NFS CSI driver to my cluster and then created and NFS share from TrueNAS. After this was tested and working from my local machine I created the new storageclass with access to the NFS share. Postgres was then satisfied.

### Watch out for NGINX Upload Limits

Migrating away from Nginx for ingress will be on my list at some point ahead of the 2026 retirement but for now as I'm using it I will mention the need for the following annotation:

```
nginx.ingress.kubernetes.io/proxy-body-size: "0"
```

This removes the body limit from the proxy on file uploads

# What I've learning Writing this Post

Even while writing this post there's a few things I'll have to revist sometime later as there's only so much time you get for hobbies. These are a few:

- I'm curious how well the machine learning workload is running on my underpowered machines? I should take a look at my Grafan cloud instance to see and maybe do some optimizations
- I want to do a deeper dive into block storage, object storage, file stroage and all of the nuances in their implementations. Maybe iSCSI would have been better in this case as the POSIX semantics issue would have been offloaded from TrueNAS. These are nuances that I'm glad to be learning though and mistakes I can afford to make in this environment.
