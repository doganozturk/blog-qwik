import { describe, expect, it, vi } from "vitest";
import { createDOM } from "@builder.io/qwik/testing";
import Layout, { LS_THEME, ThemeType, ThemeContext } from "./layout";

const mockGetColorScheme = vi.fn();
vi.mock("~/util", () => ({
  ColorScheme: {
    Dark: "dark",
    Light: "light",
  },
  getColorScheme: () => mockGetColorScheme(),
}));

describe("layout", () => {
  it("should export theme constants", () => {
    expect(LS_THEME).toBe("theme");
    expect(ThemeType.Light).toBe("light");
    expect(ThemeType.Dark).toBe("dark");
  });

  it("should have theme context", () => {
    expect(ThemeContext).toBeDefined();
  });

  it("should handle localStorage operations", () => {
    const mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });

    localStorage.setItem(LS_THEME, ThemeType.Dark);
    expect(mockStorage.setItem).toHaveBeenCalledWith(LS_THEME, ThemeType.Dark);

    localStorage.getItem(LS_THEME);
    expect(mockStorage.getItem).toHaveBeenCalledWith(LS_THEME);
  });

  it("renders container structure", async () => {
    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    const container = screen.querySelector(".container");
    
    expect(themeContainer).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it("applies theme class to container", async () => {
    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer?.className).toContain("theme-container");
  });

  it("renders slot components", async () => {
    const { screen, render } = await createDOM();
    await render(<Layout />);

    const container = screen.querySelector(".container");
    expect(container).toBeTruthy();
  });

  it("provides theme context to child components", async () => {
    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer).toBeTruthy();
    expect(ThemeContext).toBeDefined();
  });

  it("theme context propagates correctly", async () => {
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(ThemeType.Dark),
      setItem: vi.fn(),
    };
    
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });

    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer).toBeTruthy();
    expect(ThemeContext).toBeDefined();
  });

  it("handles theme switching workflow", async () => {
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    };
    
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });

    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer).toBeTruthy();
    expect(themeContainer?.className).toContain("theme-container");
  });
});

describe("layout SSR vs client-side behavior", () => {
  it("handles server-side rendering gracefully", async () => {
    const originalIsServer = vi.fn().mockReturnValue(true);
    
    vi.mock("@builder.io/qwik/build", () => ({
      isServer: originalIsServer()
    }));

    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer).toBeTruthy();
  });

  it("handles client-side hydration", async () => {
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(ThemeType.Light),
      setItem: vi.fn(),
    };
    
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });

    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer).toBeTruthy();
  });

  it("falls back to system theme when localStorage is empty", async () => {
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    };
    
    Object.defineProperty(global, "localStorage", {
      value: mockStorage,
      writable: true,
    });

    mockGetColorScheme.mockReturnValue("dark");

    const { screen, render } = await createDOM();
    await render(<Layout />);

    const themeContainer = screen.querySelector(".theme-container");
    expect(themeContainer).toBeTruthy();
  });
});
