/**
 * Reference-anchored judge (V2). Narrow task: does the candidate answer express
 * the facts of the reference answer? The judge model is OUTSIDE the compared set
 * (default: xai/grok-4.3) so no model judges itself.
 * Every call returns a transcript line for judgments.jsonl (committed, auditable).
 */
import { withRetry } from "./retry";

export const DEFAULT_JUDGE = "xai/grok-4.3";

async function chatRaw(model: string, system: string, user: string): Promise<string> {
  const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
      "Content-Type": "application/json",
      // no socket reuse: Bun's pooled keepalive sockets wedge after ~300 calls
      Connection: "close",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) throw new Error(`judge http ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? "";
}

export type Verdict = "correct" | "partial" | "incorrect";

export interface Judgment {
  verdict: Verdict;
  key_fact_match: boolean;
  rationale: string;
}

const JUDGE_SYSTEM = `Eres un evaluador estricto de respuestas factuales sobre cultura latinoamericana.
Recibes una PREGUNTA, una RESPUESTA DE REFERENCIA (verdad anclada, basada en evidencia) y una RESPUESTA CANDIDATA.
Tu unica tarea: decidir si la candidata expresa los hechos de la referencia.

Reglas:
- "correct": la candidata expresa los hechos clave de la referencia. El formato, la longitud, el estilo y los detalles extra correctos NO importan.
- "partial": acierta una parte sustantiva de los hechos clave pero omite o contradice otra parte.
- "incorrect": contradice la referencia, responde otra cosa, inventa hechos centrales distintos, o declara no saber.
- Juzga SOLO contra la referencia. No uses tu propio conocimiento para "corregir" la referencia.
- key_fact_match: true si el hecho central (la entidad/definicion/dato principal) coincide.

Responde SOLO con JSON valido, sin markdown:
{"verdict":"correct|partial|incorrect","key_fact_match":true,"rationale":"una sola frase"}`;

export async function judge(
  judgeModel: string,
  question: string,
  reference: string,
  candidate: string,
): Promise<Judgment> {
  const prompt = `PREGUNTA: ${question}\n\nRESPUESTA DE REFERENCIA: ${reference}\n\nRESPUESTA CANDIDATA: ${candidate}`;
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    // Raw fetch instead of the AI SDK: abort signals reliably fire on Bun's
    // native fetch, while zombie requests through the gateway provider hang
    // past their AbortSignal (observed: workers wedged >1h at 0% CPU).
    const text = await withRetry(
      () =>
        chatRaw(
          judgeModel,
          JUDGE_SYSTEM,
          attempt === 0 ? prompt : `${prompt}\n\n(Tu respuesta anterior no fue JSON valido: ${lastError}. Responde SOLO el objeto JSON.)`,
        ),
      "judge",
    );
    const parsed = tryParse(text);
    if (parsed) return parsed;
    lastError = text.slice(0, 100);
  }
  throw new Error(`judge returned unparseable output: ${lastError}`);
}

function tryParse(text: string): Judgment | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]) as Partial<Judgment>;
    if (obj.verdict !== "correct" && obj.verdict !== "partial" && obj.verdict !== "incorrect") return null;
    return {
      verdict: obj.verdict,
      key_fact_match: Boolean(obj.key_fact_match),
      rationale: String(obj.rationale ?? ""),
    };
  } catch {
    return null;
  }
}

export function judgeScore(verdict: Verdict): number {
  return verdict === "correct" ? 1 : verdict === "partial" ? 0.5 : 0;
}
