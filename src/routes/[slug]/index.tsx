import { component$ } from "@builder.io/qwik";
import { DocumentHead, useLocation } from "@builder.io/qwik-city";
import { PostHeader } from "~/components/header/post-header/post-header";

const title = "Post Title";
const description = "Post Summary";
const permalink = "";

export default component$(() => {
  const {params} = useLocation();

  return (
    <>
      <PostHeader q:slot="header" />
      <article class="post">POST DETAIL === {params.slug}</article>
    </>
  );
});

export const head: DocumentHead = {
  title: "Doğan Öztürk | Blog",
  meta: [
    {
      name: "description",
      content: description,
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "Doğan Öztürk | Blog" },
    { name: "twitter:creator", content: "Doğan Öztürk" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://doganozturk.dev/images/avatar.jpg",
    },
    { property: "og:title", content: title },
    { property: "og:type", content: "article" },
    { property: "og:url", content: "https://doganozturk.dev" + permalink },
    {
      property: "og:image",
      content: "https://doganozturk.dev/images/avatar.jpg",
    },
    { property: "og:description", content: description },
    { property: "og:site_name", content: "doganozturk.dev" },
  ],
};
