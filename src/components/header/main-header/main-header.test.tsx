import { test, expect, describe } from "vitest";
import { MainHeader } from "./main-header";
import { Header, HeaderType } from "~/components/header/header";

vi.mock("@builder.io/qwik", async () => {
  const actual = await vi.importActual("@builder.io/qwik");
  return {
    ...actual,
    component$: (fn: any) => fn,
    useStylesScoped$: () => {},
  };
});

describe("MainHeader", () => {
  test("should be defined", () => {
    expect(MainHeader).toBeDefined();
  });

  test("should use Header component with correct type", () => {
    expect(Header).toBeDefined();
    expect(HeaderType.Main).toBeDefined();
  });
});
