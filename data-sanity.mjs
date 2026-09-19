import fs from "fs";
// Compares counts from reference/data-source with tests/fixtures/golden.json totals (PHASES Phase 0 task 5).
const {CENTRAL}=await import(process.cwd()+"/reference/data-source/central.mjs");
const {STATE}=await import(process.cwd()+"/reference/data-source/states.mjs");
const {REGIONS}=await import(process.cwd()+"/reference/data-source/meta.mjs");
const g=JSON.parse(fs.readFileSync("tests/fixtures/golden.json","utf8")).totals;
const all=[...CENTRAL,...STATE];
const got={schemes:all.length,central:CENTRAL.length,state:STATE.length,student:all.filter(s=>s.student).length,regions:REGIONS.length,regionsWithSchemes:new Set(STATE.map(s=>s.st)).size};
for(const k of Object.keys(got)) console.log(`${k}: reference=${got[k]} golden=${g[k]} ${got[k]===g[k]?"MATCH":"MISMATCH"}`);
console.log("golden.indexablePages =",g.indexablePages,"(not recomputable before routes exist)");
