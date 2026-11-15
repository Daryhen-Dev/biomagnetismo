// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// The migration source (`source/`, ~743 MB) and local artifacts must never be
// watched by Vite: the dev server would try to index the whole WordPress tree.
export default defineConfig({
  site: "https://centrodoctorgoiz.cl",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/source/**", "**/.local/**", "**/odd/**"],
      },
    },
  },
});
