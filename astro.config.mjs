// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The production origin. Canonical URLs, Open Graph tags, robots.txt and the
// sitemap are all generated from it — set SITE_URL at build time (or edit the
// fallback) once the real domain is known.
const site = process.env.SITE_URL ?? 'https://stt-index.example.com';

export default defineConfig({
  site,
  integrations: [sitemap()],
});
