// A7 (WebKit half) and A1 in WebKit: run on GitHub Actions, where Playwright can install WebKit.
import { webkit, chromium } from "@playwright/test";
const BASE = process.env.BASE ?? "http://localhost:4321";
let failed = false;
for (const [name, type] of [["webkit", webkit], ["chromium", chromium]]) {
  const browser = await type.launch();
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { window.__csp = []; document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(e.violatedDirective)); });
  const p1 = await ctx.newPage(); await p1.goto(BASE + "/"); await p1.waitForTimeout(1500);
  const p2 = await ctx.newPage(); await p2.goto(BASE + "/second/"); await p2.waitForTimeout(1500);
  const before = await p2.textContent("#count");
  await p1.click("#add");
  const t0 = Date.now();
  const synced = await p2.waitForFunction((b) => document.querySelector("#count")?.textContent !== b, before, { timeout: 1000 }).then(() => true).catch(() => false);
  const csp = [...(await p1.evaluate(() => window.__csp)), ...(await p2.evaluate(() => window.__csp))];
  const res = { browser: name, version: browser.version(), crossTabSynced: synced, ms: synced ? Date.now() - t0 : null, before, after: await p2.textContent("#count"), cspViolations: csp };
  console.log(JSON.stringify(res));
  if (!synced || csp.length) failed = true;
  await browser.close();
}
process.exit(failed ? 1 : 0);
