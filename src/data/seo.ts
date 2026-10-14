import { MODELS, KIND_LABELS, modelPath, type Kind, type ModelEntry } from './models';

// Everything in this file is derived from the validated entry data — no new
// facts. Titles, descriptions, FAQs, rankings and comparisons are generated
// at build time, so a WER refresh or a new entry updates them all.

export const SITE_NAME = 'STT Index';
export const BUILD_YEAR = new Date().getFullYear();

// ---------------------------------------------------------------- formatting

export const pct = (wer: number) => `${wer.toFixed(2)}%`;

/** "a, b and c" */
export function humanList(items: string[], conj = 'and'): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;
}

/** Appends the site name when the result still fits Google's ~65-char title width. */
export function withSiteName(title: string): string {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 68 ? full : title;
}

function fit(candidates: string[], max = 165): string {
  return candidates.find((c) => c.length <= max) ?? candidates[candidates.length - 1]!;
}

// ------------------------------------------------------------ entry metadata

const KIND_NOUN: Record<Kind, string> = {
  model: 'speech-to-text model',
  runtime: 'speech-to-text runtime',
  toolkit: 'speech recognition toolkit',
  api: 'speech-to-text API',
};

export function kindNoun(m: ModelEntry): string {
  return KIND_NOUN[m.kind];
}

/** Document <title> for an entry page. */
export function entryTitle(m: ModelEntry): string {
  if (m.seoTitle) return withSiteName(m.seoTitle);
  switch (m.kind) {
    case 'api':
      return withSiteName(`${m.name} API — pricing, accuracy & languages`);
    case 'runtime':
      return withSiteName(`${m.name} — install, benchmarks & licence`);
    case 'toolkit':
      return withSiteName(`${m.name} — speech recognition toolkit: install & models`);
    default:
      return withSiteName(
        `${m.name} — speech-to-text model: ${m.wer != null ? 'WER, ' : ''}licence & install`
      );
  }
}

/** Meta description for an entry page. */
export function entryDescription(m: ModelEntry): string {
  // {wer} is filled from the entry's synced WER, so leaderboard updates never
  // leave a stale figure in the snippet. Fall back if the WER disappears.
  if (m.seoDescription && !(m.seoDescription.includes('{wer}') && m.wer == null))
    return m.seoDescription.replaceAll('{wer}', m.wer != null ? pct(m.wer) : '');
  const licence =
    m.kind === 'api'
      ? 'Hosted API'
      : m.licenseType === 'non-commercial'
        ? `${m.license} (non-commercial)`
        : `${m.license} licence`;
  const wer = m.wer != null ? `${pct(m.wer)} avg WER` : '';
  const runs = `runs on ${m.runs.join(', ')}`;
  const cta = m.kind === 'api' ? 'Pricing, quickstart & alternatives.' : 'Install, downloads & alternatives.';
  const join = (...xs: string[]) => xs.filter(Boolean).join(' · ');
  return fit([
    `${m.blurb} ${join(licence, wer, runs)}. ${cta}`,
    `${m.blurb} ${join(licence, wer)}. ${cta}`,
    `${m.blurb} ${join(licence, wer)}.`,
    m.blurb,
  ]);
}

// ------------------------------------------------------------------ rankings

/** Entries that carry their own leaderboard result (runtimes inherit Whisper's). */
export const BENCHMARKED = MODELS.filter((m) => m.wer != null && m.kind !== 'runtime').sort(
  (a, b) => a.wer! - b.wer!
);

export function werRank(m: ModelEntry): { rank: number; of: number } | null {
  const i = BENCHMARKED.findIndex((x) => x.id === m.id);
  return i < 0 ? null : { rank: i + 1, of: BENCHMARKED.length };
}

/** Sort by WER ascending; unbenchmarked entries keep catalogue order at the end. */
export function byWer(list: ModelEntry[]): ModelEntry[] {
  return [...list].sort((a, b) => {
    if (a.wer == null && b.wer == null) return a.num.localeCompare(b.num);
    if (a.wer == null) return 1;
    if (b.wer == null) return -1;
    return a.wer - b.wer;
  });
}

export const isOpen = (m: ModelEntry) => m.kind !== 'api' && m.licenseType !== 'proprietary';
export const runsLocally = (m: ModelEntry) =>
  m.kind !== 'api' && m.runs.some((r) => r === 'CPU' || r === 'Mobile' || r === 'Browser');

/** Largest language count mentioned in the free-text `langs` field ("1,600+" → 1600).
 *  Parameter sizes such as "1B" are ignored. Null when no number is present. */
export function langCount(langs: string): number | null {
  const nums = (langs.replace(/\d+(\.\d+)?\s*[BM]\b/g, '').match(/\d[\d,]*/g) ?? []).map((n) =>
    Number(n.replace(/,/g, ''))
  );
  return nums.length ? Math.max(...nums) : null;
}

// -------------------------------------------------------------------- related

/** Closest alternatives: same kind, overlapping hardware, similar licence and accuracy. */
export function relatedModels(m: ModelEntry, n = 4): ModelEntry[] {
  const score = (x: ModelEntry) => {
    let s = 0;
    if (x.kind === m.kind) s += 3;
    if ((x.kind === 'api') === (m.kind === 'api')) s += 1;
    s += x.runs.filter((r) => m.runs.includes(r)).length;
    if (x.licenseType === m.licenseType) s += 1;
    if (x.status === 'active') s += 1;
    if (x.wer != null && m.wer != null) s += Math.max(0, 2 - Math.abs(x.wer - m.wer));
    return s;
  };
  return MODELS.filter((x) => x.id !== m.id)
    .map((x) => ({ x, s: score(x) }))
    .sort((a, b) => b.s - a.s || a.x.num.localeCompare(b.x.num))
    .slice(0, n)
    .map(({ x }) => x);
}

// ----------------------------------------------------------------------- FAQs

export interface Faq {
  q: string;
  a: string;
}

function firstCommand(install: string): string | null {
  const line = install
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#'));
  return line ?? null;
}

export function entryFaqs(m: ModelEntry): Faq[] {
  const faqs: Faq[] = [];
  const rank = werRank(m);
  const whisper = MODELS.find((x) => x.id === 'whisper-large-v3');

  faqs.push({
    q: `What is ${m.name}?`,
    a: `${m.name} is a ${kindNoun(m)} from ${m.org}, first released in ${m.year}. ${m.blurb}`,
  });

  if (m.kind === 'api') {
    faqs.push({
      q: `Is ${m.name} free?`,
      a: `No. ${m.name} is a proprietary hosted API billed by usage — see the pricing tiers on this page, and check ${m.org}'s pricing page because prices change.`,
    });
  } else if (m.licenseType === 'non-commercial') {
    faqs.push({
      q: `Is ${m.name} free for commercial use?`,
      a: `The weights are free to download, but they are released under ${m.license}, a non-commercial licence — commercial use needs separate permission from ${m.org}.`,
    });
  } else {
    faqs.push({
      q: `Is ${m.name} free and open source?`,
      a: m.license.startsWith('Custom')
        ? `${m.name} is free to download under a custom licence (${m.license}). It is not a standard OSI licence, so read the terms before commercial use.`
        : `Yes. ${m.name} is released under ${m.license}, a permissive licence that allows commercial use under its terms.`,
    });
  }

  if (m.kind === 'runtime' && m.wer != null && whisper) {
    faqs.push({
      q: `How accurate is ${m.name}?`,
      a: `${m.name} runs Whisper weights, so accuracy follows the checkpoint you load — ${whisper.name} averages ${pct(whisper.wer!)} word error rate on the Hugging Face Open ASR Leaderboard.`,
    });
  } else if (m.wer != null) {
    faqs.push({
      q: `How accurate is ${m.name}?`,
      a: `${m.name} averages ${pct(m.wer)} word error rate (WER) on the Hugging Face Open ASR Leaderboard${rank ? `, ranking #${rank.rank} of the ${rank.of} benchmarked entries in this index` : ''}. Lower WER is better.`,
    });
  } else {
    faqs.push({
      q: `How accurate is ${m.name}?`,
      a: `${m.name} is not listed on the Hugging Face Open ASR Leaderboard, so this index shows no WER figure for it. Vendor-reported numbers are not comparable — test it on your own audio.`,
    });
  }

  faqs.push({
    q: `What languages does ${m.name} support?`,
    a: `Language coverage for ${m.name}: ${m.langs}.`,
  });

  const local = m.runs.filter((r) => r === 'CPU' || r === 'Mobile' || r === 'Browser');
  faqs.push({
    q: `Can ${m.name} run offline?`,
    a:
      m.kind === 'api'
        ? m.runs.includes('Self-hosted')
          ? `${m.name} is primarily a cloud API, but ${m.org} also offers a self-hosted deployment for audio that can't leave your infrastructure.`
          : `No. ${m.name} is a cloud API — audio is sent to ${m.org} for transcription. For offline use, pick an open model that runs locally.`
        : local.length
          ? `Yes. ${m.name} runs locally — supported targets: ${m.runs.join(', ')}.`
          : `Yes, on your own hardware — the index lists ${humanList(m.runs)} as its target, so plan for a GPU rather than a phone or laptop CPU.`,
  });

  const cmd = firstCommand(m.install);
  if (cmd) {
    faqs.push({
      q: m.kind === 'api' ? `How do I call the ${m.name} API?` : `How do I install ${m.name}?`,
      a: `Start with \`${cmd}\` — the full snippet${m.downloads.length ? ', downloads' : ''} and documentation links are on this page.`,
    });
  }
  return faqs;
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/`/g, '') },
    })),
  };
}

export function breadcrumbJsonLd(site: URL | undefined, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site).href,
    })),
  };
}

export function itemListJsonLd(site: URL | undefined, name: string, list: ModelEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      url: new URL(modelPath(m), site).href,
    })),
  };
}

// -------------------------------------------------------------------- pricing

export interface PriceRow {
  model: ModelEntry;
  plan: string;
  price: string;
  url: string;
  /** USD per audio hour, derived from "$x / min" or "$x / hr"; null when not a list price. */
  perHour: number | null;
}

export function perHour(price: string): number | null {
  const m = price.match(/\$\s*([\d.]+)\s*\/\s*(min|hr|hour)/i);
  if (!m) return null;
  const v = Number(m[1]);
  return m[2]!.toLowerCase() === 'min' ? v * 60 : v;
}

export const PRICE_ROWS: PriceRow[] = MODELS.flatMap((m) =>
  m.hosted.map((h) => ({ model: m, plan: h.name, price: h.price, url: h.url, perHour: perHour(h.price) }))
).sort((a, b) => {
  if (a.perHour == null && b.perHour == null) return a.model.num.localeCompare(b.model.num);
  if (a.perHour == null) return 1;
  if (b.perHour == null) return -1;
  return a.perHour - b.perHour;
});

/** "$0.04", "$0.258", "$0.36" — up to three decimals for sub-dime prices, never fewer than two. */
export const usd = (n: number) => `$${n < 0.1 ? n.toFixed(3).replace(/0$/, '') : n.toFixed(2)}`;

export function cheapestPerHour(m: ModelEntry): number | null {
  const xs = m.hosted.map((h) => perHour(h.price)).filter((x): x is number => x != null);
  return xs.length ? Math.min(...xs) : null;
}

export const KIND_PLURAL: Record<Kind, string> = {
  model: 'models',
  runtime: 'runtimes',
  toolkit: 'toolkits',
  api: 'APIs',
};

export { KIND_LABELS };
