import { component$, createContext, Slot, useContextProvider, useStore, useWatch$ } from "@builder.io/qwik";
import { RequestHandler, useEndpoint } from "@builder.io/qwik-city";
import { Footer } from "~/components/footer/footer";

export interface SharedState {
  theme: string;
}

export const ThemeContext = createContext<SharedState>("theme-context");

export const onGet: RequestHandler<SharedState> = async ({ cookie }) => {
  const theme = cookie.get('theme')?.value || '';

  return {
    theme,
  }
};

export default component$(() => {
  const pageData = useEndpoint<SharedState>();

  const state = useStore<SharedState>({
    theme: "",
  });
  useContextProvider(ThemeContext, state);

  useWatch$(async ({track}) => {
    track(() => pageData);

    const { theme } = await pageData.promise;

    state.theme = theme;
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
