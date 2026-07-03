import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  title: z.string(),
  tagline: z.string().optional(),
  description: z.string(),
  draft: z.boolean().default(false),
  order: z.number().default(99),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  ogImage: z.string().optional(),
  features: z.array(z.string()).optional(),
  specs: z.record(z.string()).optional(),
  badge: z.string().optional(),
  bedrooms: z.number().optional(),
});

const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
  ogImage: z.string().optional(),
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  updatedDate: z.date().optional(),
  draft: z.boolean().default(false),
  author: z.string().default('Sunshine Tiny Houses'),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  ogImage: z.string().optional(),
});

export const collections = {
  'products-thow': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products-thow' }),
    schema: productSchema,
  }),
  'products-modular': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products-modular' }),
    schema: productSchema,
  }),
  'products-class10a': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products-class10a' }),
    schema: productSchema,
  }),
  'pages': defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
    schema: pageSchema,
  }),
  'blog': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: blogSchema,
  }),
};
