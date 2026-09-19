// Reads the npm-view output (argv[2]) and checks every peer range that names a locked package, and
// every engines.node range against the Node version in argv[3].
const fs = require("fs");
const semver = require("semver");
const txt = fs.readFileSync(process.argv[2], "utf8");
const node = process.argv[3];
const blocks = txt.split(/^===== /m).filter((b) => /^\S+@[0-9.]+ \(/.test(b));
const locked = {}; const info = {};
for (const b of blocks) {
  const m = b.split("\n")[0].match(/^(.+)@([0-9.]+) /);
  locked[m[1]] = m[2];
  info[m[1]] = JSON.parse(b.slice(b.indexOf("\n") + 1, b.indexOf("npm-view-exit=")));
}
let issues = 0;
for (const [pkg, i] of Object.entries(info)) {
  const eng = i.engines && i.engines.node;
  if (eng && !semver.satisfies(node, eng)) { console.log(`ENGINE ${pkg}: node ${eng} not satisfied by ${node}`); issues++; }
  for (const [peer, range] of Object.entries(i.peerDependencies || {})) {
    if (locked[peer]) { const ok = semver.satisfies(locked[peer], range, { includePrerelease: true }); console.log(`${ok ? "ok  " : "FAIL"} ${pkg} peer ${peer}@${range} vs locked ${locked[peer]}`); if (!ok) issues++; }
    else console.log(`n/a  ${pkg} peer ${peer}@${range} (not in the locked set)`);
  }
}
console.log("issues:", issues);
process.exit(issues ? 1 : 0);
