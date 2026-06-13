/**
 * V1 scoring: token-level F1 (SQuAD-style) adapted for Spanish/Portuguese.
 * This is the lexical signal only. V2 adds embedding similarity + calibrated
 * reference-anchored judge (see spike: hybrid scoring, disagreement → spot-check).
 */

const ARTICLES = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "lo",
  "o", "a", "os", "as", "um", "uma", "uns", "umas",
  "de", "del", "da", "do", "y", "e", "en", "em", "que",
]);

export function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !ARTICLES.has(t));
}

export function tokenF1(prediction: string, reference: string): number {
  const pred = normalize(prediction);
  const ref = normalize(reference);
  if (pred.length === 0 || ref.length === 0) return 0;
  const refCounts = new Map<string, number>();
  for (const t of ref) refCounts.set(t, (refCounts.get(t) ?? 0) + 1);
  let overlap = 0;
  for (const t of pred) {
    const c = refCounts.get(t) ?? 0;
    if (c > 0) {
      overlap++;
      refCounts.set(t, c - 1);
    }
  }
  if (overlap === 0) return 0;
  const precision = overlap / pred.length;
  const recall = overlap / ref.length;
  return (2 * precision * recall) / (precision + recall);
}
