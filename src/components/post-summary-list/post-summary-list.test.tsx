import { test, expect, describe } from "vitest";
import { PostSummaryList } from "./post-summary-list";
import { createDOM } from "../../../vitest.setup";
import { PostSummary } from "./post-summary-list-item/post-summary-list-item";

describe("PostSummaryList", () => {
  test(`[PostSummaryList Component]: Should be defined`, async () => {
    expect(PostSummaryList).toBeDefined();
  });

  test(`[PostSummaryList Component]: Should render properly in DOM with empty data`, async () => {
    const { screen, render } = await createDOM();
    await render(<PostSummaryList data={[]} />);

    const sectionElement = screen.querySelector("section.post-summary-list");
    expect(sectionElement).not.toBeNull();
    expect(sectionElement?.children.length).toBe(0);
  });

  test(`[PostSummaryList Component]: Should render properly with data`, async () => {
    const mockData: PostSummary[] = [
      {
        title: "Test Post 1",
        description: "This is a test post description",
        permalink: "/test-post-1",
        date: "2023-01-01",
        lang: "en",
      },
      {
        title: "Test Post 2",
        description: "This is another test post description",
        permalink: "/test-post-2",
        date: "2023-01-02",
        lang: "en",
      },
    ];

    const { screen, render } = await createDOM();
    await render(<PostSummaryList data={mockData} />);

    const sectionElement = screen.querySelector("section.post-summary-list");
    expect(sectionElement).not.toBeNull();
    expect(sectionElement?.children.length).toBe(2);

    // Check if the titles are rendered correctly
    const titles = screen.querySelectorAll(".title");
    expect(titles.length).toBe(2);
    expect(titles[0].textContent).toBe("Test Post 1");
    expect(titles[1].textContent).toBe("Test Post 2");

    // Check if the permalinks are set correctly
    const links = screen.querySelectorAll("a.post-summary-list-item");
    expect(links.length).toBe(2);
    expect(links[0].getAttribute("href")).toBe("/test-post-1");
    expect(links[1].getAttribute("href")).toBe("/test-post-2");

    // Check if the descriptions are rendered correctly
    const summaries = screen.querySelectorAll(".summary");
    expect(summaries.length).toBe(2);
    expect(summaries[0].textContent).toBe("This is a test post description");
    expect(summaries[1].textContent).toBe(
      "This is another test post description",
    );
  });

  test(`[PostSummaryList Component]: Should have correct CSS classes`, async () => {
    const mockData: PostSummary[] = [
      {
        title: "Test Post",
        description: "This is a test post description",
        permalink: "/test-post",
        date: "2023-01-01",
        lang: "en",
      },
    ];

    const { screen, render } = await createDOM();
    await render(<PostSummaryList data={mockData} />);

    const sectionElement = screen.querySelector("section");
    expect(sectionElement).not.toBeNull();
    expect(sectionElement?.classList.contains("post-summary-list")).toBe(true);
  });
});
