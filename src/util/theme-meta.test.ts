/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  THEME_COLOR_META_ID,
  APPLE_STATUS_BAR_META_ID,
  THEME_META,
  DEFAULT_THEME_META_KEY,
  getThemeMeta,
  applyThemeMeta,
} from "./theme-meta";

describe("theme-meta constants", () => {
  it("should export theme color meta ID", () => {
    expect(THEME_COLOR_META_ID).toBe("meta-theme-color");
  });

  it("should export apple status bar meta ID", () => {
    expect(APPLE_STATUS_BAR_META_ID).toBe("meta-apple-status-bar-style");
  });

  it("should have light and dark theme configurations", () => {
    expect(THEME_META.light).toEqual({
      themeColor: "#ecf0f1",
      appleStatusBarStyle: "default",
    });

    expect(THEME_META.dark).toEqual({
      themeColor: "#1a2334",
      appleStatusBarStyle: "black",
    });
  });

  it("should have default theme meta key", () => {
    expect(DEFAULT_THEME_META_KEY).toBe("dark");
  });
});

describe("getThemeMeta", () => {
  it("should return light theme meta", () => {
    const meta = getThemeMeta("light");
    expect(meta).toEqual(THEME_META.light);
  });

  it("should return dark theme meta", () => {
    const meta = getThemeMeta("dark");
    expect(meta).toEqual(THEME_META.dark);
  });
});

describe("applyThemeMeta", () => {
  beforeEach(() => {
    // Clear the document head before each test
    document.head.innerHTML = "";
    document.body.className = "";
  });

  it("should apply dark theme meta to document", () => {
    // Create meta tags
    const themeColorMeta = document.createElement("meta");
    themeColorMeta.id = THEME_COLOR_META_ID;
    themeColorMeta.name = "theme-color";
    document.head.appendChild(themeColorMeta);

    const appleStatusBarMeta = document.createElement("meta");
    appleStatusBarMeta.id = APPLE_STATUS_BAR_META_ID;
    appleStatusBarMeta.name = "apple-mobile-web-app-status-bar-style";
    document.head.appendChild(appleStatusBarMeta);

    applyThemeMeta("dark");

    expect(themeColorMeta.content).toBe(THEME_META.dark.themeColor);
    expect(appleStatusBarMeta.content).toBe(
      THEME_META.dark.appleStatusBarStyle,
    );
    expect(document.body.classList.contains("dark")).toBe(true);
    expect(document.body.classList.contains("light")).toBe(false);
  });

  it("should apply light theme meta to document", () => {
    // Create meta tags
    const themeColorMeta = document.createElement("meta");
    themeColorMeta.id = THEME_COLOR_META_ID;
    themeColorMeta.name = "theme-color";
    document.head.appendChild(themeColorMeta);

    const appleStatusBarMeta = document.createElement("meta");
    appleStatusBarMeta.id = APPLE_STATUS_BAR_META_ID;
    appleStatusBarMeta.name = "apple-mobile-web-app-status-bar-style";
    document.head.appendChild(appleStatusBarMeta);

    applyThemeMeta("light");

    expect(themeColorMeta.content).toBe(THEME_META.light.themeColor);
    expect(appleStatusBarMeta.content).toBe(
      THEME_META.light.appleStatusBarStyle,
    );
    expect(document.body.classList.contains("light")).toBe(true);
    expect(document.body.classList.contains("dark")).toBe(false);
  });

  it("should switch from light to dark theme", () => {
    // Create meta tags
    const themeColorMeta = document.createElement("meta");
    themeColorMeta.id = THEME_COLOR_META_ID;
    document.head.appendChild(themeColorMeta);

    const appleStatusBarMeta = document.createElement("meta");
    appleStatusBarMeta.id = APPLE_STATUS_BAR_META_ID;
    document.head.appendChild(appleStatusBarMeta);

    // Apply light theme first
    applyThemeMeta("light");
    expect(document.body.classList.contains("light")).toBe(true);

    // Switch to dark theme
    applyThemeMeta("dark");
    expect(document.body.classList.contains("dark")).toBe(true);
    expect(document.body.classList.contains("light")).toBe(false);
  });

  it("should work with custom document parameter", () => {
    const customDoc = document.implementation.createHTMLDocument("test");

    const themeColorMeta = customDoc.createElement("meta");
    themeColorMeta.id = THEME_COLOR_META_ID;
    customDoc.head.appendChild(themeColorMeta);

    const appleStatusBarMeta = customDoc.createElement("meta");
    appleStatusBarMeta.id = APPLE_STATUS_BAR_META_ID;
    customDoc.head.appendChild(appleStatusBarMeta);

    applyThemeMeta("dark", customDoc);

    expect(themeColorMeta.content).toBe(THEME_META.dark.themeColor);
    expect(appleStatusBarMeta.content).toBe(
      THEME_META.dark.appleStatusBarStyle,
    );
  });

  it("should handle missing meta tags gracefully", () => {
    // No meta tags created
    expect(() => applyThemeMeta("dark")).not.toThrow();
  });

  it("should handle null document parameter", () => {
    expect(() => applyThemeMeta("dark", null)).not.toThrow();
  });

  it("should handle undefined document in SSR environment", () => {
    const originalDocument = global.document;
    // @ts-ignore - intentionally setting to undefined for SSR test
    delete global.document;

    expect(() => applyThemeMeta("dark")).not.toThrow();

    // Restore document
    global.document = originalDocument;
  });
});
