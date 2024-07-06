+++
title = 'Getting Started with Hugo & Github Pages'
date = 2024-07-05T17:54:14-04:00
draft = false
+++

# Big Idea

The goal of this post is to capture the steps required to get started with Hugo and Github pages. Hugo is a GO based static site generation tool. Github pages is a feature of Github that allows anyone with a GitHub account host a static site.


# Part 1: Creating a GitHub Pages Repo


# Part 2: Setting Up Hugo Locally
The following section covers getting your static site on your local machine. This will allow you to modify your themes and posts from your editor of choice and see updates via the local Hugo dev server.

### Install Hugo to your local machine
To get started with Hugo on your machine you'll need to first install Hugo. On MacOS you can do this via Brew:
```bash
brew install hugo
```

### Create a new Hugo Site Locally

To start a new hugo project run:
```bash
hugo new site <github-username>.github.io --format yaml
```
> **Note:** Using `--format yaml` is optional. The default config format for Hugo is toml.

This will create a new directory named `<github-username>.github.io` that is pre-populated with the Hugo starter boilerplate. You don't have to use the site name `<github-username>.github.io`. You can change it whatever you would like. However, in the case of Github pages, you will create your pages site in a repo named `<github-username>.github.io`. I would like this repo to become that future repo so I will choose this naming for now in order to be consistent.

## Add a Hugo Theme to your site

By default Hugo does not include a theme for you site. This is where you get to pick how you want your site to look once built and deployed. You can find a complete list of themes on the [Hugo themes page](https://themes.gohugo.io/). For this wiki I will use the theme [PaperMod](https://themes.gohugo.io/themes/hugo-papermod/) as that is the theme of this blog.

Once you have selected a theme, you will want to clone that theme into the `/themes` directory contained within the Hugo project created above. There are two commons ways that others online will reccomend doing this. One way requires downloading the theme's repo as a zipfile form Github, extracting the contents and moving them into the `/themes` directory. This method does not maintain the git history of the selected theme. It means that as the upstream theme repo changes you will not be able to pull those changes via git. The second method involves cloning the repo







