import { createDOM } from "@builder.io/qwik/testing";
import { test, expect, describe } from "vitest";
import { Footer, links } from "./footer";

describe("Footer", () => {
  test(`[Footer Component]: Should be defined`, async () => {
    expect(Footer).toBeDefined();
  });

  test(`[Footer Component]: Should have links defined`, async () => {
    expect(links).toBeDefined();
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
  });

  test(`[Footer Component]: Should have correctly structured links`, async () => {
    for (const link of links) {
      expect(link).toHaveProperty("linkProps");
      expect(link).toHaveProperty("text");
      expect(link.linkProps).toHaveProperty("href");
      expect(typeof link.text).toBe("string");
    }
  });

  test(`[Footer Component]: Should render all links`, async () => {
    const { screen, render } = await createDOM();
    await render(<Footer />);

    for (const link of links) {
      expect(screen.outerHTML).toContain(link.text);
    }
  });

  test(`[Footer Component]: Should have correct link structure in DOM`, async () => {
    const { screen, render } = await createDOM();
    await render(<Footer />);

    const linkElements = Array.from(screen.querySelectorAll("a"));
    expect(linkElements.length).toEqual(links.length);

    linkElements.forEach((element, index) => {
      expect(element.getAttribute("href")).toEqual(links[index].linkProps.href);
      expect(element.textContent).toContain(links[index].text);
    });
  });
});
