import { describe, expect, it } from "vitest";
import type { DocumentHeadValue } from "@builder.io/qwik-city";
import IndexPage, { loadPosts, head } from "./index";

const createMockModule = ({
  title,
  description,
  date,
  permalink,
  lang,
}: {
  title: string;
  description?: string;
  date: string;
  permalink: string;
  lang: string;
}) => {
  return async () =>
    ({
      head: {
        title,
        meta:
          description !== undefined
            ? [{ name: "description", content: description }]
            : [],
        links: [],
        styles: [],
        scripts: [],
        frontmatter: { date, permalink, lang },
      },
    }) as any;
};

describe("index page metadata", () => {
  const getHeadValue = () => head as DocumentHeadValue;

  it("contains the base metadata", () => {
    const headValue = getHeadValue();
    expect(headValue.title).toBe("Doğan Öztürk | Blog");
    expect(headValue.meta).toBeDefined();

    const descriptionMeta = headValue.meta?.find(
      (meta) => meta.name === "description",
    );

    expect(descriptionMeta?.content).toContain("software engineer");
  });

  it("includes Twitter tags", () => {
    const headValue = getHeadValue();

    const twitterCard = headValue.meta?.find(
      (meta) => meta.name === "twitter:card",
    );
    const twitterSite = headValue.meta?.find(
      (meta) => meta.name === "twitter:site",
    );

    expect(twitterCard?.content).toBe("summary");
    expect(twitterSite?.content).toBe("Doğan Öztürk | Blog");
  });

  it("includes OpenGraph tags", () => {
    const headValue = getHeadValue();

    const ogTitle = headValue.meta?.find(
      (meta) => meta.property === "og:title",
    );
    const ogType = headValue.meta?.find((meta) => meta.property === "og:type");
    const ogUrl = headValue.meta?.find((meta) => meta.property === "og:url");

    expect(ogTitle?.content).toBe("Doğan Öztürk | Blog");
    expect(ogType?.content).toBe("article");
    expect(ogUrl?.content).toBe("https://doganozturk.dev/");
  });
});

describe("loadPosts", () => {
  it("filters non-English posts and sorts in descending order", async () => {
    const modules = {
      "/src/routes/posts/first/index.mdx": createMockModule({
        title: "First",
        description: "First description",
        date: "2024-01-10",
        permalink: "/posts/first",
        lang: "en",
      }),
      "/src/routes/posts/second/index.mdx": createMockModule({
        title: "Second",
        date: "2024-02-01",
        permalink: "/posts/second",
        lang: "en",
      }),
      "/src/routes/posts/third/index.mdx": createMockModule({
        title: "Third",
        description: "Should be filtered",
        date: "2024-03-01",
        permalink: "/posts/third",
        lang: "tr",
      }),
    } as unknown as Parameters<typeof loadPosts>[0];

    const posts = await loadPosts(modules);

    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe("Second");
    expect(posts[0].description).toBe("");
    expect(posts[1].title).toBe("First");
    expect(posts.every((post) => post.lang === "en")).toBe(true);
  });

  it("returns an empty array when there are no modules", async () => {
    const posts = await loadPosts(
      {} as unknown as Parameters<typeof loadPosts>[0],
    );
    expect(posts).toEqual([]);
  });
});

describe("IndexPage component", () => {
  it("exports the default component", () => {
    expect(IndexPage).toBeDefined();
    expect(typeof IndexPage).toBe("function");
  });
});
