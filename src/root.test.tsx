import { vi, describe, expect, it } from "vitest";

vi.mock("@builder.io/qwik-city", () => ({
  QwikCityProvider: (props: any) => <div>{props.children}</div>,
  RouterOutlet: () => <div>router-outlet</div>,
  ServiceWorkerRegister: () => <service-worker-register />,
  useDocumentHead: () => ({ title: "t", meta: [], links: [], styles: [] }),
  useLocation: () => ({ url: { href: "https://example.com" } }),
}));

import Root from "./root";
import { createDOM } from "../vitest.setup";

describe("root", () => {
  it("renders key scripts", async () => {
    const { render, screen } = await createDOM();
    await render(<Root />);

    const bodyScripts = Array.from(screen.querySelectorAll("body script"));
    const themeScript = bodyScripts.find((s) => s.textContent?.includes("ensureTheme"));
    expect(themeScript?.textContent).toContain("ensureTheme");

    expect(screen.outerHTML).toContain("service-worker-register");
  });
});
