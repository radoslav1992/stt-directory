# STT-Index

Static Astro 5 directory of speech-to-text models, deployed to Cloudflare Workers (static assets). SEO is the point: every entry is a prerendered page with canonical URL, OG tags, JSON-LD, and a sitemap entry — all generated from the data files.

## Commands

- `npm run dev` / `npm run build` / `npm run check`
- `node scripts/sync-leaderboard.mjs [--write] [--report out.json]` — diff the catalogue against the Open ASR Leaderboard data; `--write` applies WER updates to the JSON files

## Data model

- One entry = one JSON file at `src/data/models/<id>.json`, validated by the zod schema in `src/data/models.ts` — a malformed entry fails the build.
- Display order (and the "ENTRY NN" numbers) come from `src/data/catalogue.json`. Insert new ids at the editorially correct place: leaderboard leaders first, then the Whisper ecosystem, edge/multilingual models, toolkits, legacy entries, hosted APIs last.
- `id` must match the filename. `hfId` is the Open ASR Leaderboard join key used by the sync script (runtimes that execute Whisper weights share `openai/whisper-large-v3`); `null` means never auto-synced.
- Adding a valid file + catalogue.json entry is all it takes — page, library row, ticker, counts, sitemap, and structured data generate at build time.

## Curation rules (what belongs)

- Openly downloadable STT models, the runtimes/toolkits people actually deploy, and major hosted APIs.
- One entry per model family: cover variants inside the entry (params like "3B / 24B", prose in `about`) rather than adding an entry per checkpoint.
- Skip minor fine-tunes, quantised re-uploads, and models with no distinct capability or niche.

## Verification rules (non-negotiable)

- `wer`: only from the Open ASR Leaderboard data (the sync script / its report). Not listed there → `null`. Never use a vendor-claimed figure.
- `license`: verify against the actual LICENSE file or model-card metadata, never press coverage. Classify `licenseType` conservatively; custom licences get a caveat sentence in `about`.
- Pricing strings: only with a fetched source; otherwise write "usage-based". API entries carry a "prices change — check the pricing page" note.
- Every URL in `downloads`/`hosted`/`links` must be one actually resolved during research.

## House style

- `blurb`: one sentence, ~120 chars max, em-dash rhythm ("X — Y").
- `about`: exactly two paragraphs. First: what it is, architecture, headline result. Second: ecosystem, licence caveats, practical guidance. British editorial spelling in prose ("licence", "recognised"); SPDX ids in the `license` field.
- `install`: a paste-able snippet, ≤ 8 lines, real commands from the project's docs.
- API entries (`kind: "api"`): `downloads: []`, pricing tiers in `hosted`, `licenseType: "proprietary"`.
