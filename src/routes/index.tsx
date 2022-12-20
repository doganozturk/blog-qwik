import { component$, Resource, useResource$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { MainHeader } from "~/components/header/main-header/main-header";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";
import { PostSummary } from "~/components/post-summary-list/post-summary-list-item/post-summary-list-item";
import { asyncMap } from "~/util/asyncMap";

const title = "Doğan Öztürk | Blog";
const description =
  "Ben Doğan, yazılım mühendisiyim. Genel olarak yazılım, detayda ise web geliştirme, önyüz geliştirme, Node.js, Python vb. konularda düşüncelerimi paylaşmaya çalışıyorum.";

export default component$(() => {
  const postsResource = useResource$(async () => {
    const modules = await import.meta.glob("/src/posts/*.mdx");

    const posts = await asyncMap(Object.keys(modules), async (path) => {
      const mod = await modules[path]();

      return (mod as { frontmatter: PostSummary }).frontmatter;
    });

    return posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateB - dateA;
    });
  });

  return (
    <>
      <MainHeader q:slot="header" />
      <main class="main">
        <Resource
          value={postsResource}
          onResolved={(posts) => <PostSummaryList data={posts} />}
        />
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
