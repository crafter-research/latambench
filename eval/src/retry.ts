/** Retry transient gateway failures (timeouts, 5xx). Param errors fail fast. */
export async function withRetry<T>(fn: () => Promise<T>, label: string, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const msg = String(e instanceof Error ? e.message : e);
      const transient = /timed out|timeout|aborted|50[0-39]|overloaded|rate limit|ECONNRESET|fetch failed/i.test(msg);
      if (!transient || i === attempts - 1) throw e;
      const delay = 2000 * 2 ** i;
      console.warn(`  retry ${i + 1}/${attempts - 1} for ${label} in ${delay}ms: ${msg.slice(0, 80)}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}
