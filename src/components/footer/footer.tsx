import { component$, useStylesScoped$ } from "@builder.io/qwik";

import styles from "./footer.css?inline";

export const Footer = component$(() => {
  useStylesScoped$(styles);

  const links = [
    {
      linkProps: {
        href: "mailto:doganozturk2005@gmail.com",
      },
      text: "mail .",
    },
    {
      linkProps: {
        href: "https://twitter.com/dodothebird",
        target: "_blank",
        rel: "noopener",
      },
      text: "twitter .",
    },
    {
      linkProps: {
        href: "https://github.com/doganozturk",
        target: "_blank",
        rel: "noopener",
      },
      text: "github .",
    },
    {
      linkProps: {
        href: "https://linkedin.com/in/doganozturk",
        target: "_blank",
        rel: "noopener",
      },
      text: "linkedin .",
    },
    {
      linkProps: {
        href: "https://www.notion.so/Do-an-zt-rk-6adacf6b91174b35bc9ce204f479b83b",
        target: "_blank",
        rel: "noopener",
      },
      text: "cv .",
    },
  ];

  return (
    <footer class="footer">
      <ul class="links">
        {links.map((link) => {
          return (
            <li class="link">
              <a {...link.linkProps}>
                <span>{link.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </footer>
  );
});
