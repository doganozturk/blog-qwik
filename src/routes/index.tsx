import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { MainHeader } from "~/components/main-header/main-header";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";

const title = "Doğan Öztürk | Blog";
const description =
  "Ben Doğan, yazılım mühendisiyim. Genel olarak yazılım, detayda ise web geliştirme, önyüz geliştirme, Node.js, Python vb. konularda düşüncelerimi paylaşmaya çalışıyorum.";

export default component$(() => {
  return (
    <>
      <MainHeader q:slot="header" />
      <main class="main">
        <PostSummaryList />
      </main>
    </>
  );
});

export const head: DocumentHead = {
  title,
  meta: [
    {
      name: "description",
      content: description,
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: title },
    { name: "twitter:creator", content: "Doğan Öztürk" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://doganozturk.dev/images/avatar.jpg",
    },
    { property: "og:title", content: title },
    { property: "og:type", content: "article" },
    { property: "og:url", content: "https://doganozturk.dev/" },
    {
      property: "og:image",
      content: "https://doganozturk.dev/images/avatar.jpg",
    },
    { property: "og:description", content: description },
    { property: "og:site_name", content: "doganozturk.dev" },
  ],
};
