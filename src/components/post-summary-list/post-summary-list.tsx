import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { PostSummary, PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";

import styles from "./post-summary-list.css?inline";

interface PostSummaryListProps {
  data: PostSummary[];
}

export const PostSummaryList = component$(({ data }: PostSummaryListProps) => {
  useStylesScoped$(styles);

  return (
    <section class="post-summary-list">
      {data.map(({ title, description, permalink, date }) => (
        <PostSummaryListItem
          key={title}
          title={title}
          description={description}
          permalink={permalink}
          date={date}
        />
      ))}
    </section>
  )
});