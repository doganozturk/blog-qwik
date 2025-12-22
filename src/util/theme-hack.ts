export const themeHack = `(function(){
  // We use typeof window !== 'undefined' here instead of Qwik's isServer utility
  // because this script gets injected directly into the HTML and runs before
  // Qwik initializes. It prevents flash of unstyled content (FOUC) by applying
  // the theme class from localStorage as early as possible.
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    var THEME_COLOR_META_ID = 'meta-theme-color';
    var APPLE_STATUS_BAR_META_ID = 'meta-apple-status-bar-style';
    var themeMeta = {
      light: { themeColor: '#faf8f5', appleStatusBarStyle: 'default' },
      dark: { themeColor: '#0c0a09', appleStatusBarStyle: 'black' },
    };

    function applyMeta(theme) {
      var meta = themeMeta[theme];
      if (!meta) {
        return;
      }

      var themeColorEl = document.getElementById(THEME_COLOR_META_ID);
      if (themeColorEl && themeColorEl.tagName === 'META') {
        themeColorEl.setAttribute('content', meta.themeColor);
      }

      var appleStatusEl = document.getElementById(APPLE_STATUS_BAR_META_ID);
      if (appleStatusEl && appleStatusEl.tagName === 'META') {
        appleStatusEl.setAttribute('content', meta.appleStatusBarStyle);
      }
    }

    var storedTheme = localStorage.getItem("theme") || "";

    // Apply meta tags immediately if we have a stored theme
    if (storedTheme) {
      applyMeta(storedTheme);
    }

    // Wait for DOM elements to apply classes
    function ensureTheme() {
      const themeContainer = document.querySelector(".theme-container");
      if (!themeContainer) {
        requestAnimationFrame(ensureTheme);
        return;
      }
      if (storedTheme) {
        themeContainer.classList.add(storedTheme);
        document.body.classList.add(storedTheme);
      }
    }
    requestAnimationFrame(ensureTheme);
  }
})();`;
