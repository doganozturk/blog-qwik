import {
  component$,
  createContext,
  Slot,
  useClientEffect$,
  useContextProvider,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { RequestHandler, useEndpoint } from "@builder.io/qwik-city";
import { Footer } from "~/components/footer/footer";
import { setCookie } from "~/util/cookie";

export interface Theme {
  theme: string;
}

export const ThemeContext = createContext<Theme>("theme-context");

export const onGet: RequestHandler<Theme> = async ({ cookie }) => {
  const theme = cookie.get("theme")?.value || "";

  return {
    theme,
  };
};

export default component$(() => {
  const pageData = useEndpoint<Theme>();

  const state = useStore<Theme>({
    theme: "",
  });
  useContextProvider(ThemeContext, state);

  useTask$(async ({ track }) => {
    track(() => pageData);

    const { theme } = await pageData.value;

    state.theme = theme;
  });

  useClientEffect$(({ track }) => {
    const theme = track(() => state.theme);

    if (theme) {
      setCookie("theme", theme, 365);
    }
  });

  return (
    <div class={`theme-container ${state.theme}`}>
      <div class="container">
        <Slot name="header" />
        <Slot />
        <Footer />
      </div>
    </div>
  );
});
