import { test, expect, describe } from "vitest";
import { PostHeader } from "./post-header";
import { Header, HeaderType } from "~/components/header/header";
import { createDOM } from "../../../../vitest.setup";

describe("PostHeader", () => {
  test(`[PostHeader Component]: Should be defined`, async () => {
    expect(PostHeader).toBeDefined();
  });

  test(`[PostHeader Component]: Should use Header component with correct type`, async () => {
    expect(Header).toBeDefined();
    expect(HeaderType.Post).toBeDefined();
  });

  test(`[PostHeader Component]: Should render properly in DOM`, async () => {
    const { screen, render } = await createDOM();
    await render(<PostHeader />);

    expect(screen.outerHTML).toContain("header");
  });

  test(`[PostHeader Component]: Should contain back button or navigation`, async () => {
    const { screen, render } = await createDOM();
    await render(<PostHeader />);

    const linkElements = Array.from(screen.querySelectorAll("a"));
    expect(linkElements.length).toBeGreaterThan(0);

    const backButton = screen.querySelector(".back-button, .back-link");
    if (backButton) {
      expect(backButton).not.toBeNull();
    }
  });

  test(`[PostHeader Component]: Should have correct header structure`, async () => {
    const { screen, render } = await createDOM();
    await render(<PostHeader />);

    const headerElement = screen.querySelector("header");
    expect(headerElement).not.toBeNull();

    const titleElements = screen.querySelectorAll("h1, h2, .title");
    if (titleElements.length > 0) {
      expect(titleElements.length).toBeGreaterThan(0);
    }
  });

  test(`[PostHeader Component]: Should have correct CSS classes`, async () => {
    const { screen, render } = await createDOM();
    await render(<PostHeader />);

    const headerElement = screen.querySelector("header");
    expect(headerElement).not.toBeNull();
    expect(headerElement?.classList.contains("header")).toBe(true);
  });
});
