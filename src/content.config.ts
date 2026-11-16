import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Institutional pages ported from WordPress.
 * `legacyUrls` carries every historical path that must 301 to this page, so the
 * redirect map is generated from content instead of a hand-maintained list.
 * `wpId` keeps the provenance of each page so the copy can be diffed against
 * the original WordPress install (see T18).
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    navTitle: z.string().optional(),
    section: z.enum(["institucional", "galeria", "conocimiento", "contacto"]).optional(),
    order: z.number().default(0),
    wpId: z.number().int().optional(),
    legacyUrls: z.array(z.string()).default([]),
    // Videos de YouTube del sitio original. Ver `VideoEmbed.astro`: se muestran
    // como tarjeta con fachada y el reproductor carga recién al hacer clic.
    videos: z
      .array(
        z.object({
          id: z.string().length(11),
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

/**
 * Photo galleries, one file per WordPress page. A page may embed several Modula
 * galleries (`fotoentrevista` has 7), so the file groups them under `galleries`.
 * `src` is the project path of the optimised file in `src/assets/media`, ready
 * for `import.meta.glob("/src/assets/media/**\/*.webp")` in the page templates.
 *
 * Alt text: WordPress only had it for 9 of the 343 photos. The port filled the
 * gaps with "<pageTitle>: <galleryTitle> (foto N de M)" and flagged them with
 * `altPending` so the design phase can rewrite them properly. Alt is never empty.
 */
const galleries = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/galleries" }),
  schema: z.object({
    title: z.string(),
    /** Project path of the cover image (first photo of the first gallery). */
    cover: z.string(),
    /** The page's own text, with the galleries removed. */
    intro: z.string().default(""),
    /** Videos del sitio original que acompañan a las fotos (ver VideoEmbed). */
    videos: z
      .array(
        z.object({
          id: z.string().length(11),
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .default([]),
    galleries: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        images: z.array(
          z.object({
            src: z.string(),
            alt: z.string().min(1),
            altPending: z.boolean().default(false),
            caption: z.string().optional(),
            width: z.number().int().positive(),
            height: z.number().int().positive(),
          }),
        ),
      }),
    ),
  }),
});

export const collections = { pages, galleries };
