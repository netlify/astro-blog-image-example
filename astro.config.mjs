import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";

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
