import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { formatDistance } from "date-fns";
import tr from "date-fns/locale/tr/index";

import styles from "./post-summary-list-item.css?inline";

export interface PostSummary {
  title: string;
  description: string;
  permalink: string;
  date: string;
}

export const PostSummaryListItem = component$(
  ({ title, description, permalink, date }: PostSummary) => {
    useStylesScoped$(styles);

    return (
      <a href={permalink} class="post-summary-list-item">
        <h2 class="title">{title}</h2>
        <p class="date">
          {formatDistance(new Date(date), new Date(), {
            locale: tr,
            addSuffix: false,
          })}
        </p>
        <p class="summary">{description}</p>
      </a>
    );
  }
);
