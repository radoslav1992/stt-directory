import { z } from 'astro/zod';
import catalogueOrder from './catalogue.json';

// The catalogue lives in src/data/models/*.json — one file per entry — with
// display order in src/data/catalogue.json. Entry numbers derive from that
// order, so inserting a model never requires renumbering. Every file is
// validated against the schema below at build time; a malformed entry fails
// the build rather than shipping.

export const modelSchema = z.object({
  /** URL slug; must match the filename. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Hugging Face repo id used to sync WER against the Open ASR Leaderboard
   *  CSV (scripts/sync-leaderboard.mjs). Runtimes that execute Whisper
   *  weights share whisper-large-v3's id. Null = never auto-synced. */
  hfId: z.string().nullable(),
  name: z.string(),
  org: z.string(),
  year: z.number().int(),
  /** ISO date (YYYY-MM-DD) the entry joined the catalogue — drives the RSS feed. */
  added: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  kind: z.enum(['model', 'runtime', 'toolkit', 'api']),
  status: z.enum(['active', 'legacy', 'discontinued']),
  license: z.string(),
  licenseType: z.enum(['permissive', 'non-commercial', 'proprietary']),
  params: z.string(),
  /** Average WER (%) on the Open ASR Leaderboard; null = not benchmarked there. */
  wer: z.number().nullable(),
  langs: z.string(),
  runs: z.array(z.string()).min(1),
  blurb: z.string(),
  about: z.array(z.string()).min(1),
  install: z.string(),
  downloads: z.array(z.object({ label: z.string(), url: z.string().url() })),
  hosted: z.array(z.object({ name: z.string(), price: z.string(), url: z.string().url() })),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })),
  demo: z.enum(['whisper', 'moonshine']).nullable(),
  demoNote: z.string().optional(),
});

export type ModelInput = z.infer<typeof modelSchema>;
export type Kind = ModelInput['kind'];
export type Status = ModelInput['status'];
export type LicenseType = ModelInput['licenseType'];
export type DemoKind = NonNullable<ModelInput['demo']>;

export interface ModelEntry extends ModelInput {
  num: string;
}

const files = import.meta.glob<{ default: unknown }>('./models/*.json', { eager: true });

const byId = new Map<string, ModelInput>();
for (const [path, mod] of Object.entries(files)) {
  const parsed = modelSchema.safeParse(mod.default);
  if (!parsed.success) {
    throw new Error(`Invalid model data in ${path}:\n${parsed.error.message}`);
  }
  const fileId = path.replace(/^.*\//, '').replace(/\.json$/, '');
  if (parsed.data.id !== fileId) {
    throw new Error(`${path}: id "${parsed.data.id}" must match the filename`);
  }
  byId.set(parsed.data.id, parsed.data);
}

const order: string[] = catalogueOrder;
const missing = order.filter((id) => !byId.has(id));
if (missing.length > 0) {
  throw new Error(`catalogue.json references missing model files: ${missing.join(', ')}`);
}
const orphans = [...byId.keys()].filter((id) => !order.includes(id));
if (orphans.length > 0) {
  throw new Error(`Model files not listed in catalogue.json: ${orphans.join(', ')}`);
}

export const MODELS: ModelEntry[] = order.map((id, i) => ({
  ...byId.get(id)!,
  num: String(i + 1).padStart(2, '0'),
}));

export const FEATURED_IDS = ['whisper-large-v3', 'granite-speech-4-1-2b', 'moonshine', 'vosk'];

export const KIND_LABELS: Record<Kind, string> = {
  model: 'Model',
  runtime: 'Runtime',
  toolkit: 'Toolkit',
  api: 'API',
};

export const STATUS_MAP: Record<Status, { label: string; color: string }> = {
  active: { label: '● ACTIVE', color: '#1F7A3D' },
  legacy: { label: '◐ LEGACY', color: '#8A6D1B' },
  discontinued: { label: '○ DISCONTINUED', color: '#9A3B1E' },
};

const SPDX_URLS: Record<string, string> = {
  MIT: 'https://spdx.org/licenses/MIT.html',
  'Apache-2.0': 'https://spdx.org/licenses/Apache-2.0.html',
  'BSD-2-Clause': 'https://spdx.org/licenses/BSD-2-Clause.html',
  'MPL-2.0': 'https://spdx.org/licenses/MPL-2.0.html',
  'CC-BY-4.0': 'https://spdx.org/licenses/CC-BY-4.0.html',
  'CC-BY-NC-4.0': 'https://spdx.org/licenses/CC-BY-NC-4.0.html',
  'CC-BY-NC-SA': 'https://spdx.org/licenses/CC-BY-NC-SA-4.0.html',
};

export function licenseUrl(license: string): string | undefined {
  return SPDX_URLS[license];
}

export function werLabel(wer: number | null): string {
  return wer == null ? '—' : wer.toFixed(2) + '%';
}

export function specline(m: ModelEntry): string {
  return `${m.license} · ${m.params} · ${m.wer == null ? 'no WER' : m.wer.toFixed(2) + '% WER'}`;
}

export function modelPath(m: ModelEntry): string {
  return `/model/${m.id}/`;
}

export function getModel(id: string): ModelEntry | undefined {
  return MODELS.find((m) => m.id === id);
}

/** Best average WER among open (non-proprietary) entries, e.g. "5.33%". */
export function bestOpenWer(): string {
  const best = Math.min(
    ...MODELS.filter((m) => m.licenseType !== 'proprietary' && m.wer != null).map((m) => m.wer!)
  );
  return best.toFixed(2) + '%';
}
