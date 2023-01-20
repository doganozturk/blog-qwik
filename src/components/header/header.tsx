import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";

import styles from "./header.css?inline";

export enum HeaderType {
  Main = "main",
  Post = "post",
}

interface HeaderProps {
  type: HeaderType;
}

export const Header = component$(({ type }: HeaderProps) => {
  useStylesScoped$(styles);

  return (
    <header class="header">
      <a
        href="/"
        className="header-main"
        aria-label={type === HeaderType.Post ? "back" : ""}
      >
        <Slot />
      </a>
      <ThemeSwitcher />
    </header>
  );
});
