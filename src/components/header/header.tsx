import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";

import styles from './header.css?inline';

export const Header = component$(() => {
  useStyles$(styles);

  return (
    <header class="header">
      <a href="/" class="header-main">
        <Slot />
      </a>
      <ThemeSwitcher/>
    </header>
  );
});