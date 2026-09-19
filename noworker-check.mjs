import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext();
await ctx.addInitScript(() => { window.__csp = []; document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(e.violatedDirective + " " + (e.blockedURI || "inline"))); });
const p = await ctx.newPage(); const errs = []; p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errs.push(m.text().slice(0, 160)); });
await p.goto("http://localhost:4321/noworker/"); await p.waitForFunction(() => document.getElementById("out").textContent !== "pending", null, { timeout: 8000 }).catch(() => {});
console.log(JSON.stringify({ out: await p.textContent("#out"), csp: await p.evaluate(() => window.__csp), console: errs }, null, 1));
await b.close();
