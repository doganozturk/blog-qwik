import { component$ } from "@builder.io/qwik";
import { PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";
import { PostSummary } from "~/models";

interface PostSummaryListProps {
  data: PostSummary[];
}

export const PostSummaryList = component$(({ data }: PostSummaryListProps) => {
  return (
    <section class="post-summary-list">
      {data.map(({ title, description, permalink, date, lang }) => (
        <PostSummaryListItem
          key={title}
          title={title}
          description={description}
          permalink={permalink}
          date={date}
          lang={lang}
        />
      ))}
    </section>
  );
});
