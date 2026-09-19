import { OGImageRoute } from "astro-og-canvas";
export const prerender = true;
// Spike only: the social-image layout proposed in docs/proposals/0004 (phase/00-recon).
const pages = {
  "schemes/cgss": { title: "Credit Guarantee Scheme for Startups", description: "Collateral-free loans up to ₹20 cr · All India · Open" },
  "schemes/long": { title: "A deliberately long test title, not a scheme, to see how the social image wraps at 52 pixels", description: "Stress test (92 characters)" },
  "schemes/longer": { title: "A deliberately long test title, not a scheme, to see how the social image wraps at 52 pixels when it runs past three lines", description: "Stress test (122 characters)" },
  "regions/KL": { title: "Startup Schemes in Kerala (2026): State Grants, Incentives & Policy", description: "3 state schemes + every central scheme" },
  // Boundary probes with real titles (reference/data-source, ARCHITECTURE §8.1 title rules):
  "schemes/sipp": { title: "Startup IP Protection (SIPP): patent & trademark fee rebates", description: "80% off patent fees, 50% off trademark fees · All India · Open" },
  "schemes/iic": { title: "Institution's Innovation Council & National Innovation and Startup Policy", description: "Campus support: credits, IP help, startup leave · All India · Open" },
  "regions/RJ": { title: "Startup Schemes in Rajasthan (2026): State Grants, Incentives & Policy", description: "1 state schemes + every central scheme" },
  "regions/DH": { title: "Startup Schemes in Dadra & Nagar Haveli and Daman & Diu (2026)", description: "1 state schemes + every central scheme" },
};
export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    logo: { path: "./og-assets/wordmark.png", size: [404] },
    bgGradient: [[239, 234, 223]],
    border: { color: [91, 63, 160], width: 8, side: "inline-start" },
    padding: 64,
    font: {
      title: { families: ["Newsreader Medium"], size: page.title.length > 60 ? 52 : 64, color: [29, 31, 43], lineHeight: 1.1 },
      description: { families: ["IBM Plex Sans"], size: 28, color: [85, 84, 106] },
    },
    fonts: ["./reference/fonts/newsreader-500.v1.woff2", "./reference/fonts/plexsans-400.v1.woff2"],
  }),
});
