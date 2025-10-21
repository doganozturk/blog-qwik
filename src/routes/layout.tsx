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
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): ThemeMetaKey => {
    if (isServer) {
      return getColorScheme() === ColorScheme.Dark
        ? ThemeType.Dark
        : ThemeType.Light;
    }

    const storedTheme = localStorage.getItem(LS_THEME);
    if (isValidTheme(storedTheme)) {
      return storedTheme;
    }

    return getColorScheme() === ColorScheme.Dark
      ? ThemeType.Dark
      : ThemeType.Light;
  };

  const theme = useSignal<ThemeMetaKey | "">(getInitialTheme());
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

  // Apply theme meta tags on initial load
  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      if (isValidTheme(theme.value)) {
        applyThemeMeta(theme.value);
      }
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
