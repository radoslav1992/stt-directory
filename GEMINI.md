# STT-Index — agent context

The project's data model, curation scope, verification rules, and house style
live in `CLAUDE.md` (provider-neutral editorial guide, despite the filename).
Read it in full before changing anything under `src/data/`.

Hard rules, restated: never invent numbers — WER only from
`leaderboard-report.json`; licences only after verifying the actual LICENSE
file or model-card metadata; pricing only with a fetched source. Validate with
`npm run build` and `npx astro check` before finishing.
