/**
 * Emite los archivos de redirects de los hostings a partir de una sola fuente.
 *
 * Fuente única: `src/data/redirects.json`. Este script escribe:
 *   - `public/_redirects`  → formato de **Netlify y de Cloudflare Pages** (las
 *                            dos leen el mismo archivo; elegir hosting no
 *                            cambia esta configuración)
 *   - `vercel.json`        → formato de Vercel
 *   - `public/robots.txt`  → apunta al sitemap generado por @astrojs/sitemap
 *
 * Se ejecuta en `prebuild`, así que los tres archivos nunca se editan a mano:
 * si hay que agregar una URL vieja, se agrega en `redirects.json` y listo.
 */
import fs from "node:fs/promises";
import path from "node:path";

const SITE = "https://centrodoctorgoiz.cl";
const root = process.cwd();

const redirects = JSON.parse(await fs.readFile(path.join(root, "src/data/redirects.json"), "utf8"));
const entries = Object.entries(redirects);

await fs.mkdir(path.join(root, "public"), { recursive: true });

// Netlify y Cloudflare Pages: una línea por regla, código 301. Los dos hostings
// leen `_redirects` con esta misma sintaxis, así que la decisión entre ellos no
// toca este archivo.
const hostingRedirects = [
  "# Generado por scripts/emit-redirects.mjs desde src/data/redirects.json",
  "# No editar a mano: los cambios se hacen en redirects.json",
  "# Funciona en Netlify y en Cloudflare Pages (mismo formato de _redirects)",
  ...entries.map(([from, to]) => `${from}  ${to}  301`),
  "",
].join("\n");
await fs.writeFile(path.join(root, "public/_redirects"), hostingRedirects, "utf8");

// Vercel: la misma información en su esquema JSON.
const vercel = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  redirects: entries.map(([from, to]) => ({ source: from, destination: to, permanent: true })),
};
await fs.writeFile(path.join(root, "vercel.json"), `${JSON.stringify(vercel, null, 2)}\n`, "utf8");

// robots.txt: el sitemap lo genera @astrojs/sitemap en el build.
const robots = ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE}/sitemap-index.xml`, ""].join("\n");
await fs.writeFile(path.join(root, "public/robots.txt"), robots, "utf8");

console.log(
  `redirects emitidos: ${entries.length} (public/_redirects, vercel.json) + public/robots.txt`,
);
