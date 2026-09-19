import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext(); const seen = [];
ctx.on("response", (r) => { if (r.status() >= 400) seen.push(r.status() + " " + r.url()); });
const p = await ctx.newPage(); await p.goto("http://localhost:4321/"); await p.waitForTimeout(1500);
console.log(JSON.stringify(seen)); await b.close();
