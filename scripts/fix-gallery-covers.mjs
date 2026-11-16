/**
 * Elige una portada real para cada galería.
 *
 * Por qué existe: la portada la hereda la migración desde el JSON de la galería, y en
 * varios casos apunta a la primera imagen del álbum, que puede ser una bandera, un
 * logotipo o una captura. Una bandera a 190 px al lado de fotografías documentales
 * parece un error de carga, no una decisión editorial.
 *
 * Regla: si la portada actual describe una bandera, un logotipo o una captura de
 * pantalla, se reemplaza por la primera imagen del primer álbum cuya descripción no
 * sea ninguno de esos casos. El script es idempotente: correrlo dos veces no cambia nada.
 *
 * Uso: node scripts/fix-gallery-covers.mjs [--dry]
 */
import fs from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve("src/content/galleries");
const dry = process.argv.includes("--dry");
const IGNORABLE = /\b(bandera|logotipo|logo|escudo|captura de pantalla|pantalla|diploma|portada de)\b/i;

const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".json"));
const report = [];

for (const file of files) {
  const full = path.join(DIR, file);
  const gallery = JSON.parse(await fs.readFile(full, "utf8"));

  const all = gallery.galleries.flatMap((album) =>
    album.images.map((image) => ({ ...image, album: album.title })),
  );
  const coverImage = all.find((image) => image.src === gallery.cover);
  const coverIsIgnorable = !coverImage || IGNORABLE.test(coverImage.alt ?? "");

  if (!coverIsIgnorable) {
    report.push({ file, action: "sin cambios", cover: coverImage?.alt?.slice(0, 60) });
    continue;
  }

  const replacement = all.find((image) => !IGNORABLE.test(image.alt ?? ""));
  if (!replacement) {
    report.push({ file, action: "SIN REEMPLAZO: todas las fotos son ignorables" });
    continue;
  }

  if (!dry) {
    gallery.cover = replacement.src;
    await fs.writeFile(full, `${JSON.stringify(gallery, null, 2)}\n`, "utf8");
  }
  report.push({
    file,
    action: dry ? "cambiaría" : "portada cambiada",
    de: coverImage?.alt?.slice(0, 50) ?? "(portada inexistente)",
    a: replacement.alt.slice(0, 50),
  });
}

for (const row of report) console.log(JSON.stringify(row));
