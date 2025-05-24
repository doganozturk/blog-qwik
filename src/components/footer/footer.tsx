import { component$, useStylesScoped$ } from "@builder.io/qwik";

import styles from "./footer.css?inline";

interface LinkItem {
  linkProps: { href: string; target?: string; rel?: string };
  text: string;
}

export const links: LinkItem[] = [
  {
    linkProps: {
      href: "mailto:doganozturk2005@gmail.com",
    },
    text: "mail",
  },
  {
    linkProps: {
      href: "https://twitter.com/dodothebird",
      target: "_blank",
      rel: "noopener",
    },
    text: "twitter",
  },
  {
    linkProps: {
      href: "https://github.com/doganozturk",
      target: "_blank",
      rel: "noopener",
    },
    text: "github",
  },
  {
    linkProps: {
      href: "https://linkedin.com/in/doganozturk",
      target: "_blank",
      rel: "noopener",
    },
    text: "linkedin",
  },
  {
    linkProps: {
      href: "https://www.notion.so/Do-an-zt-rk-6adacf6b91174b35bc9ce204f479b83b",
      target: "_blank",
      rel: "noopener",
    },
    text: "cv",
  },
];

export const Footer = component$(() => {
  useStylesScoped$(styles);

  return (
    <footer class="footer">
      <ul class="links">
        {links.map(({ linkProps, text }, index) => (
          <li class="link" key={index}>
            <a {...linkProps}>{text}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
});
