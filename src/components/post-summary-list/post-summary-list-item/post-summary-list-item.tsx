import {
  component$,
  useStylesScoped$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { formatDistance } from "~/util";

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

    const elementRef = useSignal<Element>();
    const isPrefetched = useSignal(false);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(
      ({ track, cleanup }) => {
        track(() => elementRef.value);

        const element = elementRef.value;
        if (!element || isPrefetched.value) return;

        // Check if IntersectionObserver is available (not in SSR or test environment)
        if (typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !isPrefetched.value) {
                // Create prefetch link
                const link = document.createElement("link");
                link.rel = "prefetch";
                link.href = permalink;
                link.as = "document";
                document.head.appendChild(link);

                isPrefetched.value = true;
                observer.disconnect();
              }
            });
          },
          {
            rootMargin: "50px",
          },
        );

        observer.observe(element);

        cleanup(() => observer.disconnect());
      },
      { strategy: "intersection-observer" },
    );

    return (
      <a href={permalink} class="post-summary-list-item" ref={elementRef}>
        <h2 class="title">{title}</h2>
        <p class="date">{formatDistance(date)}</p>
        <p class="summary">{description}</p>
      </a>
    );
  },
);
