# Agent notes

## Commands

- `npm ci`, then `npm run dev`. To start the dev server in the background use `astro dev --background`; manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.
- Before finishing a change: `npm run check` and `npm run build` must pass.

## Conventions

- **CSP:** pages forbid inline styles and scripts. Never write `style="..."` or `on*=` attributes; set dynamic values with `element.style.setProperty('--name', value)` and read them in CSS.
- **Design tokens:** colors, radii (`--radius-card`, `--radius-control`, `--radius-pill`), spacing, and hover borders live in `src/styles/tokens.css`. Do not hard-code hex colors or radii. Breakpoints are 480, 640, 900, and 1200 px.
- **Buttons and arrows:** use `src/components/ui/Cta.astro` for buttons. The arrow icon is `public/icons/arrow.svg`, used through the `.arrow-icon` class and the shared mask rules in `global.css`.
- **Images:** render covers with `media/CoverImage.astro`; it shows the placeholder when there is no cover.
- **i18n:** every text goes through `src/i18n/messages/{pt-br,en-us}.json`; keep both files with the same keys. Brand names stay in `src/config/site.ts`.
- **Content:** Markdown in `src/content/`, validated by `src/content.config.ts`. Lists, the home sections, and search must work when empty.
- **Motion:** respect `prefers-reduced-motion` (a global rule disables transitions); no effects that follow the cursor.

## Documentation

Full documentation: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
