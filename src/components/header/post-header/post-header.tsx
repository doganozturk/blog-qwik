import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Header } from "~/components/header/header";

import styles from "./post-header.css?inline";

export const PostHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header>
      <div class="back">
        <svg width="15" height="20" viewBox="0 0 50 80">
          <path
            fill="none"
            stroke="#FFF"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M45.63 75.8L.375 38.087 45.63.375"
          ></path>
        </svg>
      </div>
    </Header>
  );
});
