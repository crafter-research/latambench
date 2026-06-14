/**
 * Reference-FIDELITY check without human labels (V2). NOTE ON WHAT THIS MEASURES:
 * the synthetic set is anchored to the references, so high TPR/TNR proves the judge
 * faithfully reproduces reference-anchored verdicts. It does NOT prove the references
 * are correct (reference quality is a separate axis; see the random reference audit
 * and the human validation against ground truth). Builds verdicts known BY CONSTRUCTION:
 *   exact       reference itself as candidate            -> correct
 *   paraphrase  reference rewritten, same facts          -> correct
 *   swap        reference from another item, same country -> incorrect
 *   corrupt     reference with the key fact altered       -> incorrect
 * Reports TPR (correct types) and TNR (incorrect types). Gate: both >= 0.95.
 * "partial" counts as a miss in both directions (strict).
 */
import { generateText } from "ai";
import type { BenchItem } from "./datasets";
import { judge, type Verdict } from "./judge";
import { withRetry } from "./retry";

const REWRITE_MODEL = "google/gemini-3-flash";

export interface CalibCase {
  type: "exact" | "paraphrase" | "swap" | "corrupt";
  expected: "correct" | "incorrect";
  itemId: string;
  question: string;
  reference: string;
  candidate: string;
  verdict?: Verdict;
  pass?: boolean;
}

function pick(items: BenchItem[], n: number, offset = 0): BenchItem[] {
  const step = Math.floor(items.length / n);
  return Array.from({ length: n }, (_, i) => items[(i * step + offset) % items.length]!);
}

async function rewrite(instruction: string, reference: string): Promise<string> {
  const { text } = await withRetry(
    () =>
      generateText({
        model: REWRITE_MODEL,
        system: instruction,
        prompt: reference,
        temperature: 0.3,
        abortSignal: AbortSignal.timeout(120_000),
      }),
    "rewrite",
  );
  return text.trim();
}

export async function buildCalibrationSet(items: BenchItem[], perType: number): Promise<CalibCase[]> {
  const cases: CalibCase[] = [];

  for (const item of pick(items, perType, 0)) {
    cases.push({ type: "exact", expected: "correct", itemId: item.id, question: item.question, reference: item.reference, candidate: item.reference });
  }

  for (const item of pick(items, perType, 1)) {
    const candidate = await rewrite(
      "Parafrasea el texto manteniendo TODOS los hechos exactos (entidades, fechas, lugares, datos). Cambia palabras y estructura. Devuelve solo el texto parafraseado.",
      item.reference,
    );
    cases.push({ type: "paraphrase", expected: "correct", itemId: item.id, question: item.question, reference: item.reference, candidate });
  }

  const byCountry = new Map<string, BenchItem[]>();
  for (const i of items) {
    const g = byCountry.get(i.country) ?? [];
    g.push(i);
    byCountry.set(i.country, g);
  }
  for (const item of pick(items, perType, 2)) {
    const peers = (byCountry.get(item.country) ?? []).filter((p) => p.id !== item.id);
    const donor = peers.length > 0 ? peers[item.id.length % peers.length]! : items.find((p) => p.id !== item.id)!;
    cases.push({ type: "swap", expected: "incorrect", itemId: item.id, question: item.question, reference: item.reference, candidate: donor.reference });
  }

  for (const item of pick(items, perType, 3)) {
    const candidate = await rewrite(
      "Reescribe el texto alterando el hecho factual CENTRAL (cambia la entidad, lugar, fecha o dato principal por otro plausible pero FALSO). Manten el estilo y la longitud. Devuelve solo el texto reescrito.",
      item.reference,
    );
    cases.push({ type: "corrupt", expected: "incorrect", itemId: item.id, question: item.question, reference: item.reference, candidate });
  }

  return cases;
}

export async function runCalibration(judgeModel: string, cases: CalibCase[], concurrency = 8) {
  let cursor = 0;
  let done = 0;
  async function worker() {
    while (cursor < cases.length) {
      const c = cases[cursor++]!;
      const j = await judge(judgeModel, c.question, c.reference, c.candidate);
      c.verdict = j.verdict;
      c.pass = c.expected === "correct" ? j.verdict === "correct" : j.verdict === "incorrect";
      done++;
      if (done % 20 === 0) console.log(`  calibration ${done}/${cases.length}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));

  const byType = new Map<string, { pass: number; total: number }>();
  for (const c of cases) {
    const t = byType.get(c.type) ?? { pass: 0, total: 0 };
    t.total++;
    if (c.pass) t.pass++;
    byType.set(c.type, t);
  }
  const positives = cases.filter((c) => c.expected === "correct");
  const negatives = cases.filter((c) => c.expected === "incorrect");
  const tpr = positives.filter((c) => c.pass).length / positives.length;
  const tnr = negatives.filter((c) => c.pass).length / negatives.length;
  return { tpr, tnr, byType: Object.fromEntries([...byType].map(([k, v]) => [k, v.pass / v.total])), cases };
}
