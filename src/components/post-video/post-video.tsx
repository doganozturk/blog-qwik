import { component$, useStylesScoped$ } from "@builder.io/qwik";

import styles from "./post-video.css?inline";

interface PostVideoProps {
  id: string;
  title: string;
}

export const PostVideo = component$(({ id, title }: PostVideoProps) => {
  useStylesScoped$(styles);

  const src = `https://www.youtube.com/embed/${id}`;
  const srcDoc = `<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${id}?autoplay=1><img src=https://img.youtube.com/vi/${id}/hqdefault.jpg alt='${title}'><span>▶</span></a>`;

  return (
    <div class="post-video">
      <iframe
        loading="lazy"
        width="560"
        height="315"
        title={title}
        src={src}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        srcDoc={srcDoc}
      ></iframe>
    </div>
  );
});
