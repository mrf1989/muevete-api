import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";

Deno.test("hello world", () => {
    const x = 1 + 2;
    assertEquals(x, 3);
});