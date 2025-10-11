import { describe, expect, it } from "vitest";
import type {
  DocumentHeadProps,
  DocumentHeadValue,
} from "@builder.io/qwik-city";
import { createDOM } from "../../../vitest.setup";
import Layout, { head } from "./layout";

type MetaTag = {
  name?: string;
  property?: string;
  content?: string;
};

function createMockDocumentHeadProps(
  title: string,
  meta: MetaTag[],
  permalink: string,
): DocumentHeadProps {
  return {
    head: {
      title,
      meta,
      links: [],
      styles: [],
      scripts: [],
      frontmatter: { permalink },
    },
    params: {},
    url: new URL("https://example.com"),
    isNavigating: false,
    prevUrl: undefined,
    withLocale: <T = unknown,>(fn: () => T): T => fn(),
    resolveValue: () => undefined,
  };
}

function callDocumentHead(
  headFunction: typeof head,
  props: DocumentHeadProps,
): DocumentHeadValue {
  if (typeof headFunction === "function") {
    return headFunction(props);
  }
  return headFunction;
}

describe("posts layout", () => {
  it("exports default component", () => {
    expect(Layout).toBeDefined();
    expect(typeof Layout).toBe("function");
  });

  it("renders post header and projected slot content", async () => {
    const { render, screen } = await createDOM();
    await render(
      <Layout>
        <div id="slot-content">Slot Content</div>
      </Layout>,
    );

    const article = screen.querySelector("article.post");
    expect(article).toBeTruthy();
    expect(article?.textContent).toContain("Slot Content");

    const header = screen.querySelector("header");
    expect(header).toBeTruthy();
  });

  it("generates meta tags", () => {
    const mockProps = createMockDocumentHeadProps(
      "My Post",
      [{ name: "description", content: "awesome" }],
      "/my-post",
    );

    const result = callDocumentHead(head, mockProps);
    const meta = result.meta || [];

    const find = (attr: keyof MetaTag, value: string) =>
      meta.find((m: MetaTag) => m[attr] === value);

    expect(find("name", "twitter:title")?.content).toBe("My Post");
    expect(find("property", "og:url")?.content).toBe(
      "https://doganozturk.dev/my-post",
    );
    expect(find("name", "twitter:image")?.content).toContain("avatar.jpg");
  });

  it("generates all required social media meta tags", () => {
    const mockProps = createMockDocumentHeadProps(
      "Test Post",
      [{ name: "description", content: "Test description" }],
      "/test",
    );

    const result = callDocumentHead(head, mockProps);
    const meta = result.meta || [];

    const hasTag = (attr: keyof MetaTag, value: string) =>
      meta.some((m: MetaTag) => m[attr] === value);

    expect(hasTag("name", "twitter:card")).toBe(true);
    expect(hasTag("name", "twitter:site")).toBe(true);
    expect(hasTag("property", "og:type")).toBe(true);
    expect(hasTag("property", "og:site_name")).toBe(true);
  });

  it("preserves original head metadata", () => {
    const originalMeta: MetaTag[] = [
      { name: "description", content: "Test description" },
      { name: "keywords", content: "test, blog" },
    ];

    const mockProps = createMockDocumentHeadProps(
      "Test Post",
      originalMeta,
      "/test",
    );

    const result = callDocumentHead(head, mockProps);

    expect(result.title).toBe("Test Post");
    expect(result.meta).toContain(originalMeta[0]);
    expect(result.meta).toContain(originalMeta[1]);
  });

  it("handles missing description gracefully", () => {
    const mockProps = createMockDocumentHeadProps("Test Post", [], "/test");

    const result = callDocumentHead(head, mockProps);
    const meta = result.meta || [];

    const twitterDesc = meta.find(
      (m: MetaTag) => m.name === "twitter:description",
    );
    const ogDesc = meta.find((m: MetaTag) => m.property === "og:description");

    expect(twitterDesc?.content).toBeUndefined();
    expect(ogDesc?.content).toBeUndefined();
  });

  it("returns literal head value when provided", () => {
    const staticHead: DocumentHeadValue = {
      title: "Static Head",
      meta: [],
      links: [],
      styles: [],
      scripts: [],
      frontmatter: { permalink: "/static" },
    };

    const mockProps = createMockDocumentHeadProps("Ignored", [], "/ignored");
    const result = callDocumentHead(staticHead, mockProps);

    expect(result).toBe(staticHead);
  });
});
