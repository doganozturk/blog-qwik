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
      expect(link).toHaveProperty("icon");
      expect(link).toHaveProperty("label");
      expect(link.linkProps).toHaveProperty("href");
      expect(typeof link.label).toBe("string");
      expect(typeof link.icon).toBe("function");
    }
  });

  test(`[Footer Component]: Should render all links with icons`, async () => {
    const { screen, render } = await createDOM();
    await render(<Footer />);

    const linkElements = Array.from(screen.querySelectorAll("a"));
    expect(linkElements.length).toEqual(links.length);

    // Check that each link contains an SVG icon
    linkElements.forEach((element) => {
      const svg = element.querySelector("svg");
      expect(svg).toBeTruthy();
    });
  });

  test(`[Footer Component]: Should have correct link structure in DOM`, async () => {
    const { screen, render } = await createDOM();
    await render(<Footer />);

    const linkElements = Array.from(screen.querySelectorAll("a"));
    expect(linkElements.length).toEqual(links.length);

    linkElements.forEach((element, index) => {
      expect(element.getAttribute("href")).toEqual(links[index].linkProps.href);
      expect(element.getAttribute("aria-label")).toEqual(links[index].label);
    });
  });
});
