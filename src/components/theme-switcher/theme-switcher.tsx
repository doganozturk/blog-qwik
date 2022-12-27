import { component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { ThemeContext, ThemeType } from "~/routes/layout";

import styles from "./theme-switcher.css?inline";

export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);

  const state = useContext(ThemeContext);

  return (
    <div
      class="theme-switcher"
      onClick$={() => {
        state.theme =
          state.theme === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;
      }}
    >
      <span class="switch switch-light">🌞</span>
      <span class="switch switch-dark hidden">🌚</span>
    </div>
  );
});
