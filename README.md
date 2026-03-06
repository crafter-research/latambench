# LatamBench

**The first generation-first benchmark for evaluating LLMs on authentic Latin American Spanish.**

Built by [Crafter Research](https://github.com/crafter-research) — a research lab of [Crafter Station](https://crafterstation.com).

[![Website](https://img.shields.io/badge/web-latambench.org-white?style=flat-square&labelColor=080808)](https://latambench.org)
[![License](https://img.shields.io/badge/license-MIT-white?style=flat-square&labelColor=080808)](LICENSE)
[![Status](https://img.shields.io/badge/status-pilot%20phase-F8BB2D?style=flat-square&labelColor=080808)](https://latambench.org#roadmap)

---

## Why LatamBench?

Current benchmarks (MMLU, HumanEval, GSM8K) are built in English and reflect a single cultural standard. Translations lose context, idioms, and the technical reality of Latin American developers who code in Spanish but document in Spanglish.

LatamBench is not a translation. It is an instrument built from the inside — by and for the Latin American technical community.

## Benchmark Categories

| ID | Category | Description | Target |
|----|----------|-------------|--------|
| GEN | Latam-Gen | Open-ended text generation with regional variety instructions | 200 |
| RSN | Latam-Reason | Logical and mathematical reasoning in Latin American Spanish | 200 |
| COD | Latam-Code | Code generation with technical specs in Spanish *(Phase 1)* | 200 |
| CUL | Latam-Cultura | Cultural, historical, and geopolitical knowledge of Latin America | 200 |
| IF | Latam-IF | Instruction following with complex constraints in Spanish | 100 |

**Total target**: 900 samples across 5 regional varieties: PE · MX · AR · CO · CL

## Repository Structure

```
latambench/
├── web/              # Landing page (Astro + Tailwind)
├── data/             # Annotated benchmark datasets
│   ├── latam-code/   # Phase 1 pilot samples
│   ├── latam-gen/
│   ├── latam-reason/
│   ├── latam-cultura/
│   └── latam-if/
├── eval/             # Evaluation harness
│   └── README.md
└── docs/
    └── guidelines/   # Annotation guidelines per category
```

## Current Status

**Phase 1 — Pilot** (active)

- [ ] Recruit 5 pilot annotators (1 per variety: PE, MX, AR, CO, CL)
- [ ] Annotate 50 Latam-Code pilot samples (~10 per annotator)
- [ ] Evaluate 5 baseline models on pilot samples
- [ ] Publish preliminary preprint

See the full [roadmap](https://latambench.org#roadmap).

## Contributing

We are looking for **5 pilot annotators** — one per regional variety.

**Requirements:**
- Native Latin American Spanish speaker (any variety)
- Technical background: developer, data scientist, or engineering student
- ~10 samples/week availability
- Genuine interest in NLP and LLM evaluation

All annotators receive authorship credit in the preprint.

**How to apply:** [Open a GitHub Issue](https://github.com/crafter-research/latambench/issues) with your variety, background, and availability.

## Development

```bash
# Landing page
cd web && bun install && bun dev

# Regenerate brand assets
cd web && bun run scripts/generate-assets.ts
```

## License

MIT © [Crafter Research](https://github.com/crafter-research)
