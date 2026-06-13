/** Inter-rater reliability: judge the 100 validation cases with 2 extra judges
 *  (outside the compared families) and compare to grok-4.3. Outputs verdicts to
 *  validation/multijudge-<model>.jsonl. Kappa computed by stats step.
 *  Judges: moonshotai/kimi-k2.6, zai/glm-5.1 (both outside anthropic/google/openai/
 *  deepseek/alibaba/meta — so no family judges its own). */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { judge } from "../src/judge";

const CASES = new URL("../validation/cases.json", import.meta.url).pathname;
const OUT = (m: string) => new URL(`../validation/mj-${m.replace(/[^a-z0-9]/gi, "_")}.jsonl`, import.meta.url).pathname;
const JUDGES = ["moonshotai/kimi-k2.6", "zai/glm-5.1"];

const cases = JSON.parse(readFileSync(CASES, "utf8")) as { uid: string; question: string; reference: string; response: string }[];

for (const jm of JUDGES) {
  const out = OUT(jm);
  const done = new Set<string>();
  if (existsSync(out)) for (const l of readFileSync(out, "utf8").trim().split("\n")) if (l) done.add(JSON.parse(l).uid);
  const pending = cases.filter((c) => !done.has(c.uid));
  console.log(`${jm}: ${pending.length} pendientes`);
  let cursor = 0;
  async function worker() {
    while (cursor < pending.length) {
      const c = pending[cursor++]!;
      try {
        const v = await judge(jm, c.question, c.reference, c.response);
        appendFileSync(out, `${JSON.stringify({ uid: c.uid, verdict: v.verdict })}\n`);
      } catch (e) {
        appendFileSync(out, `${JSON.stringify({ uid: c.uid, verdict: "error", err: String(e).slice(0, 80) })}\n`);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  console.log(`${jm}: done`);
}
console.log("MULTIJUDGE DONE");
