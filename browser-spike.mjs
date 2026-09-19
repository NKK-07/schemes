// Phase 0 browser spike: A1 (CSP + islands), A2 (Pagefind under CSP), A7 (cross-tab store sync).
import { chromium } from "@playwright/test";
const BASE = process.env.BASE ?? "http://localhost:4321";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  window.__csp = [];
  document.addEventListener("securitypolicyviolation", (e) =>
    window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI || "inline"} sample=${(e.sample || "").slice(0, 40)}`));
});
const consoleErrors = [];
const notFound = [];
const mk = async () => { const p = await ctx.newPage(); p.on("response", (r) => { if (r.status() >= 400) notFound.push(`${r.status()} ${r.url().replace(BASE, "")}`); }); p.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); }); p.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message)); return p; };
const out = {};
// A1
const p1 = await mk();
await p1.goto(BASE + "/");
await p1.waitForFunction(() => document.querySelector("astro-island:not([ssr])") !== null, null, { timeout: 5000 }).catch(() => {});
await p1.waitForTimeout(800);
out.htmlHasJsClass = await p1.evaluate(() => document.documentElement.classList.contains("js"));
await p1.click("#add");
await p1.waitForTimeout(200);
out.islandCountAfterClick = await p1.textContent("#count");
// A7
const p2 = await mk();
await p2.goto(BASE + "/second/");
await p2.waitForTimeout(800);
const before = await p2.textContent("#count");
await p1.click("#add");
const t0 = Date.now();
await p2.waitForFunction((b) => document.querySelector("#count")?.textContent !== b, before, { timeout: 1000 }).then(() => { out.crossTabMs = Date.now() - t0; }).catch(() => { out.crossTabMs = "no sync within 1000 ms"; });
out.crossTab = { before, after: await p2.textContent("#count") };
// A2
const requestsBeforeSearch = [];
p1.on("request", (r) => requestsBeforeSearch.push(r.url()));
for (const q of ["kerala", "prototype"]) {
  await p1.evaluate(() => { document.getElementById("results").textContent = ""; });
  await p1.fill("#q", q);
  await p1.waitForFunction(() => document.querySelectorAll("#results li").length > 0, null, { timeout: 5000 }).catch(() => {});
  await p1.waitForTimeout(300);
  out["search:" + q] = await p1.$$eval("#results li", (lis) => lis.map((l) => l.textContent));
}
out.pagefindRequests = requestsBeforeSearch.filter((u) => u.includes("/pagefind/")).map((u) => u.replace(BASE, "")).slice(0, 8);
out.cspViolations = [...(await p1.evaluate(() => window.__csp)), ...(await p2.evaluate(() => window.__csp))];
out.consoleErrors = consoleErrors;
out.httpErrors = notFound;
out.browser = browser.version();
console.log(JSON.stringify(out, null, 2));
await browser.close();
