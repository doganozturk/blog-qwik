# Developer Experience Improvements Guide

## Overview

This guide focuses on enhancing the developer experience for your Qwik blog through improved tooling, testing strategies, type safety, debugging capabilities, and development workflows.

## 1. Enhanced TypeScript Configuration

### 1.1 Stricter TypeScript Settings
```json
// tsconfig.json (Enhanced)
{
  "compilerOptions": {
    "allowJs": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["es2022", "DOM", "WebWorker", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "@builder.io/qwik",
    
    // Strict type checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    // Module resolution
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    
    // Output
    "incremental": true,
    "isolatedModules": true,
    "outDir": "tmp",
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    // Type checking
    "types": ["node", "vite/client", "vitest/globals"],
    "typeRoots": ["./node_modules/@types", "./src/types"],
    
    // Path mapping
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"],
      "@/*": ["./src/*"],
      "#types": ["./src/types/index.ts"]
    }
  },
  "include": [
    "src",
    "*.d.ts", 
    "*.config.ts", 
    "vitest.setup.tsx",
    "scripts/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "server",
    "coverage"
  ]
}
```

### 1.2 Enhanced Type Definitions
```typescript
// src/types/index.ts (Enhanced)
import type { QwikIntrinsicElements } from '@builder.io/qwik';

// Global type definitions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    posthog?: any;
  }
}

// Post-related types
export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  permalink: string;
  lang: 'en' | 'tr';
  category?: string;
  tags?: string[];
  author?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface PostSummary {
  title: string;
  description: string;
  date: string;
  permalink: string;
  lang: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  featured?: boolean;
}

export interface PostContent extends PostSummary {
  content: string;
  frontmatter: PostFrontmatter;
  wordCount: number;
  lastModified?: string;
}

// Theme types
export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto'
}

export interface ThemeContextValue {
  theme: { value: ThemeType };
  setTheme: (theme: ThemeType) => Promise<void>;
  isLoading: { value: boolean };
}

// Component props types
export interface BaseComponentProps {
  class?: string;
  id?: string;
  'data-testid'?: string;
}

export interface ImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface NewsletterData {
  email: string;
  consent: boolean;
}

// Utility types
export type Locale = 'en' | 'tr';
export type ColorScheme = 'light' | 'dark' | 'no-preference';

// Analytics types
export interface PageViewData {
  path: string;
  title: string;
  referrer?: string;
  userAgent?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  path: string;
  timestamp: string;
}

// Error types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}

// Component type extensions
declare module '@builder.io/qwik' {
  interface QwikIntrinsicElements {
    // Custom elements if needed
  }
}

// Environment variables
export interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_GA_ID?: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 2. Enhanced Testing Strategy

### 2.1 Improved Vitest Configuration
```typescript
// vitest.config.ts (Enhanced)
import { defineConfig } from 'vitest/config';
import { qwikVite } from '@builder.io/qwik/optimizer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [qwikVite(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules',
        'dist',
        'coverage',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**',
        'src/entry.*',
        'src/root.tsx'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Test environment
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Mock configuration
    deps: {
      inline: ['@builder.io/qwik', '@builder.io/qwik-city']
    }
  },
  
  resolve: {
    alias: {
      '~': new URL('./src', import.meta.url).pathname,
      '@': new URL('./src', import.meta.url).pathname
    }
  }
});
```

### 2.2 Enhanced Test Setup
```tsx
// vitest.setup.tsx (Enhanced)
import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = vi.fn();

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
  }
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
});

// Global test utilities
export const createMockPost = (overrides = {}) => ({
  title: 'Test Post',
  description: 'A test post description',
  date: '2023-01-01',
  permalink: '/test-post',
  lang: 'en',
  category: 'test',
  ...overrides
});

export const createMockThemeContext = (theme = 'light') => ({
  theme: { value: theme },
  setTheme: vi.fn(),
  isLoading: { value: false }
});
```

### 2.3 Component Testing Patterns
```tsx
// src/components/theme-switcher/theme-switcher.test.tsx (Enhanced)
import { test, expect, vi, beforeEach, describe } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { ThemeSwitcher } from './theme-switcher';
import { ThemeContext, ThemeType } from '~/contexts/theme';
import { createMockThemeContext } from '../../../vitest.setup';

describe('ThemeSwitcher', () => {
  let mockContext: ReturnType<typeof createMockThemeContext>;

  beforeEach(() => {
    mockContext = createMockThemeContext();
  });

  test('renders with light theme', async () => {
    const { screen, render } = await createDOM();
    
    await render(
      <ThemeContext.Provider value={mockContext}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    const button = screen.querySelector('button[aria-label*="Switch to dark theme"]');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('🌚');
  });

  test('renders with dark theme', async () => {
    const { screen, render } = await createDOM();
    mockContext.theme.value = ThemeType.Dark;
    
    await render(
      <ThemeContext.Provider value={mockContext}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    const button = screen.querySelector('button[aria-label*="Switch to light theme"]');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('🌞');
  });

  test('calls setTheme when clicked', async () => {
    const { screen, render, userEvent } = await createDOM();
    
    await render(
      <ThemeContext.Provider value={mockContext}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    const button = screen.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);

    expect(mockContext.setTheme).toHaveBeenCalledWith(ThemeType.Dark);
  });

  test('shows loading state', async () => {
    const { screen, render } = await createDOM();
    mockContext.isLoading.value = true;
    
    await render(
      <ThemeContext.Provider value={mockContext}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    const button = screen.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('⏳');
  });

  test('has proper accessibility attributes', async () => {
    const { screen, render } = await createDOM();
    
    await render(
      <ThemeContext.Provider value={mockContext}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    const button = screen.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toContain('Switch to');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
```

### 2.4 Integration Testing
```tsx
// src/components/post-summary-list/post-summary-list.integration.test.tsx (New)
import { test, expect, describe } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { PostSummaryList } from './post-summary-list';
import { createMockPost } from '../../../vitest.setup';

describe('PostSummaryList Integration', () => {
  test('renders list of posts correctly', async () => {
    const { screen, render } = await createDOM();
    
    const mockPosts = [
      createMockPost({ title: 'First Post', permalink: '/first-post' }),
      createMockPost({ title: 'Second Post', permalink: '/second-post' }),
    ];
    
    await render(<PostSummaryList data={mockPosts} />);

    expect(screen.textContent).toContain('First Post');
    expect(screen.textContent).toContain('Second Post');
    
    const links = screen.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute('href')).toBe('/first-post');
    expect(links[1]?.getAttribute('href')).toBe('/second-post');
  });

  test('handles empty post list', async () => {
    const { screen, render } = await createDOM();
    
    await render(<PostSummaryList data={[]} />);

    expect(screen.textContent).toContain('No posts found');
  });

  test('filters posts by category when provided', async () => {
    const { screen, render } = await createDOM();
    
    const mockPosts = [
      createMockPost({ title: 'Tech Post', category: 'technology' }),
      createMockPost({ title: 'Life Post', category: 'lifestyle' }),
    ];
    
    await render(<PostSummaryList data={mockPosts} filterCategory="technology" />);

    expect(screen.textContent).toContain('Tech Post');
    expect(screen.textContent).not.toContain('Life Post');
  });
});
```

## 3. Development Tooling Enhancements

### 3.1 ESLint Configuration
```javascript
// .eslintrc.cjs (Enhanced)
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:qwik/recommended',
    'plugin:@typescript-eslint/strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'qwik'],
  rules: {
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    
    // General code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
    
    // Qwik specific
    'qwik/loader-location': 'error',
    'qwik/no-react-props': 'error',
    'qwik/prefer-classlist': 'warn',
    'qwik/unused-server': 'error',
    'qwik/valid-lexical-scope': 'error',
  },
  overrides: [
    {
      files: ['*.test.{ts,tsx}', '*.spec.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
    {
      files: ['*.config.{ts,js}', 'scripts/**/*'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    'coverage',
    'server',
    '.tmp',
    'storybook-static',
  ],
};
```

### 3.2 Prettier Configuration
```javascript
// .prettierrc.cjs (Enhanced)
module.exports = {
  // Formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // HTML/JSX
  jsxSingleQuote: false,
  htmlWhitespaceSensitivity: 'css',
  
  // Markdown
  proseWrap: 'preserve',
  
  // File specific overrides
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
  ],
  
  // Plugin configuration
  plugins: ['prettier-plugin-organize-imports'],
};
```

### 3.3 VS Code Configuration
```json
// .vscode/settings.json (New)
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  "files.associations": {
    "*.css": "css"
  },
  
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true,
    "**/.tmp": true
  },
  
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/coverage/**": true
  },
  
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.wordWrap": "on"
  }
}
```

### 3.4 VS Code Extensions Recommendations
```json
// .vscode/extensions.json (New)
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "vitest.explorer",
    "ms-playwright.playwright",
    "yzhang.markdown-all-in-one",
    "streetsidesoftware.code-spell-checker",
    "aaron-bond.better-comments",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## 4. Build and Development Scripts

### 4.1 Enhanced Package.json Scripts
```json
// package.json (Enhanced scripts section)
{
  "scripts": {
    // Development
    "dev": "vite --mode ssr --host",
    "dev:debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    "dev:turbo": "TURBO=1 vite --mode ssr",
    
    // Building
    "build": "qwik build",
    "build:client": "vite build",
    "build:server": "vite build --ssr src/entry.ssr.tsx",
    "build:types": "tsc --incremental --noEmit",
    "build:analyze": "ANALYZE=true npm run build",
    
    // Testing
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    // Linting & Formatting
    "lint": "eslint \"src/**/*.{ts,tsx}\" --cache",
    "lint:fix": "eslint \"src/**/*.{ts,tsx}\" --fix --cache",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    
    // Quality checks
    "check": "npm run typecheck && npm run lint && npm run format:check",
    "check:fix": "npm run typecheck && npm run lint:fix && npm run format",
    
    // Performance
    "perf:audit": "lighthouse http://localhost:4173 --output json --output-path ./lighthouse-report.json",
    "perf:bundle": "npx bundlesize",
    
    // Utilities
    "clean": "rm -rf dist .tmp node_modules/.vite coverage",
    "clean:install": "npm run clean && npm install",
    "preview": "qwik build preview && vite preview --open",
    "start": "vite --open --mode ssr",
    
    // Development utilities
    "generate:component": "node scripts/generate-component.js",
    "generate:page": "node scripts/generate-page.js",
    "prepare": "husky install"
  }
}
```

### 4.2 Component Generator Script
```javascript
// scripts/generate-component.js (New)
const fs = require('fs').promises;
const path = require('path');

async function generateComponent(componentName) {
  const kebabName = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1);
  const componentDir = path.join('src', 'components', kebabName);
  
  // Create component directory
  await fs.mkdir(componentDir, { recursive: true });
  
  // Component template
  const componentTemplate = `import { component$, useStylesScoped$ } from '@builder.io/qwik';
import type { BaseComponentProps } from '#types';
import styles from './${kebabName}.css?inline';

interface ${componentName}Props extends BaseComponentProps {
  // Add your props here
}

export const ${componentName} = component$<${componentName}Props>(({ class: className, ...props }) => {
  useStylesScoped$(styles);

  return (
    <div class={\`${kebabName} \${className || ''}\`} {...props}>
      <h1>${componentName} Component</h1>
    </div>
  );
});
`;

  // CSS template
  const cssTemplate = `.${kebabName} {
  /* Add your styles here */
}
`;

  // Test template
  const testTemplate = `import { test, expect, describe } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { ${componentName} } from './${kebabName}';

describe('${componentName}', () => {
  test('renders correctly', async () => {
    const { screen, render } = await createDOM();
    
    await render(<${componentName} />);
    
    expect(screen.textContent).toContain('${componentName} Component');
  });

  test('applies custom class', async () => {
    const { screen, render } = await createDOM();
    
    await render(<${componentName} class="custom-class" />);
    
    const element = screen.querySelector('.${kebabName}');
    expect(element?.classList.contains('custom-class')).toBe(true);
  });
});
`;

  // Write files
  await fs.writeFile(path.join(componentDir, `${kebabName}.tsx`), componentTemplate);
  await fs.writeFile(path.join(componentDir, `${kebabName}.css`), cssTemplate);
  await fs.writeFile(path.join(componentDir, `${kebabName}.test.tsx`), testTemplate);

  console.log(`✅ Component ${componentName} created at ${componentDir}`);
}

// Get component name from command line
const componentName = process.argv[2];
if (!componentName) {
  console.error('❌ Please provide a component name: npm run generate:component MyComponent');
  process.exit(1);
}

generateComponent(componentName).catch(console.error);
```

### 4.3 Git Hooks Setup
```json
// .husky/pre-commit (New)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run type checking
echo "⚡ Type checking..."
npm run typecheck

# Run linting
echo "🔧 Linting..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test:run

echo "✅ Pre-commit checks passed!"
```

```json
// .husky/commit-msg (New)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check commit message format
npx commitlint --edit $1
```

### 4.4 Commitlint Configuration
```javascript
// .commitlintrc.cjs (New)
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New features
        'fix',      // Bug fixes
        'docs',     // Documentation
        'style',    // Code style changes
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD
        'build',    // Build system
        'revert',   // Reverts
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 120],
  },
};
```

## 5. Debugging and Development Tools

### 5.1 Debug Configuration
```json
// .vscode/launch.json (New)
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Qwik Dev Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vite/bin/vite.js",
      "args": ["--mode", "ssr"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "skipFiles": ["<node_internals>/**", "node_modules/**"]
    },
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run"],
      "env": {
        "NODE_ENV": "test"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**", "node_modules/**"]
    }
  ]
}
```

### 5.2 Development Environment Variables
```bash
# .env.development (New)
VITE_APP_TITLE="Doğan Öztürk Blog (Dev)"
VITE_APP_ENV=development
VITE_DEBUG=true
VITE_POSTHOG_KEY=your_dev_key_here
VITE_GA_ID=your_dev_ga_id_here

# Server-side variables
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test

# Database (if using one)
DATABASE_URL=file:./dev.db

# Feature flags
FEATURE_NEWSLETTER=true
FEATURE_COMMENTS=false
FEATURE_ANALYTICS=true
```

## 6. Performance Monitoring in Development

### 6.1 Bundle Analyzer Configuration
```javascript
// scripts/analyze-bundle.js (New)
const { analyzer } = require('rollup-plugin-analyzer');
const { build } = require('vite');

async function analyzeBundles() {
  console.log('📊 Analyzing bundle...');
  
  try {
    await build({
      plugins: [
        analyzer({
          summaryOnly: false,
          limit: 50,
          hideDeps: false,
          showExports: true
        })
      ],
      build: {
        write: false, // Don't write files, just analyze
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['@builder.io/qwik', '@builder.io/qwik-city'],
              utils: ['date-fns']
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
  }
}

if (require.main === module) {
  analyzeBundles();
}

module.exports = { analyzeBundles };
```

This comprehensive developer experience enhancement provides a robust foundation for efficient development, testing, and maintenance of your Qwik blog application.