// Lists every package-lock entry whose engines.node range is not satisfied by each candidate Node version.
import fs from "fs";
import semver from "semver";
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8")).packages;
for (const v of ["22.12.0", "22.19.0", "22.22.0", "22.22.2", "22.22.3", "22.23.2"]) {
  const bad = [];
  for (const [path, e] of Object.entries(lock)) {
    const r = e.engines && e.engines.node;
    if (path && r && !semver.satisfies(v, r)) bad.push(`${path.replace(/^.*node_modules\//, "")}@${e.version} (${r})${e.optional ? " [optional]" : ""}${e.os ? " os=" + e.os.join("|") : ""}`);
  }
  console.log(`Node ${v}: ${bad.length} unsatisfied`);
  for (const b of bad) console.log("   " + b);
}
