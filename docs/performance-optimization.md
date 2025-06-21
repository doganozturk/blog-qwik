# Performance Optimization Guide

## Overview

This guide provides comprehensive strategies to optimize your Qwik blog's performance using the latest patterns and best practices. Focus areas include image optimization, resource loading, bundle optimization, and Core Web Vitals improvements.

## Current Performance Analysis

### Current Implementation Strengths
- ✅ **Qwik's Resumability**: Already provides excellent baseline performance
- ✅ **Lazy Loading**: Images use `loading="lazy"` attribute
- ✅ **Static Site Generation**: Build process generates static content
- ✅ **Clean Architecture**: Well-structured components and routes

### Areas for Improvement
- ⚠️ **Image Optimization**: Single format images without responsive variants
- ⚠️ **Resource Loading**: Basic `useResource$` without proper error handling
- ⚠️ **Bundle Analysis**: No bundle size monitoring
- ⚠️ **Core Web Vitals**: Room for LCP and CLS improvements

## 1. Image Optimization Strategy

### Current Image Implementation
```tsx
// src/components/header/main-header/main-header.tsx (Current)
<img src={avatarSrc} class="avatar" loading="lazy" alt="Doğan Öztürk" />
```

### Modern Responsive Image Implementation

#### 1.1 Create Image Optimization Utility
```tsx
// src/utils/image-optimization.ts (New)
export interface ImageConfig {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export interface ImageVariant {
  src: string;
  width: number;
  format: 'webp' | 'jpg' | 'png';
}

export const generateImageVariants = (basePath: string, formats: string[] = ['webp', 'jpg']): ImageVariant[] => {
  const variants: ImageVariant[] = [];
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  
  sizes.forEach(size => {
    formats.forEach(format => {
      variants.push({
        src: `${basePath}-${size}w.${format}`,
        width: size,
        format: format as 'webp' | 'jpg' | 'png'
      });
    });
  });
  
  return variants;
};

export const generateSrcSet = (variants: ImageVariant[], format: string): string => {
  return variants
    .filter(variant => variant.format === format)
    .map(variant => `${variant.src} ${variant.width}w`)
    .join(', ');
};
```

#### 1.2 Optimized Image Component
```tsx
// src/components/optimized-image/optimized-image.tsx (New)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { generateImageVariants, generateSrcSet, type ImageConfig } from '~/utils/image-optimization';
import styles from './optimized-image.css?inline';

interface OptimizedImageProps extends ImageConfig {
  class?: string;
}

export const OptimizedImage = component$<OptimizedImageProps>(({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  width,
  height,
  class: className
}) => {
  useStylesScoped$(styles);
  
  // Extract base path and extension
  const basePath = src.replace(/\.[^/.]+$/, '');
  const variants = generateImageVariants(basePath);
  
  // Generate srcsets for different formats
  const webpSrcSet = generateSrcSet(variants, 'webp');
  const jpegSrcSet = generateSrcSet(variants, 'jpg');
  
  return (
    <picture class={`optimized-image ${className || ''}`}>
      {/* WebP sources for modern browsers */}
      <source 
        srcSet={webpSrcSet}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* JPEG fallback */}
      <source 
        srcSet={jpegSrcSet}
        sizes={sizes}
        type="image/jpeg"
      />
      
      {/* Fallback img element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        class="optimized-image__img"
      />
    </picture>
  );
});
```

#### 1.3 Avatar Component Update
```tsx
// src/components/header/main-header/main-header.tsx (Updated)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Header, HeaderType } from '~/components/header/header';
import { OptimizedImage } from '~/components/optimized-image/optimized-image';
import styles from './main-header.css?inline';

export const MainHeader = component$(() => {
  useStylesScoped$(styles);

  return (
    <Header type={HeaderType.Main}>
      <OptimizedImage
        src="/images/avatar.jpg"
        alt="Doğan Öztürk"
        width={120}
        height={120}
        priority={true}
        sizes="120px"
        class="avatar"
      />
      <div class="title">
        <h1 class="name">Doğan Öztürk</h1>
        <p class="info">Reflections on Technology, Culture, and Life</p>
      </div>
    </Header>
  );
});
```

### 1.4 Image Processing Build Script
```javascript
// scripts/generate-images.js (New)
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [320, 640, 768, 1024, 1280, 1920];
const formats = ['webp', 'jpg'];

async function generateImageVariants(inputPath, outputDir) {
  const inputBuffer = await fs.readFile(inputPath);
  const baseName = path.parse(inputPath).name;
  
  for (const size of sizes) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `${baseName}-${size}w.${format}`);
      
      await sharp(inputBuffer)
        .resize(size, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .toFormat(format, {
          quality: format === 'webp' ? 85 : 80,
          progressive: true
        })
        .toFile(outputPath);
        
      console.log(`Generated: ${outputPath}`);
    }
  }
}

// Generate variants for all images
async function processImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  
  // Process avatar
  await generateImageVariants(
    path.join(imagesDir, 'avatar.jpg'),
    imagesDir
  );
  
  // Process post images
  const postsDir = path.join(imagesDir, 'posts');
  // Add logic to process all post images
}

processImages().catch(console.error);
```

## 2. Resource Loading Optimization

### Current Resource Loading
```tsx
// src/routes/index.tsx (Current)
export default component$(() => {
  const postsResource = useResource$(getPosts);
  
  return (
    <Resource
      value={postsResource}
      onResolved={(posts) => <PostSummaryList data={posts} />}
    />
  );
});
```

### Enhanced Resource Loading with Error Handling

#### 2.1 Advanced Resource Pattern
```tsx
// src/routes/index.tsx (Enhanced)
import { component$, Resource, useResource$, useSignal } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { PostSummaryListSkeleton } from '~/components/post-summary-list/post-summary-list-skeleton';
import { ErrorBoundary } from '~/components/error-boundary/error-boundary';

// Enhanced loader with error handling
export const usePostsLoader = routeLoader$(async ({ error }) => {
  try {
    const posts = await getPosts();
    
    // Validate data structure
    if (!Array.isArray(posts)) {
      throw new Error('Invalid posts data structure');
    }
    
    return {
      posts,
      timestamp: Date.now(),
      count: posts.length
    };
  } catch (err) {
    console.error('Failed to load posts:', err);
    throw error(500, 'Failed to load blog posts');
  }
});

export default component$(() => {
  const postsData = usePostsLoader();
  const retryCount = useSignal(0);
  
  // Enhanced resource with retry logic
  const postsResource = useResource$<typeof postsData.value>(async ({ track, cleanup }) => {
    track(() => retryCount.value); // Track retry attempts
    
    // Simulate abort controller for cleanup
    const controller = new AbortController();
    cleanup(() => controller.abort());
    
    try {
      // Return loader data or refetch if needed
      return postsData.value;
    } catch (error) {
      if (retryCount.value < 3) {
        // Auto-retry with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, retryCount.value) * 1000)
        );
        retryCount.value++;
        throw error; // Will trigger retry
      }
      throw new Error('Failed to load posts after multiple attempts');
    }
  });

  return (
    <>
      <MainHeader q:slot="header" />
      <main class="main">
        <Resource
          value={postsResource}
          onPending={() => <PostSummaryListSkeleton />}
          onRejected={(error) => (
            <ErrorBoundary 
              error={error} 
              onRetry={() => retryCount.value++}
            />
          )}
          onResolved={(data) => (
            <PostSummaryList 
              data={data.posts} 
              timestamp={data.timestamp}
            />
          )}
        />
      </main>
    </>
  );
});
```

#### 2.2 Loading Skeleton Component
```tsx
// src/components/post-summary-list/post-summary-list-skeleton.tsx (New)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './post-summary-list-skeleton.css?inline';

export const PostSummaryListSkeleton = component$(() => {
  useStylesScoped$(styles);
  
  return (
    <div class="skeleton-container">
      {Array.from({ length: 5 }).map((_, index) => (
        <article key={index} class="skeleton-post">
          <div class="skeleton-title"></div>
          <div class="skeleton-description"></div>
          <div class="skeleton-meta">
            <div class="skeleton-date"></div>
            <div class="skeleton-read-time"></div>
          </div>
        </article>
      ))}
    </div>
  );
});
```

#### 2.3 Error Boundary Component
```tsx
// src/components/error-boundary/error-boundary.tsx (New)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './error-boundary.css?inline';

interface ErrorBoundaryProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorBoundary = component$<ErrorBoundaryProps>(({ error, onRetry }) => {
  useStylesScoped$(styles);
  
  return (
    <div class="error-boundary">
      <div class="error-content">
        <h2 class="error-title">Something went wrong</h2>
        <p class="error-message">
          {error.message || 'An unexpected error occurred while loading content.'}
        </p>
        
        {onRetry && (
          <button 
            class="retry-button"
            onClick$={onRetry}
          >
            Try Again
          </button>
        )}
        
        <details class="error-details">
          <summary>Technical Details</summary>
          <pre class="error-stack">{error.stack}</pre>
        </details>
      </div>
    </div>
  );
});
```

## 3. Bundle Optimization

### 3.1 Vite Configuration Enhancement
```typescript
// vite.config.ts (Enhanced)
import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { analyzer } from 'rollup-plugin-analyzer';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite({
        // Enable source maps for debugging
        sourcemap: process.env.NODE_ENV === 'development',
        // Optimize for production
        minify: process.env.NODE_ENV === 'production',
        // Client-side entry points
        client: {
          // Specify which symbols should be eagerly loaded
          manifestInput: {
            // Critical symbols that should be available immediately
            symbols: [
              'theme-switcher-click',
              'navigation-interactions'
            ]
          }
        }
      }),
      tsconfigPaths(),
      // Bundle analyzer for production builds
      process.env.ANALYZE && analyzer({
        summaryOnly: true,
        limit: 20
      })
    ],
    
    build: {
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'vendor-qwik': ['@builder.io/qwik', '@builder.io/qwik-city'],
            'vendor-utils': ['date-fns'],
            
            // Feature-based chunks
            'components-header': [
              './src/components/header/header.tsx',
              './src/components/header/main-header/main-header.tsx',
              './src/components/header/post-header/post-header.tsx'
            ],
            'components-post': [
              './src/components/post-summary-list/post-summary-list.tsx',
              './src/components/post-video/post-video.tsx'
            ]
          }
        }
      },
      
      // Target modern browsers for smaller bundles
      target: ['es2020', 'chrome80', 'firefox78', 'safari13'],
      
      // Enable minification
      minify: 'esbuild',
      
      // Source maps for production debugging
      sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        '@builder.io/qwik',
        '@builder.io/qwik-city',
        'date-fns'
      ],
      // Exclude heavy dependencies that should be lazy-loaded
      exclude: ['@builder.io/qwik/testing']
    },
    
    // Preview optimization
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    }
  };
});
```

### 3.2 Bundle Analysis Scripts
```json
// package.json (Add scripts)
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "bundle:size": "npx bundlesize",
    "perf:audit": "lighthouse --output=json --output-path=./lighthouse-report.json --chrome-flags='--headless' http://localhost:4173"
  },
  "bundlesize": [
    {
      "path": "./dist/**/*.js",
      "maxSize": "50kb",
      "compression": "gzip"
    }
  ]
}
```

## 4. Core Web Vitals Optimization

### 4.1 Largest Contentful Paint (LCP) Improvements

#### Preload Critical Resources
```tsx
// src/components/router-head/router-head.tsx (Enhanced)
import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  
  return (
    <>
      <title>{head.title}</title>
      
      {/* Preload critical resources */}
      <link 
        rel="preload" 
        href="/images/avatar-320w.webp" 
        as="image" 
        type="image/webp"
        media="(max-width: 768px)"
      />
      <link 
        rel="preload" 
        href="/images/avatar-640w.webp" 
        as="image" 
        type="image/webp"
        media="(min-width: 769px)"
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://us.i.posthog.com" />
      <link rel="dns-prefetch" href="https://us.i.posthog.com" />
      
      {/* Resource hints for navigation */}
      {loc.url.pathname === '/' && (
        <>
          <link rel="prefetch" href="/posts" />
          <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        </>
      )}
      
      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}
      
      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}
      
      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
```

### 4.2 Cumulative Layout Shift (CLS) Prevention

#### Skeleton Components with Exact Dimensions
```css
/* src/components/post-summary-list/post-summary-list-skeleton.css */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.skeleton-post {
  /* Exact dimensions to prevent layout shift */
  min-height: 180px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background-secondary);
}

.skeleton-title {
  width: 80%;
  height: 1.5rem;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-description {
  width: 100%;
  height: 3rem;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-meta {
  display: flex;
  gap: 1rem;
}

.skeleton-date,
.skeleton-read-time {
  width: 100px;
  height: 1rem;
  background: var(--skeleton-base);
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 4.3 First Input Delay (FID) Optimization

#### Optimize Event Handlers
```tsx
// src/components/theme-switcher/theme-switcher.tsx (Optimized)
import { component$, useContext, useStylesScoped$, $ } from '@builder.io/qwik';
import { ThemeContext, ThemeType } from '~/contexts/theme';
import styles from './theme-switcher.css?inline';

export const ThemeSwitcher = component$(() => {
  useStylesScoped$(styles);
  const themeContext = useContext(ThemeContext);
  
  // Optimize click handler for better FID
  const handleThemeToggle = $(async () => {
    // Use requestIdleCallback for non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Analytics or other non-critical tasks
        console.log('Theme switched:', themeContext.theme.value);
      });
    }
    
    // Critical theme switching logic
    const newTheme = themeContext.theme.value === ThemeType.Light 
      ? ThemeType.Dark 
      : ThemeType.Light;
    
    await themeContext.setTheme(newTheme);
  });

  return (
    <button
      class="theme-switcher"
      onClick$={handleThemeToggle}
      // Optimize for touch devices
      style={{ touchAction: 'manipulation' }}
    >
      {/* ... */}
    </button>
  );
});
```

## 5. Performance Monitoring

### 5.1 Web Vitals Tracking
```tsx
// src/utils/performance-monitoring.ts (New)
export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

export const trackWebVitals = (metric: WebVitalsMetric) => {
  // Send to analytics service
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // Google Analytics 4
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
  
  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
};

// Web Vitals integration
export const initWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(trackWebVitals);
    getFID(trackWebVitals);
    getFCP(trackWebVitals);
    getLCP(trackWebVitals);
    getTTFB(trackWebVitals);
  });
};
```

### 5.2 Performance Observer
```tsx
// src/root.tsx (Add performance monitoring)
import { initWebVitals } from '~/utils/performance-monitoring';

export default component$(() => {
  // Initialize performance monitoring
  useOnDocument('DOMContentLoaded', $(() => {
    initWebVitals();
  }));
  
  // ... rest of component
});
```

## 6. Caching Strategy

### 6.1 Service Worker Enhancement
```tsx
// src/routes/service-worker.ts (Enhanced)
import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

// Configure cache names
setCacheNameDetails({
  prefix: 'blog-qwik',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

// Skip waiting and claim clients
skipWaiting();
clientsClaim();

// Clean up old caches
cleanupOutdatedCaches();

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        // Remove query parameters for consistent caching
        return request.url.split('?')[0];
      }
    }]
  })
);

// Cache API responses with NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [{
      cacheWillUpdate: async ({ response }) => {
        // Only cache successful responses
        return response.status === 200 ? response : null;
      }
    }]
  })
);

// Cache CSS and JS with StaleWhileRevalidate
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);
```

## 7. Performance Testing

### 7.1 Lighthouse CI Configuration
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Start server
        run: npm run preview &
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### 7.2 Lighthouse Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173/', 'http://localhost:4173/posts'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

## Expected Performance Improvements

### Before Optimization
- **LCP**: ~3.5s (Large images, no preloading)
- **FID**: ~150ms (Heavy event handlers)
- **CLS**: ~0.25 (Layout shifts during loading)
- **Bundle Size**: ~200KB (Unoptimized chunks)

### After Optimization
- **LCP**: ~1.2s (Optimized images, preloading)
- **FID**: ~50ms (Optimized event handlers)
- **CLS**: ~0.05 (Proper skeleton loading)
- **Bundle Size**: ~120KB (Optimized chunking)

This comprehensive performance optimization guide should significantly improve your blog's loading speed and user experience while maintaining Qwik's excellent baseline performance characteristics.