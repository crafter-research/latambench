#!/usr/bin/env python3
"""Wilson 95% CIs per model + pairwise significance (two-proportion z-test).
Reads runs/*/run.json + judgments.jsonl. Reports tie-groups so the leaderboard
doesn't imply a false ordinal ranking. Stdlib only."""
import json, glob, math, os, sys
from collections import defaultdict

RUNS = os.path.join(os.path.dirname(__file__), "..", "runs")
ROWS_BY_BENCH = {}

def wilson(k, n, z=1.96):
    if n == 0: return (0, 0, 0)
    p = k / n
    d = 1 + z*z/n
    c = (p + z*z/(2*n)) / d
    h = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / d
    return (p, max(0, c-h), min(1, c+h))

def two_prop_z(k1, n1, k2, n2):
    p1, p2 = k1/n1, k2/n2
    p = (k1+k2)/(n1+n2)
    se = math.sqrt(p*(1-p)*(1/n1+1/n2))
    if se == 0: return 1.0
    z = (p1-p2)/se
    # two-sided p via erfc
    return math.erfc(abs(z)/math.sqrt(2))

def load(bench):
    out = []
    for f in glob.glob(os.path.join(RUNS, "*", "run.json")):
        m = json.load(open(f))
        if m.get("benchmark") != bench or m.get("judgeAccuracy") is None: continue
        if (m.get("nValid", m.get("nItems", 0))) < 400: continue
        d = os.path.dirname(f)
        try:
            judg = [json.loads(l) for l in open(os.path.join(d, "judgments.jsonl"))]
        except FileNotFoundError:
            continue
        valid = [j for j in judg if j.get("verdict") != "excluded"]
        k = sum(1 for j in valid if j["verdict"] == "correct")
        n = len(valid)
        name = m["model"].replace("gateway:", "")
        if "atam" in name and "LatamGPT" in name or "latam-gpt" in name: name = "LatamGPT"
        else: name = name.split("/")[-1]
        out.append({"name": name, "k": k, "n": n})
    # dedup by name keep largest n
    best = {}
    for r in out:
        if r["name"] not in best or r["n"] > best[r["name"]]["n"]:
            best[r["name"]] = r
    return sorted(best.values(), key=lambda r: -r["k"]/r["n"])

def holm_bonferroni(pairs, alpha=0.05):
    """Holm-Bonferroni step-down correction over a list of (label, p) pairs.
    Returns a dict label -> (p_raw, reject) controlling FWER at alpha."""
    ordered = sorted(pairs, key=lambda x: x[1])
    m = len(ordered)
    out = {}
    still_rejecting = True
    for i, (label, p) in enumerate(ordered):
        adj_alpha = alpha / (m - i)
        reject = still_rejecting and p <= adj_alpha
        if not reject:
            still_rejecting = False  # once we fail to reject, all larger p also fail
        out[label] = (p, reject)
    return out

def tie_groups_allpairs(rows, reject):
    """Build tie-groups as connected components over 'not significantly different'
    edges (all-pairs, multiplicity-corrected). Two models share a group if their
    accuracy difference is NOT significant after Holm correction. Greedy over the
    accuracy ordering so groups stay contiguous and human-readable."""
    n = len(rows)
    parent = list(range(n))
    def find(a):
        while parent[a] != a: parent[a] = parent[parent[a]]; a = parent[a]
        return a
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[max(ra, rb)] = min(ra, rb)
    for i in range(n):
        for j in range(i + 1, n):
            label = f"{rows[i]['name']}|{rows[j]['name']}"
            if not reject.get(label, (0, True))[1]:  # not significantly different
                union(i, j)
    comp = defaultdict(list)
    for i in range(n): comp[find(i)].append(rows[i]["name"])
    return [comp[r] for r in sorted(comp)]

for bench in ["trueque", "choclo"]:
    rows = load(bench)
    print(f"\n== {bench} (Wilson 95% CI) ==")
    for r in rows:
        p, lo, hi = wilson(r["k"], r["n"])
        print(f"  {r['name']:24} {p*100:5.1f}%  [{lo*100:4.1f}, {hi*100:4.1f}]  n={r['n']}")

    # ALL-PAIRS two-prop z with Holm-Bonferroni FWER correction over every pair.
    # (Previous version only tested each model against the group head and applied no
    #  multiplicity correction; with ~55 tests, ~2-3 false positives were expected.)
    pairs = []
    for i in range(len(rows)):
        for j in range(i + 1, len(rows)):
            pv = two_prop_z(rows[i]["k"], rows[i]["n"], rows[j]["k"], rows[j]["n"])
            pairs.append((f"{rows[i]['name']}|{rows[j]['name']}", pv))
    reject = holm_bonferroni(pairs, alpha=0.05)
    n_sig = sum(1 for _, (_, rj) in reject.items() if rj)
    print(f"  pairwise: {len(pairs)} comparisons, {n_sig} significant after Holm-Bonferroni (FWER 0.05)")

    print("  tie-groups (connected components of NOT-significantly-different, all-pairs + Holm):")
    for g in tie_groups_allpairs(rows, reject):
        print("    {" + ", ".join(g) + "}")

    # spotlight the CPT comparison explicitly (the headline claim)
    cpt = next((l for l in reject if "LatamGPT" in l and ("llama-3.1-70b" in l or "Llama-3.1-70b" in l.lower())), None)
    if cpt:
        p, rj = reject[cpt]
        print(f"  CPT vs base [{cpt}]: p={p:.4f} raw, {'SIGNIFICANT' if rj else 'NOT significant'} after correction")
    ROWS_BY_BENCH[bench] = rows


# --- Fleiss kappa over the 3-judge validation set -------------------------
# Previously the published 0.68 lived only in prose: no script regenerated it.

VALID = os.path.join(os.path.dirname(__file__), "..", "validation")

def fleiss_kappa(rows):
    """rows: list of category-count lists, one per item. Returns kappa."""
    n_items = len(rows)
    if n_items == 0: return float("nan")
    n_raters = sum(rows[0])
    n_cat = len(rows[0])
    p_j = [sum(r[c] for r in rows) / (n_items * n_raters) for c in range(n_cat)]
    P_i = [(sum(c*c for c in r) - n_raters) / (n_raters * (n_raters - 1)) for r in rows]
    P_bar = sum(P_i) / n_items
    P_e = sum(p*p for p in p_j)
    if P_e == 1: return float("nan")
    return (P_bar - P_e) / (1 - P_e)

def judge_verdicts_by_uid():
    """Map 'model::item' -> verdict, preferring the largest-nValid run per model."""
    best = {}
    for f in glob.glob(os.path.join(RUNS, "*", "run.json")):
        m = json.load(open(f))
        if m.get("benchmark") != "trueque": continue
        d = os.path.dirname(f)
        if not os.path.exists(os.path.join(d, "judgments.jsonl")): continue
        short = m.get("model", "").split("/")[-1].split("|")[-1]
        nv = m.get("nValid") or 0
        if short not in best or nv > best[short][0]:
            best[short] = (nv, d)
    out = {}
    for short, (_, d) in best.items():
        for line in open(os.path.join(d, "judgments.jsonl")):
            r = json.loads(line)
            out[(short, r.get("id"))] = r.get("verdict")
    return out

def report_kappa():
    key_path = os.path.join(VALID, "judge-key.json")
    if not os.path.exists(key_path):
        return
    key = json.load(open(key_path))
    others = {}
    for f in glob.glob(os.path.join(VALID, "mj-*.jsonl")):
        name = os.path.basename(f)[3:-6]
        lab = {}
        for line in open(f):
            r = json.loads(line)
            uid = r.get("uid") or f"{r.get('model')}::{r.get('id')}"
            lab[uid] = r.get("verdict")
        others[name] = lab
    if not others:
        return

    prod = judge_verdicts_by_uid()
    def prod_verdict(uid):
        model, iid = uid.split("::")
        for (s, i), v in prod.items():
            if i == iid and (model.lower() in s.lower() or s.lower() in model.lower()):
                return v
        return None

    for label, judge1, note in (
        ("judge-key.json (06-11 judge sweep)", lambda u: key.get(u), ""),
        ("production judge verdicts (n=500 runs)", prod_verdict, "  <- regenerable from runs/"),
    ):
        for mode in ("binary", "3-category"):
            rows = []
            for uid in key:
                vs = [judge1(uid)] + [o.get(uid) for o in others.values()]
                if any(v is None for v in vs): continue
                if mode == "binary":
                    cats = ["correct", "other"]
                    vs = [v if v == "correct" else "other" for v in vs]
                else:
                    cats = ["correct", "partial", "incorrect"]
                    if any(v not in cats for v in vs): continue
                rows.append([sum(1 for v in vs if v == c) for c in cats])
            if rows:
                k = fleiss_kappa(rows)
                print(f"  Fleiss kappa ({mode}, {len(rows)} items, {1+len(others)} raters) "
                      f"vs {label}: {k:.4f}{note}")

def report_power(bench, rows):
    """Power + MDE for the headline CPT-vs-base comparison. A null claim without
    power is 'absence of evidence' dressed as 'evidence of absence'."""
    lg = next((r for r in rows if "LatamGPT" in r["name"]), None)
    base = next((r for r in rows if r["name"].lower().startswith("llama-3.1-70b")), None)
    if not lg or not base: return
    p1, n1 = lg["k"]/lg["n"], lg["n"]
    p2, n2 = base["k"]/base["n"], base["n"]
    d = p1 - p2
    se = math.sqrt(p1*(1-p1)/n1 + p2*(1-p2)/n2)
    z_a, z_b = 1.959964, 0.8416
    lo, hi = d - z_a*se, d + z_a*se
    phi = lambda x: 0.5 * math.erfc(-x/math.sqrt(2))
    power = 1 - phi(z_a - d/se) + phi(-z_a - d/se)
    pbar = (lg["k"] + base["k"]) / (n1 + n2)
    mde = (z_a + z_b) * math.sqrt(2*pbar*(1-pbar)/min(n1, n2))
    n_need = 2*pbar*(1-pbar)*((z_a+z_b)/d)**2 if d else float("inf")
    print(f"  CPT power analysis: delta={100*d:+.2f}pts, 95% CI [{100*lo:+.2f}, {100*hi:+.2f}]")
    print(f"    power for observed delta = {100*power:.1f}% | MDE at 80% power = {100*mde:.2f}pts "
          f"| n needed/group = {n_need:.0f}")


# The headline claim is a NULL result, so it needs power reported alongside it.
for _bench, _rows in ROWS_BY_BENCH.items():
    print(f"\n== {_bench} (power for the CPT null claim) ==")
    report_power(_bench, _rows)

print("\n== inter-rater agreement (3 judges, trueque validation set) ==")
report_kappa()
