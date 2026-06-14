# LatamBench

**Independent evaluation of LLMs on Latin American cultural knowledge.**

Reproducible numbers nobody else publishes, with a calibrated judge and open transcripts.

Built by [Crafter Research](https://github.com/crafter-research), a research lab of [Crafter Station](https://crafterstation.com).

[![Website](https://img.shields.io/badge/web-latambench.org-white?style=flat-square&labelColor=080808)](https://latambench.org)
[![License](https://img.shields.io/badge/license-MIT-white?style=flat-square&labelColor=080808)](LICENSE)

---

## Why LatamBench?

Benchmarks of Latin American culture exist (Trueque, CHOCLO), but they run without auditing: nobody compares models independently, nobody verifies the references are correct, and naive lexical rankings (token overlap) give misleading results.

LatamBench is an **evals observatory**. It runs those benchmarks with a calibrated reference-anchored judge and open transcripts, and in the process audits the benchmarks themselves. The underlying question: *who owns the "cultural truth" when an answer has several legitimate forms?*

## Leaderboard

Three dimensions per model, not just accuracy: **correct** (judge considers the answer expresses the reference facts), **abstain** (model declines, "no sé"), **halluc** (wrong attempt). Raw accuracy collapses abstention and hallucination into one "wrong", but for high-stakes use a model that says "I don't know" beats one that invents. Seed 42, temperature 0. 95% Wilson CIs in brackets.

### Trueque (500 questions)

| # | Model | Org | Correct | Abstain | Halluc |
|---|-------|-----|---------|---------|--------|
| 1 | Claude Fable 5 | Anthropic | 72.8% [68.7, 76.5] | 3.4% | 6.6% |
| 2 | Gemini 3.1 Pro | Google | 67.4% [63.2, 71.4] | 2.2% | 7.4% |
| 3 | Gemini 3.5 Flash | Google | 64.0% [59.7, 68.1] | 2.0% | 8.4% |
| 4 | GPT-5.5 | OpenAI | 63.6% [59.3, 67.7] | 1.2% | 10.4% |
| 5 | DeepSeek V4 Pro | DeepSeek | 55.2% [50.8, 59.5] | 2.4% | 18.2% |
| 6 | Qwen3.7 Max | Alibaba | 54.0% [49.6, 58.3] | 8.6% | 14.0% |
| 7 | GPT-5.4 Mini | OpenAI | 45.8% [41.5, 50.2] | 4.6% | 18.4% |
| 8 | Claude Haiku 4.5 | Anthropic | 33.6% [29.6, 37.9] | 15.6% | 26.8% |
| 9 | Llama 4 Maverick | Meta | 30.0% [26.1, 34.2] | 4.6% | 30.2% |
| 10 | **LatamGPT SFT 1.0** `regional` | CENIA | 23.9% [20.3, 27.9] | 5.0% | 41.7% |
| 11 | Llama 3.1 70B `base` | Meta | 20.2% [16.9, 23.9] | 5.0% | 38.6% |

All three rates (correct / abstain / hallucination) share the `nValid` denominator; infra-excluded items (pod timeouts) are dropped. Ranking is by Correct (binary judge accuracy). Canonical numbers: [`eval/results-leaderboard.json`](eval/results-leaderboard.json).

### CHOCLO (500 sampled, long-tail entities) · preliminary

> Preliminary: the judge calibration and the 3-judge inter-rater study cover Trueque only. CHOCLO (ultra-short references) has no validation of its own yet. The accuracy ordering is stable, but with all-pairs Holm-Bonferroni correction the entire CHOCLO board falls into a single statistical tie-group by accuracy, so do not read the ordinal rank as significant.

| # | Model | Org | Correct | Abstain | Halluc |
|---|-------|-----|---------|---------|--------|
| 1 | Gemini 3.5 Flash | Google | 51.8% [47.4, 56.1] | 10.2% | 20.0% |
| 2 | Gemini 3.1 Pro | Google | 50.8% [46.4, 55.2] | 15.0% | 16.2% |
| 3 | GPT-5.5 | OpenAI | 48.1% [43.7, 52.5] | 7.8% | 24.0% |
| 4 | DeepSeek V4 Pro | DeepSeek | 40.2% [36.0, 44.6] | 13.8% | 29.4% |
| 5 | Qwen3.7 Max | Alibaba | 34.7% [30.6, 38.9] | 31.5% | 18.2% |
| 6 | Llama 4 Maverick | Meta | 28.0% [24.2, 32.1] | 14.8% | 39.6% |
| 7 | GPT-5.4 Mini | OpenAI | 26.6% [22.9, 30.6] | 29.6% | 27.8% |
| 8 | Claude Opus 4.8 | Anthropic | 24.4% [20.8, 28.4] | 58.0% | 7.4% |
| 9 | **LatamGPT SFT 1.0** `regional` | CENIA | 23.5% [19.7, 27.8] | 5.5% | 53.2% |
| 10 | Llama 3.1 70B `base` | Meta | 22.2% [18.8, 26.1] | 10.8% | 51.7% |
| 11 | Claude Haiku 4.5 | Anthropic | 18.8% [15.6, 22.5] | 53.8% | 18.2% |

### How to read this

- **The frontier leads but does not crush.** The best model answers ~73% of cultural questions; none goes higher. Regional cultural knowledge is still the weak tail even for SOTA.
- **The regional model's CPT shows no significant gain.** LatamGPT (23.9% [20.3, 27.9]) and its base Llama 3.1 70B (20.2% [16.9, 23.9]) overlap: the continued-pretraining produced **no statistically significant improvement** over the base model (two-prop z, p=0.166 Trueque / p=0.647 CHOCLO; not significant after Holm-Bonferroni). LatamGPT is near the bottom but not last: its own base ranks below it (and Haiku ranks below both on CHOCLO).
- **Rank by hallucination and the order flips.** Opus 4.8 invents only 7.4% on CHOCLO (it abstains instead); LatamGPT invents 53.2% on CHOCLO and its base 51.7% (the two highest). LatamGPT almost never abstains (5.5%): when it fails, it makes something up. For the government/education use cases attributed to regional models, that is the worst profile. Note: abstention rates are partly prompt-driven (the system prompt asks models to decline when unsure); see Threats to Validity in the methodology.
- **Adjacent models within overlapping CIs are statistical ties** (e.g. CHOCLO top-3). Do not read the ordinal rank as significant everywhere.

## Methodology

- **Reference-anchored judge**: a model outside the compared set decides whether a candidate answer expresses the facts of the reference. Three judges from different families (grok-4.3, kimi-k2.6, glm-5.1) show substantial agreement (Fleiss kappa 0.68 on the binary correct/wrong axis).
- **Reference-fidelity check (not a correctness oracle)**: a synthetic set built from the references reports TPR 0.99 / TNR 0.97. This measures that the judge faithfully reproduces reference-anchored verdicts, NOT that the references are correct. Reference quality is a separate axis (see audit below).
- **Three dimensions**: correct (primary metric, binary) + abstain vs hallucinate (an abstention classifier outside the compared set). A secondary hybrid `score` weights partial credit at 0.5.
- **Reproducible methodology**: every run stores raw responses and full judge transcripts; fixed seed and temperature 0. Note: exact numbers are not bit-reproducible (provider routing, model aliases drift, e.g. a model was retired mid-study), but the pipeline and inputs are.
- **Benchmark audit**: the disagreement pipeline surfaces reference-quality issues in the benchmarks themselves; a random audit (n=60) estimates ~5-7% imprecise references. Proposed fixes are additive (accept synonyms / multiple senses), never cultural corrections.
- **Threats to validity**: serving conditions, prompt-confounded abstention, single-reference judging, and reference quality are documented limitations under active mitigation.

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

- [x] Evals observatory live: Trueque + CHOCLO, 11 models, reference-anchored judge
- [x] Three dimensions: correct / abstain / hallucinate
- [x] Inter-rater reliability (3 judges, Fleiss kappa 0.68) + Wilson CIs
- [x] Benchmark audit: reference-quality issues surfaced
- [ ] Human validation of the judge against ground truth (in progress)
- [ ] Own generative dataset with multi-answer references (covering the space of defensible answers, not a single point)

## License

MIT © [Crafter Research](https://github.com/crafter-research)
