import { component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { ThemeContext, ThemeType } from "~/routes/layout";

import styles from "./theme-switcher.css?inline";

export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);

  const theme = useContext(ThemeContext);

  return (
    <div
      class="theme-switcher"
      onClick$={() => {
        theme.value =
          theme.value === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;
      }}
    >
      {theme.value === ThemeType.Dark && (
        <span class="switch switch-light">🌞</span>
      )}
      {theme.value === ThemeType.Light && (
        <span class="switch switch-dark">🌚</span>
      )}
    </div>
  );
});
