import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import netlify from "@astrojs/netlify";

// TODO: Only run server-mode in production

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    AutoImport({
      imports: [
        // Add your Note component to the auto-imports:
        "./src/components/Uploader.astro",
      ],
    }),
    mdx(),
    sitemap(),
  ],
  output: "hybrid",
  adapter: netlify(),
});
