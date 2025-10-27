import { component$, Resource, useResource$ } from "@builder.io/qwik";
import type { DocumentHead, DocumentHeadProps } from "@builder.io/qwik-city";
import { MainHeader } from "~/components/header/main-header/main-header";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";
import { PostSummary } from "~/components/post-summary-list/post-summary-list-item/post-summary-list-item";
import { asyncMap, Locale } from "~/util";

type PostModuleLoader = () => Promise<DocumentHeadProps>;
type PostModuleMap = Record<string, PostModuleLoader>;

export const loadPosts = async (
  modules: PostModuleMap,
): Promise<PostSummary[]> => {
  const paths = Object.keys(modules);

  const posts = await asyncMap(paths, async (path) => {
    const data = await modules[path]();

    return {
      title: data.head.title || "",
      description:
        data.head.meta.find((m) => m.name === "description")?.content || "",
      date: data.head.frontmatter.date as string,
      permalink: data.head.frontmatter.permalink as string,
      lang: data.head.frontmatter.lang as string,
    };
  });

  return posts
    .filter(({ lang }) => lang === Locale.en)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateB - dateA;
    });
};

/* c8 ignore start */
export const getPosts = async (): Promise<PostSummary[]> => {
  const modules = import.meta.glob(
    "/src/routes/**/**/index.mdx",
  ) as PostModuleMap;
  return loadPosts(modules);
};
/* c8 ignore stop */

/* c8 ignore start */
export default component$(() => {
  const postsResource = useResource$(getPosts);

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
/* c8 ignore stop */

const title = "Doğan Öztürk | Blog";
const description =
  "I'm Doğan, a software engineer passionate about front-end development, JavaScript and Node.js. On my blog, I share my expertise and experiences in tech, as well as my interests in role-playing games, computer games, sci-fi and more.";

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
