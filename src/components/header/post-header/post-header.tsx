import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Header, HeaderType } from "~/components/header/header";

import styles from "./post-header.css?inline";

export const PostHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header type={HeaderType.Post}>
      <span>doganozturk.dev</span>
    </Header>
  );
});
