/**
 * Embedding similarity via the gateway's OpenAI-compatible /v1/embeddings.
 * File-cached by text hash: references repeat across runs, responses don't.
 */
const EMB_MODEL = "openai/text-embedding-3-small";
const EMB_URL = "https://ai-gateway.vercel.sh/v1/embeddings";
const CACHE_PATH = new URL("../datasets/cache/embeddings.json", import.meta.url).pathname;

let cache: Record<string, number[]> | null = null;

async function loadCache(): Promise<Record<string, number[]>> {
  if (cache) return cache;
  const f = Bun.file(CACHE_PATH);
  cache = (await f.exists()) ? ((await f.json()) as Record<string, number[]>) : {};
  return cache;
}

export async function flushEmbeddingCache() {
  if (cache) await Bun.write(CACHE_PATH, JSON.stringify(cache));
}

function key(text: string): string {
  return new Bun.CryptoHasher("sha256").update(text).digest("hex").slice(0, 24);
}

export async function embedAll(rawTexts: string[]): Promise<number[][]> {
  const c = await loadCache();
  // the embeddings API rejects empty strings; placeholder keeps indices aligned
  const texts = rawTexts.map((t) => (t.trim().length > 0 ? t : "(vacio)"));
  const missing = [...new Set(texts.filter((t) => !c[key(t)]))];
  const BATCH = 64;
  const { withRetry } = await import("./retry");
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const data = await withRetry(async () => {
      const res = await fetch(EMB_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
          "Content-Type": "application/json",
          Connection: "close",
        },
        body: JSON.stringify({ model: EMB_MODEL, input: batch }),
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) throw new Error(`embeddings ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return (await res.json()) as { data: { index: number; embedding: number[] }[] };
    }, "embeddings");
    for (const d of data.data) c[key(batch[d.index]!)] = d.embedding;
  }
  return texts.map((t) => c[key(t)]!);
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
