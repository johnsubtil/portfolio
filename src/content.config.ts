import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectCategories, projectStatuses } from './config/content';

const requiredText = z.string().trim().min(1);
const localMediaPath = requiredText.regex(/^\/(?![\/\\])[^\\\s\u0000-\u001f\u007f]+$/, 'Use a local media path starting with /, without backslashes or whitespace');
const publishedAt = z.iso.date().transform((value) => new Date(`${value}T00:00:00.000Z`));
const updated = z.union([z.iso.date(), z.iso.datetime({ offset: true })])
  .transform((value) => new Date(value));
const image = z.object({
  src: localMediaPath,
  alt: z.string().trim().default(''),
}).strict();
const cover = image.optional();
const skills = z.array(requiredText).default([]);
const projectLink = z.string().trim().pipe(z.union([
  z.literal(''),
  z.url({ protocol: /^https?$/ }),
])).optional();

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: requiredText,
    description: requiredText,
    format: requiredText,
    cover,
    project: reference('projects').optional(),
    publishedAt,
    updated,
    draft: z.boolean().default(false),
  }).strict(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: requiredText,
    description: requiredText,
    status: z.enum(projectStatuses),
    category: z.enum(projectCategories).default('software'),
    cover,
    subtitle: requiredText.optional(),
    presentationImage: image.extend({ caption: requiredText.optional() }).strict().optional(),
    featured: z.boolean().default(false),
    skills,
    links: z.object({
      website: projectLink,
      github: projectLink,
      behance: projectLink,
      instagram: projectLink,
      tiktok: projectLink,
      youtube: projectLink,
    }).strict().default({}),
    publishedAt,
    updated,
  }).strict(),
});

export const collections = { posts, projects };
