import { test, expect, describe, vi } from "vitest";
import { RouterHead } from "./router-head";
import { createDOM } from "../../../vitest.setup";

// Mock the Qwik City hooks
vi.mock("@builder.io/qwik-city", () => {
  return {
    useDocumentHead: () => ({
      title: "Test Title",
      meta: [
        { name: "description", content: "Test Description" },
        { name: "keywords", content: "test, qwik, component" },
      ],
      links: [
        { rel: "stylesheet", href: "/test-style.css" },
        { rel: "icon", href: "/favicon.ico" },
      ],
      styles: [
        { props: { id: "test-style" }, style: "body { color: red; }" },
        {
          props: {
            id: "inline-style",
            dangerouslySetInnerHTML: "p { color: blue; }",
          },
          style: "should not override",
        },
      ],
    }),
    useLocation: () => ({
      url: { href: "https://test-site.com/test-page" },
    }),
  };
});

describe("RouterHead", () => {
  test(`[RouterHead Component]: Should be defined`, async () => {
    expect(RouterHead).toBeDefined();
  });

  test(`[RouterHead Component]: Should render title from document head`, async () => {
    const { screen, render } = await createDOM();
    await render(<RouterHead />);

    const titleElement = screen.querySelector("title");
    expect(titleElement).not.toBeNull();
    expect(titleElement?.textContent).toBe("Test Title");
  });

  test(`[RouterHead Component]: Should render canonical link with correct href`, async () => {
    const { screen, render } = await createDOM();
    await render(<RouterHead />);

    const canonicalLink = screen.querySelector("link[rel='canonical']");
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink?.getAttribute("href")).toBe(
      "https://test-site.com/test-page",
    );
  });

  test(`[RouterHead Component]: Should render meta tags from document head`, async () => {
    const { screen, render } = await createDOM();
    await render(<RouterHead />);

    const metaTags = screen.querySelectorAll("meta");
    expect(metaTags.length).toBe(2);

    const descriptionMeta = Array.from(metaTags).find(
      (meta) => meta.getAttribute("name") === "description",
    );
    expect(descriptionMeta).not.toBeNull();
    expect(descriptionMeta?.getAttribute("content")).toBe("Test Description");

    const keywordsMeta = Array.from(metaTags).find(
      (meta) => meta.getAttribute("name") === "keywords",
    );
    expect(keywordsMeta).not.toBeNull();
    expect(keywordsMeta?.getAttribute("content")).toBe("test, qwik, component");
  });

  test(`[RouterHead Component]: Should render links from document head`, async () => {
    const { screen, render } = await createDOM();
    await render(<RouterHead />);

    // We expect 3 links: canonical + 2 from the mock
    const links = screen.querySelectorAll("link");
    expect(links.length).toBe(3);

    const stylesheetLink = Array.from(links).find(
      (link) => link.getAttribute("rel") === "stylesheet",
    );
    expect(stylesheetLink).not.toBeNull();
    expect(stylesheetLink?.getAttribute("href")).toBe("/test-style.css");

    const iconLink = Array.from(links).find(
      (link) => link.getAttribute("rel") === "icon",
    );
    expect(iconLink).not.toBeNull();
    expect(iconLink?.getAttribute("href")).toBe("/favicon.ico");
  });

  test(`[RouterHead Component]: Should render styles from document head`, async () => {
    const { screen, render } = await createDOM();
    await render(<RouterHead />);

    const styleElements = screen.querySelectorAll("style");
    expect(styleElements.length).toBe(2);

    const scopedStyle = Array.from(styleElements).find(
      (style) => style.getAttribute("id") === "test-style",
    );
    expect(scopedStyle).not.toBeNull();
    expect(scopedStyle?.innerHTML).toBe("body { color: red; }");

    const inlineStyle = Array.from(styleElements).find(
      (style) => style.getAttribute("id") === "inline-style",
    );
    expect(inlineStyle).not.toBeNull();
    expect(inlineStyle?.innerHTML).toBe("p { color: blue; }");
  });
});
