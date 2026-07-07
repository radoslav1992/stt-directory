# STT—INDEX

An open, static directory of speech-to-text models — specs, licences, benchmarks, and where to get each model. Built with [Astro](https://astro.build) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) (static assets).

## Stack

- **Astro 5** — fully static output; every model, legal, and index page is prerendered HTML for SEO (canonical URLs, Open Graph tags, JSON-LD structured data, sitemap, robots.txt).
- **Vanilla JS islands** — client-side search/filtering on the library page, and an in-browser transcription demo (Whisper tiny.en / Moonshine tiny via [transformers.js](https://huggingface.co/docs/transformers.js), loaded on demand from the jsDelivr CDN; audio never leaves the device).
- **Cloudflare Workers static assets** — no server code; `wrangler.jsonc` serves `dist/` with `404.html` handling. `public/_headers` sets immutable caching for hashed assets.

## Develop

```sh
npm install
npm run dev        # dev server at localhost:4321
```

## Build & deploy

```sh
npm run build      # static build into dist/
npm run deploy     # build + wrangler deploy (needs `wrangler login` or CLOUDFLARE_API_TOKEN)
```

> **Set the production URL** before the first real deploy: canonical URLs, OG tags, robots.txt, and the sitemap are generated from the `site` value in `astro.config.mjs`. Either edit the fallback there or build with `SITE_URL=https://your-domain.example npm run build`.

To preview the exact Worker locally after a build: `npm run preview` (runs `wrangler dev`).

## Project layout

```
src/
  data/models.ts       # the catalogue — all model entries live here
  data/legal.ts        # legal page copy
  layouts/Base.astro   # head/SEO, header, footer
  components/Demo.astro# in-browser transcription demo island
  pages/
    index.astro        # home
    library.astro      # searchable/filterable table
    model/[id].astro   # one prerendered page per entry
    legal/[doc].astro  # privacy / terms / licences
    404.astro
    robots.txt.ts
  styles/global.css    # design system (IBM Plex + Instrument Serif, cream/ink/orange)
```

Adding a model = adding one object to `src/data/models.ts`; its page, library row, sitemap entry, and structured data are generated at build time.
