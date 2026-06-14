#!/usr/bin/env python3
"""Wilson 95% CIs per model + pairwise significance (two-proportion z-test).
Reads runs/*/run.json + judgments.jsonl. Reports tie-groups so the leaderboard
doesn't imply a false ordinal ranking. Stdlib only."""
import json, glob, math, os, sys
from collections import defaultdict

RUNS = os.path.join(os.path.dirname(__file__), "..", "runs")

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
