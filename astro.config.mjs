// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The production origin. Canonical URLs, Open Graph tags, robots.txt and the
// sitemap are all generated from it (SITE_URL overrides for previews).
const site = process.env.SITE_URL ?? 'https://speechtotext.dev';

export default defineConfig({
  site,
  integrations: [sitemap()],
});
