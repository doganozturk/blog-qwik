import { getColorScheme, ColorScheme } from "./get-color-scheme";
import { vi } from "vitest";

vi.mock("@builder.io/qwik", () => ({
  isServer: false,
}));

describe("getColorScheme", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn();
  });

  it("should return Dark when system prefers dark mode", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
    }));

    expect(getColorScheme()).toBe(ColorScheme.Dark);
  });

  it("should return Light when system prefers light mode", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: light)",
      media: query,
    }));

    expect(getColorScheme()).toBe(ColorScheme.Light);
  });

  it("should return NoPreference when system has no preference", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
    }));

    expect(getColorScheme()).toBe(ColorScheme.NoPreference);
  });

  it("should handle case when matchMedia is not available", () => {
    // @ts-ignore - Intentionally setting matchMedia to undefined
    window.matchMedia = undefined;

    expect(getColorScheme()).toBe(ColorScheme.NoPreference);
  });
});
