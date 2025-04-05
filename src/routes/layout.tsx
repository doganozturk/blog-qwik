import {
  component$,
  Slot,
  useTask$,
  useContextProvider,
  useSignal,
  createContext,
  useOnDocument,
  $,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { Footer } from "~/components/footer/footer";
import { ColorScheme, getColorScheme } from "~/util";

export const LS_THEME = "theme";

export enum ThemeType {
  Light = "light",
  Dark = "dark",
}

export const ThemeContext = createContext<{ value: string }>("theme-context");

export default component$(() => {
  const theme = useSignal<string>("");
  useContextProvider(ThemeContext, theme);

  // Save theme to localStorage when it changes
  useTask$(({ track }) => {
    const currentTheme = track(() => theme.value);

    if (isServer || !currentTheme) {
      return;
    }

    localStorage.setItem(LS_THEME, currentTheme);
  });

  // Initialize theme from localStorage or system preference
  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      theme.value =
        localStorage.getItem(LS_THEME) ||
        (getColorScheme() === ColorScheme.Dark
          ? ThemeType.Dark
          : ThemeType.Light);
    })
  );

  return (
    <div class={`theme-container ${theme.value}`}>
      <div class="container">
        <Slot name="header" />
        <Slot />
        <Footer />
      </div>
    </div>
  );
});
