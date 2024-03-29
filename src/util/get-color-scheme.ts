export enum ColorScheme {
  Dark = "dark",
  Light = "light",
  NoPreference = "no-preference",
}

export const getColorScheme = (): ColorScheme => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return ColorScheme.Dark;
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return ColorScheme.Light;
  }

  return ColorScheme.NoPreference;
};
