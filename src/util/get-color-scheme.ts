import { isServer } from "@builder.io/qwik/build";

export enum ColorScheme {
  Dark = "dark",
  Light = "light",
  NoPreference = "no-preference",
}

export const getColorScheme = (): ColorScheme => {
  if (isServer) {
    return ColorScheme.Light;
  }

  if (!window.matchMedia) {
    return ColorScheme.NoPreference;
  }

  // Check for dark mode preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return ColorScheme.Dark;
  }

  // Check for light mode preference
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return ColorScheme.Light;
  }

  // No preference
  return ColorScheme.NoPreference;
};
