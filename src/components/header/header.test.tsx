import { test, expect, describe } from "vitest";
import { Header, HeaderType } from "./header";
import { createDOM } from "../../../vitest.setup";

describe("Header", () => {
  test(`[Header Component]: Should be defined`, async () => {
    expect(Header).toBeDefined();
  });

  test(`[Header Component]: Should render properly in DOM with Main type`, async () => {
    const { screen, render } = await createDOM();
    await render(
      <Header type={HeaderType.Main}>
        <div>Test Content</div>
      </Header>
    );

    expect(screen.outerHTML).toContain("header");
    expect(screen.outerHTML).toContain("Test Content");
  });

  test(`[Header Component]: Should render properly in DOM with Post type`, async () => {
    const { screen, render } = await createDOM();
    await render(
      <Header type={HeaderType.Post}>
        <div>Test Content</div>
      </Header>
    );

    expect(screen.outerHTML).toContain("header");
    expect(screen.outerHTML).toContain("Test Content");
  });

  test(`[Header Component]: Should have correct aria-label based on type`, async () => {
    // Test with Main type
    const { screen: screenMain, render: renderMain } = await createDOM();
    await renderMain(
      <Header type={HeaderType.Main}>
        <div>Test Content</div>
      </Header>
    );

    const anchorMain = screenMain.querySelector("a.header-main");
    expect(anchorMain).not.toBeNull();
    expect(anchorMain?.getAttribute("aria-label")).toBe("");

    // Test with Post type
    const { screen: screenPost, render: renderPost } = await createDOM();
    await renderPost(
      <Header type={HeaderType.Post}>
        <div>Test Content</div>
      </Header>
    );

    const anchorPost = screenPost.querySelector("a.header-main");
    expect(anchorPost).not.toBeNull();
    expect(anchorPost?.getAttribute("aria-label")).toBe("back");
  });

  test(`[Header Component]: Should include ThemeSwitcher component`, async () => {
    const { screen, render } = await createDOM();
    await render(
      <Header type={HeaderType.Main}>
        <div>Test Content</div>
      </Header>
    );

    const themeSwitcher = screen.querySelector(".theme-switcher");
    expect(themeSwitcher).not.toBeNull();
  });

  test(`[Header Component]: Should have correct CSS classes`, async () => {
    const { screen, render } = await createDOM();
    await render(
      <Header type={HeaderType.Main}>
        <div>Test Content</div>
      </Header>
    );

    const headerElement = screen.querySelector("header");
    expect(headerElement).not.toBeNull();
    expect(headerElement?.classList.contains("header")).toBe(true);

    const anchorElement = screen.querySelector("a");
    expect(anchorElement).not.toBeNull();
    expect(anchorElement?.classList.contains("header-main")).toBe(true);
  });
});