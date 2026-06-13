# data/

Annotated benchmark datasets for LatamBench.

## Structure

```
data/
├── latam-code/      # Code generation (Phase 1 - active)
├── latam-gen/       # Open text generation
├── latam-reason/    # Logical reasoning
├── latam-cultura/   # Cultural knowledge
└── latam-if/        # Instruction following
```

## Sample Format

Each sample is a JSONL file with the following schema:

```jsonc
{
  "id": "COD-PE-001",
  "category": "latam-code",
  "variety": "PE",           // PE | MX | AR | CO | CL
  "language": "es",
  "instruction": "Escribe una función en Python que...",
  "reference": "def ...",    // gold reference (if applicable)
  "annotator": "anon-001",
  "difficulty": "medium",    // easy | medium | hard
  "tags": ["algoritmos", "listas"],
  "created_at": "2026-03-06"
}
```

## Status

| Category | Samples | Status |
|----------|---------|--------|
| Latam-Code | 0/200 | Phase 1 - recruiting annotators |
| Latam-Gen | 0/200 | Pending |
| Latam-Reason | 0/200 | Pending |
| Latam-Cultura | 0/200 | Pending |
| Latam-IF | 0/100 | Pending |

See [annotation guidelines](../docs/guidelines/) before contributing samples.
