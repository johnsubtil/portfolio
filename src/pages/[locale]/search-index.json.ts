import type { APIRoute } from 'astro';
import { getLocale, getLocalePaths, localizedUrl } from '../../i18n/locales';
import { getUI } from '../../i18n/ui';
import { getProjects, getPosts } from '../../lib/content/queries';
import { contentSlug } from '../../lib/content/identity';
import type { SearchEntry } from '../../lib/search/engine';

export function getStaticPaths() {
  return getLocalePaths();
}

export const GET: APIRoute = async ({ url }) => {
  const locale = getLocale(url);
  const text = getUI(locale);
  const [projects, posts] = await Promise.all([getProjects(locale), getPosts(locale)]);
  const entries: SearchEntry[] = [
    ...projects.map((project): SearchEntry => ({
      type: 'project',
      title: project.data.title,
      description: project.data.description,
      context: text.projects.statuses[project.data.status],
      url: localizedUrl(locale, `/projects/${contentSlug(project.id)}/`),
      body: `${project.body ?? ''}\n${project.data.skills.join(' ')}`,
      updated: project.data.updated.toISOString(),
      cover: project.data.cover,
    })),
    ...posts.map((post): SearchEntry => ({
      type: 'post',
      title: post.data.title,
      description: post.data.description,
      context: post.project?.data.title ?? '',
      url: localizedUrl(locale, `/posts/${contentSlug(post.id)}/`),
      body: post.body ?? '',
      updated: post.data.updated.toISOString(),
      cover: post.data.cover ?? post.project?.data.cover,
    })),
  ];
  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
