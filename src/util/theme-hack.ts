export const themeHack = `(function(){
  // We use 'typeof window !== undefined' here instead of Qwik's isServer utility
  // because this script gets injected directly into the HTML and runs before
  // Qwik initializes. It prevents flash of unstyled content (FOUC) by applying
  // the theme class from localStorage as early as possible.
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    function ensureTheme(){
      if(!document.querySelector(".theme-container")){
        requestAnimationFrame(ensureTheme)
      }
      themeToEnsure=localStorage.getItem("theme")||"";
      if(!themeToEnsure) return;
      document.querySelector(".theme-container").classList.add(themeToEnsure)
    }
    requestAnimationFrame(ensureTheme);
  }
})();`;
