/**
 * bench - LatamBench eval harness CLI.
 *
 *   bun src/cli.ts run --model <id> --benchmark trueque [--sample N] [--seed 42]
 *
 * Output: runs/<run-id>/run.json + responses.jsonl, per-item progress, mean token-F1.
 */
import { parseArgs } from "node:util";
import { loadBenchmark, stratifiedSample } from "./datasets";
import { DEFAULT_JUDGE } from "./judge";
import { generate, parseModel } from "./models";
import { tokenF1 } from "./scoring";

const RUNS_DIR = new URL("../runs/", import.meta.url).pathname;

async function cmdRun(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      model: { type: "string" },
      benchmark: { type: "string", default: "trueque" },
      sample: { type: "string" },
      seed: { type: "string", default: "42" },
    },
  });
  if (!values.model) {
    console.error("Usage: bench run --model <id> --benchmark trueque [--sample N] [--seed 42]");
    process.exit(1);
  }
  const model = parseModel(values.model);
  const seed = Number(values.seed);
  const all = await loadBenchmark(values.benchmark!);
  const items = values.sample ? stratifiedSample(all, Number(values.sample), seed) : all;

  const runId = `${new Date().toISOString().slice(0, 19).replaceAll(":", "")}-${model.id.replace(/[^a-z0-9.-]+/gi, "_")}`;
  const runDir = `${RUNS_DIR}${runId}/`;
  const responsesPath = `${runDir}responses.jsonl`;

  console.log(`run ${runId}`);
  console.log(`benchmark=${values.benchmark} items=${items.length}/${all.length} seed=${seed} model=${model.id}${model.smokeOnly ? " [SMOKE ONLY - not leaderboard-eligible]" : ""}\n`);

  const CONCURRENCY = 8;
  const results: { f1: number; line: string }[] = new Array(items.length);
  let done = 0;
  let failed = 0;
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      const item = items[i]!;
      let response = "";
      let error: string | undefined;
      try {
        response = await generate(model.id, item.question);
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
        failed++;
      }
      const f1 = error ? 0 : tokenF1(response, item.reference);
      results[i] = {
        f1,
        line: JSON.stringify({ id: item.id, country: item.country, question: item.question, reference: item.reference, response, f1, error }),
      };
      done++;
      console.log(`[${String(done).padStart(3)}/${items.length}] f1=${f1.toFixed(3)} ${item.country.padEnd(12)} ${item.question.slice(0, 64)}${error ? ` ERROR: ${error.slice(0, 60)}` : ""}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
  const lines = results.map((r) => r.line);
  const sumF1 = results.reduce((acc, r) => acc + r.f1, 0);

  const meanF1 = sumF1 / items.length;
  const runMeta = {
    runId,
    benchmark: values.benchmark,
    model: model.id,
    smokeOnly: model.smokeOnly,
    seed,
    nItems: items.length,
    nTotal: all.length,
    failed,
    meanTokenF1: Number(meanF1.toFixed(4)),
    scoring: "token-f1-v1 (lexical only - hybrid judge lands in V2)",
    createdAt: new Date().toISOString(),
  };
  await Bun.write(responsesPath, `${lines.join("\n")}\n`);
  await Bun.write(`${runDir}run.json`, JSON.stringify(runMeta, null, 2));

  console.log(`\nmean token-F1: ${meanF1.toFixed(4)} (${items.length} items, ${failed} errors)`);
  console.log(`saved: runs/${runId}/`);
}

async function cmdCalibrateJudge(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      judge: { type: "string", default: DEFAULT_JUDGE },
      "per-type": { type: "string", default: "50" },
    },
  });
  const { buildCalibrationSet, runCalibration } = await import("./calibrate");
  const items = await loadBenchmark("trueque");
  const perType = Number(values["per-type"]);
  console.log(`building synthetic set: 4 types x ${perType} cases (rewrites via gemini-3-flash)...`);
  const cases = await buildCalibrationSet(items, perType);
  console.log(`judging ${cases.length} cases with ${values.judge}...`);
  const result = await runCalibration(values.judge!, cases);
  const version = `judge-v1-${values.judge!.replace(/[^a-z0-9.-]+/gi, "_")}`;
  const out = {
    version,
    judge: values.judge,
    perType,
    tpr: Number(result.tpr.toFixed(4)),
    tnr: Number(result.tnr.toFixed(4)),
    byType: result.byType,
    gate: result.tpr >= 0.95 && result.tnr >= 0.95 ? "PASS" : "FAIL",
    createdAt: new Date().toISOString(),
    cases: result.cases,
  };
  await Bun.write(new URL(`../calibration/${version}.json`, import.meta.url).pathname, JSON.stringify(out, null, 2));
  console.log(`\nTPR (exact+paraphrase -> correct): ${out.tpr}`);
  console.log(`TNR (swap+corrupt -> incorrect):   ${out.tnr}`);
  console.log(`by type: ${JSON.stringify(out.byType)}`);
  console.log(`gate (>=0.95 both): ${out.gate}`);
  console.log(`saved: calibration/${version}.json`);
}

async function cmdRescore(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      judge: { type: "string", default: DEFAULT_JUDGE },
      glob: { type: "string", default: "*gateway*" },
    },
  });
  const { judge: judgeFn, judgeScore } = await import("./judge");
  const { embedAll, cosine, flushEmbeddingCache } = await import("./embeddings");
  const { Glob } = await import("bun");

  const runDirs: string[] = [];
  for await (const dir of new Glob(values.glob!).scan({ cwd: RUNS_DIR, onlyFiles: false })) runDirs.push(dir);
  runDirs.sort();
  console.log(`rescoring ${runDirs.length} runs with judge=${values.judge}\n`);

  for (const dir of runDirs) {
    const runPath = `${RUNS_DIR}${dir}/`;
    const metaFile = Bun.file(`${runPath}run.json`);
    if (!(await metaFile.exists())) continue;
    const meta = (await metaFile.json()) as Record<string, unknown>;
    const rows = (await Bun.file(`${runPath}responses.jsonl`).text())
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l) as { id: string; question: string; reference: string; response: string; f1: number });

    const embeddings = await embedAll(rows.flatMap((r) => [r.response, r.reference]));

    // resumable: load prior judgments (partial.jsonl), skip already-judged ids
    const { appendFileSync } = await import("node:fs");
    const partialPath = `${runPath}judgments.partial.jsonl`;
    const judged = new Map<string, { id: string; embSim: number; verdict: "correct" | "partial" | "incorrect" | "excluded"; key_fact_match: boolean; rationale: string }>();
    if (await Bun.file(partialPath).exists()) {
      for (const line of (await Bun.file(partialPath).text()).trim().split("\n")) {
        if (!line) continue;
        const j = JSON.parse(line);
        judged.set(j.id, j);
      }
    }
    const pending = rows.map((r, i) => ({ r, i })).filter(({ r }) => !judged.has(r.id));
    if (judged.size > 0) console.log(`  resume: ${judged.size}/${rows.length} ya juzgados`);

    let cursor = 0;
    const disagreements: string[] = [];
    async function worker() {
      while (cursor < pending.length) {
        const { r, i } = pending[cursor++]!;
        const empty = !r.response || r.response.trim().length === 0;
        const embSim = empty ? 0 : cosine(embeddings[i * 2]!, embeddings[i * 2 + 1]!);
        // infra errors (timeouts, connection drops) are EXCLUDED from the denominator,
        // not scored as incorrect: a dead pod is not model ignorance
        const j = empty
          ? { verdict: "excluded" as const, key_fact_match: false, rationale: "error de generacion (infra) - excluido del denominador" }
          : await judgeFn(values.judge!, r.question, r.reference, r.response);
        const disagree =
          (j.verdict === "correct" && r.f1 < 0.15 && embSim < 0.6) ||
          (j.verdict === "incorrect" && (r.f1 > 0.5 || embSim > 0.85));
        if (disagree) disagreements.push(JSON.stringify({ run: dir, ...r, embSim: Number(embSim.toFixed(3)), judgment: j }));
        const record = { id: r.id, embSim: Number(embSim.toFixed(4)), ...j };
        judged.set(r.id, record);
        appendFileSync(partialPath, `${JSON.stringify(record)}\n`);
        if (judged.size % 50 === 0) console.log(`  judged ${judged.size}/${rows.length}`);
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker));

    const all = rows.map((r) => judged.get(r.id)!);
    const valid = all.filter((j) => j.verdict !== "excluded");
    const n = valid.length || 1;
    const correct = valid.filter((j) => j.verdict === "correct").length;
    const partial = valid.filter((j) => j.verdict === "partial").length;
    const sumJudge = valid.reduce((a, j) => a + judgeScore(j.verdict as "correct" | "partial" | "incorrect"), 0);
    const sumEmb = valid.reduce((a, j) => a + j.embSim, 0);
    meta.judgeModel = values.judge;
    meta.nExcluded = all.length - valid.length;
    meta.nValid = valid.length;
    meta.judgeAccuracy = Number((correct / n).toFixed(4));
    meta.judgePartialRate = Number((partial / n).toFixed(4));
    meta.judgeMeanScore = Number((sumJudge / n).toFixed(4));
    meta.meanEmbSim = Number((sumEmb / n).toFixed(4));
    await Bun.write(`${runPath}judgments.jsonl`, `${all.map((j) => JSON.stringify(j)).join("\n")}\n`);
    await Bun.write(`${runPath}run.json`, JSON.stringify(meta, null, 2));
    if (disagreements.length > 0) {
      const queuePath = new URL("../spotcheck/queue.jsonl", import.meta.url).pathname;
      const existing = (await Bun.file(queuePath).exists()) ? await Bun.file(queuePath).text() : "";
      await Bun.write(queuePath, `${existing}${disagreements.join("\n")}\n`);
    }
    console.log(
      `${String(meta.model).padEnd(40)} judge=${meta.judgeAccuracy} (partial=${meta.judgePartialRate}) embSim=${meta.meanEmbSim} f1=${meta.meanTokenF1} disagreements=${disagreements.length}`,
    );
  }
  await flushEmbeddingCache();
}

async function cmdAbstention(args: string[]) {
  const { values } = parseArgs({ args, options: { glob: { type: "string", default: "*gateway*" } } });
  const { classifyAbstention } = await import("./abstention");
  const { Glob } = await import("bun");
  const dirs: string[] = [];
  for await (const dir of new Glob(values.glob!).scan({ cwd: RUNS_DIR, onlyFiles: false })) dirs.push(dir);
  dirs.sort();
  for (const dir of dirs) {
    const runPath = `${RUNS_DIR}${dir}/`;
    if (!(await Bun.file(`${runPath}run.json`).exists())) continue;
    const meta = (await Bun.file(`${runPath}run.json`).json()) as Record<string, unknown>;
    const rows = (await Bun.file(`${runPath}responses.jsonl`).text()).trim().split("\n").map((l) => JSON.parse(l) as { id: string; question: string; response: string });

    // infra-excluded ids (timeouts, empty responses): a dead pod is not a model
    // abstaining. Read the verdicts and drop excluded ids from the abstention universe.
    const excluded = new Set<string>();
    const verdictById = new Map<string, string>();
    if (await Bun.file(`${runPath}judgments.jsonl`).exists()) {
      for (const l of (await Bun.file(`${runPath}judgments.jsonl`).text()).trim().split("\n")) {
        if (!l) continue;
        const j = JSON.parse(l) as { id: string; verdict: string };
        verdictById.set(j.id, j.verdict);
        if (j.verdict === "excluded") excluded.add(j.id);
      }
    }
    const valid = rows.filter((r) => !excluded.has(r.id) && (r.response ?? "").trim().length > 0);

    const outPath = `${runPath}abstention.jsonl`;
    // dedup any prior append-only writes: last value per id wins.
    const results = new Map<string, boolean>();
    if (await Bun.file(outPath).exists()) {
      for (const l of (await Bun.file(outPath).text()).trim().split("\n")) if (l) { const o = JSON.parse(l); results.set(o.id, o.abstained); }
    }
    const pending = valid.filter((r) => !results.has(r.id));
    let cursor = 0;
    async function worker() {
      while (cursor < pending.length) {
        const r = pending[cursor++]!;
        const abstained = await classifyAbstention(r.question, r.response ?? "");
        results.set(r.id, abstained);
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker));

    // rewrite the file CLEAN (one line per valid id, excluded ids dropped): kills
    // the append-only duplication and makes the artifact reproducible.
    const validIds = new Set(valid.map((r) => r.id));
    const clean = valid
      .map((r) => ({ id: r.id, abstained: results.get(r.id) ?? false }))
      .map((o) => JSON.stringify(o))
      .join("\n");
    await Bun.write(outPath, clean ? `${clean}\n` : "");

    const nValid = (meta.nValid as number | undefined) ?? valid.length;
    const abst = valid.filter((r) => results.get(r.id) === true && validIds.has(r.id)).length;
    // hallucination = genuine wrong ATTEMPTS = incorrect verdicts that did NOT abstain.
    // Compute it directly from (verdict, abstained) instead of rate arithmetic
    // (incorrectRate - abstentionRate), which undercounts when some abstentions land
    // on correct/partial verdicts (a model that hedges but still answers correctly).
    const nHalluc = valid.filter((r) => verdictById.get(r.id) === "incorrect" && results.get(r.id) !== true).length;
    // abstentionRate is over the VALID denominator (nValid), consistent with
    // judgeAccuracy/judgePartialRate. excluded infra failures are not abstentions.
    meta.abstentionRate = Number((abst / (nValid || 1)).toFixed(4));
    meta.nAbstained = abst;
    meta.hallucRate = Number((nHalluc / (nValid || 1)).toFixed(4));
    meta.nHalluc = nHalluc;
    await Bun.write(`${runPath}run.json`, JSON.stringify(meta, null, 2));
    console.log(`${String(meta.model).replace("gateway:", "").replace(/^compat:.*\|/, "").padEnd(38)} ${meta.benchmark} abstain=${meta.abstentionRate} halluc=${meta.hallucRate} (n=${nValid}, excl=${excluded.size})`);
  }
}

async function cmdReport() {
  const { Glob } = await import("bun");
  const rows: Record<string, unknown>[] = [];
  for await (const dir of new Glob("*").scan({ cwd: RUNS_DIR, onlyFiles: false })) {
    const f = Bun.file(`${RUNS_DIR}${dir}/run.json`);
    if (await f.exists()) rows.push({ ...(await f.json()), _dir: dir } as Record<string, unknown>);
  }
  const allScored = rows.filter((r) => r.judgeAccuracy !== undefined && !r.smokeOnly);
  // dedup by (benchmark, model): keep the largest-n run, tie-break by most recent dir.
  // the runs dir holds both the early sample-100 sweeps and the final n=500 sweeps for
  // the same models; without dedup every model shows up twice.
  const best = new Map<string, Record<string, unknown>>();
  for (const r of allScored) {
    const key = `${r.benchmark}|${r.model}`;
    const prev = best.get(key);
    const n = Number(r.nValid ?? r.nItems ?? 0);
    const pn = prev ? Number(prev.nValid ?? prev.nItems ?? 0) : -1;
    if (!prev || n > pn || (n === pn && String(r._dir) > String(prev._dir))) best.set(key, r);
  }
  const scored = [...best.values()];
  const benchmarks = [...new Set(scored.map((r) => String(r.benchmark)))].sort();
  for (const bench of benchmarks) {
    // PRIMARY ranking metric is judgeAccuracy (binary correct rate). judgeMeanScore
    // (which weights partial=0.5) is reported as a sensitivity column only, because
    // the partial weight is arbitrary and flips adjacent ranks. See threats T10.
    const group = scored
      .filter((r) => r.benchmark === bench)
      .sort((a, b) => Number(b.judgeAccuracy ?? 0) - Number(a.judgeAccuracy ?? 0));
    console.log(`\n== ${bench} ==`);
    // correct = judge correct; abstain = declined ("no sabe"); halluc = wrong attempt ("sabe mal")
    // all three rates share the nValid denominator (excluded infra failures dropped everywhere).
    console.log("model".padEnd(40) + "correct".padStart(9) + "abstain".padStart(9) + "halluc".padStart(8) + "score".padStart(8) + "n".padStart(6));
    for (const r of group) {
      const model = String(r.model).replace("gateway:", "").replace(/^compat:.*\|/, "");
      const abst = r.abstentionRate as number | undefined;
      // halluc = wrong-and-not-abstained = incorrect verdicts that did not abstain,
      // counted directly in cmdAbstention (meta.hallucRate). Falls back to rate
      // arithmetic for older runs lacking the field. Not derived as incorrectRate-abst
      // because some abstentions land on correct/partial verdicts (hedged-but-right).
      const halluc = r.hallucRate !== undefined
        ? Number(r.hallucRate)
        : abst !== undefined
          ? Math.max(0, 1 - Number(r.judgeAccuracy) - Number(r.judgePartialRate ?? 0) - abst)
          : undefined;
      console.log(
        model.padEnd(40) +
          `${(Number(r.judgeAccuracy) * 100).toFixed(1)}%`.padStart(9) +
          (abst !== undefined ? `${(abst * 100).toFixed(1)}%` : "-").padStart(9) +
          (halluc !== undefined ? `${(halluc * 100).toFixed(1)}%` : "-").padStart(8) +
          String(r.judgeMeanScore).padStart(8) +
          String(r.nValid ?? r.nItems).padStart(6),
      );
    }
  }
}

const [command, ...rest] = Bun.argv.slice(2);
switch (command) {
  case "run":
    await cmdRun(rest);
    break;
  case "calibrate-judge":
    await cmdCalibrateJudge(rest);
    break;
  case "rescore":
    await cmdRescore(rest);
    break;
  case "abstention":
    await cmdAbstention(rest);
    break;
  case "report":
    await cmdReport();
    break;
  default:
    console.error("Commands: run, calibrate-judge, rescore, abstention, report");
    process.exit(1);
}
