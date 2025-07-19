import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Header, HeaderType } from "~/components/header/header";
import avatarSrc from "~/media/images/avatar.jpg";

import styles from "./main-header.css?inline";

export const MainHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header type={HeaderType.Main}>
      <img src={avatarSrc} class="avatar" loading="lazy" alt="Doğan Öztürk" width="365" height="365" />
      <div class="title">
        <h1 class="name">Doğan Öztürk</h1>
        <p class="info">Reflections on Technology, Culture, and Life</p>
      </div>
    </Header>
  );
});
