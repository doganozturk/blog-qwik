import { describe, expect, it } from "vitest";
import type { DocumentHeadValue } from "@builder.io/qwik-city";
import IndexPage, { getPosts, head } from "./index";

describe("index page", () => {
  it("should have correct head metadata", () => {
    const headValue = head as DocumentHeadValue;
    expect(headValue.title).toBe("Doğan Öztürk | Blog");
    expect(headValue.meta).toBeDefined();
    
    const descMeta = headValue.meta?.find((m: { name?: string; content?: string }) => m.name === "description");
    expect(descMeta?.content).toContain("software engineer");
  });

  it("should have Twitter meta tags", () => {
    const headValue = head as DocumentHeadValue;
    const twitterCard = headValue.meta?.find((m: { name?: string; content?: string }) => m.name === "twitter:card");
    const twitterSite = headValue.meta?.find((m: { name?: string; content?: string }) => m.name === "twitter:site");
    
    expect(twitterCard?.content).toBe("summary");
    expect(twitterSite?.content).toBe("Doğan Öztürk | Blog");
  });

  it("should have OpenGraph meta tags", () => {
    const headValue = head as DocumentHeadValue;
    const ogTitle = headValue.meta?.find((m: { property?: string; content?: string }) => m.property === "og:title");
    const ogType = headValue.meta?.find((m: { property?: string; content?: string }) => m.property === "og:type");
    const ogUrl = headValue.meta?.find((m: { property?: string; content?: string }) => m.property === "og:url");
    
    expect(ogTitle?.content).toBe("Doğan Öztürk | Blog");
    expect(ogType?.content).toBe("article");
    expect(ogUrl?.content).toBe("https://doganozturk.dev/");
  });

  it("exports default component", () => {
    expect(IndexPage).toBeDefined();
    expect(typeof IndexPage).toBe("function");
  });
});

describe("getPosts utility", () => {
  it("should be defined as async function", () => {
    expect(getPosts).toBeDefined();
    expect(typeof getPosts).toBe("function");
  });

});

describe("IndexPage component", () => {
  it("exports default component function", () => {
    expect(IndexPage).toBeDefined();
    expect(typeof IndexPage).toBe("function");
  });
});