import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  title: z.string(),
  tagline: z.string().optional(),
  description: z.string(),
  draft: z.boolean().default(false),
  // New designs waiting on details: shown on preview builds only, never on the live site
  comingSoon: z.boolean().default(false),
  order: z.number().default(99),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  ogImage: z.string().optional(),
  features: z.array(z.string()).optional(),
  specs: z.record(z.string()).optional(),
  badge: z.string().optional(),
  bedrooms: z.number().optional(),
  // Model inside a range that has its own listing page, e.g. 'cabin' → /modular-homes/cabin/<id>/
  range: z.string().optional(),
  // Pricing + plans (Oct 2026 brochure). priceFrom is whole dollars incl. GST, ex factory.
  priceFrom: z.number().optional(),
  area: z.string().optional(),
  size: z.string().optional(),
  upgrades: z.string().optional(),
  floorPlans: z.array(z.object({ src: z.string(), label: z.string().optional() })).optional(),
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })).optional(),
  // Several models on one page (no page uses this since the Cabin models got their own pages, 2026-10-20)
  models: z.array(z.object({
    name: z.string(),
    blurb: z.string(),
    priceFrom: z.number().optional(),
    area: z.string().optional(),
    size: z.string().optional(),
    upgrades: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    floorPlan: z.string().optional(),
    comingSoon: z.boolean().optional(),
  })).optional(),
});

const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
  ogImage: z.string().optional(),
});

const blogSchema = z.object({
  title: z.string(),
  // Shorter title for the browser tab and Google (about 60 characters with the brand); falls back to title
  seoTitle: z.string().optional(),
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
