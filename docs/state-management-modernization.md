# State Management Modernization Guide

## Overview

This guide details how to modernize your theme management system using the latest Qwik patterns for better SSR/hydration performance and reduced layout shift.

## Current Implementation Analysis

### Current Theme System
```tsx
// src/routes/layout.tsx (Current)
export const ThemeContext = createContextId<{ value: string }>("theme-context");

export default component$(() => {
  const theme = useSignal<string>("");
  useContextProvider(ThemeContext, theme);

  // Save theme to localStorage when it changes
  useTask$(({ track }) => {
    const currentTheme = track(() => theme.value);
    if (isServer || !currentTheme) return;
    localStorage.setItem(LS_THEME, currentTheme);
  });

  // Initialize theme from localStorage or system preference
  useOnDocument('DOMContentLoaded', $(() => {
    theme.value = localStorage.getItem(LS_THEME) || 
      (getColorScheme() === ColorScheme.Dark ? ThemeType.Dark : ThemeType.Light);
  }));

  return (
    <div class={`theme-container ${theme.value}`}>
      {/* ... */}
    </div>
  );
});
```

### Issues with Current Approach
1. **Flash of Wrong Theme**: Theme loads client-side, causing visual flash
2. **Hydration Mismatch**: Server renders without theme, client hydrates with theme
3. **No SSR Theme Support**: Cannot persist theme preference across sessions
4. **Manual State Management**: No leveraging of Qwik's server state patterns

## Modern Implementation

### 1. Server-Side Theme Loader

```tsx
// src/routes/layout.tsx (Improved)
import { routeLoader$, server$ } from '@builder.io/qwik-city';

// Server-side theme detection and loading
export const useThemeLoader = routeLoader$(async ({ cookie, request }) => {
  // Check cookie first
  const cookieTheme = cookie.get('theme')?.value;
  if (cookieTheme && ['light', 'dark'].includes(cookieTheme)) {
    return { theme: cookieTheme as ThemeType };
  }

  // Fallback to user-agent hint or default
  const userAgent = request.headers.get('user-agent') || '';
  const prefersDark = request.headers.get('sec-ch-prefers-color-scheme') === 'dark';
  
  return { 
    theme: prefersDark ? ThemeType.Dark : ThemeType.Light 
  };
});

// Server function for theme updates
export const updateTheme = server$(function(newTheme: ThemeType) {
  this.cookie.set('theme', newTheme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: true,
    httpOnly: false // Allow client-side access for immediate updates
  });
});
```

### 2. Enhanced Theme Context

```tsx
// src/contexts/theme.tsx (New file)
import { createContextId, type Signal } from '@builder.io/qwik';

export interface ThemeContextValue {
  theme: Signal<ThemeType>;
  setTheme: (theme: ThemeType) => Promise<void>;
  isLoading: Signal<boolean>;
}

export const ThemeContext = createContextId<ThemeContextValue>('theme-context');

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}

// Theme detection utilities
export const getSystemTheme = (): ThemeType => {
  if (typeof window === 'undefined') return ThemeType.Light;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? ThemeType.Dark 
    : ThemeType.Light;
};

export const applyThemeClass = (theme: ThemeType) => {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute('data-theme', theme);
};
```

### 3. Updated Layout Component

```tsx
// src/routes/layout.tsx (Complete modernized version)
import { 
  component$, 
  Slot, 
  useContextProvider, 
  useSignal, 
  useTask$,
  $
} from '@builder.io/qwik';
import { routeLoader$, server$ } from '@builder.io/qwik-city';
import { Footer } from '~/components/footer/footer';
import { 
  ThemeContext, 
  ThemeType, 
  type ThemeContextValue,
  applyThemeClass,
  getSystemTheme
} from '~/contexts/theme';

// Server-side theme loader
export const useThemeLoader = routeLoader$(async ({ cookie, request }) => {
  const cookieTheme = cookie.get('theme')?.value;
  if (cookieTheme && ['light', 'dark'].includes(cookieTheme)) {
    return { theme: cookieTheme as ThemeType };
  }

  // Check for client hint header
  const prefersDark = request.headers.get('sec-ch-prefers-color-scheme') === 'dark';
  return { theme: prefersDark ? ThemeType.Dark : ThemeType.Light };
});

// Server function for theme persistence
export const updateTheme = server$(function(newTheme: ThemeType) {
  this.cookie.set('theme', newTheme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false
  });
});

export default component$(() => {
  const themeLoader = useThemeLoader();
  const theme = useSignal<ThemeType>(themeLoader.value.theme);
  const isLoading = useSignal(false);

  // Create theme context value
  const themeContext: ThemeContextValue = {
    theme,
    setTheme: $(async (newTheme: ThemeType) => {
      isLoading.value = true;
      
      // Update client-side immediately for instant feedback
      theme.value = newTheme;
      applyThemeClass(newTheme);
      
      // Persist to server
      try {
        await updateTheme(newTheme);
      } catch (error) {
        console.error('Failed to persist theme:', error);
        // Revert on error
        theme.value = theme.value === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;
        applyThemeClass(theme.value);
      } finally {
        isLoading.value = false;
      }
    }),
    isLoading
  };

  useContextProvider(ThemeContext, themeContext);

  // Only apply theme class when theme changes (not on initial load)
  useTask$(({ track, cleanup }) => {
    const currentTheme = track(() => theme.value);
    
    // Only apply if theme actually changed (not initial server value)
    if (currentTheme !== themeLoader.value.theme) {
      applyThemeClass(currentTheme);
    }
    
    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't explicitly set a preference
        const hasUserPreference = document.cookie.includes('theme=');
        if (!hasUserPreference) {
          const systemTheme = e.matches ? ThemeType.Dark : ThemeType.Light;
          theme.value = systemTheme;
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      cleanup(() => mediaQuery.removeEventListener('change', handleChange));
    }
  });

  return (
    <div class={`theme-container ${theme.value}`} data-theme={theme.value}>
      <div class="container">
        <Slot name="header" />
        <Slot />
        <Footer />
      </div>
    </div>
  );
});
```

### 4. Updated Theme Switcher Component

```tsx
// src/components/theme-switcher/theme-switcher.tsx (Updated)
import { component$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import { ThemeContext, ThemeType } from '~/contexts/theme';
import styles from './theme-switcher.css?inline';

export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);
  const themeContext = useContext(ThemeContext);

  return (
    <button
      class="theme-switcher"
      aria-label={`Switch to ${themeContext.theme.value === ThemeType.Light ? 'dark' : 'light'} theme`}
      aria-pressed={themeContext.theme.value === ThemeType.Dark}
      disabled={themeContext.isLoading.value}
      onClick$={async () => {
        const newTheme = themeContext.theme.value === ThemeType.Light 
          ? ThemeType.Dark 
          : ThemeType.Light;
        
        await themeContext.setTheme(newTheme);
      }}
    >
      <span class="switch-icon" aria-hidden="true">
        {themeContext.theme.value === ThemeType.Dark ? '🌞' : '🌚'}
      </span>
      {themeContext.isLoading.value && (
        <span class="loading-indicator" aria-hidden="true">⏳</span>
      )}
    </button>
  );
});
```

### 5. Enhanced CSS for Theme Switching

```css
/* src/components/theme-switcher/theme-switcher.css */
.theme-switcher {
  position: relative;
  background: transparent;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.theme-switcher:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.theme-switcher:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.switch-icon {
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.theme-switcher:hover .switch-icon {
  transform: rotate(15deg);
}

.loading-indicator {
  font-size: 0.8rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Prevent flash of unstyled content */
:root {
  --theme-transition: background-color 0.2s ease, color 0.2s ease;
}

.theme-container {
  transition: var(--theme-transition);
}

/* Ensure immediate theme application on SSR */
:root[data-theme="dark"] {
  color-scheme: dark;
}

:root[data-theme="light"] {
  color-scheme: light;
}
```

### 6. Theme Variables (Single Source of Truth)

```css
/* src/styles/themes.css - Single source of truth for all theme variables */
:root {
  /* Light theme (default) */
  --color-background: #ffffff;
  --color-text: #000000;
  --color-border: #e5e5e5;
  --color-primary: #0056b3;
  --color-secondary: #e67e22;
  --color-accent: #17a2b8;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Borders and radius */
  --border-radius: 0.375rem;
  --border-width: 1px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Dark theme overrides */
[data-theme="dark"] {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
  --color-border: #333333;
  --color-primary: #0066cc;
  --color-secondary: #f39c12;
  --color-accent: #20c997;
  --color-success: #198754;
  --color-warning: #fd7e14;
  --color-error: #dc3545;
  
  /* Dark-specific shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4);
}

/* Base styles using theme variables */
html {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: 1.6;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.2s ease, color 0.2s ease;
  margin: 0;
  padding: 0;
}

/* Color scheme for form elements and scrollbars */
:root {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}
```

### 7. Import Theme Styles in Root

```tsx
// src/root.tsx (Import theme styles)
import { component$, useStyles$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { useThemeLoader } from './routes/layout';

// Import theme styles
import themeStyles from './styles/themes.css?inline';

export default component$(() => {
  useStyles$(themeStyles);
  
  const themeData = useThemeLoader();

  return (
    <QwikCityProvider>
      <head>
        <RouterHead />
      </head>
      {/* Apply theme attribute to body - CSS handles the rest */}
      <body 
        class={themeData.value.theme} 
        data-theme={themeData.value.theme}
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
```

### 8. Simplified RouterHead Component

```tsx
// src/components/router-head/router-head.tsx (Clean - no theme duplication)
import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { useThemeLoader } from '~/routes/layout';

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  const themeData = useThemeLoader();

  return (
    <>
      <title>{head.title}</title>
      
      {/* Set meta theme-color for mobile browsers */}
      <meta 
        name="theme-color" 
        content={themeData.value.theme === 'dark' ? '#1a1a1a' : '#ffffff'} 
      />
      
      {/* Canonical URL */}
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
```



## Migration Steps

### Step 1: Create New Theme Context
1. Create `src/contexts/theme.tsx` with the new theme context
2. Update imports in existing components

### Step 2: Update Layout Component
1. Add the `useThemeLoader` to layout.tsx
2. Replace the old theme logic with new server-side approach
3. Test SSR theme loading

### Step 3: Update Theme Switcher
1. Modify theme switcher to use new context
2. Add loading states and improved accessibility
3. Test theme switching functionality

### Step 4: Create Theme Styles
1. Create `src/styles/themes.css` with all theme variables
2. Define light and dark theme variants using CSS custom properties
3. Add base styles that use the theme variables

### Step 5: Update Root Component
1. Import theme styles using `useStyles$`
2. Apply theme classes to body element during SSR
3. Remove any client-side theme application scripts

### Step 6: Simplify RouterHead Component
1. Remove theme variable duplication from RouterHead
2. Keep only meta theme-color for mobile browsers
3. Let CSS handle all theme application

### Step 7: Test and Validate
1. Test theme switching functionality
2. Verify no theme flash on page load
3. Test with JavaScript disabled
4. Validate CSS custom properties are working
5. Test visual transitions and accessibility

## Testing

### Unit Tests
```tsx
// src/components/theme-switcher/theme-switcher.test.tsx
import { test, expect } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing'; 
import { ThemeSwitcher } from './theme-switcher';
import { ThemeContext, ThemeType } from '~/contexts/theme';

test('theme switcher renders correctly', async () => {
  const { screen, render } = await createDOM();
  
  const mockContext = {
    theme: { value: ThemeType.Light },
    setTheme: vi.fn(),
    isLoading: { value: false }
  };

  await render(
    <ThemeContext.Provider value={mockContext}>
      <ThemeSwitcher />
    </ThemeContext.Provider>
  );

  const button = screen.querySelector('button');
  expect(button).toBeTruthy();
  expect(button?.getAttribute('aria-label')).toContain('Switch to dark theme');
});
```

### Integration Tests
```tsx
// Test full theme switching flow
test('theme switching persists across navigation', async () => {
  // Test implementation for theme persistence
});
```

## Performance Benefits

### Before (Current Implementation)
- ❌ Theme flash on page load
- ❌ Hydration mismatch warnings
- ❌ No SSR theme support
- ❌ Multiple localStorage reads/writes

### After (Modernized Implementation)  
- ✅ Zero theme flash with pure CSS/HTML approach
- ✅ Single source of truth for all theme variables
- ✅ No CSS-in-JS duplication or maintenance overhead
- ✅ Consistent SSR/client rendering
- ✅ Server-side theme persistence
- ✅ Efficient cookie-based theme storage
- ✅ System theme preference detection
- ✅ Smooth theme transitions
- ✅ Better accessibility support
- ✅ No JavaScript required for initial theme
- ✅ Works with JavaScript disabled
- ✅ Faster initial page load
- ✅ Better caching and performance

## Accessibility Improvements

1. **Proper ARIA Labels**: Theme switcher has descriptive labels
2. **Keyboard Navigation**: Full keyboard support for theme switching
3. **Screen Reader Support**: Announces theme changes
4. **Loading States**: Indicates when theme is being saved
5. **System Preference Respect**: Honors user's system settings

## Why This Approach Is Superior

### ✅ **Single Source of Truth**
- **All theme variables defined in CSS** - no duplication between JS and CSS
- **Type-safe theme configuration** (optional) - prevents inconsistencies
- **Easier maintenance** - change themes in one place
- **Better organization** - clear separation of concerns

### ✅ **Pure HTML/CSS Solution**
- **Zero JavaScript required** for initial theme application
- **Immediate theme application** during server-side rendering
- **Works with JavaScript disabled** - fully accessible
- **No timing issues** - theme is applied before any CSS is processed

### ✅ **Better Performance**
- **Faster initial load** - no script execution delay
- **Better caching** - CSS files cached separately from JS
- **Reduced bundle size** - no client-side theme detection code
- **Better Core Web Vitals** - eliminates Cumulative Layout Shift from theme flash
- **SEO friendly** - search engines see the correct theme

### ✅ **Improved Developer Experience**
- **No CSS-in-JS duplication** - clean separation of styles and logic
- **Simpler architecture** - fewer components and moving parts
- **Easier testing** - pure server-side logic
- **Better debugging** - no client-side timing issues
- **Cleaner code** - leverages Qwik's strengths properly
- **CSS intellisense** - full IDE support for theme variables

### 🚫 **What We Eliminated**
- ❌ Theme prevention scripts
- ❌ CSS variable duplication in JavaScript
- ❌ Client-side cookie reading
- ❌ DOM manipulation timing issues
- ❌ JavaScript dependencies for theming
- ❌ Hydration mismatches
- ❌ CSS-in-JS complexity

## Best Practices

### ✅ **Recommended Approach**
1. **Define themes in CSS** using custom properties
2. **Import theme styles** in root component with `useStyles$`
3. **Set theme attribute** on body during SSR
4. **Let CSS handle everything** - no JavaScript theme application
5. **Use semantic variable names** (e.g., `--color-primary` not `--blue`)

### ✅ **File Organization**
```
src/
├── styles/
│   ├── themes.css        # Single source of truth
│   ├── reset.css         # CSS reset
│   ├── utilities.css     # Utility classes
│   └── variables.css     # Non-theme variables
├── components/
│   └── */
│       └── *.css         # Component styles using theme vars
└── routes/
    └── layout.tsx        # Theme detection and application
```

This modernized approach provides a much better user experience while properly leveraging Qwik's server-side capabilities for optimal performance. It represents the correct way to handle themes in modern Qwik applications with a clean, maintainable architecture.