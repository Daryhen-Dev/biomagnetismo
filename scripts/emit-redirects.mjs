/**
 * Emite los archivos de redirects de los hostings a partir de una sola fuente.
 *
 * Fuente única: `src/data/redirects.json`, con dos formas:
 *   - `exact`: una ruta vieja → la nueva, tal cual.
 *   - `wildcards`: usa `*` para cubrir familias enteras (categorías, etiquetas,
 *     autores, archivos por fecha del blog viejo).
 *
 * Escribe tres archivos:
 *   - `public/_redirects`  → formato de Netlify **y** de Cloudflare Pages, que
 *     comparten sintaxis. La decisión entre los dos no toca este archivo.
 *   - `vercel.json`        → el esquema de Vercel, que escribe los comodines
 *     como `:path*`.
 *   - `public/robots.txt`  → apunta al sitemap que genera @astrojs/sitemap.
 *
 * Se ejecuta en `build`, así que los tres archivos nunca se editan a mano: si
 * hay que agregar una URL vieja, se agrega en `redirects.json` y listo.
 */
import fs from "node:fs/promises";
import path from "node:path";

const SITE = "https://centrodoctorgoiz.cl";
const root = process.cwd();

const source = JSON.parse(await fs.readFile(path.join(root, "src/data/redirects.json"), "utf8"));
const exact = Object.entries(source.exact ?? {});
const wildcards = source.wildcards ?? [];

await fs.mkdir(path.join(root, "public"), { recursive: true });

const lines = [
  "# Generado por scripts/emit-redirects.mjs desde src/data/redirects.json",
  "# No editar a mano: los cambios se hacen en redirects.json",
  "# Funciona en Netlify y en Cloudflare Pages (mismo formato de _redirects)",
  ...exact.map(([from, to]) => `${from}  ${to}  301`),
  ...wildcards.map((rule) => `${rule.from}  ${rule.to}  301`),
  "",
];

await fs.writeFile(path.join(root, "public/_redirects"), lines.join("\n"), "utf8");

/** En Vercel un `*` se escribe `:path*`, después de los segmentos literales. */
const toVercelSource = (route) =>
  route.includes("*") ? route.replace("*", ":path*") : route;

const vercel = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  redirects: [
    ...exact.map(([from, to]) => ({ source: from, destination: to, permanent: true })),
    ...wildcards.map((rule) => ({
      source: toVercelSource(rule.from),
      destination: rule.to,
      permanent: true,
    })),
  ],
};
await fs.writeFile(path.join(root, "vercel.json"), `${JSON.stringify(vercel, null, 2)}\n`, "utf8");

const robots = ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE}/sitemap-index.xml`, ""].join("\n");
await fs.writeFile(path.join(root, "public/robots.txt"), robots, "utf8");

console.log(
  `redirects emitidos: ${exact.length} exactos + ${wildcards.length} comodines (public/_redirects, vercel.json) + public/robots.txt`,
);
