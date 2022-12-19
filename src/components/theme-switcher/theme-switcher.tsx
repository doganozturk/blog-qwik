import {
  component$,
  useClientEffect$,
  useContext,
  useStylesScoped$,
} from "@builder.io/qwik";
import { ThemeContext } from "~/root";
import { setCookie } from "~/util/cookie";

import styles from "./theme-switcher.css?inline";

export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);

  const state = useContext(ThemeContext);

  useClientEffect$(({ track }) => {
    const theme = track(() => state.theme);

    if (theme) {
      setCookie("theme", theme, 365);
    }
  });

  return (
    <div
      className="theme-switcher"
      onClick$={() => {
        state.theme = state.theme === "light" ? "dark" : "light";
      }}
    >
      <span className="switch switch-light">🌞</span>
      <span className="switch switch-dark hidden">🌚</span>
    </div>
  );
});
