import { getColorScheme, ColorScheme } from "./get-color-scheme";
import { vi } from "vitest";

vi.mock("@builder.io/qwik", () => ({
  isServer: true,
}));

describe("getColorScheme", () => {
  it("should return Light when running on the server", () => {
    expect(getColorScheme()).toBe(ColorScheme.Light);
  });
});
