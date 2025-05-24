import { test, expect, describe } from "vitest";
import { PostSummaryListItem } from "./post-summary-list-item";
import { createDOM } from "../../../../vitest.setup";

describe("PostSummaryListItem", () => {
  test(`[PostSummaryListItem Component]: Should be defined`, async () => {
    expect(PostSummaryListItem).toBeDefined();
  });

  test(`[PostSummaryListItem Component]: Should render properly in DOM`, async () => {
    const mockData = {
      title: "Test Post",
      description: "This is a test post description",
      permalink: "/test-post",
      date: "2023-01-01",
      lang: "en",
    };

    const { screen, render } = await createDOM();
    await render(
      <PostSummaryListItem
        title={mockData.title}
        description={mockData.description}
        permalink={mockData.permalink}
        date={mockData.date}
        lang={mockData.lang}
      />,
    );

    expect(screen.outerHTML).toContain("post-summary-list-item");
  });

  test(`[PostSummaryListItem Component]: Should display correct content`, async () => {
    const mockData = {
      title: "Test Post",
      description: "This is a test post description",
      permalink: "/test-post",
      date: "2023-01-01",
      lang: "en",
    };

    const { screen, render } = await createDOM();
    await render(
      <PostSummaryListItem
        title={mockData.title}
        description={mockData.description}
        permalink={mockData.permalink}
        date={mockData.date}
        lang={mockData.lang}
      />,
    );

    // Check if the title is rendered correctly
    const titleElement = screen.querySelector(".title");
    expect(titleElement).not.toBeNull();
    expect(titleElement?.textContent).toBe(mockData.title);

    // Check if the description is rendered correctly
    const summaryElement = screen.querySelector(".summary");
    expect(summaryElement).not.toBeNull();
    expect(summaryElement?.textContent).toBe(mockData.description);

    // Check if the permalink is set correctly
    const linkElement = screen.querySelector("a.post-summary-list-item");
    expect(linkElement).not.toBeNull();
    expect(linkElement?.getAttribute("href")).toBe(mockData.permalink);

    // Check if the date is rendered (we can't check the exact formatted value without mocking the formatDistance function)
    const dateElement = screen.querySelector(".date");
    expect(dateElement).not.toBeNull();
    expect(dateElement?.textContent).not.toBe("");
  });

  test(`[PostSummaryListItem Component]: Should have correct CSS classes`, async () => {
    const mockData = {
      title: "Test Post",
      description: "This is a test post description",
      permalink: "/test-post",
      date: "2023-01-01",
      lang: "en",
    };

    const { screen, render } = await createDOM();
    await render(
      <PostSummaryListItem
        title={mockData.title}
        description={mockData.description}
        permalink={mockData.permalink}
        date={mockData.date}
        lang={mockData.lang}
      />,
    );

    const linkElement = screen.querySelector("a");
    expect(linkElement).not.toBeNull();
    expect(linkElement?.classList.contains("post-summary-list-item")).toBe(
      true,
    );

    const titleElement = screen.querySelector("h2");
    expect(titleElement).not.toBeNull();
    expect(titleElement?.classList.contains("title")).toBe(true);

    const dateElement = screen.querySelector("p:first-of-type");
    expect(dateElement).not.toBeNull();
    expect(dateElement?.classList.contains("date")).toBe(true);

    const summaryElement = screen.querySelector("p:last-of-type");
    expect(summaryElement).not.toBeNull();
    expect(summaryElement?.classList.contains("summary")).toBe(true);
  });
});
