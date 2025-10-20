export const themeHack = `(function(){
  // We use typeof window !== 'undefined' here instead of Qwik's isServer utility
  // because this script gets injected directly into the HTML and runs before
  // Qwik initializes. It prevents flash of unstyled content (FOUC) by applying
  // the theme class from localStorage as early as possible.
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    var THEME_COLOR_META_ID = 'meta-theme-color';
    var APPLE_STATUS_BAR_META_ID = 'meta-apple-status-bar-style';
    var themeMeta = {
      light: { themeColor: '#ecf0f1', appleStatusBarStyle: 'default' },
      dark: { themeColor: '#1a2334', appleStatusBarStyle: 'black' },
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

    function ensureTheme() {
      const themeContainer = document.querySelector(".theme-container");
      if (!themeContainer) {
        requestAnimationFrame(ensureTheme);
        return;
      }
      const themeToEnsure = localStorage.getItem("theme") || "";
      if (themeToEnsure) {
        themeContainer.classList.add(themeToEnsure);
        document.body.classList.add(themeToEnsure);
        applyMeta(themeToEnsure);
      }
    }
    requestAnimationFrame(ensureTheme);
  }
})();`;
