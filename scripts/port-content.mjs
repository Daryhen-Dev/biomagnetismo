/**
 * Port the extracted WordPress content into the Astro collections (T8 + T9).
 *
 * Inputs (read-only, produced by the extraction tasks):
 *   .local/extract/pages/<slug>.md       Markdown per page
 *   .local/extract/pages-manifest.json   WP id/slug/title per page
 *   .local/extract/galleries.json        Modula galleries with their images
 *   .local/extract/gallery-map.json      page -> gallery ids
 *   source/domains/centrodoctorgoiz.cl/public_html/wp-content/uploads/  originals
 *
 * Outputs (all inside the allowed edit surfaces):
 *   src/content/pages/<slug>.md          the 10 institutional pages
 *   src/content/galleries/<slug>.json    one file per gallery page
 *   src/assets/media/<year>/<month>/<basename>.webp   optimised images
 *   src/data/redirects.json              301 map for the consolidated pages
 *
 * The script is idempotent: rerunning it regenerates the same files.
 * Run with:  node scripts/port-content.mjs
 */

import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const UPLOADS = path.join(
  ROOT,
  "source/domains/centrodoctorgoiz.cl/public_html/wp-content/uploads",
);
const EXTRACT = path.join(ROOT, ".local/extract");
const PAGES_OUT = path.join(ROOT, "src/content/pages");
const GALLERIES_OUT = path.join(ROOT, "src/content/galleries");
const MEDIA_OUT = path.join(ROOT, "src/assets/media");
const REDIRECTS_OUT = path.join(ROOT, "src/data/redirects.json");

/**
 * The 10 pages that survive the consolidation to Spanish. The 5 English
 * duplicates and the 2 blog entries are not ported (see S3 / L5 / L6).
 */
const PAGES = {
  home: "institucional",
  "francisco-mena": "institucional",
  servicios: "institucional",
  testimonios: "institucional",
  colaboradores: "institucional",
  galeria: "galeria",
  preguntas: "conocimiento",
  "par-biomagnetico": "conocimiento",
  entrevistas: "conocimiento",
  contactos: "contacto",
};

/** 301s for the consolidated English duplicates and the retired blog entries. */
const REDIRECTS = {
  "/about-us/": "/francisco-mena/",
  "/services/": "/servicios/",
  "/contact-us/": "/contactos/",
  "/testimonial/": "/testimonios/",
  "/customer-cabinet/": "/",
  "/saludo/": "/",
  "/foto1/": "/",
};

const WP_UPLOAD_RE = /https?:\/\/localhost:\d+\/wp-content\/uploads\/([^)\s"]+)/g;
// Absolute localhost links to other pages stay as links, minus the dead host.
// WordPress plugin assets are not ported, so they are left untouched.
const WP_INTERNAL_RE = /https?:\/\/localhost:\d+\/(?!(?:wp-content|wp-includes|wp-admin)\b)/g;

const stats = {
  converted: 0,
  cacheHits: 0,
  bytesBefore: 0,
  bytesAfter: 0,
  missing: [],
  variantSubstitutions: [],
  metadataLeaks: [],
};

/** `<year>/<month>/<basename>.webp` for an uploads-relative source path. */
function outputRelPath(uploadRel) {
  const dir = path.posix.dirname(uploadRel);
  const ext = path.posix.extname(uploadRel);
  const basename = path.posix.basename(uploadRel, ext).replace(/-\d+x\d+$/, "");
  return `${dir}/${basename}.webp`;
}

/**
 * WordPress stores every resized variant next to the original
 * (`IMG_0527-585x1024.jpg`). Always convert the original when it is on disk:
 * shipping a 585px crop as the only source would cap the design phase.
 */
function resolveOriginal(uploadRel) {
  const dir = path.posix.dirname(uploadRel);
  const ext = path.posix.extname(uploadRel);
  const stem = path.posix.basename(uploadRel, ext);
  const originalStem = stem.replace(/-\d+x\d+$/, "");
  if (originalStem === stem) return uploadRel;
  const candidate = `${dir}/${originalStem}${ext}`.replace(/^\.\//, "");
  return existsSync(path.join(UPLOADS, candidate)) ? candidate : uploadRel;
}

const converted = new Map();

/**
 * Convert one uploads-relative file to WebP inside `src/assets/media`.
 * Returns the project-relative output path (`/src/assets/media/...`).
 */
async function convert(uploadRel) {
  if (!existsSync(path.join(UPLOADS, uploadRel))) {
    stats.missing.push(uploadRel);
    return null;
  }

  const original = resolveOriginal(uploadRel);
  if (original !== uploadRel && !stats.variantSubstitutions.some((v) => v.to === original)) {
    stats.variantSubstitutions.push({ from: uploadRel, to: original });
  }
  const source = path.join(UPLOADS, original);
  const relOut = outputRelPath(original);
  const outPath = path.join(MEDIA_OUT, relOut);
  const projectPath = `/src/assets/media/${relOut}`;

  if (converted.has(relOut)) {
    stats.cacheHits += 1;
    return { relOut, projectPath, ...converted.get(relOut) };
  }

  const { data, info } = await sharp(source)
    .rotate() // bake EXIF orientation before the metadata is stripped
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const meta = await sharp(data).metadata();
  if (meta.exif || meta.icc || meta.orientation || meta.xmp) {
    stats.metadataLeaks.push(relOut);
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, data);

  stats.converted += 1;
  stats.bytesBefore += statSync(source).size;
  stats.bytesAfter += statSync(outPath).size;
  converted.set(relOut, { width: info.width, height: info.height });

  return { relOut, projectPath, width: info.width, height: info.height };
}

/**
 * Inline images: pages get paths relative to the Markdown file so Astro resolves
 * and optimises them; the gallery JSON keeps project paths, matching `src`.
 */
async function rewriteMarkdownImages(markdown, mode = "relative") {
  const replacements = new Map();
  for (const match of markdown.matchAll(WP_UPLOAD_RE)) {
    const uploadRel = decodeURIComponent(match[1]);
    const result = await convert(uploadRel);
    if (!result) continue;
    replacements.set(
      match[0],
      mode === "relative" ? `../../assets/media/${result.relOut}` : result.projectPath,
    );
  }

  let out = markdown;
  for (const [from, to] of replacements) out = out.split(from).join(to);
  // Remaining absolute localhost links are internal page links: keep the target,
  // drop the dead host so the static build links to the new routes.
  return out.replace(WP_INTERNAL_RE, "/");
}

function splitFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error("Markdown sin frontmatter");
  return { frontmatter: match[1], body: raw.slice(match[0].length) };
}

function yamlString(value) {
  return JSON.stringify(value);
}

async function portPages(manifest) {
  await fs.mkdir(PAGES_OUT, { recursive: true });
  const bySlug = new Map(manifest.map((page) => [page.slug, page]));
  const written = [];

  for (const [slug, section] of Object.entries(PAGES)) {
    const entry = bySlug.get(slug);
    if (!entry) throw new Error(`Falta ${slug} en pages-manifest.json`);
    const raw = await fs.readFile(path.join(EXTRACT, "pages", `${slug}.md`), "utf8");
    const { body } = splitFrontmatter(raw);
    const ported = await rewriteMarkdownImages(body);

    const frontmatter = [
      "---",
      `title: ${yamlString(entry.title)}`,
      `section: ${yamlString(section)}`,
      `order: ${entry.id}`,
      `wpId: ${entry.id}`,
      "legacyUrls: []",
      "---",
      "",
    ].join("\n");

    await fs.writeFile(path.join(PAGES_OUT, `${slug}.md`), `${frontmatter}${ported.trimEnd()}\n`, "utf8");
    written.push(slug);
  }

  return written;
}

async function portGalleries() {
  await fs.mkdir(GALLERIES_OUT, { recursive: true });
  const map = JSON.parse(await fs.readFile(path.join(EXTRACT, "gallery-map.json"), "utf8"));
  const galleries = JSON.parse(await fs.readFile(path.join(EXTRACT, "galleries.json"), "utf8"));
  const byId = new Map(galleries.map((gallery) => [gallery.id, gallery]));
  const written = [];

  for (const page of map) {
    const raw = await fs.readFile(path.join(EXTRACT, "pages", `${page.pageSlug}.md`), "utf8");
    const { body } = splitFrontmatter(raw);
    const intro = (await rewriteMarkdownImages(body, "project")).trim();

    const pageGalleries = [];
    for (const id of page.galleryIds) {
      const gallery = byId.get(id);
      if (!gallery) throw new Error(`Galería ${id} ausente para ${page.pageSlug}`);
      const total = gallery.images.length;
      const images = [];

      for (const [index, image] of gallery.images.entries()) {
        const result = await convert(image.file);
        if (!result) continue;
        const originalAlt = (image.alt ?? "").trim();
        images.push({
          src: result.projectPath,
          alt: originalAlt || `${page.pageTitle}: ${gallery.title} (foto ${index + 1} de ${total})`,
          altPending: !originalAlt,
          caption: image.caption ?? "",
          width: result.width,
          height: result.height,
        });
      }

      pageGalleries.push({ slug: gallery.slug, title: gallery.title, images });
    }

    const cover = pageGalleries[0]?.images[0]?.src ?? "";
    const payload = { title: page.pageTitle, cover, intro, galleries: pageGalleries };
    await fs.writeFile(
      path.join(GALLERIES_OUT, `${page.pageSlug}.json`),
      `${JSON.stringify(payload, null, 2)}\n`,
      "utf8",
    );
    written.push(page.pageSlug);
  }

  return written;
}

async function writeRedirects() {
  await fs.mkdir(path.dirname(REDIRECTS_OUT), { recursive: true });
  await fs.writeFile(REDIRECTS_OUT, `${JSON.stringify(REDIRECTS, null, 2)}\n`, "utf8");
}

const manifest = JSON.parse(await fs.readFile(path.join(EXTRACT, "pages-manifest.json"), "utf8"));

const pages = await portPages(manifest);
const galleryPages = await portGalleries();
await writeRedirects();

const kb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB (${bytes} B)`;
console.log(`Páginas escritas: ${pages.length} → ${pages.join(", ")}`);
console.log(`Galerías escritas: ${galleryPages.length} → ${galleryPages.join(", ")}`);
console.log(`Redirects: ${Object.keys(REDIRECTS).length}`);
console.log(`Imágenes convertidas: ${stats.converted} (reutilizadas desde caché: ${stats.cacheHits})`);
console.log(`Bytes antes: ${kb(stats.bytesBefore)}`);
console.log(`Bytes después: ${kb(stats.bytesAfter)}`);
console.log(`Referencias faltantes: ${stats.missing.length}${stats.missing.length ? ` → ${stats.missing.join(", ")}` : ""}`);
console.log(`Variantes sustituidas por el original: ${stats.variantSubstitutions.length}`);
for (const sub of stats.variantSubstitutions) console.log(`  ${sub.from} → ${sub.to}`);
console.log(`Salidas con metadatos EXIF/ICC/XMP: ${stats.metadataLeaks.length}`);
