// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

const debugShim = fileURLToPath(new URL("./src/shims/debug.js", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://technews.amb1.workers.dev",
  adapter: cloudflare({
    imageService: "compile",
    // Avoid remote-binding auth during `astro build` (CI has no interactive wrangler login).
    prerenderEnvironment: "node",
  }),
  integrations: [
    sitemap(),
    icon({
      include: {
        lucide: [
          "sun",
          "moon",
          "monitor",
          "languages",
          "rss",
          "user",
          "external-link",
          "arrow-left",
          "a-arrow-down",
          "a-arrow-up",
          "search",
          "bookmark",
        ],
      },
    }),
  ],
  vite: {
    resolve: {
      // workerd has no CJS `module` global; alias debug → ESM shim (obug)
      alias: {
        debug: debugShim,
      },
    },
    optimizeDeps: {
      // Force pre-bundling so CJS debug pulled by iconify never hits workerd raw
      include: ["astro-icon > @iconify/utils > debug", "debug"],
    },
    ssr: {
      optimizeDeps: {
        include: [
          "astro-icon > @iconify/utils > debug",
          "debug",
          "@iconify/utils",
        ],
      },
    },
  },
});
