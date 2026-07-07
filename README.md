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

> The production origin is `https://speechtotext.dev` (set in `astro.config.mjs`); canonical URLs, OG tags, robots.txt, and the sitemap are generated from it. Override per-build with `SITE_URL=… npm run build` for previews.

To preview the exact Worker locally after a build: `npm run preview` (runs `wrangler dev`).

## Project layout

```
src/
  data/models/*.json   # the catalogue — one validated JSON file per entry
  data/catalogue.json  # display order (entry numbers derive from position)
  data/models.ts       # zod schema + loader (invalid data fails the build)
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
scripts/
  sync-leaderboard.mjs # WER drift + new-model detection vs the Open ASR Leaderboard
  sync-config.json     # candidate threshold + ignore patterns (covered families)
```

Adding a model = one JSON file in `src/data/models/` plus its id in `src/data/catalogue.json`; the page, library row, sitemap entry, entry number, and structured data are generated at build time. Editorial rules live in `CLAUDE.md`.

## Automated catalogue updates

`.github/workflows/catalogue-sync.yml` runs every Monday (or on demand via *Run workflow*):

1. **Deterministic sync** — `scripts/sync-leaderboard.mjs` fetches the [Open ASR Leaderboard](https://github.com/huggingface/open_asr_leaderboard) data, applies WER drift to existing entries (joined via each entry's `hfId`), and lists new models below the notability threshold in `scripts/sync-config.json`.
2. **Agentic drafting** — if new candidates exist and the `GEMINI_API_KEY` repository secret is set (Google AI Studio key), Gemini CLI researches each one (model card, licence file, announcements), drafts the entry per the style and verification rules in `CLAUDE.md`, and validates the build.
3. **PR-gated publish** — everything lands as a `bot/catalogue-sync` PR with sources cited. Merging deploys (via your deploy-on-merge setup). Without the secret, WER-refresh PRs still work; only drafting is skipped.

`ci.yml` builds and type-checks every PR, so a malformed bot entry can never merge.

## Subscriptions

- **RSS** — `/rss.xml` is generated at build time from each entry's `added` date (newest first, 20 items, summaries only — every item links to the entry page). Linked in the footer and via `<link rel="alternate">`.
- **Email** — the footer has a Buttondown subscribe form that stays hidden until configured: create an account at [buttondown.com](https://buttondown.com), set `BUTTONDOWN_USERNAME` in `src/config.ts`, and enable Buttondown's RSS-to-email automation pointed at `https://speechtotext.dev/rss.xml` so new entries are emailed automatically. The privacy policy's "Email updates" section already describes this setup — revise it if you pick a different provider.
