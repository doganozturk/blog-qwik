export const THEME_COLOR_META_ID = "meta-theme-color";
export const APPLE_STATUS_BAR_META_ID = "meta-apple-status-bar-style";

export const THEME_META = {
  light: {
    themeColor: "#faf8f5",
    appleStatusBarStyle: "default" as const,
  },
  dark: {
    themeColor: "#0c0a09",
    appleStatusBarStyle: "black" as const,
  },
} as const;

export type ThemeMetaKey = keyof typeof THEME_META;

export const DEFAULT_THEME_META_KEY: ThemeMetaKey = "dark";

export const getThemeMeta = (theme: ThemeMetaKey) => THEME_META[theme];

export const applyThemeMeta = (theme: ThemeMetaKey, doc?: Document | null) => {
  const targetDocument =
    doc ?? (typeof document !== "undefined" ? document : undefined);

  if (!targetDocument) {
    return;
  }

  const metaThemeColor = targetDocument.getElementById(
    THEME_COLOR_META_ID,
  ) as HTMLMetaElement | null;
  const appleStatusBar = targetDocument.getElementById(
    APPLE_STATUS_BAR_META_ID,
  ) as HTMLMetaElement | null;

  const { themeColor, appleStatusBarStyle } = getThemeMeta(theme);

  if (metaThemeColor) {
    metaThemeColor.content = themeColor;
  }

  if (appleStatusBar) {
    appleStatusBar.content = appleStatusBarStyle;
  }

  if (targetDocument.body) {
    targetDocument.body.classList.remove("light", "dark");
    targetDocument.body.classList.add(theme);
  }
};
