import { describe, expect, it } from "vitest";
import { head } from "./layout";

describe("posts layout head", () => {
  it("generates meta tags", () => {
    const result = head({
      head: {
        title: "My Post",
        meta: [{ name: "description", content: "awesome" }],
        frontmatter: { permalink: "/my-post" },
      },
    } as any);

    const meta = result.meta;
    const find = (attr: string, value: string) =>
      meta.find((m: any) => m[attr] === value);

    expect(find("name", "twitter:title").content).toBe("My Post");
    expect(find("property", "og:url").content).toBe(
      "https://doganozturk.dev/my-post",
    );
    expect(find("name", "twitter:image").content).toContain("avatar.jpg");
  });
});
