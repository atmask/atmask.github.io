+++
title = 'Getting Started with Hugo'
date = 2024-07-05T17:54:14-04:00
draft = false
+++

# Overview

The goal of this post is to capture the steps required to get started with Hugo and Github pages. Hugo is a GO based static site generation tool. Github pages is a feature of Github that allows anyone with a GitHub account host a static site.


# Part 1: Setting Up Hugo Locally
The following section covers getting your static site on your local machine. This will allow you to modify your themes and posts from your editor of choice and see updates via the local Hugo dev server.

### Install Hugo to your local machine
To get started with Hugo on your machine you'll need to first install Hugo. On MacOS you can do this via Brew:
```bash
brew install hugo
```

### Create a new Hugo Site Locally

To start a new hugo project run:
```
hugo new site <github-username>.github.io --format yaml
```

Using `--format yaml` is optional. The default config format for Hugo is toml.





