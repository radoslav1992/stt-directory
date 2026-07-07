#!/usr/bin/env node
// Syncs the catalogue against the Open ASR Leaderboard's published data.
//
//   node scripts/sync-leaderboard.mjs                  # dry run, print report
//   node scripts/sync-leaderboard.mjs --write          # apply WER updates to src/data/models/*.json
//   node scripts/sync-leaderboard.mjs --report out.json
//
// Two outputs:
//   updates    — entries whose leaderboard WER drifted from the catalogue value
//                (applied automatically with --write; numbers only, no prose)
//   candidates — leaderboard models not yet catalogued, below the WER threshold
//                and not matching ignorePatterns (families already covered).
//                These need editorial research before becoming entries — see
//                CLAUDE.md and .github/workflows/catalogue-sync.yml.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CSV_URL =
  'https://raw.githubusercontent.com/huggingface/open_asr_leaderboard/main/scripts/data/en_shortform.csv';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS_DIR = path.join(ROOT, 'src', 'data', 'models');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'sync-config.json'), 'utf8'));

const args = process.argv.slice(2);
const write = args.includes('--write');
const reportIdx = args.indexOf('--report');
const reportPath = reportIdx >= 0 ? args[reportIdx + 1] : null;

const res = await fetch(CSV_URL);
if (!res.ok) {
  console.error(`Failed to fetch leaderboard CSV: HTTP ${res.status}`);
  process.exit(1);
}
const csv = await res.text();

// Parse the CSV. Column order: model, Avg. WER, RTFx, Model size (B), License, ...
// Model ids contain no commas; duplicate rows are collapsed (first wins).
const rows = new Map();
for (const line of csv.trim().split('\n').slice(1)) {
  const cols = line.split(',');
  if (cols.length < 5) continue;
  const [hfId, werRaw, rtfxRaw, sizeRaw, license] = cols;
  const wer = Number(werRaw);
  if (!hfId || !Number.isFinite(wer)) continue;
  if (!rows.has(hfId)) {
    rows.set(hfId, { hfId, wer, rtfx: Number(rtfxRaw), sizeB: Number(sizeRaw), license });
  }
}
if (rows.size === 0) {
  console.error('Leaderboard CSV parsed to zero rows — format may have changed.');
  process.exit(1);
}

const entries = fs
  .readdirSync(MODELS_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => {
    const file = path.join(MODELS_DIR, f);
    return { file, data: JSON.parse(fs.readFileSync(file, 'utf8')) };
  });

// 1. WER drift on existing entries (joined via hfId).
const updates = [];
for (const e of entries) {
  if (!e.data.hfId || e.data.wer == null) continue;
  const row = rows.get(e.data.hfId);
  if (!row) continue;
  const newWer = Math.round(row.wer * 100) / 100;
  if (Math.abs(newWer - e.data.wer) >= 0.01) {
    updates.push({ id: e.data.id, hfId: e.data.hfId, oldWer: e.data.wer, newWer });
    if (write) {
      e.data.wer = newWer;
      fs.writeFileSync(e.file, JSON.stringify(e.data, null, 2) + '\n');
    }
  }
}

// 2. New models worth considering.
const covered = new Set(entries.map((e) => e.data.hfId).filter(Boolean));
const ignore = CONFIG.ignorePatterns.map((p) => new RegExp(p));
const candidates = [...rows.values()]
  .filter((r) => !covered.has(r.hfId))
  .filter((r) => r.wer <= CONFIG.candidateWerThreshold)
  .filter((r) => !ignore.some((re) => re.test(r.hfId)))
  .sort((a, b) => a.wer - b.wer)
  .slice(0, CONFIG.maxCandidates ?? 10);

const report = {
  fetchedAt: new Date().toISOString(),
  source: CSV_URL,
  wroteUpdates: write,
  updates,
  candidates,
};
if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

console.log(`Leaderboard rows: ${rows.size}`);
console.log(
  `WER updates (${write ? 'applied' : 'dry run'}): ${updates.length}` +
    updates.map((u) => `\n  ${u.id}: ${u.oldWer} -> ${u.newWer}`).join('')
);
console.log(
  `New candidates: ${candidates.length}` +
    candidates.map((c) => `\n  ${c.hfId} (${c.wer}% WER, ${c.license})`).join('')
);
