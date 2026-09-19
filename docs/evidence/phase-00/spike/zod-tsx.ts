import { Demo } from "./src/lib/schema";
console.log("A10 tsx:", Demo.safeParse({ id: "ok", n: 1 }).success, Demo.safeParse({ id: "Bad!", n: 1 }).success);
