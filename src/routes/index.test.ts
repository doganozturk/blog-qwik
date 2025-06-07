import { describe, expect, it, vi, afterEach } from "vitest";

/** Mock import.meta.glob */

const originalGlob = import.meta.glob;

afterEach(() => {
  import.meta.glob = originalGlob;
  vi.clearAllMocks();
});

describe("getPosts", () => {
  it.skip("filters by locale and sorts by date", async () => {
    const modules: Record<string, any> = {
      "/src/routes/first/index.mdx": vi.fn().mockResolvedValue({
        head: {
          title: "First",
          meta: [{ name: "description", content: "desc1" }],
          frontmatter: {
            date: "2022-01-01",
            permalink: "/first/",
            lang: "en",
          },
        },
      }),
      "/src/routes/second/index.mdx": vi.fn().mockResolvedValue({
        head: {
          title: "Second",
          meta: [{ name: "description", content: "desc2" }],
          frontmatter: {
            date: "2023-01-01",
            permalink: "/second/",
            lang: "tr",
          },
        },
      }),
      "/src/routes/third/index.mdx": vi.fn().mockResolvedValue({
        head: {
          title: "Third",
          meta: [{ name: "description", content: "desc3" }],
          frontmatter: {
            date: "2024-01-01",
            permalink: "/third/",
            lang: "en",
          },
        },
      }),
    };

    // mock glob before importing module
    import.meta.glob = vi.fn(() => modules);

    const { getPosts } = await import("./index");
    const posts = await getPosts();

    expect(posts).toEqual([
      {
        title: "Third",
        description: "desc3",
        date: "2024-01-01",
        permalink: "/third/",
        lang: "en",
      },
      {
        title: "First",
        description: "desc1",
        date: "2022-01-01",
        permalink: "/first/",
        lang: "en",
      },
    ]);
  });
});
