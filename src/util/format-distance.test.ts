import { formatDistance, Locale } from "./format-distance";
import { vi } from "vitest";

describe("formatDistance", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-12"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should format distance in English by default", () => {
    const date = "2024-01-11"; // 1 day ago
    const result = formatDistance(date);
    expect(result).toBe("1 day");
  });

  it("should format distance in Turkish when specified", () => {
    const date = "2024-01-11"; // 1 day ago
    const result = formatDistance(date, Locale.tr);
    expect(result).toBe("1 gün");
  });

  it("should handle future dates", () => {
    const date = "2024-01-13"; // 1 day in future
    const result = formatDistance(date);
    expect(result).toBe("1 day");
  });

  it("should handle dates more than a month ago", () => {
    const date = "2023-12-01";
    const result = formatDistance(date);
    expect(result).toBe("about 1 month"); // Updated expectation
  });
});
