import { test, expect, describe } from "vitest";
import { Footer, links } from "./footer";

// Mock the component$ function to avoid optimizer issues
vi.mock("@builder.io/qwik", async () => {
  const actual = await vi.importActual("@builder.io/qwik");
  return {
    ...actual,
    component$: (fn: any) => fn,
    useStylesScoped$: () => {},
  };
});

describe("Footer", () => {
  test("should be defined", () => {
    expect(Footer).toBeDefined();
  });

  test("should have links defined", () => {
    expect(links).toBeDefined();
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
  });

  test("should have correctly structured links", () => {
    for (const link of links) {
      expect(link).toHaveProperty("linkProps");
      expect(link).toHaveProperty("text");
      expect(link.linkProps).toHaveProperty("href");
      expect(typeof link.text).toBe("string");
    }
  });
});
