---
title: "Enabling experimental mode on Nix"
date: 2026-06-08T10:26:32-04:00
draft: false
---

# Overview

Here's a short one! Ever run into the following with Nix?

```bash
error: experimental Nix feature 'nix-command' is disabled; add '--extra-experimental-features nix-command' to enable it
```

Let's talk about it

# Flakes are experimental?

So flakes are experimental? Yes, in Nix flakes are still gated as experimental. Want to get around it quickly?

```bash
nix --extra-experimental-features 'nix-command flakes' flake check
```

For a longer term ease of use you are better off just enabling this permanently:

```bash
mkdir -p ~/.config/nix && \
  echo 'experimental-features = nix-command flakes' >> ~/.config/nix/nix.conf
```
