export interface LegalSection {
  h: string;
  p: string;
}

export interface LegalDoc {
  title: string;
  updated: string;
  description: string;
  sections: LegalSection[];
}

export const LEGAL: Record<string, LegalDoc> = {
  privacy: {
    title: 'Privacy policy',
    updated: 'July 2026',
    description:
      'STT-Index is a static directory with no accounts, no analytics, and no cookies. Read how the in-browser demos keep your audio on your device.',
    sections: [
      {
        h: 'The short version',
        p: 'STT-Index is a static directory. It has no accounts, no analytics, no cookies, and no server that receives your data.',
      },
      {
        h: 'In-browser demos',
        p: 'The "run it in your browser" demos download model weights from the Hugging Face CDN and execute them entirely on your device using WebGPU or WebAssembly. Audio you record or upload is processed in local memory and is never transmitted to us or to any third party. Closing the tab discards it.',
      },
      {
        h: 'Third-party requests',
        p: 'Loading this site fetches fonts from Google Fonts, and running a demo fetches model files from cdn.jsdelivr.net and huggingface.co. Those services see a standard HTTP request (your IP address and user agent), governed by their own privacy policies. No audio or transcript content is ever included in those requests.',
      },
      {
        h: 'Email updates (optional)',
        p: 'If you choose to subscribe to email updates, the address you enter is stored on our own self-hosted newsletter system (listmonk) and used solely to send you index updates. It is never sold or shared; a commercial email delivery relay handles the actual sending and sees recipient addresses in transit, as any mail carrier does. Every email contains an unsubscribe link that removes you immediately. The form is entirely optional and sets no cookies; the RSS feed offers the same updates with no data shared at all.',
      },
      {
        h: 'Outbound links',
        p: 'Model pages link to GitHub, Hugging Face, vendor sites, and papers. Once you leave this site, the destination’s privacy policy applies.',
      },
      {
        h: 'Contact',
        p: 'Questions about this policy can be raised as an issue on the project’s repository.',
      },
    ],
  },
  terms: {
    title: 'Terms of use',
    updated: 'July 2026',
    description:
      'Terms of use for STT-Index: an informational catalogue of speech-to-text models compiled from public sources, provided free of charge, as-is.',
    sections: [
      {
        h: 'What this site is',
        p: 'STT-Index is an informational catalogue of speech-to-text models compiled from public sources: model cards, papers, leaderboards, and vendor documentation. It is provided free of charge, as-is.',
      },
      {
        h: 'No warranty',
        p: 'Specifications, benchmark figures, prices, and licence summaries change frequently and may be out of date or wrong. Nothing here is a guarantee of a model’s performance, fitness for a purpose, or licence terms. Verify against the linked primary source before relying on anything.',
      },
      {
        h: 'Not legal advice',
        p: 'Licence classifications in this index (e.g. "permissive", "non-commercial") are editorial shorthand, not legal advice. Read the actual licence text and consult counsel for commercial deployments.',
      },
      {
        h: 'Your use of listed models',
        p: 'Downloading or running any listed model is a transaction between you and its publisher, under that model’s own licence. We host no model weights.',
      },
      {
        h: 'Trademarks',
        p: 'All model and company names are trademarks of their respective owners. This site is independent and unaffiliated with any listed vendor.',
      },
    ],
  },
  licences: {
    title: 'Model licences & data',
    updated: 'July 2026',
    description:
      'How STT-Index classifies model licences, where the benchmark numbers come from, and how to submit corrections.',
    sections: [
      {
        h: 'How we classify licences',
        p: '"Permissive" covers MIT, Apache-2.0, BSD, MPL-2.0, CC-BY-4.0, and a small number of custom vendor licences that allow commercial use — with varying attribution requirements. "Non-commercial" covers CC-BY-NC variants, which prohibit commercial use without a separate licence from the publisher. "Proprietary" marks hosted commercial APIs where no weights are published — you access the model per-use under the vendor’s terms of service.',
      },
      {
        h: 'CC-BY caveat for models',
        p: 'CC-BY-4.0 (used by NVIDIA’s Canary and Parakeet) is a content licence applied to weights. It permits commercial use with attribution, but it is not a software licence — some legal teams treat weights licensing conservatively. Check with yours.',
      },
      {
        h: 'Where the numbers come from',
        p: 'WER figures are averages from the Hugging Face Open ASR Leaderboard as of mid-2026, where a model is listed there. Parameter counts and language coverage come from official model cards. Prices come from vendor pricing pages and change without notice.',
      },
      {
        h: 'Corrections',
        p: 'Spotted a stale figure or a mis-classified licence? Corrections are welcome via the project repository.',
      },
    ],
  },
};

export const LEGAL_NAV = [
  { key: 'privacy', label: 'Privacy policy' },
  { key: 'terms', label: 'Terms of use' },
  { key: 'licences', label: 'Model licences & data' },
] as const;
