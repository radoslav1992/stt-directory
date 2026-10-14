# STT-Index

Static Astro 5 directory of speech-to-text models, deployed to Cloudflare Workers (static assets). SEO is the point: every entry is a prerendered page with canonical URL, OG tags, JSON-LD, and a sitemap entry — all generated from the data files.

## Commands

- `npm run dev` / `npm run build` / `npm run check`
- `node scripts/sync-leaderboard.mjs [--write] [--report out.json]` — diff the catalogue against the Open ASR Leaderboard data; `--write` applies WER updates to the JSON files

## Data model

- One entry = one JSON file at `src/data/models/<id>.json`, validated by the zod schema in `src/data/models.ts` — a malformed entry fails the build.
- Display order (and the "ENTRY NN" numbers) come from `src/data/catalogue.json`. Insert new ids at the editorially correct place: leaderboard leaders first, then the Whisper ecosystem, edge/multilingual models, toolkits, legacy entries, hosted APIs last.
- `id` must match the filename. `hfId` is the Open ASR Leaderboard join key used by the sync script (runtimes that execute Whisper weights share `openai/whisper-large-v3`); `null` means never auto-synced.
- `added` is the ISO date (YYYY-MM-DD) the entry joined the catalogue — it drives the RSS feed (`/rss.xml`). Stamp new entries with the date they are created (in the sync workflow, use the date from the report's `fetchedAt`). Never backdate or change it on existing entries.
- `demo` (nullable) renders the in-browser transcription box: `{ note, models: [{ label, hfId, size, webgpuOnly? }] }`. Only for architectures with a transformers.js-compatible ONNX build, and every `hfId` must be a verified Hugging Face repo — a wrong id fails at user-click time, not build time. Mark multi-hundred-MB checkpoints `webgpuOnly: true`.
- `seoTitle` / `seoDescription` (optional) override the generated `<title>` (≤ 60 chars, no site suffix — it is appended when it fits) and meta description (≤ 160 chars). Use them only for entries with real search demand (check Search Console), match the queries people actually type (e.g. the exact checkpoint id), and use only facts already present in the entry. Write the entry's own WER as the `{wer}` placeholder (filled at build time, so leaderboard syncs never leave a stale figure) and avoid quoting other entries' WER. Otherwise omit them — `src/data/seo.ts` generates both from the data.
- Adding a valid file + catalogue.json entry is all it takes — page, library row, search palette, leaderboard, pricing table, guide membership, FAQs, counts, sitemap, and structured data generate at build time.

## Generated SEO pages

- `/leaderboard/` ranks every entry with its own WER (runtimes inherit Whisper's and aren't ranked separately). `/pricing/` lists every `hosted` tier, normalising "$x / min" and "$x / hr" strings to cost per audio hour — keep price strings in that shape so they parse.
- `/best/<slug>/` guides are defined in `src/data/collections.ts`: a filter + sort over the data plus a hand-written intro. Intros must not contain numbers that aren't derived from the data.
- `/compare/<a>-vs-<b>/` pages come from the curated `PAIRS` list in `src/data/comparisons.ts` — add a pair only when people search for it. Every sentence on those pages is generated from the two entries; removing an entry that a pair references fails the build.
- FAQs on entry, guide and comparison pages are generated in `src/data/seo.ts` from entry fields — never hand-write facts there.

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
