import { getModel, type ModelEntry } from './models';
import { cheapestPerHour, humanList, langCount, pct, usd } from './seo';

// Head-to-head pages at /compare/<a>-vs-<b>/. Pairs are curated (people
// actually search them); every sentence on the page is generated from the
// two entries' data, so the pages stay correct as the catalogue changes.

const PAIRS: [string, string][] = [
  ['moonshine', 'parakeet-tdt-0-6b'],
  ['faster-whisper', 'whisper-cpp'],
  ['faster-whisper', 'whisperx'],
  ['whisper-large-v3', 'whisper-large-v3-turbo'],
  ['distil-whisper', 'whisper-large-v3-turbo'],
  ['moonshine', 'whisper-large-v3-turbo'],
  ['vosk', 'whisper-cpp'],
  ['vosk', 'moonshine'],
  ['vosk', 'silero'],
  ['parakeet-tdt-0-6b', 'canary-1b-v2'],
  ['cohere-transcribe', 'canary-qwen-2-5b'],
  ['qwen3-asr', 'whisper-large-v3'],
  ['sensevoice', 'qwen3-asr'],
  ['deepgram', 'assemblyai'],
  ['assemblyai', 'elevenlabs-scribe-v2'],
  ['deepgram', 'elevenlabs-scribe-v2'],
];

export interface Comparison {
  slug: string;
  a: ModelEntry;
  b: ModelEntry;
}

export const COMPARISONS: Comparison[] = PAIRS.map(([x, y]) => {
  const a = getModel(x);
  const b = getModel(y);
  if (!a || !b) throw new Error(`comparisons.ts: unknown entry in pair ${x} vs ${y}`);
  return { slug: `${a.id}-vs-${b.id}`, a, b };
});

export const comparisonPath = (c: Comparison) => `/compare/${c.slug}/`;

export function comparisonsFor(m: ModelEntry): Comparison[] {
  return COMPARISONS.filter((c) => c.a.id === m.id || c.b.id === m.id);
}

const sameWeights = (a: ModelEntry, b: ModelEntry) =>
  a.hfId != null && a.hfId === b.hfId && (a.kind === 'runtime' || b.kind === 'runtime');

/** Cost summary: open entries are free to self-host, so a hosted price is the
 *  optional managed route, never "the" price. */
export function costText(m: ModelEntry): string {
  const p = cheapestPerHour(m);
  if (m.kind === 'api') return p != null ? `from ≈ ${usd(p)} per audio hour` : 'usage-based';
  return p != null ? `free to self-host; hosted from ≈ ${usd(p)} per audio hour` : 'free to self-host';
}

/** Factual one-liners on how the two entries differ. */
export function comparisonFacts(a: ModelEntry, b: ModelEntry): { label: string; text: string }[] {
  const out: { label: string; text: string }[] = [];

  if (sameWeights(a, b) && a.wer != null) {
    out.push({
      label: 'Accuracy',
      text: `Both execute the same Whisper weights, so accuracy is identical — ${pct(a.wer!)} average WER on the Open ASR Leaderboard. The difference is speed, hardware and features.`,
    });
  } else if (a.wer != null && b.wer != null) {
    const [lo, hi] = a.wer <= b.wer ? [a, b] : [b, a];
    out.push({
      label: 'Accuracy',
      text:
        lo.wer === hi.wer
          ? `Tied at ${pct(lo.wer!)} average WER on the Open ASR Leaderboard.`
          : `${lo.name} has the lower average WER on the Open ASR Leaderboard: ${pct(lo.wer!)} vs ${pct(hi.wer!)} for ${hi.name}.`,
    });
  } else if (a.wer != null || b.wer != null) {
    const [has, not] = a.wer != null ? [a, b] : [b, a];
    out.push({
      label: 'Accuracy',
      text: `${has.name} averages ${pct(has.wer!)} WER on the Open ASR Leaderboard; ${not.name} isn’t listed there, so there is no like-for-like figure.`,
    });
  } else {
    out.push({
      label: 'Accuracy',
      text: 'Neither is listed on the Open ASR Leaderboard, so there is no independent like-for-like WER — compare them on your own audio.',
    });
  }

  out.push({
    label: 'Licence',
    text:
      a.license === b.license
        ? `Both are ${a.license}${a.licenseType === 'proprietary' ? ' — hosted APIs billed by usage' : ''}.`
        : `${a.name} is ${a.license} (${a.licenseType}); ${b.name} is ${b.license} (${b.licenseType}).`,
  });

  const onlyA = a.runs.filter((r) => !b.runs.includes(r));
  const onlyB = b.runs.filter((r) => !a.runs.includes(r));
  out.push({
    label: 'Runs on',
    text:
      !onlyA.length && !onlyB.length
        ? `Both target ${humanList(a.runs)}.`
        : [
            onlyA.length ? `only ${a.name} lists ${humanList(onlyA)}` : '',
            onlyB.length ? `only ${b.name} lists ${humanList(onlyB)}` : '',
          ]
            .filter(Boolean)
            .join('; ')
            .replace(/^./, (c) => c.toUpperCase()) + '.',
  });

  out.push({ label: 'Languages', text: `${a.name}: ${a.langs}. ${b.name}: ${b.langs}.` });
  if (!(a.params.startsWith('—') && b.params.startsWith('—')))
    out.push({ label: 'Size', text: `${a.name}: ${a.params}. ${b.name}: ${b.params}.` });

  if (cheapestPerHour(a) != null || cheapestPerHour(b) != null) {
    out.push({
      label: 'Cost',
      text: `${a.name}: ${costText(a)}. ${b.name}: ${costText(b)}. Prices change — check the provider.`,
    });
  }

  if (a.status !== 'active' || b.status !== 'active') {
    const stale = [a, b].filter((m) => m.status !== 'active');
    out.push({
      label: 'Maintenance',
      text: stale.map((m) => `${m.name} is marked ${m.status}`).join('; ') + ' in this index.',
    });
  }
  return out;
}

/** Reasons to pick `a` over `b`, each derived from a single data field. */
export function advantages(a: ModelEntry, b: ModelEntry): string[] {
  const out: string[] = [];
  if (!sameWeights(a, b) && a.wer != null && (b.wer == null || a.wer < b.wer))
    out.push(b.wer == null ? 'an independent leaderboard result' : 'the lower word error rate');
  const extra = a.runs.filter((r) => !b.runs.includes(r) && r !== 'Cloud API');
  if (extra.includes('Self-hosted')) out.push('a self-hosted deployment option');
  // GPU support is table stakes for a server model, not a reason to choose it.
  const targets = extra.filter((r) => r !== 'Self-hosted' && r !== 'GPU');
  if (targets.length) out.push(`to run on ${humanList(targets)}`);
  if (a.licenseType === 'permissive' && b.licenseType !== 'permissive') out.push('a permissive licence');
  const la = langCount(a.langs);
  const lb = langCount(b.langs);
  if (la != null && lb != null && la >= lb * 1.5) out.push(`broader language coverage — ${a.langs}`);
  const pa = cheapestPerHour(a);
  const pb = cheapestPerHour(b);
  if (pa != null && pb != null && pa < pb)
    out.push(a.kind === 'api' && b.kind === 'api' ? 'a lower list price' : 'a cheaper hosted option');
  if (a.status === 'active' && b.status !== 'active') out.push('an actively maintained project');
  if (a.demo && !b.demo) out.push('to try it in your browser on this site first');
  return out;
}
