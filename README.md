# John Subtil

English | [Português](README.pt-BR.md)

Portfolio and story hub for John Subtil. A static site built with Astro, TypeScript, CSS, and Markdown content, with small React islands. Portuguese lives under `/pt-br/` and English under `/en-us/` (for example `/pt-br/projetos/` and `/en-us/projects/`); the bare address `/` only sends the reader to one of them.

## Development

Requires Node.js 22.23.4+ and npm.

```sh
npm ci
npm run dev        # http://localhost:4321
```

```sh
npm run check      # Type checks (astro check)
npm run build      # Generate dist/
npm run preview    # Preview the production build
```

`npm run dev -- --background` starts the server in the background; manage it with `npm run astro -- dev status`, `npm run astro -- dev logs`, and `npm run astro -- dev stop`.

## Content

Projects live in `src/content/projects/{pt-br,en-us}/`; posts in `src/content/posts/{pt-br,en-us}/`. Use matching filenames for translations, with lowercase letters, numbers, and hyphens, without nested folders.

A project (`my-project.md`):

```md
---
title: My project
description: A short description.
status: in-progress
category: stories
publishedAt: '2026-11-06'
updated: '2026-11-06'
---

Project text in Markdown.
```

Statuses: `in-progress`, `completed`. Categories: `software` (the default), `stories`, `art`. Projects are published as soon as their files exist. Add `featured: true` to show a project in the home page hero (up to three, newest first). Without any featured project the home page shows a text hero instead. Add `skills: [Astro, TypeScript]` to list the technologies a project uses: they show as `#` tags at the end of the project page, where each one opens the projects list filtered by it, and they are part of the site search.

A post (`my-post.md`):

```md
---
title: My post
description: A short description.
format: Note
publishedAt: '2026-11-06'
updated: '2026-11-06'
draft: true
---

Post text in Markdown.
```

Set `draft: false` to publish a post; omitting `draft` also publishes it. A post may stand alone. `format` is optional; when omitted, only the project name shows next to the date. Optional `project: en-us/my-project` links it to an existing project in the same language; translations must link to translations of the same project, or both omit the association. Posts carry no skills: those belong to projects.

Lists sort by `updated`, newest first. Dates use `YYYY-MM-DD`; `updated` also accepts an ISO timestamp with a timezone offset. All supported fields and validation rules are in [src/content.config.ts](src/content.config.ts).

Lists, the home page sections, and search all handle the empty case, so the site works with no projects or posts.

## Images

Store content images in `public/images/projects/<slug>/` or `public/images/posts/<slug>/` and use paths starting with `/images/`. Media paths must be local, start with `/`, and contain no spaces or backslashes. Files in `public/` are served unchanged; export them at suitable sizes. Imported interface assets, such as icons and hero artwork, stay in `src/assets/`.

Projects and posts without a cover show an image placeholder. Optional project or post cover:

```yaml
cover:
  src: /images/projects/my-project/cover.webp
  alt: Description of the image.
```

Covers are shown in the hero, the project tiles (near-square on the home, 16:10 on the Projects page, cropped from the center), cards, and search. SVG covers work too, and are served unchanged. In Markdown: `![Description](/images/projects/my-project/detail.webp)`.

Projects also accept `subtitle`, `links` (`website`, `github`, `behance`, `instagram`, `tiktok`, `youtube`), and an image or animated GIF before the Markdown body:

```yaml
presentationImage:
  src: /images/projects/my-project/demo.gif
  alt: Description of the demonstration.
  caption: An optional caption.
```

GIFs are served unchanged. Keep animations short and export them at suitable sizes.

## Configuration

- `src/config/site.ts`: site identity, email, social links, and the path of the About page photo.
- `src/config/ranks.ts`: the rank of each area, from E to S (shown in the home "What I do" section), and the post that explains the ranks (`rankGuidePost`, linked by the "?" in the home "What I do" section). The titles of the letters live in `src/i18n/messages` (`ranks`).
- `src/config/themes.ts`: the themes (id, browser color) and which one is the default. The picker in the header lists them and remembers the choice in `localStorage`.
- `src/config/content.ts`: statuses and categories (each category needs a name in `projects.categories`, a text in `home.disciplines`, and, optionally, a rank in `ranks.ts`), whether project cards show their category, and the limits for the home hero (and how many seconds each featured project stays before the next one comes in), the home project list and the home recent posts (free slots show as gray placeholders; `showPlaceholderSlots` turns that off), and the article table of contents.
- `src/i18n/messages/`: interface text; keep keys aligned between languages.
- `src/styles/tokens.css`: colors, radii, spacing, and typography. Use these tokens instead of hard-coded values.
- `public/`: the JS monogram icon (`favicon-dark-lab.svg`, `favicon-golden-royal.svg`, `favicon.ico`, `apple-touch-icon.png`), social preview image (`images/site/og-image.png`), `robots.txt`, `_headers`, and `scripts/language.js` (chooses the language for the bare address and the 404 page). The sitemap is generated at `/sitemap.xml`.

## Project structure

- `src/pages/`, `src/layouts/`: routes and page shells. Pages are `[locale]/` (`pt-br`, `en-us`) with a translated section (`[section]/`: `projetos`/`projects`, `posts`, `sobre`/`about`, `busca`/`search`); the section names are in `src/i18n/locales.ts` (`routeSegments`), and links are built with `localizedUrl(locale, '/projects/')`. `src/views/` holds the page bodies. `404.astro` holds both languages and shows the one that matches the reader.
- `src/components/`: grouped by area (`home`, `projects`, `posts`, `catalog`, `search`, `layout`, `i18n`, `media`, `ui`, `motion`). `ui/Cta.astro` is the shared button and `ui/Icon.astro` the shared icon.
- `src/styles/themes/`, `src/components/themes/`: one stylesheet and one folder of effects per theme (`dark-lab`, `golden-royal`), so a theme can be removed by deleting its two parts, its entry in `themes.ts` and its `favicon-<id>.svg`. Theme selectors use `:root[data-theme='<id>']`, and theme-only markup carries `data-only='<id>'`.
- `src/lib/`: content queries and the search engine.
- `src/scripts/`: browser behavior, in `catalog/` (filters, pagination), `search/` (header and page) and `article/` (contents menu and tables).

## Deployment

The site is built for Cloudflare Pages: build command `npm run build`, output directory `dist`, Node.js 22. `public/_headers` sets the security and cache headers on Cloudflare Pages; on another host, set the same headers there. Update `site` in `astro.config.mjs` if the domain changes.

GitHub Actions runs type checks and the build on every push and pull request (`.github/workflows/ci.yml`), and `npm audit` once a week (`.github/workflows/audit.yml`).

## Security

The site makes no third-party requests, and fonts are self-hosted. Astro adds a Content Security Policy to every page that forbids inline styles and scripts, so dynamic values go through CSS custom properties set from scripts (see `src/components/motion/ScrollProgress.tsx`). To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

Software: [MIT](LICENSE). Content and branding: [reserved rights](CONTENT_RIGHTS.md). Third-party icons retain their [licenses](src/assets/icons/LICENSE.txt).
