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
| 1 | Claude Fable 5 | Anthropic | 72.9% [68.9, 76.7] | 3.4% | 7.6% |
| 2 | Gemini 3.1 Pro | Google | 67.4% [63.2, 71.4] | 2.2% | 8.4% |
| 3 | Gemini 3.5 Flash | Google | 64.0% [59.7, 68.1] | 2.0% | 10.0% |
| 4 | GPT-5.5 | OpenAI | 63.7% [59.4, 67.8] | 1.2% | 10.8% |
| 5 | DeepSeek V4 Pro | DeepSeek | 55.2% [50.8, 59.5] | 2.4% | 19.4% |
| 6 | Qwen3.7 Max | Alibaba | 54.0% [49.6, 58.3] | 8.6% | 14.8% |
| 7 | GPT-5.4 Mini | OpenAI | 45.8% [41.5, 50.2] | 4.6% | 19.0% |
| 8 | Claude Haiku 4.5 | Anthropic | 33.6% [29.6, 37.9] | 15.6% | 27.0% |
| 9 | Llama 4 Maverick | Meta | 30.0% [26.1, 34.2] | 4.6% | 30.8% |
| 10 | **LatamGPT SFT 1.0** `regional` | CENIA | 23.9% [20.3, 27.9] | 5.0% | 42.1% |
| 11 | Llama 3.1 70B `base` | Meta | 20.3% [16.9, 24.0] | 5.0% | 38.8% |

All three rates (correct / abstain / hallucination) share the `nValid` denominator; infra-excluded items (pod timeouts) are dropped. Ranking is by Correct (binary judge accuracy). Canonical numbers: [`eval/results-leaderboard.json`](eval/results-leaderboard.json).

> The columns do not sum to 100%. They are not a partition: `correct` + `partial` (partial not shown) cover the judge verdict; `abstain` is an independent axis (a model can hedge on an answer the judge still scores correct/partial), and `hallucination` counts only `incorrect AND not-abstained`. So `correct + abstain + hallucination` can exceed 100% by the count of abstentions that landed on correct/partial verdicts.

### CHOCLO (500 sampled, long-tail entities) · preliminary

> Preliminary: the judge calibration and the 3-judge inter-rater study cover Trueque only. CHOCLO (ultra-short references) has no validation of its own yet. The accuracy ordering is stable, but with all-pairs Holm-Bonferroni correction the entire CHOCLO board falls into a single statistical tie-group by accuracy, so do not read the ordinal rank as significant.

| # | Model | Org | Correct | Abstain | Halluc |
|---|-------|-----|---------|---------|--------|
| 1 | Gemini 3.5 Flash | Google | 51.8% [47.4, 56.1] | 10.2% | 20.2% |
| 2 | Gemini 3.1 Pro | Google | 50.8% [46.4, 55.2] | 15.0% | 16.8% |
| 3 | GPT-5.5 | OpenAI | 48.1% [43.7, 52.5] | 7.8% | 24.4% |
| 4 | DeepSeek V4 Pro | DeepSeek | 40.2% [36.0, 44.6] | 13.8% | 29.6% |
| 5 | Qwen3.7 Max | Alibaba | 34.7% [30.6, 38.9] | 31.5% | 19.8% |
| 6 | Llama 4 Maverick | Meta | 28.0% [24.2, 32.1] | 14.8% | 40.2% |
| 7 | GPT-5.4 Mini | OpenAI | 26.6% [22.9, 30.6] | 29.6% | 28.0% |
| 8 | Claude Opus 4.8 | Anthropic | 24.4% [20.8, 28.4] | 58.0% | 9.4% |
| 9 | **LatamGPT SFT 1.0** `regional` | CENIA | 23.5% [19.7, 27.8] | 5.5% | 53.2% |
| 10 | Llama 3.1 70B `base` | Meta | 22.2% [18.8, 26.1] | 10.8% | 52.3% |
| 11 | Claude Haiku 4.5 | Anthropic | 18.8% [15.6, 22.5] | 53.8% | 18.6% |

### How to read this

- **The frontier leads but does not crush.** The best model answers 72.9% of cultural questions; none goes higher. Regional cultural knowledge is still the weak tail even for SOTA.
- **The regional model's CPT shows no detectable gain, and the study is underpowered for small ones.** LatamGPT (23.9% [20.3, 27.9]) and its base Llama 3.1 70B (20.3% [17.0, 24.0]) overlap. The difference is **+3.6 points, 95% CI [-1.6, +8.8]** (two-prop z, p=0.177 Trueque / p=0.647 CHOCLO; not significant after Holm-Bonferroni). Read that interval carefully: it rules out gains larger than ~8.8 points, but it does **not** rule out a small real gain. At n=482 vs n=498 this design has 27% power for the observed difference and can only detect differences of 7.5 points or more; resolving a 3.6-point effect at 80% power would need about 2,100 items per group. The honest claim is that 297B tokens of continued pretraining bought no gain this study can see, not that the gain is zero. LatamGPT is near the bottom but not last: its own base ranks below it (and Haiku ranks below both on CHOCLO).
- **Rank by hallucination and the order flips.** Opus 4.8 invents only 9.4% on CHOCLO (it abstains instead); LatamGPT invents 53.2% on CHOCLO and its base 52.3% (the two highest). LatamGPT almost never abstains (5.5%): when it fails, it makes something up. For the government/education use cases attributed to regional models, that is the worst profile. Note: abstention rates are partly prompt-driven (the system prompt asks models to decline when unsure); see Threats to Validity in the methodology.
- **Adjacent models within overlapping CIs are statistical ties** (e.g. CHOCLO top-3). Do not read the ordinal rank as significant everywhere.

## Methodology

- **Reference-anchored judge**: a model outside the compared set decides whether a candidate answer expresses the facts of the reference. Three judges from different families (grok-4.3, kimi-k2.6, glm-5.1) agree at Fleiss kappa 0.67 on the binary correct/wrong axis (0.70 across three categories), computed over the 100-item validation set by `eval/analysis/stats.py`. Caveat worth stating: that figure uses grok's verdicts from the sweep the validation set was built from. Scored against grok's verdicts in the final n=500 runs, the same three raters agree at kappa 0.56, which is moderate rather than substantial. The judge is not perfectly self-consistent across runs, and the lower number is the more conservative one to quote.
- **Reference-fidelity check (not a correctness oracle)**: a synthetic set built from the references reports TPR 0.99 / TNR 0.97. This measures that the judge faithfully reproduces reference-anchored verdicts, NOT that the references are correct. Reference quality is a separate axis (see audit below).
- **Three dimensions**: correct (primary metric, binary) + abstain vs hallucinate (an abstention classifier outside the compared set). A secondary hybrid `score` weights partial credit at 0.5.
- **Reproducible methodology**: every run stores raw responses and full judge transcripts; fixed seed and temperature 0. Note: exact numbers are not bit-reproducible (provider routing, model aliases drift, e.g. a model was retired mid-study), but the pipeline and inputs are.
- **Benchmark audit**: the disagreement pipeline surfaces reference-quality issues in the benchmarks themselves. The adjudicated sample (n=52, in `eval/spotcheck/`) is the queue of cases where the scoring signals disagreed, so it over-samples problems by construction and yields no unbiased error rate for the benchmark as a whole. It found the judge right in 38 of 52 and surfaced concrete reference defects (see below). A uniform random audit, which is what an error rate would require, has not been run. Proposed fixes are additive (accept synonyms / multiple senses), never cultural corrections.
- **Infra failures are excluded, and the exclusion does not flatter our own conclusion**: generation timeouts are dropped from the denominator of all three rates (`nValid`/`nExcluded` in every run.json), because counting a pod timeout as a wrong answer penalizes the model for the infrastructure. This matters most for LatamGPT, the model this study is most critical of, which lost 79 of 500 CHOCLO items to its self-hosted pod. Those excluded items were marginally **easier** than the ones it kept (peer correct-rate 0.360 vs 0.343), so the policy slightly helps its score: counting them as wrong would drop LatamGPT from 23.5% to 19.8% on CHOCLO. The exclusion rule works against the paper's own claim, not for it.
- **Threats to validity**: serving conditions, prompt-confounded abstention, single-reference judging, and reference quality are documented limitations under active mitigation. Two are worth naming up front: the judge's reference-fidelity set (200 items) is drawn from the same 500 items it is then applied to, so that TPR/TNR figure is in-sample; and the benchmarks are public HuggingFace datasets with no contamination analysis, which matters because CENIA authored both Trueque and the model under test.

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
