import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />

      {head.meta.map((m, index) => (
        <meta key={`meta-${index}`} {...m} />
      ))}

      {head.links.map((l, index) => (
        <link key={`link-${index}`} {...l} />
      ))}

      {head.styles.map((s, index) => (
        <style
          key={`style-${index}`}
          {...s.props}
          dangerouslySetInnerHTML={s.style}
        />
      ))}
    </>
  );
});
