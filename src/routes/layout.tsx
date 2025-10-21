import {
  component$,
  Slot,
  useTask$,
  useContextProvider,
  useSignal,
  createContextId,
  useOnDocument,
  $,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { Footer } from "~/components/footer/footer";
import { ColorScheme, applyThemeMeta, getColorScheme } from "~/util";
import type { ThemeMetaKey } from "~/util";

export const LS_THEME = "theme";

export enum ThemeType {
  Light = "light",
  Dark = "dark",
}

export const ThemeContext = createContextId<{ value: ThemeMetaKey | "" }>(
  "theme-context",
);

const isValidTheme = (
  value: string | null | undefined,
): value is ThemeMetaKey =>
  value === ThemeType.Light || value === ThemeType.Dark;

export default component$(() => {
  const initialTheme: ThemeMetaKey =
    getColorScheme() === ColorScheme.Dark ? ThemeType.Dark : ThemeType.Light;
  const theme = useSignal<ThemeMetaKey | "">(initialTheme);
  useContextProvider(ThemeContext, theme);

  // Save theme to localStorage when it changes
  useTask$(({ track }) => {
    const currentTheme = track(() => theme.value);

    if (isServer || !isValidTheme(currentTheme)) {
      return;
    }

    localStorage.setItem(LS_THEME, currentTheme);
    applyThemeMeta(currentTheme);
  });

  // Initialize theme from localStorage or system preference
  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      const storedTheme = localStorage.getItem(LS_THEME);

      if (isValidTheme(storedTheme)) {
        theme.value = storedTheme;
        applyThemeMeta(storedTheme);
        return;
      }

      const fallbackTheme: ThemeMetaKey =
        getColorScheme() === ColorScheme.Dark
          ? ThemeType.Dark
          : ThemeType.Light;

      theme.value = fallbackTheme;
      applyThemeMeta(fallbackTheme);
    }),
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
