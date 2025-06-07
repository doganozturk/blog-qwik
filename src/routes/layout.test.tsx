/* @vitest-environment jsdom */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import Layout, { LS_THEME, ThemeType } from "./layout";
import { createDOM } from "../../vitest.setup";

vi.mock("~/util", async () => {
  const actual = await vi.importActual<typeof import("~/util")>("~/util");
  return {
    ...actual,
    getColorScheme: vi.fn(() => actual.ColorScheme.Dark),
  };
});

describe("Layout", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.skip("initializes theme from localStorage", async () => {
    window.localStorage.setItem(LS_THEME, "dark");
    const getItemSpy = vi.spyOn(window.localStorage, "getItem");
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");

    const { screen, render } = await createDOM();
    await render(<Layout />);

    document.dispatchEvent(new Event("DOMContentLoaded"));

    const container = screen.querySelector(".theme-container");
    expect(getItemSpy).toHaveBeenCalledWith(LS_THEME);
    expect(container?.classList.contains(ThemeType.Dark)).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith(LS_THEME, ThemeType.Dark);
  });

  it.skip("uses system preference when no stored theme", async () => {
    const setItemSpy = vi.spyOn(window.localStorage, "setItem");
    const { screen, render } = await createDOM();
    await render(<Layout />);

    document.dispatchEvent(new Event("DOMContentLoaded"));

    const container = screen.querySelector(".theme-container");
    expect(container?.classList.contains(ThemeType.Dark)).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith(LS_THEME, ThemeType.Dark);
  });
});
