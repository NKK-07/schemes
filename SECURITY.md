# SECURITY.md — security and abuse contract

This file defines the security headers, the Content Security Policy, the Vercel firewall set-up, the AI-crawler decision (D2), supply-chain rules and the incident runbook. It ranks above `ARCHITECTURE.md` (SPEC authority order). Agents may not edit it; changes go through `docs/proposals/`.

---

## 1. Threat model

The site is static: no server code, no accounts, no forms, no database. What there is to protect, and from what:

| Asset | Threat | Control | Proven by |
|---|---|---|---|
| Visitors' browsers | Script injection through data or URL parameters | Astro escaping; no `set:html` except JSON-LD; no `innerHTML`; CSP with hashes; no `unsafe-inline`/`unsafe-eval` for scripts | AC-SEC-02, AC-SEC-03, AC-SEC-05 |
| Visitors' browsers | Clickjacking, MIME sniffing, cross-origin window access | Headers in §2 | AC-SEC-01 |
| Visitors' privacy | Tracking, cookies, data leaving the browser | No cookies, no third-party requests, `ffg:*` storage only, analytics only per D4 (same origin, cookie-free) | AC-SEC-04, AC-PRIV-01, AC-PRIV-02 |
| Visitors' trust | Open redirect through legacy `/#/…` links | The legacy redirect only navigates to URLs found in the build's own URL map; anything else goes to `/` | AC-FUNC-28, §5 |
| Visitors' trust | The site being mistaken for an official portal | "An independent guide, not an official government website" on every page; no government emblems, seals or `.gov`-like styling | AC-CONTENT-12 |
| Availability and quota (Vercel Hobby: 1M edge requests, 100 GB transfer a month; the project is paused when exceeded) | Scrapers, scanners, request floods | Firewall rules in §3, Bot Protection, Attack Challenge Mode runbook in §7 | AC-SEC-07, AC-OPS-04 |
| Integrity of the code | Malicious or vulnerable npm packages | Exact pins, lockfile, `npm ci`, install scripts off, audit gate, dependency allowlist | AC-SEC-06, §6 |
| Integrity of the deployment | Stolen GitHub or Vercel account, leaked deploy hook | 2FA, branch protection, one secret only, rotation runbook | §6, §7 |

Out of scope: DDoS beyond what Vercel's platform mitigation absorbs; availability of the official government portals the site links to.

## 2. Response headers (exact)

`vercel.json` is exactly this content (JSON-equal: the parsed objects are deep-equal; formatting may differ), plus nothing else. `scripts/serve-dist.ts` reads the same file and applies the same headers, `trailingSlash` and `cleanUrls` locally, so tests see production behaviour.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "trailingSlash": true,
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Resource-Policy", "value": "same-origin" }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/data/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }]
    },
    {
      "source": "/pagefind/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }]
    }
  ]
}
```

Rules:
- **Two CSPs, on purpose.** The header policy above carries only directives that do not restrict scripts or styles (and `frame-ancestors`, which a `<meta>` tag cannot set). The script and style policy is the `<meta>` tag Astro generates (§2.1). Browsers enforce both. **Never add `default-src`, `script-src` or `style-src` to the header policy**: it would block the hashed inline scripts that only the meta policy lists.
- HTML keeps Vercel's default caching (`public, max-age=0, must-revalidate`). Never set long caching on HTML, `/pagefind/*`, `/data/*`, `/og/*` or the PDF; their names are not content-hashed.
- The `X-XSS-Protection` header is deprecated and must not be sent. Do not add `interest-cohort` or other unrecognised features to `Permissions-Policy`: Chrome logs a console error for them, which fails Lighthouse Best Practices.
- `Content-Type` for the PDF is Vercel's inferred `application/pdf` (AC-CONTENT-11 checks it).
- Preview deployments get `X-Robots-Tag: noindex` from Vercel automatically. Do not override it.

### 2.1 Content Security Policy in HTML (`astro.config.mjs`)

```js
security: {
  csp: {
    algorithm: "SHA-256",
    directives: [
      "default-src 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ],
    scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
    styleDirective: { resources: ["'self'"] }
  }
}
```

- Astro adds a `sha256-…` hash for every inline script and style it emits (island hydration, the theme boot script in `Head.astro`). AC-SEC-02 checks that each inline block's hash is in the tag.
- `'wasm-unsafe-eval'` exists only for Pagefind's WebAssembly. It is not `'unsafe-eval'`.
- `img-src data:` exists only for the stamp texture mask in `site.css` (a `data:` SVG). No other `data:` URL may be added.
- Vercel Web Analytics (D4 = On) loads `/_vercel/insights/script.js` and posts to `/_vercel/insights/*`, both same origin, so `'self'` covers them.
- If Assumption A1 (ARCHITECTURE §11) fails, Phase 0 writes a proposal. **Falling back to `'unsafe-inline'` is forbidden.**

## 3. Vercel firewall (configured in the dashboard, Phase 14)

`vercel.json` cannot hold firewall rules for this project (Vercel does not allow `routes`, where `mitigate` lives, together with `headers`, `cleanUrls` and `trailingSlash`). The owner sets these in **Project → Firewall → Configure**, exactly as below, and publishes. The Phase 14 report contains screenshots (AC-SEC-07).

**R1 — Deny scanner paths** (custom rule)
- Condition: *Request Path* matches regex
  `^/(\.env|\.git|\.aws|\.DS_Store|wp-admin|wp-login\.php|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|cgi-bin|vendor/phpunit|server-status|actuator)` **or** *Request Path* ends with `.php`.
- Action: **Deny** (403).
- Why: these paths never exist on this site. They return 404 without the rule; the rule drops them at the edge and makes scans visible in the firewall log.

**R2 — Rate limit pages** (custom rule with the Rate Limit action)
- Condition: *Request Path* does **not** match regex `^/(_astro|fonts|pagefind|og|icons)/`.
- Action: **Rate limit**, fixed window **60 seconds**, **300 requests**, key **IP address**; when exceeded, **Deny** (429).
- Why: assets are excluded because one page view loads 10–30 of them. 300 page-level requests a minute from one IP is far above human browsing but leaves room for mobile-carrier NAT, where many people share one IP.

**R3 — Bot Protection** (managed ruleset)
- **Log** for the first 7 days after launch, then **Challenge**.
- Before switching to Challenge, check the firewall log for legitimate agents that would be caught. After switching, share one scheme URL on WhatsApp and on LinkedIn and confirm the preview card still appears (WhatsApp previews matter most in India). If it does not, switch back to Log and record it in the report.

**R4 — AI Bots** (managed ruleset): per D2 (§4).

- Leave **Attack Challenge Mode off** in normal operation. It is the emergency switch in §7.
- Record in the Phase 14 report: the Hobby limits shown on the Firewall page (custom rules, rate-limit rules, included rate-limit checks) on the day of configuration. If a limit prevents R1–R4 exactly as written, the owner decides; the agent does not.

## 4. AI crawlers (decision D2)

| D2 | `robots.txt` (`src/pages/robots.txt.ts`) | Vercel AI Bots ruleset |
|---|---|---|
| **Allow** (recommended) | Only the base file below | Off |
| **Block** | The base file **plus** one group per user agent in the list below, each with `Disallow: /` | **Deny** |

Base `robots.txt` (both options; `{origin}` is the canonical origin, SPEC §5):

```
User-agent: *
Allow: /

Sitemap: {origin}/sitemap-index.xml
```

`/shortlist/`, `/compare/` and `/404` are **not** disallowed: they carry `noindex`, and a crawler can only see `noindex` on a page it is allowed to fetch. A disallowed page that is linked can still be indexed as a bare URL.

AI user agents for D2 = Block (exact list, in this order): `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Bytespider`, `Amazonbot`, `meta-externalagent`, `cohere-ai`.

Blocking also removes the guide from AI search answers (for example ChatGPT search and Perplexity), which is where many founders now look first. That is why Allow is recommended. `Googlebot` and `Bingbot` are never blocked under either option.

## 5. Code rules (enforced in review and by the checks named)

1. Render text with Astro expressions or Preact JSX only. **No** `set:html`, `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML` or `document.write`, except `JsonLd.astro` (ARCHITECTURE §8.2). ESLint `no-restricted-syntax` / `no-restricted-properties` rules enforce this (AC-SEC-05).
2. No `eval`, `new Function`, string `setTimeout`/`setInterval`, or inline event-handler attributes (`on*=`).
3. No `style` attributes and no Preact `style` props (the CSP blocks them). Set positions with `element.style.*` in code.
4. Every external link comes from scheme data (`officialUrl`, which must be `https://`) and has `target="_blank" rel="noopener"`.
5. **Legacy redirect** (`scripts/legacy-redirect.ts`): parse `location.hash` against the fixed table in SPEC §7.7, look the id or code up in a map generated at build from the data, and call `location.replace()` with that same-origin path. An unknown id or pattern goes to `/`. Never build a URL from hash text.
6. **Stored data is untrusted**: every store decodes JSON inside try/catch, keeps only known scheme ids, known document keys and enum values, and resets to the default on anything else (ARCHITECTURE §6.2).
7. URL query parameters (`q`, filters) are only read into state and rendered as text. Unknown values are ignored (SPEC §7.2).
8. The clipboard is written only in response to a click (Share fallback).
9. No secrets, tokens, API keys or personal data in the repository, the build, or client code. The site has no environment secrets; `GOOGLE_SITE_VERIFICATION` is public by nature.

## 6. Supply chain and accounts

- Only the packages in ARCHITECTURE §2, at exact versions, with `package-lock.json` committed. Install with `npm ci`, never `npm install`, in CI and on Vercel.
- `.npmrc` contains `ignore-scripts=true` and `engine-strict=true`, **if Assumption A8 is verified** in Phase 0 (ARCHITECTURE §11). If a package needs an install script, Phase 0 writes an ADR naming the package and the script.
- `npm audit --omit=dev --audit-level=high` must exit 0 (AC-SEC-06). A high or critical advisory with no fix is reported to the owner, who decides.
- GitHub Actions (D3 = Yes) are pinned to full commit SHAs (TESTING §8). Workflows get `permissions: contents: read` (the daily rebuild gets `permissions: {}`).
- The only secret is `VERCEL_DEPLOY_HOOK_URL`, stored as a GitHub Actions secret (D3 = Yes). It is never printed or committed.
- **Owner checklist (Phase 14, recorded in the report):** 2FA on GitHub and Vercel; branch protection on `main` (no force-push; require the `ci` check if D3 = Yes); Vercel Git fork protection on; Vercel Deployment Protection (Standard Protection) on for preview deployments.

## 7. Incident runbook

| Situation | Action |
|---|---|
| Traffic spike or flood; usage graphs climbing fast | Firewall → turn **Attack Challenge Mode** on. Check the top IPs, paths and user agents in the firewall log; add a Deny custom rule for a clear offender if a rule slot is free. Turn Attack Challenge Mode off when traffic is normal. Record it. |
| A bad deployment (broken pages, wrong content) | Deployments → previous good deployment → **Instant Rollback**. Then fix forward through the normal lifecycle (AGENTS §2). |
| Approaching a Hobby limit (> 70% of edge requests or transfer mid-month) | Check whether the traffic is human (Analytics if D4 = On) or automated (firewall log). Automated: tighten R2 or turn R3 to Challenge. Human: the owner decides whether to move to a paid plan. **Hobby is for non-commercial use.** |
| Deploy hook leaked | Vercel → Settings → Git → Deploy Hooks: delete it, create a new one, update the GitHub secret. |
| Account compromise suspected | Revoke sessions and tokens in GitHub and Vercel, rotate the deploy hook, review recent deployments and roll back to a known-good one. |
| A reported factual error in a scheme | Not a security incident. Record it under "Data questions" and handle it as a data change (AGENTS §6). |

## 8. What this file does not allow

No WAF bypass tokens, no allow-listing of IPs, no custom challenge pages, no CAPTCHA, no server functions for rate limiting, no third-party security services, no security scanners run against production without the owner's approval.
