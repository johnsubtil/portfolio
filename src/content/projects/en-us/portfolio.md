---
title: Portfolio Website
description: My projects and posts about how I'm making them.
status: completed
category: software
skills: [Astro, TypeScript, React, Motion, CSS, Markdown, Zod, CSP, GitHub Actions, Dependabot, Cloudflare Pages]
cover:
  src: /images/projects/portfolio/cover.svg
publishedAt: '2026-11-21'
updated: '2026-11-23'
links:
  website: https://www.johnsubtil.com/en-us/
  github: https://github.com/johnsubtil/portfolio
---

## Why I built it

I wanted one place to share projects from different fields and write about how I'm making each one.

## How I organized the site

- **Projects**, each with a status, the tools used, and links. Clicking a tool opens the list of projects that use it.
- **Posts** about the process.
- **Search** across projects and posts.
- **Ranks**: each area I work in has a letter from E to S. I explain the scale in [How the ranks work](/en-us/posts/ranks/).

## How I built it

A static site built with **Astro** and **TypeScript**, with the content in Markdown.

- **Astro:** a fast framework with a focus on SEO. It generates static HTML at build time and lets me load JavaScript only where I need it.
- **Markdown:** I can write and edit the content in files without maintaining a database. The files live in content collections, with a **Zod** schema checked at build time.
- **React only where needed:** animations live in **React** islands with **Motion**. Using React across the whole site would be unnecessary.
- **Cloudflare Pages:** the free plan for static sites meant I didn't have to pay for hosting or a VPS to get started.
- **Strict CSP:** even without a backend or data sent to third parties, I wanted to be careful about what the browser can load and run. The **CSP** only allows scripts and styles from the same origin or with an allowed hash, with no `unsafe-inline`.
- **Licensing:** the code is available under the MIT license. I reserve the rights to the content, including the artwork and writing.

**GitHub Actions** checks types and builds the site on every push, and runs `npm audit` weekly. **Dependabot** handles dependency updates, and **Cloudflare Pages** deploys the site automatically.
