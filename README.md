# LatamBench

**Independent evaluation of LLMs on Latin American cultural knowledge.**

Reproducible numbers nobody else publishes — with a calibrated judge and open transcripts.

Built by [Crafter Research](https://github.com/crafter-research) — a research lab of [Crafter Station](https://crafterstation.com).

[![Website](https://img.shields.io/badge/web-latambench.org-white?style=flat-square&labelColor=080808)](https://latambench.org)
[![License](https://img.shields.io/badge/license-MIT-white?style=flat-square&labelColor=080808)](LICENSE)

---

## Why LatamBench?

Benchmarks of Latin American culture exist (Trueque, CHOCLO), but they run without auditing: nobody compares models independently, nobody verifies the references are correct, and naive lexical rankings (token overlap) give misleading results.

LatamBench is an **evals observatory**. It runs those benchmarks with a calibrated reference-anchored judge and open transcripts — and in the process audits the benchmarks themselves. The underlying question: *who owns the "cultural truth" when an answer has several legitimate forms?*

## Leaderboard — Trueque (500 questions)

Judge accuracy: % of answers a reference-anchored judge (a model outside the compared set) considers correct. Seed 42, temperature 0. Reproducible from `eval/runs/`.

| # | Model | Org | Correct |
|---|-------|-----|---------|
| 1 | Claude Fable 5 | Anthropic | 72.8% |
| 2 | Gemini 3.1 Pro | Google | 67.4% |
| 3 | Gemini 3.5 Flash | Google | 64.0% |
| 4 | GPT-5.5 | OpenAI | 63.6% |
| 5 | DeepSeek V4 Pro | DeepSeek | 55.2% |
| 6 | Qwen3.7 Max | Alibaba | 54.0% |
| 7 | GPT-5.4 Mini | OpenAI | 45.8% |
| 8 | Claude Haiku 4.5 | Anthropic | 33.6% |
| 9 | Llama 4 Maverick | Meta | 30.0% |
| 10 | **LatamGPT SFT 1.0** `regional` | CENIA | 23.9% |
| 11 | Llama 3.1 70B `base` | Meta | 20.2% |

The best frontier model answers ~73% of cultural questions; none goes higher. A regionally continued-pretrained model (LatamGPT) lands just above its own base, far from the frontier. CHOCLO (105K short-reference questions) is under judge recalibration before publishing.

## Methodology

- **Reference-anchored judge** — a model outside the compared set decides whether a candidate answer expresses the facts of the reference. Calibrated on a synthetic set built from the dataset itself (TPR 0.99 / TNR 0.97 gate ≥ 0.95).
- **Hybrid scoring** — token-F1 + embedding similarity + judge verdict. Signal disagreements go to manual spot-check.
- **Reproducible** — every run stores raw responses and full judge transcripts. Fixed seed, temperature 0, versioned in git.
- **Benchmark audit** — the disagreement pipeline surfaces reference-quality issues in the benchmarks themselves; proposed fixes are additive (accept synonyms / multiple senses), never cultural corrections.

## Repository Structure

```
latambench/
├── web/                  # Landing page (Astro + Tailwind)
├── eval/                 # Evaluation harness (Bun + AI SDK)
│   ├── src/              # cli, datasets, models, judge, scoring, calibrate
│   ├── runs/             # per-run: responses.jsonl + judgments.jsonl + run.json
│   ├── calibration/      # judge calibration (TPR/TNR)
│   ├── spotcheck/        # signal-disagreement queue + adjudication
│   └── README.md
└── data/                 # dataset placeholders (own dataset is a later phase)
```

## Running an eval

```bash
cd eval && bun install
# Requires AI_GATEWAY_API_KEY (Vercel AI Gateway) in eval/.env
bun src/cli.ts run --model "gateway:openai/gpt-5.5" --benchmark trueque --seed 42
bun src/cli.ts calibrate-judge          # synthetic TPR/TNR gate
bun src/cli.ts rescore --glob "<run-id>"  # hybrid score + judge
bun src/cli.ts report                   # leaderboard by benchmark
```

Model id prefixes: `gateway:<provider>/<model>` (Vercel AI Gateway), `compat:<baseURL>|<model>` (any OpenAI-compatible endpoint, e.g. a self-hosted model via vLLM).

## Roadmap

- [x] Evals observatory live — Trueque-500, 11 models, calibrated judge
- [x] Benchmark audit — reference-quality issues surfaced
- [ ] CHOCLO leaderboard — judge recalibration for short references
- [ ] Own generative dataset with multi-answer references (covering the space of defensible answers, not a single point)

## License

MIT © [Crafter Research](https://github.com/crafter-research)
