import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import { PostHeader } from "~/components/header/post-header/post-header";
import * as fs from "fs";
import WebComponents from "~/posts/web-components.mdx";
import JSNation from "~/posts/amsterdam-jsnation-2019.mdx";
import CrossPlatform from "~/posts/cross-platform-development-react-native-web.mdx";
import Hoisting from "~/posts/javascript-temelleri-hoisting.mdx";
import Decorators from "~/posts/decoratorleri-expressjs-temel-konseptleri-uzerinden-anlamak.mdx";

import prismStyles from '~/styles/prism/prism-vsc-dark-plus.css?inline';
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
  useStylesScoped$(prismStyles);
  useStylesScoped$(styles);

  const { params } = useLocation();

  const map = {
    "web-components": WebComponents,
    "amsterdam-jsnation-2019": JSNation,
    "cross-platform-development-react-native-web": CrossPlatform,
    "javascript-temelleri-hoisting": Hoisting,
    "decoratorleri-expressjs-temel-konseptleri-uzerinden-anlamak": Decorators,
  };

  return (
    <>
      <PostHeader q:slot="header" />
      <article class="post">{map[params.slug]()}</article>
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
