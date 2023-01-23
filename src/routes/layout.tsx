import {
  component$,
  createContext,
  Slot,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";

export const LS_THEME = "theme";

export enum ThemeType {
  Light = "light",
  Dark = "dark",
}

export interface Theme {
  theme: string;
}

export const ThemeContext = createContext<Theme>("theme-context");

export default component$(() => {
  const state = useStore<Theme>({
    theme: "",
  });
  useContextProvider(ThemeContext, state);

  useClientEffect$(({ track }) => {
    const theme = track(() => state.theme);

    if (theme) {
      localStorage.setItem(LS_THEME, theme);
    }
  });

  useClientEffect$(({ track }) => {
    const theme = track(() => localStorage.getItem(LS_THEME));

    if (!state.theme && theme) {
      state.theme = theme;
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
