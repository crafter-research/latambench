# LatamBench Eval Harness

Independent LLM evals for Latin America. Runs existing LATAM cultural benchmarks (Trueque, CHOCLO) plus a general-capability control against frontier and regional models (LatamGPT, Salamandra, PatagonIA).

> 2026-06 refocus: LatamBench is now an **evals observatory** first (run independent numbers nobody else publishes), original dataset contribution as a later phase. The old Python/lm-evaluation-harness plan is superseded by this Bun + AI SDK harness.

## Status: V1 (harness runs)

```bash
bun install
bun src/cli.ts run --model <id> --benchmark trueque --sample 20 --seed 42
```

Model ids:

| Prefix | Example | Notes |
|--------|---------|-------|
| `anthropic:` | `anthropic:claude-haiku-4-5-20251001` | needs `ANTHROPIC_API_KEY` |
| `openai:` | `openai:gpt-5` | needs `OPENAI_API_KEY` |
| `compat:` | `compat:http://localhost:8000/v1\|latamgpt` | any OpenAI-compatible endpoint (vLLM / llama.cpp) - how LatamGPT runs |
| `claude-cli` | `claude-cli:haiku` | smoke tests only, never leaderboard |
| `dry` | `dry` | pipeline test, no model call |

Output per run: `runs/<run-id>/run.json` (metadata: model, seed, sample, score) + `responses.jsonl` (every generation, replicable).

## Scoring

V1 reports **token-F1 only** (lexical, SQuAD-style adapted for ES/PT). Known limitation, verified on first smoke run: semantically correct but verbose answers under-score. V2 adds the hybrid protocol - token-F1 + embedding similarity + reference-anchored LLM judge calibrated on a synthetic set (TPR/TNR ≥ 0.95 reported before use), with disagreements queued for human spot-check. Judge transcripts are committed.

## Roadmap (slices)

| Slice | Demo |
|-------|------|
| V1 ✅ | `bench run` over Trueque sample, lexical score |
| V2 | `bench calibrate-judge` + hybrid scoring |
| V3 | Multi-model comparison table + spot-check queue |
| V4 | LatamGPT via `compat:` endpoint - launch numbers |
| V5 | Leaderboard live on latambench.org |
| V6 | `bench post-draft` |

## Contributing

If you want to contribute to the eval harness, open an issue describing what you want to build.
