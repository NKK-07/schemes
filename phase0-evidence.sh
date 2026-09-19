#!/usr/bin/env bash
# Phase 0 evidence, version 2. Reproduces every spike claim from the committed spike in one run.
# Each output file starts with the exact command lines that were run, each followed by "exit=<code>".
# Usage: source /home/claude/ffg-env.sh && ./phase0-evidence.sh
set -u
OUT=docs-evidence-v2
rm -rf "$OUT"; mkdir -p "$OUT"
CHROME=/opt/pw-browsers/chromium
PORT=4321

run() { # run "<file>" "<command>"
  local f="$OUT/$1"; shift
  echo "\$ $*" >> "$f"
  bash -o pipefail -c "$*" >> "$f" 2>&1
  echo "exit=$?" >> "$f"
}
serve() {
  for p in $(ps -eo pid,args | awk '/astro preview --port '"$PORT"'/ && !/awk/ {print $1}'); do kill "$p" 2>/dev/null; done
  sleep 1
  (npx astro preview --port "$PORT" > /dev/null 2>&1 &)
  for i in $(seq 1 30); do curl -sf "http://localhost:$PORT/" > /dev/null && break; sleep 1; done
}

run 00-git.txt "git rev-parse HEAD && git status --short && node -v && npm -v"
run 01-npm-ci.txt "rm -rf node_modules dist && npm ci --no-audit --no-fund 2>&1 | grep -v 'npm warn deprecated'"
run 01-npm-ci.txt "ls node_modules/@pagefind"
run 02-versions.txt "node check-versions.mjs"
run 03-engines.txt "node engines-scan.mjs"

# Build with the CSP exactly as SECURITY §2.1 (no manual hash): shows the unhashed boot script and the Shiki warning.
run 04-build-security21.txt "npx astro build --config astro.config.security21.mjs 2>&1 | grep -vE '^\s*$'"
run 05-csp-security21.txt "python3 csp-all-pages.py"
serve
run 06-browser-security21.txt "node browser-spike.mjs"

# Build with the committed config (proposal 0001 hash + proposal 0003 markdown setting).
run 07-build-committed.txt "npx astro build 2>&1 | grep -vE '^\s*$'"
run 08-csp-committed.txt "python3 csp-all-pages.py"
serve
run 09-browser-committed.txt "node browser-spike.mjs"
run 10-pagefind-main-thread-with-wasm.txt "node noworker-check.mjs"
run 11-webkit-check-in-chromium.txt "BROWSERS=chromium CHROMIUM_PATH=$CHROME node webkit-check.mjs"
run 12-sitemap.txt "cat dist/sitemap-index.xml"
run 12-sitemap.txt "cat dist/sitemap-0.xml"
run 13-og-png.txt "python3 -c \"import struct;b=open('dist/og/schemes/cgss.png','rb').read(32);print('PNG signature:',b[:8]==b'\\\\x89PNG\\\\r\\\\n\\\\x1a\\\\n');print('width x height:',struct.unpack('>II',b[16:24]))\" && cp dist/og/schemes/cgss.png $OUT/13-og-default-families.png"
run 14-a10.txt "npx vitest run tests/zod.test.ts --reporter=verbose 2>&1 | grep -E 'A10|Test Files|Tests'"
run 14-a10.txt "npx tsx zod-tsx.ts"
run 14-a10.txt "grep -o 'data-pagefind-meta=\"id:cgss\"' dist/index.html"

# Favicon probe: remove /favicon.ico from dist, expect a console 404; restore it.
run 15-favicon-probe.txt "mv dist/favicon.ico /tmp/ffg-favicon.ico && node browser-spike.mjs | grep -A2 consoleErrors"
run 15-favicon-probe.txt "mv /tmp/ffg-favicon.ico dist/favicon.ico && node browser-spike.mjs | grep -A1 consoleErrors"

# Negative control: no 'wasm-unsafe-eval'.
run 16-build-nowasm.txt "npx astro build --config astro.config.nowasm.mjs 2>&1 | grep -E 'Complete|ERROR'"
serve
run 17-pagefind-without-wasm.txt "node browser-spike.mjs | grep -A3 -E 'search:|cspViolations'"
run 17-pagefind-without-wasm.txt "node noworker-check.mjs"

# Mutation probe: listen:false must make the cross-tab checks fail.
run 18-mutation-listen-false.txt "sed -i 's/listen: true,/listen: false,/' src/stores/shortlist.ts && npx astro build 2>&1 | grep -E 'Complete|ERROR'"
serve
run 18-mutation-listen-false.txt "BROWSERS=chromium CHROMIUM_PATH=$CHROME node webkit-check.mjs"
run 18-mutation-listen-false.txt "node browser-spike.mjs | grep crossTab"
run 18-mutation-listen-false.txt "sed -i 's/listen: false,/listen: true,/' src/stores/shortlist.ts && grep -n listen src/stores/shortlist.ts"

# OG font-family probe: exact family names vs a wrong one.
run 19-og-families.txt "OG_TITLE_FAMILY='Newsreader Medium' OG_DESC_FAMILY='IBM Plex Mono Medium' npx astro build 2>&1 | grep -E 'Loaded|families|Newsreader|Plex|Complete' && cp dist/og/schemes/cgss.png $OUT/19-og-exact-mono.png"
run 19-og-families.txt "OG_TITLE_FAMILY='Newsreader Medium' OG_DESC_FAMILY='IBM Plex Mono' npx astro build 2>&1 | grep -E 'Complete' && cp dist/og/schemes/cgss.png $OUT/19-og-wrong-mono.png"

# A8: install with scripts disabled, then build (committed config).
run 20-ignore-scripts.txt "rm -rf node_modules dist && npm ci --ignore-scripts --no-audit --no-fund 2>&1 | grep -v 'npm warn deprecated'"
run 20-ignore-scripts.txt "npx astro build 2>&1 | grep -E 'pagefind\]|Complete|ERROR'"
run 21-npm-audit.txt "npm audit --omit=dev --audit-level=high"
run 22-fresh-install.txt "./fresh-install-check.sh"

for p in $(ps -eo pid,args | awk '/astro preview --port '"$PORT"'/ && !/awk/ {print $1}'); do kill "$p" 2>/dev/null; done
run 99-git-after.txt "git status --short"
echo "evidence written to $OUT"
