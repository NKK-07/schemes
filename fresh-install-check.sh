#!/usr/bin/env bash
# Regenerates the lockfile from package.json in a scratch folder and reports whether the optional
# Pagefind binary was installed and whether the lockfile matches the committed one.
set -u
T=$(mktemp -d)
cp package.json "$T/"
cd "$T" && npm install --no-audit --no-fund > install.log 2>&1
echo "npm install exit=$?"
grep -E "^added" install.log
ls node_modules/@pagefind
cmp -s package-lock.json "$OLDPWD/package-lock.json" && echo "lockfile identical to committed" || echo "lockfile DIFFERS from committed"
rm -rf "$T"
