# eval/

Evaluation harness for LatamBench.

## Overview

The evaluation pipeline runs benchmark samples against LLM APIs and scores outputs using a combination of:

- **Automatic metrics**: pass@k (Latam-Code), ROUGE/BERTScore (Latam-Gen), exact match (Latam-Reason, Latam-IF)
- **Human evaluation**: Latam-Cultura and edge cases flagged by automatic evaluation

## Planned Stack

- Python 3.11+
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) as base
- OpenAI, Anthropic, Google, and HuggingFace APIs
- Results stored as JSONL in `results/`

## Status

Not yet implemented. Will be built after pilot annotation phase (Phase 1).

## Contributing

If you want to contribute to the eval harness, open an issue describing what you want to build.
