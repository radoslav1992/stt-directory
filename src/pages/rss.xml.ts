import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { MODELS, modelPath, specline } from '../data/models';

const FEED_SIZE = 20;

export function GET(context: APIContext) {
  const latest = [...MODELS]
    .sort((a, b) => b.added.localeCompare(a.added) || a.num.localeCompare(b.num))
    .slice(0, FEED_SIZE);

  return rss({
    title: 'STT Index — new in the index',
    description:
      'New speech-to-text models, runtimes, and APIs as they enter the catalogue — specs, licences, and benchmarks.',
    site: context.site!,
    items: latest.map((m) => ({
      title: `${m.name} — ${m.org}`,
      description: `${m.blurb} (${specline(m)})`,
      link: modelPath(m),
      pubDate: new Date(`${m.added}T00:00:00Z`),
    })),
    customData: '<language>en</language>',
  });
}
