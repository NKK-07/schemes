// Phase 0 variant: the CSP exactly as SECURITY §2.1 (no manual hash), no markdown setting.
// Phase 0 spike (A1, A2, A4, A10). Mirrors SECURITY §2.1 and ARCHITECTURE §5/§8.3.
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: "https://founders-field-guide.vercel.app",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes("/shortlist/"),
      serialize: (item) => ({ ...item, lastmod: "2026-09-18" }),
    }),
    pagefind(),
  ],
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
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
});
