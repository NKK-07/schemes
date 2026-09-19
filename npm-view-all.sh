#!/usr/bin/env bash
# npm view for every package in the ARCHITECTURE.md §2 table (PHASES Phase 0 task 3).
set -u
node -e '
const md=require("fs").readFileSync("ARCHITECTURE.md","utf8");
for (const m of md.matchAll(/^\| ([@a-z0-9/\-]+) \| ([0-9.]+) \| (dep|dev) \| (\d+) \|/gm)) console.log(m[1], m[2], m[3], m[4]);
' | while read name ver kind phase; do
  echo "===== $name@$ver ($kind, phase $phase)"
  npm view "$name@$ver" version engines peerDependencies --json
  echo "exit=$?"
done
