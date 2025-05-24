import { test, expect, describe } from "vitest";
import { PostVideo } from "./post-video";
import { createDOM } from "../../../vitest.setup";

describe("PostVideo", () => {
  test(`[PostVideo Component]: Should be defined`, async () => {
    expect(PostVideo).toBeDefined();
  });

  test(`[PostVideo Component]: Should render properly in DOM`, async () => {
    const mockData = {
      id: "test-video-id",
      title: "Test Video Title",
    };

    const { screen, render } = await createDOM();
    await render(<PostVideo id={mockData.id} title={mockData.title} />);

    expect(screen.outerHTML).toContain("post-video");
  });

  test(`[PostVideo Component]: Should create correct YouTube embed URL`, async () => {
    const mockData = {
      id: "test-video-id",
      title: "Test Video Title",
    };

    const { screen, render } = await createDOM();
    await render(<PostVideo id={mockData.id} title={mockData.title} />);

    const iframeElement = screen.querySelector("iframe");
    expect(iframeElement).not.toBeNull();
    expect(iframeElement?.getAttribute("src")).toBe(
      `https://www.youtube.com/embed/${mockData.id}`,
    );
  });

  test(`[PostVideo Component]: Should set correct title attribute`, async () => {
    const mockData = {
      id: "test-video-id",
      title: "Test Video Title",
    };

    const { screen, render } = await createDOM();
    await render(<PostVideo id={mockData.id} title={mockData.title} />);

    const iframeElement = screen.querySelector("iframe");
    expect(iframeElement).not.toBeNull();
    expect(iframeElement?.getAttribute("title")).toBe(mockData.title);
  });

  test(`[PostVideo Component]: Should include srcdoc with thumbnail`, async () => {
    const mockData = {
      id: "test-video-id",
      title: "Test Video Title",
    };

    const { screen, render } = await createDOM();
    await render(<PostVideo id={mockData.id} title={mockData.title} />);

    const iframeElement = screen.querySelector("iframe");
    expect(iframeElement).not.toBeNull();

    const srcdoc = iframeElement?.getAttribute("srcdoc");
    expect(srcdoc).not.toBeNull();
    expect(srcdoc).toContain(
      `https://img.youtube.com/vi/${mockData.id}/hqdefault.jpg`,
    );
    expect(srcdoc).toContain(
      `https://www.youtube.com/embed/${mockData.id}?autoplay=1`,
    );
    expect(srcdoc).toContain(`alt='${mockData.title}'`);
  });

  test(`[PostVideo Component]: Should have correct iframe attributes`, async () => {
    const mockData = {
      id: "test-video-id",
      title: "Test Video Title",
    };

    const { screen, render } = await createDOM();
    await render(<PostVideo id={mockData.id} title={mockData.title} />);

    const iframeElement = screen.querySelector("iframe");
    expect(iframeElement).not.toBeNull();
    expect(iframeElement?.getAttribute("loading")).toBe("lazy");
    expect(iframeElement?.getAttribute("width")).toBe("560");
    expect(iframeElement?.getAttribute("height")).toBe("315");
    expect(iframeElement?.getAttribute("allow")).toContain("accelerometer");
    expect(iframeElement?.getAttribute("allow")).toContain("autoplay");
    expect(iframeElement?.hasAttribute("allowFullscreen")).toBe(true);
  });

  test(`[PostVideo Component]: Should have correct CSS classes`, async () => {
    const mockData = {
      id: "test-video-id",
      title: "Test Video Title",
    };

    const { screen, render } = await createDOM();
    await render(<PostVideo id={mockData.id} title={mockData.title} />);

    const divElement = screen.querySelector("div");
    expect(divElement).not.toBeNull();
    expect(divElement?.classList.contains("post-video")).toBe(true);
  });
});
