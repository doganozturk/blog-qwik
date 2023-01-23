import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Header, HeaderType } from "~/components/header/header";

import styles from "./main-header.css?inline";

export const MainHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header type={HeaderType.Main}>
      <img
        className="avatar"
        src="/images/avatar.jpg"
        loading="lazy"
        alt="Doğan Öztürk"
      />
      <div className="title">
        <h1 className="name">Doğan Öztürk</h1>
        <p className="info">
          Yazılım ve diğer şeyler üzerine kişisel karalamalar
        </p>
      </div>
    </Header>
  );
});
