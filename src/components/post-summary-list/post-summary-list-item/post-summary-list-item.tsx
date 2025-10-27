import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { formatDistance, useViewportPrefetch } from "~/util";

import styles from "./post-summary-list-item.css?inline";

export interface PostSummary {
  title: string;
  description: string;
  permalink: string;
  date: string;
  lang: string;
}

export const PostSummaryListItem = component$(
  ({ title, description, permalink, date }: PostSummary) => {
    useStylesScoped$(styles);

    const elementRef = useViewportPrefetch(permalink, {
      rootMargin: "50px",
    });

    return (
      <a href={permalink} class="post-summary-list-item" ref={elementRef}>
        <h2 class="title">{title}</h2>
        <p class="date">{formatDistance(date)}</p>
        <p class="summary">{description}</p>
      </a>
    );
  },
);
