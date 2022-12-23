import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { PostHeader } from "~/components/header/post-header/post-header";

import prismStyles from "~/styles/prism/prism-vsc-dark-plus.css?inline";
import styles from "./index.css?inline";

export default component$(() => {
  useStyles$(prismStyles);
  useStyles$(styles);

  return (
    <>
      <PostHeader q:slot="header" />
      <article class="post">
        <Slot />
      </article>
    </>
  );
});

/*export const head: DocumentHead = (data) => {
  console.log(data);

  const { title, description, permalink } = data || {};
  return ({
    meta: [
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "Doğan Öztürk | Blog" },
      { name: "twitter:creator", content: "Doğan Öztürk" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      {
        name: "twitter:image",
        content: "https://doganozturk.dev/images/avatar.jpg"
      },
      { property: "og:title", content: title },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://doganozturk.dev" + permalink },
      {
        property: "og:image",
        content: "https://doganozturk.dev/images/avatar.jpg"
      },
      { property: "og:description", content: description },
      { property: "og:site_name", content: "doganozturk.dev" }
    ]
  });
};*/
