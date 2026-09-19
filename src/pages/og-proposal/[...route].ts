import { OGImageRoute } from "astro-og-canvas";
export const prerender = true;
// Spike only: the social-image layout proposed in docs/proposals/0004 (phase/00-recon).
const pages = {
  "schemes/cgss": { title: "Credit Guarantee Scheme for Startups", description: "Collateral-free loans up to ₹20 cr · All India · Open" },
  "schemes/long": { title: "Pradhan Mantri Formalisation of Micro Food Processing Enterprises (PMFME)", description: "35% capital subsidy up to ₹10 lakh · All India · Closes 30 Sep 2026" },
  "regions/KL": { title: "Startup schemes in Kerala", description: "3 state schemes + every central scheme" },
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
