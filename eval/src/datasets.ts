/**
 * Dataset adapters. V1: Trueque (latam-gpt/Trueque-Benchmark-beta-0.1).
 * Source: HF datasets-server API (no python, no HF token needed for public sets).
 * Cache: eval/datasets/cache/<name>.json - committed runs always record dataset + seed.
 */

export interface BenchItem {
  id: string;
  question: string;
  reference: string;
  country: string;
  topic: string;
}

const HF_ROWS = "https://datasets-server.huggingface.co/rows";
const CACHE_DIR = new URL("../datasets/cache/", import.meta.url).pathname;

interface TruequeRow {
  row_idx: number;
  row: {
    question: string;
    country: string;
    reference_answer: string;
    topic: string;
  };
}

async function fetchTrueque(): Promise<BenchItem[]> {
  const dataset = encodeURIComponent("latam-gpt/Trueque-Benchmark-beta-0.1");
  const items: BenchItem[] = [];
  const pageSize = 100;
  for (let offset = 0; ; offset += pageSize) {
    const url = `${HF_ROWS}?dataset=${dataset}&config=default&split=train&offset=${offset}&length=${pageSize}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HF datasets-server ${res.status}: ${url}`);
    const data = (await res.json()) as { rows: TruequeRow[] };
    for (const r of data.rows) {
      items.push({
        id: `trueque-${r.row_idx}`,
        question: r.row.question,
        reference: r.row.reference_answer,
        country: r.row.country,
        topic: r.row.topic,
      });
    }
    if (data.rows.length < pageSize) break;
  }
  return items;
}

/** Minimal RFC4180 CSV parser (quoted fields with commas/newlines). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function fetchChoclo(): Promise<BenchItem[]> {
  const res = await fetch("https://huggingface.co/datasets/latam-gpt/CHOCLO/resolve/main/BenchmarkCHOCLO.csv");
  if (!res.ok) throw new Error(`CHOCLO download ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0]!;
  const col = (name: string) => header.indexOf(name);
  const [iEnt, iCountry, iCat, iDiff, iQ, iA] = [col("Entity"), col("Country"), col("Category"), col("Difficulty"), col("Question"), col("Answer")];
  return rows.slice(1).map((r, idx) => ({
    id: `choclo-${idx}`,
    question: r[iQ]!,
    reference: r[iA]!,
    country: r[iCountry]!,
    topic: `${r[iCat]}/${r[iDiff]}/${r[iEnt]}`,
  })).filter((x) => x.question && x.reference);
}

export async function loadBenchmark(name: string): Promise<BenchItem[]> {
  const fetchers: Record<string, () => Promise<BenchItem[]>> = { trueque: fetchTrueque, choclo: fetchChoclo };
  const fetcher = fetchers[name];
  if (!fetcher) throw new Error(`Unknown benchmark: ${name} (supported: ${Object.keys(fetchers).join(", ")})`);
  const cachePath = `${CACHE_DIR}${name}.json`;
  const cached = Bun.file(cachePath);
  if (await cached.exists()) return (await cached.json()) as BenchItem[];
  const items = await fetcher();
  await Bun.write(cachePath, JSON.stringify(items, null, 2));
  return items;
}

/** Deterministic PRNG so samples are reproducible from (benchmark, seed). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform Fisher-Yates shuffle (seeded). The comparator-based sort(()=>rand()-0.5)
 *  is NOT uniform and biases the sample; this is the correct unbiased shuffle. */
function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Stratified sample by country: proportional allocation, at least 1 per country when possible. */
export function stratifiedSample(items: BenchItem[], n: number, seed: number): BenchItem[] {
  if (n >= items.length) return items;
  const rand = mulberry32(seed);
  const byCountry = new Map<string, BenchItem[]>();
  for (const item of items) {
    const group = byCountry.get(item.country) ?? [];
    group.push(item);
    byCountry.set(item.country, group);
  }
  const countries = [...byCountry.keys()].sort();
  const picked: BenchItem[] = [];
  for (const country of countries) {
    const group = byCountry.get(country)!;
    const quota = Math.max(1, Math.round((group.length / items.length) * n));
    picked.push(...shuffle(group, rand).slice(0, quota));
  }
  return shuffle(picked, rand).slice(0, n);
}
