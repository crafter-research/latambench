/** Prompt ablation for abstention (bullet #4). The official run uses a system prompt
 *  that EXPLICITLY tells models to abstain ("si no conoces la respuesta con seguridad,
 *  dilo"). That confounds abstention with instruction-following. Here we re-run a CHOCLO
 *  subsample with a NEUTRAL prompt (no abstain instruction) on 3 models with extreme
 *  behavior, then classify abstention. If the pattern holds, abstention is intrinsic. */
import { writeFileSync } from "node:fs";
import { classifyAbstention } from "../src/abstention";
import { loadBenchmark, stratifiedSample } from "../src/datasets";

const NEUTRAL = "Responde la pregunta en el mismo idioma de la pregunta.";
const MODELS = ["anthropic/claude-opus-4.8", "openai/gpt-5.4-mini", "google/gemini-3.5-flash"];
const N = 60, SEED = 42;

async function gen(model: string, q: string): Promise<string> {
  const r = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`, "Content-Type": "application/json", Connection: "close" },
    body: JSON.stringify({ model, messages: [{ role: "system", content: NEUTRAL }, { role: "user", content: q }], temperature: 0 }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!r.ok) throw new Error(`gen ${r.status}`);
  const d = (await r.json()) as { choices: { message: { content: string } }[] };
  return d.choices[0]?.message?.content ?? "";
}

const items = stratifiedSample(await loadBenchmark("choclo"), N, SEED);
const results: Record<string, { abstain: number; n: number }> = {};
for (const m of MODELS) {
  let abstain = 0, n = 0, cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const it = items[cursor++]!;
      try {
        const resp = await gen(m, it.question);
        if (await classifyAbstention(it.question, resp)) abstain++;
        n++;
      } catch { /* skip */ }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  results[m] = { abstain, n };
  console.log(`${m}: abstain ${abstain}/${n} = ${(abstain / n * 100).toFixed(1)}% (prompt NEUTRAL)`);
}
writeFileSync(new URL("../validation/ablation-neutral.json", import.meta.url).pathname, JSON.stringify(results, null, 2));
console.log("ABLATION DONE");
