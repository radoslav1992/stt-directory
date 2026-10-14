import { MODELS, type ModelEntry } from './models';
import { BUILD_YEAR, byWer, langCount, pct, runsLocally, type Faq } from './seo';

// Curated "best of" guides at /best/<slug>/. Membership and ranking are
// computed from entry data at build time; only the editorial framing is
// written by hand. Keep intros free of numbers that aren't derived.

export interface Collection {
  slug: string;
  /** Short label used in navigation and cards. */
  label: string;
  /** Document <title> (site name is appended when it fits). */
  title: string;
  h1: string;
  description: string;
  intro: string[];
  /** One sentence explaining the selection rule, shown above the list. */
  criteria: string;
  sort: 'wer' | 'langs' | 'catalogue';
  filter: (m: ModelEntry) => boolean;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'open-source-speech-to-text-models',
    label: 'Open-source models',
    title: `Best Open-Source Speech-to-Text Models (${BUILD_YEAR}) — Ranked by WER`,
    h1: 'The best open-source speech-to-text models',
    description:
      'Actively maintained open-weight STT models with permissive licences, ranked by word error rate on the Open ASR Leaderboard — with sizes and install commands.',
    intro: [
      'These are the actively maintained models in the index whose weights you can download and use commercially under a permissive licence, ranked by average word error rate (WER) on the Hugging Face Open ASR Leaderboard. Lower is better; entries the leaderboard doesn’t list follow the ranked ones.',
      'Permissive here means MIT, Apache-2.0, CC-BY-4.0 or comparable terms — custom licences are flagged on each entry, so read the terms before you ship. Accuracy is rarely the only constraint: model size, target hardware, language coverage and streaming support usually decide the shortlist.',
    ],
    criteria: 'Open-weight models · permissive licence · actively maintained · ranked by Open ASR Leaderboard WER.',
    sort: 'wer',
    filter: (m) => m.kind === 'model' && m.licenseType === 'permissive' && m.status === 'active',
  },
  {
    slug: 'offline-speech-to-text',
    label: 'Offline & on-device',
    title: `Best Offline Speech-to-Text Models (${BUILD_YEAR}) — Local, On-Device STT`,
    h1: 'Offline & on-device speech-to-text',
    description:
      'Speech-to-text models and runtimes that run locally on a CPU, phone or browser — no cloud, no per-minute bill. Ranked by WER with licences and install commands.',
    intro: [
      'Everything here runs without a network connection on ordinary hardware — a laptop CPU, a phone, a single-board computer or a browser tab — so audio never leaves the device. That matters for privacy, latency, cost, and anywhere connectivity is unreliable.',
      'Entries are ranked by Open ASR Leaderboard WER where one exists. The smallest models trade accuracy for footprint, so check the parameter count and the “runs on” targets against your hardware before committing.',
    ],
    criteria: 'Self-hostable entries that run on CPU, mobile or in the browser · actively maintained · ranked by WER.',
    sort: 'wer',
    filter: (m) => runsLocally(m) && m.status === 'active',
  },
  {
    slug: 'browser-speech-to-text',
    label: 'Runs in the browser',
    title: 'Speech-to-Text in the Browser — Client-Side STT Models (WebGPU & WASM)',
    h1: 'Speech-to-text that runs in your browser',
    description:
      'STT models with builds that run client-side in a web page via WebGPU or WebAssembly — no server, no upload. Try the live demos and compare accuracy and size.',
    intro: [
      'These entries have builds that execute inside a web page through WebAssembly or WebGPU, so you can ship transcription with no server and no per-minute bill. Entries marked with a live demo can be tried on this site — your audio stays on your machine.',
      'Browser inference favours small checkpoints: download size and memory decide the user experience more than a few tenths of WER. Larger checkpoints generally need WebGPU to run in real time.',
    ],
    criteria: 'Entries whose “runs on” list includes the browser · ranked by WER.',
    sort: 'wer',
    filter: (m) => m.runs.includes('Browser'),
  },
  {
    slug: 'whisper-implementations',
    label: 'Whisper ecosystem',
    title: 'Whisper Runtimes Compared: faster-whisper vs whisper.cpp vs WhisperX',
    h1: 'Whisper models & runtimes compared',
    description:
      'OpenAI Whisper checkpoints and the runtimes that execute them — large-v3, turbo, Distil-Whisper, faster-whisper, whisper.cpp and WhisperX side by side.',
    intro: [
      'OpenAI’s Whisper is the most widely deployed open speech model, and an ecosystem has grown around it: distilled and pruned checkpoints that trade a little accuracy for speed, and runtimes that execute the same weights faster or on smaller hardware.',
      'Runtimes don’t change accuracy — they run the original checkpoints, so their WER mirrors the Whisper weights you load. Pick a checkpoint for accuracy and languages, then a runtime for your hardware: faster-whisper for Python servers, whisper.cpp for laptops, phones and the browser, WhisperX when you need word timestamps and speaker labels.',
    ],
    criteria: 'Whisper checkpoints and the runtimes built to execute them · catalogue order.',
    sort: 'catalogue',
    filter: (m) => m.id.includes('whisper'),
  },
  {
    slug: 'multilingual-speech-to-text',
    label: 'Most multilingual',
    title: 'Most Multilingual Speech-to-Text Models — Ranked by Language Coverage',
    h1: 'The most multilingual speech-to-text models',
    description:
      'Speech-to-text models and APIs that cover 50 or more languages, ranked by language coverage — from Whisper’s 99 to research models spanning over a thousand.',
    intro: [
      'Most speech models are trained on English first. These entries cover fifty languages or more — from Whisper’s 99 to massively multilingual research models that span well over a thousand.',
      'Coverage figures come from each project’s own documentation, and accuracy usually falls off sharply for low-resource languages. Treat the count as a filter, then test the shortlist on audio in the language you actually need.',
    ],
    criteria: 'Models and APIs documenting 50+ languages · ranked by language count.',
    sort: 'langs',
    filter: (m) => m.kind !== 'runtime' && m.kind !== 'toolkit' && (langCount(m.langs) ?? 0) >= 50,
  },
];

export function collectionPath(c: Collection): string {
  return `/best/${c.slug}/`;
}

export function collectionEntries(c: Collection): ModelEntry[] {
  const list = MODELS.filter(c.filter);
  if (c.sort === 'wer') return byWer(list);
  if (c.sort === 'langs')
    return [...list].sort((a, b) => (langCount(b.langs) ?? 0) - (langCount(a.langs) ?? 0));
  return list;
}

export function collectionsFor(m: ModelEntry): Collection[] {
  return COLLECTIONS.filter((c) => c.filter(m));
}

export function collectionFaqs(c: Collection): Faq[] {
  const list = collectionEntries(c);
  const faqs: Faq[] = [];
  const top = list[0];
  if (c.sort === 'wer') {
    const ranked = list.filter((m) => m.wer != null);
    if (ranked[0]) {
      const r = ranked[0];
      faqs.push({
        q: 'Which entry in this guide is the most accurate?',
        a: `${r.name} from ${r.org}, at ${pct(r.wer!)} average WER on the Hugging Face Open ASR Leaderboard${ranked[1] ? `, followed by ${ranked[1].name} (${pct(ranked[1].wer!)})` : ''}.`,
      });
    }
  } else if (c.sort === 'langs' && top) {
    faqs.push({
      q: 'Which speech-to-text model supports the most languages?',
      a: `${top.name} from ${top.org} documents the widest coverage in this index: ${top.langs} languages.`,
    });
  }
  faqs.push({
    q: 'How were these entries selected?',
    a: `${c.criteria} The list is generated from the index data, so it updates whenever an entry or its benchmark changes. ${list.length} entries currently qualify.`,
  });
  faqs.push({
    q: 'Where do the WER figures come from?',
    a: 'Only from the Hugging Face Open ASR Leaderboard, an independent benchmark that averages word error rate across several English test sets. Vendor-claimed figures are never used; entries the leaderboard doesn’t cover show no WER.',
  });
  return faqs;
}
