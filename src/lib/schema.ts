import { z } from "astro/zod";
export const Demo = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), n: z.number() }).strict();
