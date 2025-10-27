import { test, expect, describe } from "vitest";
import { ThemeSwitcher } from "./theme-switcher";
import { createDOM } from "../../../vitest.setup";

describe("ThemeSwitcher", () => {
  test(`[ThemeSwitcher Component]: Should be defined`, async () => {
    expect(ThemeSwitcher).toBeDefined();
  });

  test(`[ThemeSwitcher Component]: Should render properly in DOM`, async () => {
    const { screen, render } = await createDOM();
    await render(<ThemeSwitcher />);

    expect(screen.outerHTML).toContain("theme-switcher");
  });

  test(`[ThemeSwitcher Component]: Should display correct icon based on theme`, async () => {
    const { screen, render } = await createDOM();
    await render(<ThemeSwitcher />);

    const switchElement = screen.querySelector(".switch");
    expect(switchElement).not.toBeNull();
    expect(switchElement?.classList.contains("switch-dark")).toBe(true);
    expect(screen.outerHTML).toContain("🌚");
  });

  test(`[ThemeSwitcher Component]: Should toggle theme when clicked`, async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<ThemeSwitcher />);

    expect(screen.outerHTML).toContain("🌚");

    const themeSwitcher = screen.querySelector(".theme-switcher");
    expect(themeSwitcher).not.toBeNull();
    await userEvent(themeSwitcher!, "click");

    expect(screen.outerHTML).toContain("🌞");
    const switchElement = screen.querySelector(".switch");
    expect(switchElement).not.toBeNull();
    expect(switchElement?.classList.contains("switch-light")).toBe(true);

    await userEvent(themeSwitcher!, "click");

    expect(screen.outerHTML).toContain("🌚");
    const switchElementAfterToggle = screen.querySelector(".switch");
    expect(switchElementAfterToggle).not.toBeNull();
    expect(switchElementAfterToggle?.classList.contains("switch-dark")).toBe(
      true,
    );
  });

  test(`[ThemeSwitcher Component]: Should have correct CSS classes`, async () => {
    const { screen, render } = await createDOM();
    await render(<ThemeSwitcher />);

    const themeSwitcherElement = screen.querySelector(".theme-switcher");
    expect(themeSwitcherElement).not.toBeNull();

    const switchElement = screen.querySelector(".switch");
    expect(switchElement).not.toBeNull();
    expect(switchElement?.classList.contains("switch")).toBe(true);
  });
});
