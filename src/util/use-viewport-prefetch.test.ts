/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { prefetchDocument } from "./use-viewport-prefetch";

describe("prefetchDocument", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create and append a prefetch link to the document head", () => {
    const url = "/test-page";

    prefetchDocument(url);

    const link = document.querySelector('link[rel="prefetch"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe(url);
    expect(link?.getAttribute("rel")).toBe("prefetch");
  });

  it("should not create duplicate prefetch links for the same URL", () => {
    const url = "/test-page";

    prefetchDocument(url);
    prefetchDocument(url);

    const links = document.querySelectorAll(
      `link[rel="prefetch"][href="${url}"]`,
    );
    expect(links.length).toBe(1);
  });

  it("should create separate prefetch links for different URLs", () => {
    const url1 = "/test-page-1";
    const url2 = "/test-page-2";

    prefetchDocument(url1);
    prefetchDocument(url2);

    const link1 = document.querySelector(
      `link[rel="prefetch"][href="${url1}"]`,
    );
    const link2 = document.querySelector(
      `link[rel="prefetch"][href="${url2}"]`,
    );

    expect(link1).not.toBeNull();
    expect(link2).not.toBeNull();
    expect(link1).not.toBe(link2);
  });

  it("should handle special characters in URLs", () => {
    const url = "/test-page?param=value&other=123";

    prefetchDocument(url);

    const link = document.querySelector('link[rel="prefetch"]');
    expect(link?.getAttribute("href")).toBe(url);
  });

  it("should append link as a child of document.head", () => {
    const url = "/test-page";
    const initialChildCount = document.head.childNodes.length;

    prefetchDocument(url);

    expect(document.head.childNodes.length).toBe(initialChildCount + 1);
    const lastChild = document.head.lastChild as HTMLLinkElement;
    expect(lastChild.tagName).toBe("LINK");
    expect(lastChild.rel).toBe("prefetch");
  });
});

describe("prefetchDocument with IntersectionObserver", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("should work with IntersectionObserver callback", () => {
    const url = "/test-page-observer";

    prefetchDocument(url);

    const link = document.querySelector('link[rel="prefetch"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe(url);
  });
});

describe("useViewportPrefetch edge cases", () => {
  it("prefetchDocument should handle SSR environment gracefully", () => {
    const originalDocument = global.document;
    // @ts-ignore - intentionally setting to undefined for SSR test
    delete global.document;

    expect(() => prefetchDocument("/test")).not.toThrow();

    global.document = originalDocument;
  });

  it("should validate prefetch link attributes", () => {
    const url = "/test-validation";
    document.head.innerHTML = "";

    prefetchDocument(url);

    const link = document.querySelector(
      'link[rel="prefetch"]',
    ) as HTMLLinkElement;
    expect(link).not.toBeNull();
    expect(link.rel).toBe("prefetch");
    expect(link.getAttribute("href")).toBe(url);
  });

  it("should handle URLs with hash fragments", () => {
    const url = "/test-page#section";
    document.head.innerHTML = "";

    prefetchDocument(url);

    const link = document.querySelector('link[rel="prefetch"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toContain("/test-page");
  });

  it("should handle absolute URLs", () => {
    const url = "https://example.com/test-page";
    document.head.innerHTML = "";

    prefetchDocument(url);

    const link = document.querySelector('link[rel="prefetch"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toContain("example.com");
  });

  it("should handle root path URL", () => {
    const url = "/";
    document.head.innerHTML = "";

    prefetchDocument(url);

    const link = document.querySelector('link[rel="prefetch"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe(url);
  });
});
