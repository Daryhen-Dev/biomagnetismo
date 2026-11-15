/**
 * Extract every published WordPress page to Markdown.
 *
 * Reads the rendered HTML from the local REST API (no auth needed for published
 * pages) and converts it with turndown. Output goes to `.local/extract/pages/`
 * as an intermediate staging area: the final placement into Astro collections is
 * a separate, reviewable step.
 *
 * Run with the local stack up:  node scripts/extract-pages.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const BASE = process.env.WP_BASE_URL ?? "http://localhost:8080";
const OUT = path.resolve(".local/extract/pages");

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});
turndown.use(gfm);
turndown.keep(["table"]);

/** Strip markup that carries no content: styles, scripts, sliders, empty wrappers. */
function clean(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<div[^>]*class="[^"]*modula[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*n2-ss-[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, "");
}

/** Collapse the whitespace noise turndown leaves behind. */
function tidy(md) {
  return md
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "");
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»");
}

await fs.mkdir(OUT, { recursive: true });

const response = await fetch(`${BASE}/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,title,content,link`);
if (!response.ok) {
  throw new Error(`REST API respondió ${response.status}. ¿Está levantado el stack local?`);
}

const pages = await response.json();
const manifest = [];

for (const page of pages) {
  const title = decodeEntities(page.title.rendered).trim();
  const markdown = tidy(turndown.turndown(clean(page.content.rendered)));
  const images = [...page.content.rendered.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `wpId: ${page.id}`,
    `slug: ${JSON.stringify(page.slug)}`,
    "---",
    "",
  ].join("\n");

  await fs.writeFile(path.join(OUT, `${page.slug}.md`), `${frontmatter}${markdown}\n`, "utf8");

  manifest.push({
    id: page.id,
    slug: page.slug,
    title,
    markdownChars: markdown.length,
    headings: (markdown.match(/^#{1,3} /gm) ?? []).length,
    inlineImages: images.length,
    hasGalleryShortcode: /\[modula\s+id=/.test(page.content.rendered),
  });
}

await fs.writeFile(
  path.resolve(".local/extract/pages-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

const total = manifest.reduce((sum, p) => sum + p.markdownChars, 0);
console.log(`Páginas extraídas: ${manifest.length}  →  ${OUT}`);
console.log(`Markdown total: ${total.toLocaleString("es")} caracteres`);
for (const p of manifest.sort((a, b) => b.markdownChars - a.markdownChars)) {
  console.log(`  ${String(p.markdownChars).padStart(6)}  ${p.slug.padEnd(20)} ${p.title}`);
}
