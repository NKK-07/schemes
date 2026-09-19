// A7 (WebKit half) and A1 in WebKit: run on GitHub Actions, where Playwright can install WebKit.
// Both pages must be hydrated before the click, the click must change page 1, and only then is
// page 2 timed. Exit code 1 if either browser fails.
import { webkit, chromium } from "@playwright/test";
const BASE = process.env.BASE ?? "http://localhost:4321";
const hydrated = (p) => p.waitForFunction(() => document.querySelectorAll("astro-island").length > 0 && document.querySelectorAll("astro-island[ssr]").length === 0, null, { timeout: 10000 });
let failed = false;
const wanted = (process.env.BROWSERS ?? "webkit,chromium").split(",");
const all = { webkit, chromium };
for (const name of wanted) {
  const type = all[name];
  const browser = await type.launch(name === "chromium" && process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { window.__csp = []; document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(e.violatedDirective)); });
  const p1 = await ctx.newPage(); await p1.goto(BASE + "/"); await hydrated(p1);
  const p2 = await ctx.newPage(); await p2.goto(BASE + "/second/"); await hydrated(p2);
  const before1 = await p1.textContent("#count");
  const before2 = await p2.textContent("#count");
  await p1.click("#add");
  const clicked = await p1.waitForFunction((b) => document.querySelector("#count")?.textContent !== b, before1, { timeout: 2000 }).then(() => true).catch(() => false);
  const t0 = Date.now();
  const synced = clicked && await p2.waitForFunction((b) => document.querySelector("#count")?.textContent !== b, before2, { timeout: 1000 }).then(() => true).catch(() => false);
  const csp = [...(await p1.evaluate(() => window.__csp)), ...(await p2.evaluate(() => window.__csp))];
  const res = { browser: name, version: browser.version(), page1Changed: clicked, crossTabSynced: synced, ms: synced ? Date.now() - t0 : null, before2, after2: await p2.textContent("#count"), cspViolations: csp };
  console.log(JSON.stringify(res));
  if (!clicked || !synced || csp.length) failed = true;
  await browser.close();
}
process.exit(failed ? 1 : 0);
