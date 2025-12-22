import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Header, HeaderType } from "~/components/header/header";
import avatarSrc from "~/media/images/avatar.jpg";
import avatarWebp100 from "~/media/images/avatar-100.webp";
import avatarWebp200 from "~/media/images/avatar-200.webp";

import styles from "./main-header.css?inline";

export const MainHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header type={HeaderType.Main}>
      <picture>
        <source
          type="image/webp"
          srcset={`${avatarWebp100} 1x, ${avatarWebp200} 2x`}
        />
        <img
          src={avatarSrc}
          class="avatar"
          loading="lazy"
          alt="Doğan Öztürk"
          width="100"
          height="100"
        />
      </picture>
      <div class="title">
        <h1 class="name">Doğan Öztürk</h1>
        <p class="info">REFLECTIONS ON TECHNOLOGY, CULTURE, AND LIFE</p>
      </div>
    </Header>
  );
});
