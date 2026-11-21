import type { APIRoute } from 'astro';
import { localizedUrl, localeSettings, supportedLocales, type Locale } from '../i18n/locales';
import { contentLocale, contentSlug } from '../lib/content/identity';
import { getAllPosts, getAllProjects } from '../lib/content/queries';

interface SitemapPage {
  path: string;
  locales: Locale[];
  lastmodByLocale: Partial<Record<Locale, Date>>;
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Set `site` in astro.config.mjs to generate the sitemap.');
  const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);

  const pages = new Map<string, SitemapPage>();
  const add = (path: string, locale: Locale, updated?: Date) => {
    const page = pages.get(path) ?? { path, locales: [], lastmodByLocale: {} };
    page.locales.push(locale);
    if (updated) page.lastmodByLocale[locale] = updated;
    pages.set(path, page);
  };

  for (const locale of supportedLocales) {
    add('/', locale);
    add('/projects/', locale);
    add('/about/', locale);
  }
  for (const locale of supportedLocales) {
    if (posts.some((post) => contentLocale(post.id) === locale)) add('/posts/', locale);
  }
  for (const project of projects) {
    add(`/projects/${contentSlug(project.id)}/`, contentLocale(project.id), project.data.updated);
  }
  for (const post of posts) {
    add(`/posts/${contentSlug(post.id)}/`, contentLocale(post.id), post.data.updated);
  }

  const location = (locale: Locale, path: string) => new URL(localizedUrl(locale, path), site).href;
  const urls = [...pages.values()].flatMap((page) => page.locales.map((locale) => {
    const lastmod = page.lastmodByLocale[locale];
    const alternates = page.locales.length > 1
      ? page.locales.map((alternate) =>
        `    <xhtml:link rel="alternate" hreflang="${localeSettings[alternate].language}" href="${location(alternate, page.path)}"/>`)
      : [];
    return [
      '  <url>',
      `    <loc>${location(locale, page.path)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod.toISOString()}</lastmod>`] : []),
      ...alternates,
      '  </url>',
    ].join('\n');
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
