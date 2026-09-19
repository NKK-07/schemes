import { persistentAtom } from "@nanostores/persistent";
export const shortlist = persistentAtom<string[]>("ffg:shortlist", [], {
  listen: true,
  encode: JSON.stringify,
  decode: (raw: string): string[] => {
    try {
      const v: unknown = JSON.parse(raw);
      return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  },
});
