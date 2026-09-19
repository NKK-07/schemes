import { test, expect } from "vitest";
import { Demo } from "../src/lib/schema";
test("A10 astro/zod works in Vitest", () => {
  expect(Demo.safeParse({ id: "ok", n: 1 }).success).toBe(true);
  expect(Demo.safeParse({ id: "Bad!", n: 1 }).success).toBe(false);
});
