import { component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { ThemeContext, ThemeType } from "~/routes/layout";
import { applyThemeMeta } from "~/util";
import type { ThemeMetaKey } from "~/util";

import styles from "./theme-switcher.css?inline";

export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);

  const theme = useContext(ThemeContext);

  return (
    <div
      class="theme-switcher"
      onClick$={() => {
        const nextTheme =
          theme.value === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;

        theme.value = nextTheme;
        applyThemeMeta(nextTheme as ThemeMetaKey);
      }}
    >
      {theme.value === ThemeType.Dark && (
        <span class="switch switch-light">🌞</span>
      )}
      {theme.value === ThemeType.Light && (
        <span class="switch switch-dark">🌚</span>
      )}
      {!theme.value && <span class="switch switch-loading">&nbsp;</span>}
    </div>
  );
});
