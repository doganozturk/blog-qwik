import { component$, useStyles$ } from "@builder.io/qwik";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";

import styles from './main-header.css?inline';

export const MainHeader = component$(() => {
  useStyles$(styles);

  return (
    <header class="header">
      <a href="/" class="header-main">
        <img class="avatar" src="/images/avatar.jpg" loading="lazy" alt="Doğan Öztürk" />
        <div class="title">
          <h1 class="name">Doğan Öztürk</h1>
          <p class="info">
            Yazılım ve diğer şeyler üzerine kişisel karalamalar
          </p>
        </div>
      </a>
      <ThemeSwitcher/>
    </header>
  );
});
