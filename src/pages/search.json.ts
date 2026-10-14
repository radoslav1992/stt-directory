import type { APIRoute } from 'astro';
import { MODELS, KIND_LABELS, modelPath, werLabel } from '../data/models';
import { COLLECTIONS, collectionPath } from '../data/collections';
import { COMPARISONS, comparisonPath } from '../data/comparisons';

// Command-palette index (every entry plus the hub pages), prerendered to
// /search.json and fetched on first use instead of being inlined in every page.
// Keys are short to keep the payload small: n name, o org, k kind, w WER,
// u URL, h lowercase haystack matched against the query.
export const GET: APIRoute = () => {
  const index = {
    models: MODELS.map((m) => ({
      n: m.name,
      o: m.org,
      k: KIND_LABELS[m.kind],
      w: m.wer == null ? '' : werLabel(m.wer),
      u: modelPath(m),
      h: `${m.name} ${m.org} ${m.kind} ${m.license} ${m.langs} ${m.runs.join(' ')} ${m.id}`.toLowerCase(),
    })),
    pages: [
      { n: 'Library — all entries', u: '/library/', h: 'library all models table filter' },
      { n: 'WER leaderboard', u: '/leaderboard/', h: 'leaderboard ranking benchmark wer accuracy best' },
      { n: 'Speech-to-text API pricing', u: '/pricing/', h: 'pricing price cost api per hour minute cheap' },
      ...COLLECTIONS.map((c) => ({
        n: c.h1,
        u: collectionPath(c),
        h: `${c.label} ${c.h1} best guide`.toLowerCase(),
      })),
      ...COMPARISONS.map((c) => ({
        n: `${c.a.name} vs ${c.b.name}`,
        u: comparisonPath(c),
        h: `${c.a.name} ${c.b.name} vs compare ${c.a.id} ${c.b.id}`.toLowerCase(),
      })),
    ],
  };
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
