/**
 * Model registry. Model ids use provider prefixes:
 *   gateway:anthropic/claude-haiku-4.5    - Vercel AI Gateway (AI_GATEWAY_API_KEY): one key for
 *                                           anthropic/openai/meta/etc. Preferred for official runs.
 *   anthropic:claude-haiku-4-5-20251001   - Anthropic API (ANTHROPIC_API_KEY)
 *   openai:gpt-5                          - OpenAI API (OPENAI_API_KEY)
 *   compat:<baseURL>|<model>              - any OpenAI-compatible endpoint (vLLM/llama.cpp serving LatamGPT)
 *   claude-cli[:model]                    - local `claude -p` fallback. Smoke tests ONLY: uses the
 *                                           interactive subscription, no temperature control, not reproducible.
 *   dry                                   - no model call; echoes a placeholder (pipeline test)
 *
 * Official leaderboard runs require API providers (fixed temperature, recorded params).
 */
import { generateText } from "ai";

const SYSTEM_PROMPT =
  "Responde la pregunta de forma breve y factual, en el mismo idioma de la pregunta. " +
  "Si no conoces la respuesta con seguridad, dilo explicitamente en lugar de inventar.";

export interface ModelConfig {
  id: string;
  /** Marked true for providers that must not appear on the official leaderboard. */
  smokeOnly: boolean;
}

export function parseModel(id: string): ModelConfig {
  return { id, smokeOnly: id === "dry" || id.startsWith("claude-cli") };
}

export async function generate(modelId: string, question: string): Promise<string> {
  if (modelId === "dry") {
    return "(dry-run) sin llamada a modelo";
  }

  if (modelId.startsWith("claude-cli")) {
    const [, model = "haiku"] = modelId.split(":");
    const proc = Bun.spawn(
      ["claude", "-p", question, "--model", model, "--setting-sources", "", "--append-system-prompt", SYSTEM_PROMPT],
      { stdout: "pipe", stderr: "pipe" },
    );
    const out = await new Response(proc.stdout).text();
    const code = await proc.exited;
    if (code !== 0) {
      const err = await new Response(proc.stderr).text();
      throw new Error(`claude-cli exited ${code}: ${err.slice(0, 200)}`);
    }
    return out.trim();
  }

  const model = await resolveSdkModel(modelId);
  const { withRetry } = await import("./retry");
  const { text } = await withRetry(
    () =>
      generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: question,
        temperature: 0,
        abortSignal: AbortSignal.timeout(120_000),
      }),
    "generate",
  );
  return text.trim();
}

async function resolveSdkModel(modelId: string) {
  const [provider, ...rest] = modelId.split(":");
  const spec = rest.join(":");
  switch (provider) {
    case "gateway": {
      if (!process.env.AI_GATEWAY_API_KEY) {
        throw new Error("gateway: models need AI_GATEWAY_API_KEY (vercel.com dashboard > AI Gateway > API keys)");
      }
      // AI SDK 5 resolves plain-string ids ("anthropic/claude-haiku-4.5") through the Vercel AI Gateway.
      return spec;
    }
    case "anthropic": {
      const { anthropic } = await import("@ai-sdk/anthropic");
      return anthropic(spec);
    }
    case "openai": {
      const { openai } = await import("@ai-sdk/openai");
      return openai(spec);
    }
    case "compat": {
      const [baseURL, model] = spec.split("|");
      if (!baseURL || !model) throw new Error("compat model format: compat:<baseURL>|<model>");
      const { createOpenAI } = await import("@ai-sdk/openai");
      const compat = createOpenAI({ baseURL, apiKey: process.env.COMPAT_API_KEY ?? "none" });
      return compat(model);
    }
    default:
      throw new Error(`Unknown provider: ${provider} (use anthropic:, openai:, compat:, claude-cli, dry)`);
  }
}
