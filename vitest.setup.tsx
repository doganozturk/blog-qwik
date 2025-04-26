import "@testing-library/jest-dom/vitest";

import { component$, useContextProvider, useStore } from "@builder.io/qwik";
import { ThemeContext } from "~/routes/layout";
import { createDOM as _createDOM } from "@builder.io/qwik/testing";

export async function createDOM() {
  const dom = await _createDOM();
  const origRender = dom.render;

  dom.render = async (node: any) =>
    origRender(<GlobalProviders>{node}</GlobalProviders>);

  return dom;
}

const GlobalProviders = component$((props: { children?: any }) => {
  const store = useStore({ value: "light" });
  useContextProvider(ThemeContext, store);
  return <>{props.children}</>;
});
