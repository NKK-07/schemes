import { OGImageRoute } from "astro-og-canvas";
export const prerender = true;
export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages: { "schemes/cgss": { title: "Credit Guarantee Scheme for Startups", description: "Collateral-free loans up to ₹20 cr · All India · Open" } },
  getImageOptions: (_path, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[239, 234, 223]],
    border: { color: [91, 63, 160], width: 8, side: "inline-start" },
    font: {
      title: { families: ["Newsreader"], weight: "Medium", size: 64, color: [29, 31, 43] },
      description: { families: ["IBM Plex Sans"], size: 26, color: [85, 84, 106] },
    },
    fonts: [
      "./reference/fonts/newsreader-500.v1.woff2",
      "./reference/fonts/plexsans-400.v1.woff2",
    ],
  }),
});
