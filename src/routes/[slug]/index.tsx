import * as fs from "fs";
import {
  component$, JSXChildren, JSXNode,
  Resource,
  useResource$,
  useStyles$
} from "@builder.io/qwik";
import {
  renderToString,
} from "@builder.io/qwik/server";
import { StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import { PostHeader } from "~/components/header/post-header/post-header";
import { asyncMap } from "~/util/asyncMap";
import { PostSummary } from "~/components/post-summary-list/post-summary-list-item/post-summary-list-item";

import prismStyles from "~/styles/prism/prism-vsc-dark-plus.css?inline";
import styles from "./index.css?inline";

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const fileNamesWithExtensions = await fs.promises.readdir("src/posts");
  const fileNames = fileNamesWithExtensions.map((fileName) =>
    fileName.replace(/\.mdx$/, "")
  );

  return {
    params: fileNames.map((slug) => ({ slug })),
  };
};

export default component$(() => {
  useStyles$(prismStyles);
  useStyles$(styles);

  const { params } = useLocation();

  const postResource = useResource$(async () => {
    const modules = await import.meta.glob("/src/posts/*.mdx");

    const posts = await asyncMap(Object.keys(modules), async (path) => {
      if (path.includes(params.slug)) {
        const mod = await modules[path]();
        // @ts-ignore
        const component = await renderToString(mod.default(), {
          containerTagName: "div",
        });

        return {
          meta: (mod as { frontmatter: PostSummary }).frontmatter,
          html: component.html,
        };
      }
    });

    return posts.filter(Boolean)[0];
  });

  return (
    <>
      <PostHeader q:slot="header" />
      <Resource
        value={postResource}
        // @ts-ignore
        onResolved={({ html }) => {
          return <article class="post" dangerouslySetInnerHTML={html} />;
        }}
      />
    </>
  );
});

/*export const head: DocumentHead = {
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
};*/
