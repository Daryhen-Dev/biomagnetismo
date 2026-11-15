import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Institutional pages ported from WordPress.
 * `legacyUrls` carries every historical path that must 301 to this page, so the
 * redirect map is generated from content instead of a hand-maintained list.
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    navTitle: z.string().optional(),
    section: z.enum(["institucional", "galeria", "conocimiento", "contacto"]).optional(),
    order: z.number().default(0),
    legacyUrls: z.array(z.string()).default([]),
  }),
});

/**
 * Photo galleries, one per country visited by the doctor. WordPress holds these
 * as 13 separate pages, each a Modula gallery shortcode.
 */
const galleries = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/galleries" }),
  schema: z.object({
    title: z.string(),
    country: z.string(),
    cover: z.string(),
    order: z.number().default(0),
    images: z.array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { pages, galleries };
