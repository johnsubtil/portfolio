import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import {
  defaultLocale,
  localeSettings,
  routeSegments,
  supportedLocales,
  type Locale,
} from '../../i18n/locales';
import { contentLocale, contentSlug } from './identity';
import { recentlyUpdatedFirst } from './dates';

export type Post = CollectionEntry<'posts'> & {
  project?: CollectionEntry<'projects'>;
};

export async function getPosts(locale: Locale = defaultLocale) {
  const [entries, projects] = await Promise.all([
    getCollection('posts', ({ id, data }) => !data.draft && contentLocale(id) === locale),
    getProjects(locale),
  ]);
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const posts: Post[] = entries.map((post) => {
    const project = post.data.project ? projectsById.get(post.data.project.id) : undefined;
    if (post.data.project && !project) {
      throw new Error(`Post "${post.id}" must reference an existing project in ${locale}.`);
    }
    return { ...post, project };
  });

  return posts.sort(recentlyUpdatedFirst);
}

export async function getProjects(locale: Locale = defaultLocale) {
  const projects = await getCollection('projects', ({ id }) => contentLocale(id) === locale);
  return projects.sort(recentlyUpdatedFirst);
}

export async function getAllProjects() {
  return (await Promise.all(supportedLocales.map((locale) => getProjects(locale)))).flat();
}

export async function getAllPosts() {
  return (await Promise.all(supportedLocales.map((locale) => getPosts(locale)))).flat();
}

export async function getPostsForProject(projectId: string) {
  const posts = await getPosts(contentLocale(projectId));

  return posts.filter((post) => post.project?.id === projectId);
}

export async function getProjectPaths() {
  const projects = await getCollection('projects');
  const localesBySlug = new Map<string, Locale[]>();
  for (const project of projects) {
    const slug = contentSlug(project.id);
    localesBySlug.set(slug, [...(localesBySlug.get(slug) ?? []), contentLocale(project.id)]);
  }
  return projects.map((project) => {
    const locale = contentLocale(project.id);
    const slug = contentSlug(project.id);
    return {
      params: { locale: localeSettings[locale].path, section: routeSegments[locale].projects, slug },
      props: { kind: 'project' as const, project, locales: localesBySlug.get(slug) ?? [] },
    };
  });
}

export async function getPostPaths() {
  const posts = await getAllPosts();
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const slug = contentSlug(post.id);
    const translations = groups.get(slug) ?? [];
    const existing = translations[0];
    const projectSlug = post.project ? contentSlug(post.project.id) : undefined;
    const existingProjectSlug = existing?.project ? contentSlug(existing.project.id) : undefined;
    if (existing && existingProjectSlug !== projectSlug) {
      throw new Error(`Translations must reference the same project: ${slug}`);
    }
    translations.push(post);
    groups.set(slug, translations);
  }

  return [...groups].flatMap(([slug, translations]) =>
    supportedLocales.map((locale) => ({
      params: { locale: localeSettings[locale].path, section: routeSegments[locale].posts, slug },
      props: {
        kind: 'post' as const,
        post:
          translations.find((entry) => contentLocale(entry.id) === locale) ?? translations[0],
        locales: translations.map((entry) => contentLocale(entry.id)),
      },
    })),
  );
}
