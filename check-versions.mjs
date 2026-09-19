// Compares installed versions with the locked table in ARCHITECTURE.md §2.
import fs from "fs";
const md = fs.readFileSync("ARCHITECTURE.md", "utf8");
const rows = [...md.matchAll(/^\| ([@a-z0-9/\-]+) \| ([0-9.]+) \| (dep|dev) \| (\d+) \|/gm)];
let mismatches = 0;
for (const [, name, want] of rows) {
  let got = "MISSING";
  try { got = JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`, "utf8")).version; } catch {}
  const ok = got === want;
  if (!ok) mismatches++;
  console.log(`${ok ? "ok  " : "DIFF"} ${name} locked ${want} installed ${got}`);
}
console.log(`packages: ${rows.length}, mismatches: ${mismatches}`);
process.exit(mismatches ? 1 : 0);
