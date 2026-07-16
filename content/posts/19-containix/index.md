---
title: "Containix: Kubernetes without Images"
date: 2026-07-15T21:03:31-04:00
draft: false
---

# Hello Containix!

After many odd evenings here and there picking away at it I am happy to finally push `v0.1.0` of [containix](https://containix.dev) out into the world!

Containix is a containerd runtime shim that allows you to run nix flakes instead of images with containerd. On its own that doesn't sound like much but given that containerd is the de facto container runtime of Kubernetes this unlocks Nix flakes as first class citizens in Kubernetes pods! Rather than pods launching images, you can leverage containix to distribute your applications as Nix flakes and run them in Kubernetes pods.

To get a taste, here's what it looks like in use. If the flake's default package sets `meta.mainProgram`, the flake reference is the only thing you specify:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello
  annotations:
    containix.dev/flake: "github:myorg/myapp"
spec:
  runtimeClassName: containix
  containers:
    - name: app
      image: ghcr.io/atmask/containix-empty:0.1.0
```

> **Note:** The keen-eyed of you may notice that the `spec.image` is still set. This is because its a requirement of the CRI. While co-opting this field to pass the flake reference would have been preferable, the validation is too strict. As such I distribute a small empty image (< 1KB) that can be used a stub. It is ignored by the shim and the flake takes precedence.

# So What?

So why does this matter you may ask? A couple reasons. Namely, this changes the lifecycle of your team's software distribution.

First, no more building and pushing OCI images, no more maintaining dockerfiles. The flake is resolved when it is realized by Nix meaning that on each build of your application where you are not waiting on CI to build and push images. The flake can also be used to ensure consistency across development, test, and production environments.

Second, there is no more need for registries. You can pre-mount a binary cache to your Kubernetes nodes for fast pod starts.

Third, distribution is content-addressed and deduplicated by default. Every dependency is a Nix store path, so pods on the same node share `/nix/store`. The benefit of this is that common dependencies exist once in an immutable form instead of being copied into every image's layers.

# Motivation

Over the past couple of years I have been building small projects at `$WORK` and home in Go and building my experience there. Over about twice that time I've been maintaining production Kubernetes clusters. In about half I have been playing with Nix and derivative projects. Then I decided to see if, rather than using nix to build images, we could bring Nix flakes closer to pods as a unit of distribution.

The project is early but I've released a v0.1.0 that I'm satisfied with for now ( i.e. I've tried to avoid perfect as the enemy of the good). It works end to end and has been validated in k3s in NixOS.

# How do I try it?

Interested and want to give it a try? You can either test it on containerd alone or in a Kubernetes cluster as follows in tl;dr format (more info in the project docs):

### Containerd

**1) Get the shim**
You can do this by downloading the shim to your machine from the distributed `v0.1.0` [artifacts](https://github.com/atmask/containix/releases/tag/containix%2Fv0.1.0), build from source, or use the flake in the project repo.

### Kubernetes

### Containerd

**1) Get the shim**
You can do this by downloading the shim to your machine from the distributed `v0.1.0` [artifacts](https://github.com/atmask/containix/releases/tag/containix%2Fv0.1.0), build from source, or use the flake in the project repo.

**2) Make sure the host is ready**
The shim just needs to be on containerd's `PATH` (so it can resolve `io.containerd.containix.v1` → the binary), and a Nix daemon has to be running on the host. On NixOS, the flake's module handles both for you.

**3) Run a flake**
`ctr` doesn't auto-pull, so grab any small image first (its contents are ignored), then run with the containix runtime and a flake label:

```bash
sudo ctr image pull docker.io/library/busybox:latest
sudo ctr run --rm \
  --runtime io.containerd.containix.v1 \
  --label containix.dev/flake="nixpkgs#hello" \
  ghcr.io/atmask/containix-empty:0.1.0 containix-check
# → Hello, world!
```

### Kubernetes

**1) Prepare your nodes**
Each node needs the shim on containerd's `PATH`, a Nix daemon, and the containix runtime registered in containerd's CRI config (including `containix.dev/*` annotation passthrough. Without it the flake annotation never reaches the shim). On NixOS, that's just the module:

```nix
containix.nixosModules.default
{ services.containix.enable = true; }
```

For non-NixOS or managed clusters, see the [Kubernetes guide](https://github.com/atmask/containix/blob/main/docs/kubernetes.md).

**2) Add the RuntimeClass**
This is what routes opted-in pods to the shim (`handler` must match the registered runtime name):

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: containix
handler: containix
```

**3) Deploy a pod**
Reference the flake in an annotation and set `runtimeClassName`. If the flake's default package declares `meta.mainProgram`, that's the only annotation you need:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello
  annotations:
    containix.dev/flake: "nixpkgs#hello"
spec:
  runtimeClassName: containix
  containers:
    - name: hello
      image: ghcr.io/atmask/containix-empty:0.1.0 # required by CRI, ignored
```

`kubectl apply` it and the flake runs in the pod.

# Roadmap

Here's what's on my mind for the future if I feel there is demand:

- Better support for granular, per-pod access to private flakes
- A daemonset installer for easier node setup
- A Nix operator
