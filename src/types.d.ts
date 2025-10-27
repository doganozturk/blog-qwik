declare module "*.jpg?jsx" {
  import { JSXNode } from "@builder.io/qwik";
  const Component: (props: { [key: string]: any }) => JSXNode;
  export default Component;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png?jsx" {
  import { JSXNode } from "@builder.io/qwik";
  const Component: (props: { [key: string]: any }) => JSXNode;
  export default Component;
}

declare module "*.jpeg?jsx" {
  import { JSXNode } from "@builder.io/qwik";
  const Component: (props: { [key: string]: any }) => JSXNode;
  export default Component;
}

declare module "*.svg?jsx" {
  import { JSXNode } from "@builder.io/qwik";
  const Component: (props: { [key: string]: any }) => JSXNode;
  export default Component;
}

declare module "*.css?inline" {
  const styles: string;
  export default styles;
}
