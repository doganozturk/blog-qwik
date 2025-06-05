import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Header, HeaderType } from "~/components/header/header";
import AvatarSrc from "~/media/images/avatar.jpg?w=100&h=100quality=5&jsx";

import styles from "./main-header.css?inline";

export const MainHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header type={HeaderType.Main}>
      <AvatarSrc alt="Doğan Öztürk" />
      <div class="title">
        <h1 class="name">Doğan Öztürk</h1>
        <p class="info">Reflections on Technology, Culture, and Life</p>
      </div>
    </Header>
  );
});
