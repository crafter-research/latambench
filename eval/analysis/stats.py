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

for bench in ["trueque", "choclo"]:
    rows = load(bench)
    print(f"\n== {bench} (Wilson 95% CI) ==")
    for r in rows:
        p, lo, hi = wilson(r["k"], r["n"])
        print(f"  {r['name']:24} {p*100:5.1f}%  [{lo*100:4.1f}, {hi*100:4.1f}]  n={r['n']}")
    # tie groups: models not significantly different from the one above (alpha=0.05)
    print("  tie-groups (no significativamente distintos, two-prop z, a=0.05):")
    groups, cur = [], [rows[0]]
    for r in rows[1:]:
        pv = two_prop_z(cur[0]["k"], cur[0]["n"], r["k"], r["n"])
        if pv > 0.05: cur.append(r)
        else: groups.append(cur); cur = [r]
    groups.append(cur)
    for g in groups:
        print("    {" + ", ".join(x["name"] for x in g) + "}")
