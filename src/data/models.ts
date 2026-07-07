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
      'Current #1 on the Open ASR Leaderboard — a FastConformer encoder paired with a Qwen3 LLM decoder.',
    about: [
      'Canary-Qwen pairs a FastConformer speech encoder with an unmodified Qwen3-1.7B language-model decoder (a "SALM" architecture). The result tops the Hugging Face Open ASR Leaderboard at 5.63% average WER, ahead of every commercial API on the same benchmark.',
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
    wer: 5.85,
    langs: 'En + translation',
    runs: ['GPU'],
    blurb: 'IBM’s speech-aware LLM — second most accurate open model, under a genuinely permissive licence.',
    about: [
      'Granite Speech bolts a speech encoder onto IBM’s Granite 3.3 8B LLM. It sits just behind Canary-Qwen on the Open ASR Leaderboard (5.85% WER) but is released under Apache 2.0, which makes it the most accurate open model you can use commercially without attribution clauses.',
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
    id: 'distil-whisper',
    name: 'Distil-Whisper large-v3',
    org: 'Hugging Face',
    year: 2023,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '756M',
    wer: 7.53,
    langs: 'English',
    runs: ['GPU', 'CPU', 'Browser'],
    blurb: 'Whisper distilled to half the size and ~6× the speed, within 1% WER of the original.',
    about: [
      'Distil-Whisper is a knowledge-distilled version of Whisper large-v3: about half the parameters, roughly 6× faster, and within one WER point of its teacher on out-of-distribution audio. English-only.',
      'It drops into any Hugging Face Transformers pipeline as a straight replacement, and pairs well with speculative decoding — using it as a draft model to speed up full Whisper with zero accuracy loss.',
    ],
    install: `pip install transformers accelerate

python -c "
from transformers import pipeline
asr = pipeline('automatic-speech-recognition',
  'distil-whisper/distil-large-v3')
print(asr('audio.wav'))"`,
    downloads: [
      { label: 'Weights on Hugging Face', url: 'https://huggingface.co/distil-whisper/distil-large-v3' },
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
    id: 'moonshine',
    name: 'Moonshine',
    org: 'Useful Sensors',
    year: 2024,
    kind: 'model',
    status: 'active',
    license: 'MIT',
    licenseType: 'permissive',
    params: '27M / 62M',
    wer: null,
    langs: 'En + 7',
    runs: ['CPU', 'Mobile', 'Browser'],
    blurb: 'Tiny models built for edge devices — beats Whisper tiny/base at a fraction of the compute.',
    about: [
      'Moonshine was designed from scratch for edge hardware: variable-length windows instead of Whisper’s fixed 30-second chunks mean short utterances transcribe several times faster. The tiny model is 27M parameters — small enough for microcontroller-class devices and instant browser loading.',
      'It beats Whisper tiny and base on accuracy at a fraction of the compute, which has made it the default for live captions, voice interfaces, and wearables. Runs natively, via ONNX, or in-browser through transformers.js — try it below.',
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
    id: 'qwen3-asr',
    name: 'Qwen3-ASR',
    org: 'Alibaba',
    year: 2025,
    kind: 'model',
    status: 'active',
    license: 'Apache-2.0',
    licenseType: 'permissive',
    params: '~2B class',
    wer: null,
    langs: '11',
    runs: ['GPU'],
    blurb: 'Alibaba’s multilingual ASR from the Qwen family — strong on Chinese, English, and code-switching.',
    about: [
      'Qwen3-ASR brings the Qwen LLM family’s multilingual strength to speech: 11 languages with particularly strong Mandarin and English, robust handling of accents, code-switching, and noisy audio, plus contextual biasing — you can feed it a vocabulary list to steer transcription.',
      'A good pick when Chinese-language accuracy matters, where Whisper is comparatively weak.',
    ],
    install: `pip install transformers torch

# see the model card for the current checkpoint name
# and pipeline usage — the family moves fast.`,
    downloads: [
      { label: 'Qwen on Hugging Face', url: 'https://huggingface.co/Qwen' },
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
];

export const MODELS: ModelEntry[] = CATALOGUE.map((m, i) => ({
  ...m,
  num: String(i + 1).padStart(2, '0'),
}));

export const FEATURED_IDS = ['whisper-large-v3', 'canary-qwen-2-5b', 'moonshine', 'vosk'];

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
