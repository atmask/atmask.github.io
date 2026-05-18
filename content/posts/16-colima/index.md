---
title: "Replacing Docker Desktop with Colima"
tags: ["colima", "lima", "containers", "docker"]
date: 2026-05-17T12:44:43-05:00
draft: false
---

# Overview

I've recently been setting up my new machine. As I've been more exposed to [Nix](https://github.com/nixos/nix) and [Flox](https://flox.dev/) I've been steering away from local containerization where possible, however, that is not always an option. Part of me has been hesitant to install Docker Desktop to my new laptop. Some of that is just my own leanings. I don't want to be asked to sign in to things I shouldn't need to, I don't enjoy apps which proliferate large amounts of data in my system leaving me trying to scour and clean up when I am ready to remove those apps. In light of that I started looking for a better alternative.

I considered Podman which does have certain pros/cons but ultimately landed on Colima for my purposes.

# Podman vs Colima

[Podman](https://podman.io/) is an open source alternative to Docker. It is a container engine which forgoes the client-server architecture of Docker in favour of a daemonless and rootless design.

[Colima](https://github.com/abiosoft/colima) ("Containers in Lima"), in contrast, is the same Docker container engine used by Docker Desktop but running in a Lima-managed VM. It follows the same client-server architecture of Docker Desktop and mounts to the Docker socket expected by the normal Docker CLI tooling.

While Podman outpaces Docker in its rootless daemonless architecture it still has paper cuts when it comes to compatibility with the Docker socket and Docker Compose.

For this reason I steered towards Colima as a drop-in replacement for Docker Desktop. It fits my needs and it's minimal.

# What is Colima?

So what really is Colima? It's a project that builds on the [Lima](https://github.com/lima-vm/lima) project. Lima was started in 2021 with the goal of promoting containerd to macOS users by making Linux environments with containerd more readily accessible. Colima is a layer that builds on Lima to provision the Docker daemon in a Lima managed VM. The Docker daemon is itself a layer over containerd. The Colima VM's instance of the Docker daemon is then exposed on the Docker socket to your Mac host so that existing Docker client tooling works unchanged. In this way Colima replicates the functionality of Docker Desktop without the licensing issues or the need for a GUI application.

# Installing and Running Colima

Colima is super easy to install:

**Homebrew:** `brew install colima`
**Flox:** `flox install colime`
**Nix:** `nix-env -iA nixpkgs.colima`

Colima only provisions the Docker engine in a VM meaning you'll also need to install the Docker client for running commands:

**Homebrew:** `brew install docker`
**Flox:** `flox install docker-client`
**Nix:** `nix-env -iA nixpkgs.docker-client`

After you have everything you need installed get the Docker engine running with: `colima start`. That's it. You now have the Docker daemon running without Docker Desktop. The daemon is fully compatible with everything the Docker CLI client expects.
