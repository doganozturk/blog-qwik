import { useSignal, useVisibleTask$, type Signal } from "@builder.io/qwik";

export interface ViewportPrefetchOptions {
  /**
   * The root margin for the IntersectionObserver.
   * Determines how far before the element enters the viewport to start prefetching.
   * @default "50px"
   */
  rootMargin?: string;

  /**
   * The threshold for the IntersectionObserver.
   * A value of 0 means the callback will trigger as soon as any part of the target is visible.
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Whether to enable prefetching.
   * Useful for conditional prefetching based on user preferences or network conditions.
   * @default true
   */
  enabled?: boolean;
}

/**
 * A reusable custom hook that implements viewport-based prefetching using IntersectionObserver.
 *
 * This hook monitors when an element enters the viewport and automatically prefetches
 * the specified URL to improve perceived performance and navigation speed.
 *
 * @param url - The URL to prefetch when the element enters the viewport
 * @param options - Configuration options for the intersection observer and prefetch behavior
 * @returns A signal containing the element reference to attach to the target element
 *
 * @example
 * ```tsx
 * export const MyComponent = component$(() => {
 *   const elementRef = useViewportPrefetch("/target-page", {
 *     rootMargin: "100px",
 *     enabled: true
 *   });
 *
 *   return <div ref={elementRef}>Content</div>;
 * });
 * ```
 */
export const useViewportPrefetch = (
  url: string,
  options: ViewportPrefetchOptions = {},
): Signal<Element | undefined> => {
  const { rootMargin = "50px", threshold = 0, enabled = true } = options;

  const elementRef = useSignal<Element>();
  const isPrefetched = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ track, cleanup }) => {
      track(() => elementRef.value);

      const element = elementRef.value;
      if (!element || isPrefetched.value || !enabled) return;

      if (typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isPrefetched.value) {
              prefetchDocument(url);

              isPrefetched.value = true;
              observer.disconnect();
            }
          });
        },
        {
          rootMargin,
          threshold,
        },
      );

      observer.observe(element);

      cleanup(() => observer.disconnect());
    },
    { strategy: "intersection-observer" },
  );

  return elementRef;
};

/**
 * Creates and appends a prefetch link to the document head.
 * This function is exported for testing purposes and can be used independently.
 *
 * @param url - The URL to prefetch
 */
export const prefetchDocument = (url: string): void => {
  if (typeof document === "undefined") return;

  const existingLink = document.querySelector(
    `link[rel="prefetch"][href="${url}"]`,
  );
  if (existingLink) return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  link.as = "document";
  document.head.appendChild(link);
};
