export type Kind = 'model' | 'runtime' | 'toolkit' | 'api';
export type Status = 'active' | 'legacy' | 'discontinued';
export type LicenseType = 'permissive' | 'non-commercial' | 'proprietary';
export type DemoKind = 'whisper' | 'moonshine';

export interface LinkItem {
  label: string;
  url: string;
}

export interface HostedItem {
  name: string;
  price: string;
  url: string;
}

export interface ModelEntry {
  id: string;
  num: string;
  name: string;
  org: string;
  year: number;
  kind: Kind;
  status: Status;
  license: string;
  licenseType: LicenseType;
  params: string;
  wer: number | null;
  langs: string;
  runs: string[];
  blurb: string;
  about: string[];
  install: string;
  downloads: LinkItem[];
  hosted: HostedItem[];
  links: LinkItem[];
  demo: DemoKind | null;
  demoNote?: string;
}

// Catalogue order is editorial: leaderboard leaders first, then the Whisper
// ecosystem, edge/multilingual models, toolkits, legacy entries, and hosted
// APIs last. Entry numbers are derived from position — insert anywhere and
// numbering stays consistent.
type ModelInput = Omit<ModelEntry, 'num'>;

const CATALOGUE: ModelInput[] = [
  {
    id: 'granite-speech-4-1-2b',
    name: 'Granite Speech 4.1 2B',
    org: 'IBM',
    year: 2026,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '2B',
    wer: 5.33,
    langs: '6 + translation',
    runs: ['GPU'],
    blurb: 'Current #1 on the Open ASR Leaderboard — 5.33% average WER from a 2B model, under Apache 2.0.',
    about: [
      'Granite Speech 4.1 pairs a Conformer speech encoder with IBM’s Granite LLM through a Q-Former adapter. At 5.33% average WER it currently tops the Hugging Face Open ASR Leaderboard — ahead of every proprietary API measured there — from a checkpoint small enough for a single consumer GPU.',
      'It transcribes six languages (English, French, German, Spanish, Portuguese, Japanese) and does bidirectional speech translation. Three variants ship: the standard autoregressive model, a "-plus" with richer punctuated output, and a "-nar" non-autoregressive variant that trades a little accuracy for dramatic speed. All Apache 2.0.',
    ],
    install: `pip install "transformers>=4.52" torchaudio peft soundfile

python -c "
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
m = AutoModelForSpeechSeq2Seq.from_pretrained('ibm-granite/granite-speech-4.1-2b')"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/ibm-granite/granite-speech-4.1-2b' },
      { label: 'granite-speech-models (GitHub)', url: 'https://github.com/ibm-granite/granite-speech-models' },
    ],
    hosted: [
      { name: 'IBM watsonx.ai', price: 'usage-based', url: 'https://www.ibm.com/watsonx' },
      { name: 'Replicate', price: 'per-second GPU', url: 'https://replicate.com/ibm-granite/granite-speech-4.1-2b' },
    ],
    links: [
      { label: 'IBM announcement', url: 'https://research.ibm.com/blog/granite-4-1-ai-foundation-models' },
      { label: 'Model card', url: 'https://huggingface.co/ibm-granite/granite-speech-4.1-2b' },
      { label: 'Open ASR Leaderboard', url: 'https://huggingface.co/spaces/hf-audio/open_asr_leaderboard' },
    ],
    demo: null,
  },
  {
    id: 'cohere-transcribe',
    name: 'Cohere Transcribe',
    org: 'Cohere Labs',
    year: 2026,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '2B',
    wer: 5.42,
    langs: '14',
    runs: ['GPU'],
    blurb: 'Cohere’s first speech model — debuted at #1 on the leaderboard, open weights across 14 languages.',
    about: [
      'Cohere Transcribe is a 2B Conformer encoder + Transformer decoder that debuted at #1 on the Open ASR Leaderboard (5.42% average WER, March 2026) with roughly 525× realtime throughput. It covers 14 languages including Arabic, Mandarin, Japanese, Korean, and Vietnamese.',
      'Unlike many lab releases, the weights are Apache 2.0 — commercial use from day one — and it is small enough to run on consumer GPUs. Hosted access is available through Cohere’s API and Azure AI Foundry.',
    ],
    install: `pip install transformers torch

# checkpoint: CohereLabs/cohere-transcribe-03-2026
# see the model card for current pipeline usage.`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/CohereLabs/cohere-transcribe-03-2026' },
    ],
    hosted: [
      { name: 'Cohere API', price: 'usage-based', url: 'https://cohere.com/pricing' },
      { name: 'Azure AI Foundry', price: 'usage-based', url: 'https://ai.azure.com/' },
      { name: 'fal.ai', price: '~$0.25 / hr', url: 'https://fal.ai/models/fal-ai/cohere-transcribe' },
    ],
    links: [
      { label: 'Cohere announcement', url: 'https://cohere.com/blog/transcribe' },
      { label: 'Model card', url: 'https://huggingface.co/CohereLabs/cohere-transcribe-03-2026' },
    ],
    demo: null,
  },
  {
    id: 'canary-qwen-2-5b',
    name: 'Canary-Qwen 2.5B',
    org: 'NVIDIA',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-4.0',
    licenseType: 'permissive',
    params: '2.5B',
    wer: 5.63,
    langs: 'English',
    runs: ['GPU'],
    blurb:
      'Held #1 on the Open ASR Leaderboard through 2025 — a FastConformer encoder paired with a Qwen3 LLM decoder.',
    about: [
      'Canary-Qwen pairs a FastConformer speech encoder with an unmodified Qwen3-1.7B language-model decoder (a "SALM" architecture). It held the #1 spot on the Hugging Face Open ASR Leaderboard at 5.63% average WER through 2025 — ahead of every commercial API measured there at the time — and remains within a few tenths of the 2026 leaders.',
      'It has a dual mode: pure transcription, or an analysis mode where you can ask the model questions about the audio it just heard. English-only for now, and it wants a GPU — this is not an edge model.',
    ],
    install: `# via NVIDIA NeMo
pip install -U nemo_toolkit[asr]

python -c "
import nemo.collections.speechlm2 as slm
m = slm.models.SALM.from_pretrained('nvidia/canary-qwen-2.5b')
print(m.transcribe(['audio.wav']))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/nvidia/canary-qwen-2.5b' },
      { label: 'NeMo toolkit (GitHub)', url: 'https://github.com/NVIDIA/NeMo' },
    ],
    hosted: [{ name: 'NVIDIA NIM / Riva', price: 'per-GPU licence', url: 'https://build.nvidia.com/' }],
    links: [
      { label: 'Model card', url: 'https://huggingface.co/nvidia/canary-qwen-2.5b' },
      { label: 'Open ASR Leaderboard', url: 'https://huggingface.co/spaces/hf-audio/open_asr_leaderboard' },
    ],
    demo: null,
  },
  {
    id: 'granite-speech-3-3-8b',
    name: 'Granite Speech 3.3 8B',
    org: 'IBM',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '8B',
    wer: 5.74,
    langs: 'En + translation',
    runs: ['GPU'],
    blurb: 'IBM’s 8B speech-aware LLM — near the top of the leaderboard under a genuinely permissive licence.',
    about: [
      'Granite Speech bolts a speech encoder onto IBM’s Granite 3.3 8B LLM. It sits just behind Canary-Qwen on the Open ASR Leaderboard (5.74% WER) and is released under Apache 2.0 — among openly licensed models fit for commercial use without attribution clauses, only IBM’s own newer Granite Speech 4.1 scores better.',
      'Beyond transcription it handles speech translation to several languages. The 8B footprint means you need a serious GPU (or quantisation) to self-host.',
    ],
    install: `pip install transformers torchaudio peft soundfile

python -c "
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
m = AutoModelForSpeechSeq2Seq.from_pretrained('ibm-granite/granite-speech-3.3-8b')"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/ibm-granite/granite-speech-3.3-8b' },
      { label: 'Granite repo (GitHub)', url: 'https://github.com/ibm-granite' },
    ],
    hosted: [{ name: 'IBM watsonx.ai', price: 'usage-based', url: 'https://www.ibm.com/watsonx' }],
    links: [{ label: 'Model card', url: 'https://huggingface.co/ibm-granite/granite-speech-3.3-8b' }],
    demo: null,
  },
  {
    id: 'qwen3-asr',
    name: 'Qwen3-ASR',
    org: 'Alibaba',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '1.7B / 0.6B',
    wer: 5.76,
    langs: '11',
    runs: ['GPU'],
    blurb: 'Alibaba’s multilingual ASR from the Qwen family — strong on Chinese, English, and code-switching.',
    about: [
      'Qwen3-ASR brings the Qwen LLM family’s multilingual strength to speech: 11 languages with particularly strong Mandarin and English, robust handling of accents, code-switching, and noisy audio, plus contextual biasing — you can feed it a vocabulary list to steer transcription.',
      'The 1.7B checkpoint scores 5.76% average WER on the Open ASR Leaderboard — top-five territory — with a 0.6B sibling for lighter deployments. A good pick when Chinese-language accuracy matters, where Whisper is comparatively weak.',
    ],
    install: `pip install transformers torch

# checkpoints: Qwen/Qwen3-ASR-1.7B and Qwen/Qwen3-ASR-0.6B
# see the model card for pipeline usage — the family moves fast.`,
    downloads: [
      { label: 'Qwen3-ASR-1.7B on Hugging Face', url: 'https://huggingface.co/Qwen/Qwen3-ASR-1.7B' },
      { label: 'Qwen (GitHub)', url: 'https://github.com/QwenLM' },
    ],
    hosted: [
      {
        name: 'Alibaba Model Studio',
        price: 'usage-based',
        url: 'https://www.alibabacloud.com/en/product/modelstudio',
      },
    ],
    links: [{ label: 'Qwen organisation', url: 'https://huggingface.co/Qwen' }],
    demo: null,
  },
  {
    id: 'phi-4-multimodal',
    name: 'Phi-4-multimodal',
    org: 'Microsoft',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '5.6B',
    wer: 6.02,
    langs: '8 speech',
    runs: ['GPU', 'CPU'],
    blurb: 'A general multimodal LLM whose speech recognition briefly topped the ASR leaderboard — under MIT.',
    about: [
      'Phi-4-multimodal is a text + vision + audio model built as a frozen 3.8B Phi-4-Mini backbone with plug-in LoRA adapters per modality. Its ASR was strong enough to take #1 on the Open ASR Leaderboard at release in early 2025 — the first general-purpose multimodal model to do so — and it still sits in the top ten at 6.02% average WER.',
      'One 5.6B checkpoint handles transcription in eight languages, speech translation, spoken Q&A, and speech summarisation, with a 128k context. An official ONNX build targets edge deployment, and the MIT licence makes it the most permissive of the LLM-based options.',
    ],
    install: `pip install transformers accelerate soundfile peft

# checkpoint: microsoft/Phi-4-multimodal-instruct
# prompt with <|audio_1|>Transcribe the audio to text.
# (see the model card for the full snippet)`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/microsoft/Phi-4-multimodal-instruct' },
      { label: 'ONNX build (edge)', url: 'https://huggingface.co/microsoft/Phi-4-multimodal-instruct-onnx' },
    ],
    hosted: [{ name: 'Azure AI Foundry', price: 'per-token', url: 'https://ai.azure.com/' }],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2503.01743' },
      { label: 'Model card', url: 'https://huggingface.co/microsoft/Phi-4-multimodal-instruct' },
    ],
    demo: null,
  },
  {
    id: 'parakeet-tdt-0-6b',
    name: 'Parakeet TDT 0.6B v2',
    org: 'NVIDIA',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-4.0',
    licenseType: 'permissive',
    params: '0.6B',
    wer: 6.05,
    langs: 'English (v3: 25 EU)',
    runs: ['GPU', 'CPU'],
    blurb: 'Blistering speed — transcribes an hour of audio in about a second on a data-centre GPU.',
    about: [
      'Parakeet is the speed king: a 600M-parameter FastConformer-TDT model that scores 6.05% WER while running orders of magnitude faster than real time. It powers a lot of production transcription pipelines where Whisper is too slow.',
      'v2 is English-only; the v3 multilingual variant covers 25 European languages. It includes accurate word-level timestamps and punctuation out of the box.',
    ],
    install: `pip install -U nemo_toolkit[asr]

python -c "
import nemo.collections.asr as nemo_asr
m = nemo_asr.models.ASRModel.from_pretrained('nvidia/parakeet-tdt-0.6b-v2')
print(m.transcribe(['audio.wav']))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2' },
      { label: 'NeMo toolkit (GitHub)', url: 'https://github.com/NVIDIA/NeMo' },
    ],
    hosted: [
      { name: 'NVIDIA NIM / Riva', price: 'per-GPU licence', url: 'https://build.nvidia.com/' },
      { name: 'Groq (hosted)', price: 'usage-based', url: 'https://groq.com/' },
    ],
    links: [{ label: 'Model card', url: 'https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2' }],
    demo: null,
  },
  {
    id: 'kyutai-stt',
    name: 'Kyutai STT',
    org: 'Kyutai',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-4.0',
    licenseType: 'permissive',
    params: '2.6B / 1B',
    wer: 6.4,
    langs: 'En (1B: +Fr)',
    runs: ['GPU', 'Mobile'],
    blurb: 'True streaming transcription — words appear as you speak, and one H100 serves 400 live streams.',
    about: [
      'Kyutai STT is a genuinely streaming model from the Moshi lineage: a decoder-only transformer over Mimi codec tokens that emits text as audio arrives, with a fixed delay of 2.5 seconds (2.6B model) or 0.5 seconds (1B). Despite the streaming constraint it scores 6.40% average WER — better than offline Whisper large-v3.',
      'It is built for production voice agents: batched streaming serves 400 realtime streams on one H100 via the Rust server, the 1B model has integrated semantic voice-activity detection, and MLX builds run on Apple Silicon — including an iPhone. Weights are CC-BY-4.0.',
    ],
    install: `pip install "moshi>=0.2.6"

python -m moshi.run_inference --hf-repo kyutai/stt-2.6b-en audio.mp3

# Apple Silicon: pip install moshi-mlx`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/kyutai/stt-2.6b-en' },
      { label: 'delayed-streams-modeling (GitHub)', url: 'https://github.com/kyutai-labs/delayed-streams-modeling' },
    ],
    hosted: [],
    links: [
      { label: 'Project page', url: 'https://kyutai.org/stt' },
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2509.08753' },
      { label: 'Live demo (unmute.sh)', url: 'https://unmute.sh' },
    ],
    demo: null,
  },
  {
    id: 'voxtral',
    name: 'Voxtral',
    org: 'Mistral AI',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '3B / 24B',
    wer: 6.62,
    langs: '8+ auto-detect',
    runs: ['GPU', 'Browser'],
    blurb: 'Mistral’s audio-text LLMs — transcription plus voice Q&A and summarisation, Apache 2.0 at two sizes.',
    about: [
      'Voxtral pairs a Whisper-style audio encoder with Mistral language backbones: Mini (3B backbone) and Small (24B). Beyond pure transcription they answer questions about the audio, summarise it, and function-call from voice, with a 32k context that fits half an hour of audio. Small scores 6.62% average WER and is the strongest open-weights entry on the leaderboard’s multilingual track.',
      'The family moves fast: a February 2026 update added Voxtral Realtime — an open-weights streaming variant with configurable sub-200 ms latency — plus cheap hosted transcription on Mistral’s platform. An official ONNX build runs Mini fully in-browser on WebGPU.',
    ],
    install: `pip install -U "vllm[audio]" mistral-common

vllm serve mistralai/Voxtral-Mini-3B-2507 \\
  --tokenizer_mode mistral --config_format mistral --load_format mistral
# OpenAI-compatible /v1/audio/transcriptions endpoint`,
    downloads: [
      { label: 'Voxtral Mini on Hugging Face', url: 'https://huggingface.co/mistralai/Voxtral-Mini-3B-2507' },
      { label: 'Voxtral Small on Hugging Face', url: 'https://huggingface.co/mistralai/Voxtral-Small-24B-2507' },
    ],
    hosted: [
      { name: 'Mistral (transcribe)', price: 'from $0.003 / min', url: 'https://mistral.ai/news/voxtral-transcribe-2/' },
      { name: 'Mistral Realtime', price: '$0.006 / min', url: 'https://mistral.ai/news/voxtral-transcribe-2/' },
    ],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2507.13264' },
      { label: 'Announcement', url: 'https://mistral.ai/news/voxtral' },
      { label: 'In-browser demo (WebGPU)', url: 'https://huggingface.co/spaces/webml-community/Voxtral-WebGPU' },
    ],
    demo: null,
  },
  {
    id: 'canary-1b-v2',
    name: 'Canary 1B v2',
    org: 'NVIDIA',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-4.0',
    licenseType: 'permissive',
    params: '978M',
    wer: 7.15,
    langs: '25 European',
    runs: ['GPU', 'CPU'],
    blurb: 'NVIDIA’s multilingual Canary — 25 European languages, translation both ways, and extreme throughput.',
    about: [
      'Canary 1B v2 is the multilingual sibling of Canary-Qwen: a FastConformer encoder + Transformer decoder that transcribes and translates across 25 European languages with punctuation, capitalisation, and word timestamps. At 7.15% average English WER with a throughput around 749× realtime, it sits in the leaderboard’s best speed-for-accuracy region.',
      'It was trained on roughly 1.7M hours including NVIDIA’s openly released Granary corpus, with non-speech audio mixed in to curb hallucination. CC-BY-4.0, so commercial use with attribution. Community ONNX ports enable CPU inference.',
    ],
    install: `pip install -U nemo_toolkit[asr]

python -c "
from nemo.collections.asr.models import EncDecMultiTaskModel
m = EncDecMultiTaskModel.from_pretrained('nvidia/canary-1b-v2')
print(m.transcribe(['audio.wav'], source_lang='en', target_lang='en')[0].text)"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/nvidia/canary-1b-v2' },
      { label: 'NeMo toolkit (GitHub)', url: 'https://github.com/NVIDIA/NeMo' },
    ],
    hosted: [{ name: 'NVIDIA NIM / Riva', price: 'per-GPU licence', url: 'https://build.nvidia.com/' }],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2509.14128' },
      { label: 'Model card', url: 'https://huggingface.co/nvidia/canary-1b-v2' },
    ],
    demo: null,
  },
  {
    id: 'whisper-large-v3',
    name: 'Whisper large-v3',
    org: 'OpenAI',
    year: 2023,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '1.55B',
    wer: 7.44,
    langs: '99',
    runs: ['GPU', 'CPU', 'Browser', 'Mobile'],
    blurb:
      'The default choice. 99 languages, MIT licence, and the largest ecosystem of any speech model ever released.',
    about: [
      'Whisper is the model that made open speech recognition mainstream. Trained on 680k+ hours of audio, large-v3 transcribes and translates 99 languages under an MIT licence, and nearly every STT tool built since 2022 is Whisper-shaped or Whisper-compatible.',
      'Its ecosystem is the real superpower: faster-whisper for 4× speed, whisper.cpp for laptops and phones, distil-whisper for cheap inference, and browser builds via transformers.js — which is exactly what the demo below runs.',
    ],
    install: `pip install -U openai-whisper

whisper audio.mp3 --model large-v3

# or the 4x-faster route:
pip install faster-whisper`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/openai/whisper-large-v3' },
      { label: 'openai/whisper (GitHub)', url: 'https://github.com/openai/whisper' },
    ],
    hosted: [
      { name: 'OpenAI API', price: '$0.006 / min', url: 'https://platform.openai.com/docs/guides/speech-to-text' },
      { name: 'Groq', price: '~$0.111 / hr', url: 'https://groq.com/' },
      { name: 'Replicate', price: 'per-second GPU', url: 'https://replicate.com/openai/whisper' },
    ],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2212.04356' },
      { label: 'Model card', url: 'https://huggingface.co/openai/whisper-large-v3' },
      { label: 'GitHub', url: 'https://github.com/openai/whisper' },
    ],
    demo: 'whisper',
    demoNote:
      'This loads Whisper tiny.en (≈40 MB, English) via transformers.js and runs it right here — the same architecture as large-v3, shrunk to fit a browser tab.',
  },
  {
    id: 'whisper-large-v3-turbo',
    name: 'Whisper large-v3-turbo',
    org: 'OpenAI',
    year: 2024,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '809M',
    wer: 7.83,
    langs: '99 (no translation)',
    runs: ['GPU', 'CPU', 'Browser', 'Mobile'],
    blurb: 'large-v3 with the decoder pruned from 32 layers to 4 — near-identical accuracy at several times the speed.',
    about: [
      'Turbo is Whisper large-v3 with its decoder pruned from 32 layers to four, then fine-tuned: about half the parameters, several times the decode speed, and only a modest accuracy cost (7.83% vs 7.44% average WER). The ~1.6 GB checkpoint runs in about 6 GB of VRAM — or on a laptop via whisper.cpp.',
      'For most self-hosted transcription it has replaced large-v3 as the default: same 99 languages, same MIT licence, same ecosystem (faster-whisper, whisper.cpp, MLX, transformers.js). One trade-off: turbo is transcription-only — it was not trained for Whisper’s translation task.',
    ],
    install: `pip install -U openai-whisper

whisper audio.mp3 --model turbo

# hosted: Groq serves it at ~$0.04/hr of audio`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/openai/whisper-large-v3-turbo' },
      { label: 'openai/whisper (GitHub)', url: 'https://github.com/openai/whisper' },
    ],
    hosted: [
      { name: 'Groq', price: '~$0.04 / hr', url: 'https://groq.com/pricing' },
      { name: 'Cloudflare Workers AI', price: 'usage-based', url: 'https://developers.cloudflare.com/workers-ai/' },
    ],
    links: [
      { label: 'Model card', url: 'https://huggingface.co/openai/whisper-large-v3-turbo' },
      { label: 'GitHub', url: 'https://github.com/openai/whisper' },
    ],
    demo: null,
  },
  {
    id: 'distil-whisper',
    name: 'Distil-Whisper large-v3.5',
    org: 'Hugging Face',
    year: 2023,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '756M',
    wer: 7.21,
    langs: 'English',
    runs: ['GPU', 'CPU', 'Browser'],
    blurb: 'Whisper distilled to half the size and several times the speed — v3.5 now beats its teacher on the leaderboard.',
    about: [
      'Distil-Whisper is a knowledge-distilled version of Whisper large-v3: about half the parameters and several times faster. The current v3.5 release scores 7.21% average WER on the Open ASR Leaderboard — actually beating full large-v3’s 7.44% while running roughly 3× faster. English-only.',
      'It drops into any Hugging Face Transformers pipeline as a straight replacement, and pairs well with speculative decoding — using it as a draft model to speed up full Whisper with zero accuracy loss.',
    ],
    install: `pip install transformers accelerate

python -c "
from transformers import pipeline
asr = pipeline('automatic-speech-recognition',
  'distil-whisper/distil-large-v3.5')
print(asr('audio.wav'))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/distil-whisper/distil-large-v3.5' },
      { label: 'distil-whisper (GitHub)', url: 'https://github.com/huggingface/distil-whisper' },
    ],
    hosted: [
      { name: 'HF Inference Endpoints', price: 'per-hour GPU', url: 'https://huggingface.co/inference-endpoints' },
    ],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2311.00430' },
      { label: 'Model card', url: 'https://huggingface.co/distil-whisper/distil-large-v3' },
    ],
    demo: null,
  },
  {
    id: 'faster-whisper',
    name: 'faster-whisper',
    org: 'SYSTRAN',
    year: 2023,
    kind: 'runtime',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '— (runtime)',
    wer: 7.44,
    langs: '99 (Whisper)',
    runs: ['GPU', 'CPU'],
    blurb: 'The same Whisper weights, re-implemented in CTranslate2 — up to 4× faster on the same hardware.',
    about: [
      'faster-whisper is not a new model but a reimplementation of Whisper inference on the CTranslate2 engine. Same weights, same accuracy, up to 4× faster and with markedly lower memory use — with int8 quantisation it runs large-v3 comfortably on CPU.',
      'It is the engine behind many popular tools (WhisperX, wyoming-faster-whisper for Home Assistant, and countless transcription apps). If you self-host Whisper in production, you probably want this.',
    ],
    install: `pip install faster-whisper

python -c "
from faster_whisper import WhisperModel
m = WhisperModel('large-v3', compute_type='int8')
segs, _ = m.transcribe('audio.wav')
print(' '.join(s.text for s in segs))"`,
    downloads: [
      { label: 'faster-whisper (GitHub)', url: 'https://github.com/SYSTRAN/faster-whisper' },
      { label: 'CT2 weights on Hugging Face', url: 'https://huggingface.co/Systran' },
    ],
    hosted: [],
    links: [
      { label: 'GitHub', url: 'https://github.com/SYSTRAN/faster-whisper' },
      { label: 'CTranslate2', url: 'https://github.com/OpenNMT/CTranslate2' },
    ],
    demo: null,
  },
  {
    id: 'whisper-cpp',
    name: 'whisper.cpp',
    org: 'ggml / G. Gerganov',
    year: 2022,
    kind: 'runtime',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '— (runtime)',
    wer: 7.44,
    langs: '99 (Whisper)',
    runs: ['CPU', 'Mobile', 'Browser'],
    blurb: 'Whisper in plain C/C++ — runs on a laptop, a phone, a Raspberry Pi, or as WebAssembly in a browser.',
    about: [
      'whisper.cpp ports Whisper to dependency-free C/C++ with quantised GGML weights. It runs on anything: Apple Silicon (with Metal and Core ML acceleration), Windows, Linux, iOS, Android, Raspberry Pi, and even WebAssembly in the browser.',
      'This is the easiest way to run Whisper fully offline on a normal computer — one small binary, one model file, no Python. It powers most on-device dictation apps built on Whisper.',
    ],
    install: `git clone https://github.com/ggml-org/whisper.cpp
cd whisper.cpp && make

# grab a quantised model (~488 MB for medium)
./models/download-ggml-model.sh base.en
./build/bin/whisper-cli -m models/ggml-base.en.bin audio.wav`,
    downloads: [
      { label: 'whisper.cpp (GitHub)', url: 'https://github.com/ggml-org/whisper.cpp' },
      { label: 'GGML weights on Hugging Face', url: 'https://huggingface.co/ggerganov/whisper.cpp' },
    ],
    hosted: [],
    links: [
      { label: 'GitHub', url: 'https://github.com/ggml-org/whisper.cpp' },
      { label: 'WASM demo', url: 'https://ggml.ai/whisper.cpp/' },
    ],
    demo: null,
  },
  {
    id: 'whisperx',
    name: 'WhisperX',
    org: 'Max Bain (Oxford VGG)',
    year: 2022,
    kind: 'runtime',
    status: 'active',
    license: 'BSD-2-Clause',
    licenseType: 'permissive',
    params: '— (pipeline)',
    wer: 7.44,
    langs: '99 (Whisper)',
    runs: ['GPU', 'CPU'],
    blurb: 'Whisper with accurate word-level timestamps and speaker diarisation — ~70× realtime batched inference.',
    about: [
      'WhisperX wraps Whisper (via faster-whisper) in a production pipeline: VAD preprocessing, batched inference at roughly 70× realtime on a GPU, forced phoneme alignment with wav2vec2 for accurate word-level timestamps, and speaker diarisation through pyannote-audio.',
      'Whisper’s own timestamps are utterance-level and drift-prone — WhisperX is what most people reach for when they need subtitles, word highlighting, or who-said-what. The pyannote diarisation models require a (free) Hugging Face token.',
    ],
    install: `pip install whisperx

whisperx audio.wav --model large-v2 --diarize --highlight_words True`,
    downloads: [{ label: 'whisperX (GitHub)', url: 'https://github.com/m-bain/whisperX' }],
    hosted: [
      { name: 'Replicate (community)', price: 'per-second GPU', url: 'https://replicate.com/victor-upmeet/whisperx' },
    ],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2303.00747' },
      { label: 'GitHub', url: 'https://github.com/m-bain/whisperX' },
    ],
    demo: null,
  },
  {
    id: 'moonshine',
    name: 'Moonshine',
    org: 'Useful Sensors',
    year: 2024,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '27M – 245M',
    wer: 6.66,
    langs: 'En + 7',
    runs: ['CPU', 'Mobile', 'Browser'],
    blurb: 'Tiny models built for edge devices — beats Whisper tiny/base at a fraction of the compute.',
    about: [
      'Moonshine was designed from scratch for edge hardware: variable-length windows instead of Whisper’s fixed 30-second chunks mean short utterances transcribe several times faster. The tiny model is 27M parameters — small enough for microcontroller-class devices and instant browser loading.',
      'It beats Whisper tiny and base on accuracy at a fraction of the compute, which has made it the default for live captions, voice interfaces, and wearables. A 2026 streaming line (up to 245M parameters) reaches 6.66% average WER on the Open ASR Leaderboard. Runs natively, via ONNX, or in-browser through transformers.js — try it below.',
    ],
    install: `pip install useful-moonshine

python -c "
import moonshine
print(moonshine.transcribe('audio.wav', 'moonshine/base'))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/UsefulSensors/moonshine' },
      { label: 'moonshine (GitHub)', url: 'https://github.com/usefulsensors/moonshine' },
    ],
    hosted: [],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2410.15608' },
      { label: 'GitHub', url: 'https://github.com/usefulsensors/moonshine' },
    ],
    demo: 'moonshine',
    demoNote: 'This loads Moonshine tiny (≈27M params) via transformers.js and runs it right here in the tab.',
  },
  {
    id: 'sensevoice',
    name: 'SenseVoice',
    org: 'Alibaba (FunAudioLLM)',
    year: 2024,
    kind: 'model',
    status: 'active',
    license: 'Custom (Alibaba)',
    licenseType: 'permissive',
    params: '234M',
    wer: null,
    langs: 'Zh, Yue, En, Ja, Ko +',
    runs: ['GPU', 'CPU', 'Mobile'],
    blurb: 'Alibaba’s non-autoregressive multitasker — transcription, language ID, emotion, and audio events, far faster than Whisper.',
    about: [
      'SenseVoice-Small is a non-autoregressive encoder that does four jobs at once: transcription, spoken language identification, emotion recognition, and audio-event detection. It processes ten seconds of audio in about 70 ms — Alibaba claims 15× faster than Whisper-large — and is particularly strong on Mandarin and Cantonese, backed by 400,000+ training hours.',
      'The weights ship under Alibaba’s custom FunASR model licence — free for commercial use with attribution, but it is not a standard OSI licence, so read it. The FunASR code path is MIT, and community runtimes (sherpa-onnx, llama.cpp) take it to mobile and embedded devices.',
    ],
    install: `pip install funasr

python -c "
from funasr import AutoModel
m = AutoModel(model='FunAudioLLM/SenseVoiceSmall', trust_remote_code=True)
print(m.generate(input='audio.wav', language='auto'))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/FunAudioLLM/SenseVoiceSmall' },
      { label: 'SenseVoice (GitHub)', url: 'https://github.com/FunAudioLLM/SenseVoice' },
    ],
    hosted: [
      { name: 'Alibaba Model Studio', price: 'usage-based', url: 'https://www.alibabacloud.com/en/product/modelstudio' },
    ],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2407.04051' },
      { label: 'Model licence text', url: 'https://github.com/modelscope/FunASR/blob/main/MODEL_LICENSE' },
    ],
    demo: null,
  },
  {
    id: 'seamless-m4t-v2',
    name: 'Seamless M4T v2',
    org: 'Meta AI',
    year: 2023,
    kind: 'model',
    status: 'legacy',
    license: 'CC-BY-NC-4.0',
    licenseType: 'non-commercial',
    params: '2.3B',
    wer: null,
    langs: '~100',
    runs: ['GPU', 'CPU'],
    blurb: 'Meta’s all-in-one speech translator — ASR plus speech-to-speech translation across roughly 100 languages.',
    about: [
      'SeamlessM4T v2 is one model for five tasks: speech recognition, speech-to-text and text-to-speech translation, and speech-to-speech translation, covering roughly 100 input languages. Built on Meta’s UnitY2 framework and trained with the 114,800-hour SeamlessAlign corpus.',
      'Like MMS, it is CC-BY-NC 4.0 — research and non-commercial use only — and upstream development has been dormant since late 2024, though it remains fully usable through Hugging Face Transformers. For pure ASR newer models beat it; its niche is combined recognition and translation in one checkpoint.',
    ],
    install: `pip install transformers sentencepiece torch

python -c "
from transformers import AutoProcessor, SeamlessM4Tv2Model
m = SeamlessM4Tv2Model.from_pretrained('facebook/seamless-m4t-v2-large')"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/facebook/seamless-m4t-v2-large' },
      { label: 'seamless_communication (GitHub)', url: 'https://github.com/facebookresearch/seamless_communication' },
    ],
    hosted: [],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2312.05187' },
      { label: 'Model card', url: 'https://huggingface.co/facebook/seamless-m4t-v2-large' },
    ],
    demo: null,
  },
  {
    id: 'owsm',
    name: 'OWSM v4',
    org: 'CMU WAVLab / ESPnet',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-4.0',
    licenseType: 'permissive',
    params: '102M – 1B',
    wer: 7.44,
    langs: '150+',
    runs: ['GPU', 'CPU'],
    blurb: 'The fully open Whisper reproduction — public data, open training code, and released weights, from CMU.',
    about: [
      'OWSM ("Open Whisper-style Speech Models") is the answer to Whisper’s murky data provenance: trained entirely on public data (~320k hours for v4) with open training code in ESPnet, so every result is reproducible. The v4 paper won the Interspeech 2025 Best Student Paper award.',
      'The encoder-only OWSM-CTC v4 1B scores 7.44% average WER on the Open ASR Leaderboard — matching Whisper large-v3 — while its non-autoregressive decoding runs far faster. Sizes run from 102M to 1B, all under CC-BY-4.0.',
    ],
    install: `pip install espnet espnet_model_zoo

python -c "
from espnet2.bin.s2t_inference import Speech2Text
s2t = Speech2Text.from_pretrained('espnet/owsm_v4_medium_1B',
  lang_sym='<eng>', task_sym='<asr>')"`,
    downloads: [
      { label: 'OWSM v4 1B on Hugging Face', url: 'https://huggingface.co/espnet/owsm_v4_medium_1B' },
      { label: 'ESPnet (GitHub)', url: 'https://github.com/espnet/espnet' },
    ],
    hosted: [],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2506.00338' },
      { label: 'Project page', url: 'https://www.wavlab.org/activities/2024/owsm/' },
    ],
    demo: null,
  },
  {
    id: 'vosk',
    name: 'Vosk',
    org: 'Alpha Cephei',
    year: 2020,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '50 MB – 4 GB',
    wer: null,
    langs: '20+',
    runs: ['CPU', 'Mobile'],
    blurb: 'Lightweight offline recognition for 20+ languages — models start at 50 MB and run on a Raspberry Pi.',
    about: [
      'Vosk is a Kaldi-based offline recogniser with ready-made models for 20+ languages, starting at 50 MB — small enough for phones, Raspberry Pi, and embedded devices. It streams: you get words as they are spoken, with a zero-latency feel that batch models can’t match.',
      'Bindings exist for Python, Java, Node, C#, Go, and more. Accuracy trails the transformer generation, but for wake words, commands, and live captioning on weak hardware it remains the pragmatic choice.',
    ],
    install: `pip install vosk

# download a model from alphacephei.com/vosk/models
python -c "
from vosk import Model, KaldiRecognizer
model = Model('vosk-model-small-en-us-0.15')"`,
    downloads: [
      { label: 'Model downloads', url: 'https://alphacephei.com/vosk/models' },
      { label: 'vosk-api (GitHub)', url: 'https://github.com/alphacep/vosk-api' },
    ],
    hosted: [],
    links: [
      { label: 'Docs', url: 'https://alphacephei.com/vosk/' },
      { label: 'GitHub', url: 'https://github.com/alphacep/vosk-api' },
    ],
    demo: null,
  },
  {
    id: 'mms',
    name: 'MMS',
    org: 'Meta AI',
    year: 2023,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-NC-4.0',
    licenseType: 'non-commercial',
    params: '1B',
    wer: null,
    langs: '1,100+',
    runs: ['GPU', 'CPU'],
    blurb:
      'Massively Multilingual Speech — transcription for over 1,100 languages, most of them served by no other model.',
    about: [
      'Meta’s Massively Multilingual Speech project scaled wav2vec 2.0 to more than 1,100 languages — roughly 10× the coverage of Whisper. For hundreds of low-resource languages, MMS is effectively the only ASR available.',
      'Note the licence: CC-BY-NC 4.0 — research and non-commercial use only. For the languages it uniquely covers, that is usually an acceptable trade.',
    ],
    install: `pip install transformers torchaudio

python -c "
from transformers import pipeline
asr = pipeline('automatic-speech-recognition',
  'facebook/mms-1b-all')
print(asr('audio.wav'))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/facebook/mms-1b-all' },
      { label: 'MMS (GitHub)', url: 'https://github.com/facebookresearch/fairseq/tree/main/examples/mms' },
    ],
    hosted: [],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2305.13516' },
      {
        label: 'Language coverage map',
        url: 'https://ai.meta.com/blog/multilingual-model-speech-recognition/',
      },
    ],
    demo: null,
  },
  {
    id: 'silero',
    name: 'Silero Models',
    org: 'Silero',
    year: 2020,
    kind: 'model',
    status: 'active',
    license: 'CC-BY-NC-SA',
    licenseType: 'non-commercial',
    params: '~50M',
    wer: null,
    langs: 'En, De, Es, Ua',
    runs: ['CPU', 'Mobile'],
    blurb: 'Compact one-file models for STT, TTS, and the ubiquitous Silero VAD.',
    about: [
      'Silero ships compact, production-minded speech models that load in one line of PyTorch — STT for a handful of languages, plus the Silero VAD (voice activity detector) that has become a de-facto standard component in almost every open transcription pipeline.',
      'STT models are CC-BY-NC-SA (commercial licences are sold separately); the VAD itself is MIT and safe to use anywhere.',
    ],
    install: `pip install torch torchaudio omegaconf

python -c "
import torch
model, decoder, utils = torch.hub.load(
  'snakers4/silero-models', 'silero_stt', language='en')"`,
    downloads: [
      { label: 'silero-models (GitHub)', url: 'https://github.com/snakers4/silero-models' },
      { label: 'Silero VAD (MIT)', url: 'https://github.com/snakers4/silero-vad' },
    ],
    hosted: [],
    links: [{ label: 'GitHub', url: 'https://github.com/snakers4/silero-models' }],
    demo: null,
  },
  {
    id: 'speechbrain',
    name: 'SpeechBrain',
    org: 'SpeechBrain project',
    year: 2021,
    kind: 'toolkit',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '— (toolkit)',
    wer: null,
    langs: 'varies',
    runs: ['GPU', 'CPU'],
    blurb: 'The PyTorch speech toolkit — 200+ training recipes and 100+ pre-trained models for every speech task.',
    about: [
      'SpeechBrain is not one model but a full PyTorch toolkit: 200+ training recipes and 100+ pre-trained models spanning ASR, speaker diarisation, enhancement, separation, and TTS. If you need to train or fine-tune a speech pipeline rather than just run one, start here.',
      'v1.1 (2026) added HuggingFace-LLM integration, mixed-precision multi-GPU training, and new augmentation techniques.',
    ],
    install: `pip install speechbrain

python -c "
from speechbrain.inference import EncoderDecoderASR
asr = EncoderDecoderASR.from_hparams(
  'speechbrain/asr-conformer-transformerlm-librispeech')
print(asr.transcribe_file('audio.wav'))"`,
    downloads: [
      { label: 'speechbrain (GitHub)', url: 'https://github.com/speechbrain/speechbrain' },
      { label: 'Models on Hugging Face', url: 'https://huggingface.co/speechbrain' },
    ],
    hosted: [],
    links: [{ label: 'Docs', url: 'https://speechbrain.github.io/' }],
    demo: null,
  },
  {
    id: 'espnet',
    name: 'ESPnet',
    org: 'ESPnet community',
    year: 2018,
    kind: 'toolkit',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '— (toolkit)',
    wer: null,
    langs: 'varies',
    runs: ['GPU', 'CPU'],
    blurb: 'The academic workhorse — end-to-end recipes for ASR, TTS, translation, enhancement, and the OWSM models.',
    about: [
      'ESPnet has been the standard end-to-end speech research toolkit since 2018: hundreds of reproducible dataset recipes across ASR, TTS, speech translation, enhancement, diarisation, and spoken language understanding, with a pretrained model zoo on Hugging Face.',
      'It is also the training and release vehicle for the OWSM open Whisper-style models. If you want to reproduce a paper or train on your own corpus with a known-good recipe, this is the reference stack.',
    ],
    install: `pip install espnet espnet_model_zoo

# full recipes: clone the repo and use egs2/<dataset>/run.sh`,
    downloads: [
      { label: 'espnet (GitHub)', url: 'https://github.com/espnet/espnet' },
      { label: 'Models on Hugging Face', url: 'https://huggingface.co/espnet' },
    ],
    hosted: [],
    links: [
      { label: 'Docs', url: 'https://espnet.github.io/espnet/' },
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/1804.00015' },
    ],
    demo: null,
  },
  {
    id: 'wenet',
    name: 'WeNet',
    org: 'WeNet community',
    year: 2021,
    kind: 'toolkit',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '— (toolkit)',
    wer: null,
    langs: 'Zh, En + recipes',
    runs: ['GPU', 'CPU', 'Mobile'],
    blurb: 'Production-first ASR toolkit — one U2++ model serves both streaming and batch, with x86 and Android runtimes.',
    about: [
      'WeNet is built for shipping, not just research: its U2/U2++ architecture serves streaming and non-streaming recognition from a single model, and the project includes deployable runtimes for x86 (libtorch/ONNX) and Android. Strong Mandarin recipes (AISHELL, WenetSpeech) plus LibriSpeech and GigaSpeech for English.',
      'Recent development focuses on running external pretrained models — Whisper, Paraformer, SenseVoice, FireRed — through the same production runtime, making it a pragmatic bridge from research checkpoints to on-device products.',
    ],
    install: `pip install git+https://github.com/wenet-e2e/wenet.git

wenet --language chinese audio.wav`,
    downloads: [{ label: 'wenet (GitHub)', url: 'https://github.com/wenet-e2e/wenet' }],
    hosted: [],
    links: [
      { label: 'Docs', url: 'https://wenet-e2e.github.io/wenet/' },
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2102.01547' },
    ],
    demo: null,
  },
  {
    id: 'wav2vec2',
    name: 'wav2vec 2.0',
    org: 'Meta AI',
    year: 2020,
    kind: 'model',
    status: 'legacy',
    license: 'MIT',
    licenseType: 'permissive',
    params: '95M / 317M',
    wer: null,
    langs: 'En (XLSR: 53+)',
    runs: ['GPU', 'CPU'],
    blurb: 'The self-supervised breakthrough that taught speech models to learn from unlabelled audio.',
    about: [
      'wav2vec 2.0 pioneered self-supervised learning for speech: pre-train on unlabelled audio, then fine-tune with as little as 10 minutes of transcripts. It set 2020-era records on LibriSpeech and its XLSR variants brought usable ASR to dozens of low-resource languages.',
      'Newer encoder-decoder models have passed it for general transcription, but it remains a workhorse for fine-tuning on niche languages and domains where labelled data is scarce.',
    ],
    install: `pip install transformers torchaudio

python -c "
from transformers import pipeline
asr = pipeline('automatic-speech-recognition',
  'facebook/wav2vec2-large-960h-lv60-self')
print(asr('audio.wav'))"`,
    downloads: [
      {
        label: 'Weights on Hugging Face',
        url: 'https://huggingface.co/facebook/wav2vec2-large-960h-lv60-self',
      },
      { label: 'fairseq (GitHub)', url: 'https://github.com/facebookresearch/fairseq' },
    ],
    hosted: [],
    links: [{ label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2006.11477' }],
    demo: null,
  },
  {
    id: 'kaldi',
    name: 'Kaldi',
    org: 'Kaldi project',
    year: 2011,
    kind: 'toolkit',
    status: 'legacy',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '— (toolkit)',
    wer: null,
    langs: 'varies',
    runs: ['CPU'],
    blurb:
      'The C++ toolkit that carried a decade of ASR research — legacy now, but still under countless production systems.',
    about: [
      'Kaldi defined open-source speech recognition for a decade: a C++ toolkit of WFST decoders, acoustic-model recipes, and pipelines that trained most pre-transformer production systems. Vosk is built on it.',
      'New projects should not start here — the transformer generation is more accurate and vastly easier to use — but enormous amounts of deployed ASR still run Kaldi, and its recipes remain a reference for classical techniques.',
    ],
    install: `git clone https://github.com/kaldi-asr/kaldi
cd kaldi/tools && make
cd ../src && ./configure && make

# then pick a recipe under egs/`,
    downloads: [{ label: 'kaldi (GitHub)', url: 'https://github.com/kaldi-asr/kaldi' }],
    hosted: [],
    links: [{ label: 'Docs', url: 'https://kaldi-asr.org/' }],
    demo: null,
  },
  {
    id: 'coqui-stt',
    name: 'Coqui STT',
    org: 'Coqui (ex-Mozilla)',
    year: 2021,
    kind: 'model',
    status: 'discontinued',
    license: 'MPL-2.0',
    licenseType: 'permissive',
    params: '~47M',
    wer: null,
    langs: 'En + community',
    runs: ['CPU', 'Mobile'],
    blurb: 'The successor to Mozilla DeepSpeech — archived, but its small on-device models still circulate.',
    about: [
      'Coqui STT carried on Mozilla’s DeepSpeech after that project wound down: small, streaming, on-device models with bindings for Python, Node, Android, and iOS. The company pivoted to TTS and the STT project is now archived.',
      'Listed for completeness — the repos and model files remain available and functional, but there is no maintenance. For new on-device work, look at Moonshine, Vosk, or whisper.cpp instead.',
    ],
    install: `# archived — pinned versions only
pip install stt

# models from the GitHub releases page`,
    downloads: [
      { label: 'STT (GitHub, archived)', url: 'https://github.com/coqui-ai/STT' },
      { label: 'Released models', url: 'https://github.com/coqui-ai/STT-models' },
    ],
    hosted: [],
    links: [{ label: 'GitHub', url: 'https://github.com/coqui-ai/STT' }],
    demo: null,
  },
  {
    id: 'deepgram',
    name: 'Deepgram Nova-3',
    org: 'Deepgram',
    year: 2025,
    kind: 'api',
    status: 'active',
    license: 'Proprietary',
    licenseType: 'proprietary',
    params: '— (hosted)',
    wer: null,
    langs: '36+',
    runs: ['Cloud API', 'Self-hosted'],
    blurb: 'Real-time STT API built for voice agents — multilingual code-switching, keyterm prompting, optional self-hosting.',
    about: [
      'Nova-3 is Deepgram’s flagship transcription model: sub-300 ms streaming, real-time code-switching across 36+ languages, and "keyterm prompting" — pass up to ~100 domain terms at request time to adapt vocabulary without retraining. The newer Flux model adds native end-of-turn detection (~260 ms) for voice agents. Deepgram does not appear on the Open ASR Leaderboard, so no independent WER figure is listed here.',
      'Unusually for a hosted API, Deepgram also sells self-hosted deployment (Docker/Kubernetes, Enterprise plan) for audio that can’t leave your infrastructure. Pay-as-you-go starts around $0.0043/min for batch and $0.0077/min for streaming English, with a $200 signup credit. Prices change — check the pricing page.',
    ],
    install: `pip install deepgram-sdk
# export DEEPGRAM_API_KEY=...

python -c "
from deepgram import DeepgramClient, PrerecordedOptions
dg = DeepgramClient()
opts = PrerecordedOptions(model='nova-3', smart_format=True)
res = dg.listen.rest.v('1').transcribe_file(open('audio.wav','rb').read(), opts)
print(res.results.channels[0].alternatives[0].transcript)"`,
    downloads: [],
    hosted: [
      { name: 'Nova-3 batch', price: 'from $0.0043 / min', url: 'https://deepgram.com/pricing' },
      { name: 'Nova-3 streaming', price: 'from $0.0077 / min', url: 'https://deepgram.com/pricing' },
      { name: 'Self-hosted', price: 'Enterprise', url: 'https://developers.deepgram.com/docs/self-hosted-introduction' },
    ],
    links: [
      { label: 'Docs', url: 'https://developers.deepgram.com/docs' },
      { label: 'Nova-3 announcement', url: 'https://deepgram.com/learn/introducing-nova-3-speech-to-text-api' },
    ],
    demo: null,
  },
  {
    id: 'assemblyai',
    name: 'AssemblyAI Universal-3 Pro',
    org: 'AssemblyAI',
    year: 2026,
    kind: 'api',
    status: 'active',
    license: 'Proprietary',
    licenseType: 'proprietary',
    params: '— (hosted)',
    wer: 6.21,
    langs: '6 native, 99 fallback',
    runs: ['Cloud API'],
    blurb: 'A promptable speech model as an API — steer transcription with natural-language instructions.',
    about: [
      'Universal-3 Pro (February 2026) is a promptable speech language model: pass natural-language instructions — names, terminology, formatting rules — before transcription, with up to 45% claimed accuracy gains from good prompting. Its 6.21% average WER on the Open ASR Leaderboard is among the strongest API results the leaderboard measures.',
      'The March 2026 streaming variant brings prompting, real-time speaker diarisation, and 99+ languages to live transcription (~300 ms word emission, immutable finals). Async Universal-3 Pro runs $0.21/hr, the base Universal tier $0.15/hr, with a $50 signup credit. Cloud-only — there is no self-hosted option. Prices change — check the pricing page.',
    ],
    install: `pip install assemblyai
# aai.settings.api_key = 'YOUR_API_KEY'

python -c "
import assemblyai as aai
cfg = aai.TranscriptionConfig(speech_models=['universal-3-pro', 'universal-2'])
t = aai.Transcriber().transcribe('audio.mp3', cfg)
print(t.text)"`,
    downloads: [],
    hosted: [
      { name: 'Universal (async)', price: '$0.15 / hr', url: 'https://www.assemblyai.com/pricing' },
      { name: 'Universal-3 Pro (async)', price: '$0.21 / hr', url: 'https://www.assemblyai.com/pricing' },
      { name: 'U3 Pro streaming', price: '$0.45 / hr', url: 'https://www.assemblyai.com/pricing' },
    ],
    links: [
      { label: 'Docs', url: 'https://www.assemblyai.com/docs' },
      { label: 'Universal-3 Pro announcement', url: 'https://www.assemblyai.com/blog/introducing-universal-3-pro' },
    ],
    demo: null,
  },
];

export const MODELS: ModelEntry[] = CATALOGUE.map((m, i) => ({
  ...m,
  num: String(i + 1).padStart(2, '0'),
}));

export const FEATURED_IDS = ['whisper-large-v3', 'granite-speech-4-1-2b', 'moonshine', 'vosk'];

export const KIND_LABELS: Record<Kind, string> = {
  model: 'Model',
  runtime: 'Runtime',
  toolkit: 'Toolkit',
  api: 'API',
};

/** Best average WER among open (non-proprietary) entries, e.g. "5.63%". */
export function bestOpenWer(): string {
  const best = Math.min(
    ...MODELS.filter((m) => m.licenseType !== 'proprietary' && m.wer != null).map((m) => m.wer!)
  );
  return best.toFixed(2) + '%';
}

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
