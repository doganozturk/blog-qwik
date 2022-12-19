import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";

import styles from "./post-summary-list.css?inline";

export const PostSummaryList = component$(() => {
  useStylesScoped$(styles);

  return (
    <section class="post-summary-list">
      <PostSummaryListItem />
      <PostSummaryListItem />
      <PostSummaryListItem />
      <PostSummaryListItem />
      <PostSummaryListItem />
    </section>
  )
});