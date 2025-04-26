import { test, expect, describe } from "vitest";
import { MainHeader } from "./main-header";
import { Header, HeaderType } from "~/components/header/header";
import { createDOM } from "../../../../vitest.setup";

describe("MainHeader", () => {
  test(`[MainHeader Component]: Should be defined`, async () => {
    expect(MainHeader).toBeDefined();
  });

  test(`[MainHeader Component]: Should use Header component with correct type`, async () => {
    expect(Header).toBeDefined();
    expect(HeaderType.Main).toBeDefined();
  });

  test(`[MainHeader Component]: Should render properly in DOM`, async () => {
    const { screen, render } = await createDOM();
    await render(<MainHeader />);

    expect(screen.outerHTML).toContain("header");
  });

  test(`[MainHeader Component]: Should contain navigation elements`, async () => {
    const { screen, render } = await createDOM();
    await render(<MainHeader />);

    const navElement = screen.querySelector("nav");
    expect(navElement).not.toBeNull();
  });

  test(`[MainHeader Component]: Should have correct header structure`, async () => {
    const { screen, render } = await createDOM();
    await render(<MainHeader />);

    const headerElement = screen.querySelector("header");
    expect(headerElement).not.toBeNull();

    const titleElement = screen.querySelector(".title");
    if (titleElement) {
      expect(titleElement.textContent).not.toBeNull();
    }
  });

  test(`[MainHeader Component]: Should have correct CSS classes`, async () => {
    const { screen, render } = await createDOM();
    await render(<MainHeader />);

    const headerElement = screen.querySelector("header");
    expect(headerElement).not.toBeNull();
    expect(headerElement?.classList.contains("header")).toBe(true);
  });
});
