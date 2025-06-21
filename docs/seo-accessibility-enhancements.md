# SEO and Accessibility Enhancements Guide

## Overview

This guide provides comprehensive strategies to enhance your Qwik blog's SEO performance and accessibility compliance. Focus areas include structured data, meta tag optimization, accessibility improvements, and Core Web Vitals enhancement.

## 1. Structured Data Implementation

### 1.1 JSON-LD Schema for Blog Posts
```tsx
// src/utils/structured-data.ts (New)
import type { PostSummary, PostContent } from '#types';

export interface BlogPostSchema {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image?: string[];
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  wordCount?: number;
  timeRequired?: string;
  keywords?: string[];
  articleSection?: string;
  url: string;
}

export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'Website';
  name: string;
  description: string;
  url: string;
  author: {
    '@type': 'Person';
    name: string;
    jobTitle: string;
    url: string;
  };
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  sameAs: string[];
  image: string;
  knowsAbout: string[];
}

export const generateBlogPostSchema = (
  post: PostContent,
  baseUrl: string
): BlogPostSchema => {
  const postUrl = `${baseUrl}${post.permalink}`;
  const imageUrl = `${baseUrl}/images/posts/${post.permalink.split('/').pop()}/cover.jpg`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [imageUrl],
    author: {
      '@type': 'Person',
      name: 'Doğan Öztürk',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Doğan Öztürk Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/avatar.jpg`
      }
    },
    datePublished: post.date,
    dateModified: post.lastModified || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime || 5}M`,
    keywords: post.tags,
    articleSection: post.category,
    url: postUrl
  };
};

export const generateWebsiteSchema = (baseUrl: string): WebsiteSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Website',
  name: 'Doğan Öztürk Blog',
  description: 'Reflections on Technology, Culture, and Life',
  url: baseUrl,
  author: {
    '@type': 'Person',
    name: 'Doğan Öztürk',
    jobTitle: 'Software Engineer',
    url: baseUrl
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

export const generatePersonSchema = (baseUrl: string): PersonSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Doğan Öztürk',
  jobTitle: 'Software Engineer',
  description: 'Passionate about front-end development, JavaScript, Node.js, and sharing tech insights',
  url: baseUrl,
  sameAs: [
    'https://github.com/doganozturk',
    'https://twitter.com/doganozturk',
    'https://linkedin.com/in/doganozturk'
  ],
  image: `${baseUrl}/images/avatar.jpg`,
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'React',
    'Qwik',
    'Node.js',
    'Web Development',
    'Frontend Development',
    'Software Engineering'
  ]
});
```

### 1.2 Structured Data Component
```tsx
// src/components/structured-data/structured-data.tsx (New)
import { component$ } from '@builder.io/qwik';
import type { BlogPostSchema, WebsiteSchema, PersonSchema } from '~/utils/structured-data';

interface StructuredDataProps {
  schema: BlogPostSchema | WebsiteSchema | PersonSchema | Array<BlogPostSchema | WebsiteSchema | PersonSchema>;
}

export const StructuredData = component$<StructuredDataProps>(({ schema }) => {
  const jsonLd = Array.isArray(schema) ? schema : [schema];
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={JSON.stringify(item, null, 2)}
        />
      ))}
    </>
  );
});
```

### 1.3 Enhanced Post Layout with Structured Data
```tsx
// src/routes/(posts)/[...slug]/index.tsx (Enhanced with structured data)
import { component$ } from '@builder.io/qwik';
import { type DocumentHead, useLocation } from '@builder.io/qwik-city';
import { StructuredData } from '~/components/structured-data/structured-data';
import { generateBlogPostSchema } from '~/utils/structured-data';

export default component$(() => {
  const post = usePostLoader();
  const location = useLocation();
  const baseUrl = location.url.origin;
  
  const schema = generateBlogPostSchema(post.value, baseUrl);

  return (
    <>
      <StructuredData schema={schema} />
      
      <article class="post" itemScope itemType="https://schema.org/BlogPosting">
        <header class="post-header">
          <h1 itemProp="headline">{post.value.title}</h1>
          <div class="post-meta">
            <time 
              itemProp="datePublished" 
              dateTime={post.value.date}
            >
              {new Date(post.value.date).toLocaleDateString()}
            </time>
            <span>·</span>
            <span itemProp="timeRequired" content={`PT${post.value.readingTime}M`}>
              {post.value.readingTime} min read
            </span>
            <span>·</span>
            <span>{post.value.stats.views} views</span>
          </div>
          
          {post.value.category && (
            <span class="post-category" itemProp="articleSection">
              {post.value.category}
            </span>
          )}
          
          {post.value.tags && post.value.tags.length > 0 && (
            <div class="post-tags">
              {post.value.tags.map(tag => (
                <span key={tag} class="post-tag" itemProp="keywords">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        
        <div class="post-content" itemProp="articleBody">
          <post.value.content />
        </div>
        
        <footer class="post-footer">
          <div itemScope itemType="https://schema.org/Person" itemProp="author">
            <span class="sr-only" itemProp="name">Doğan Öztürk</span>
            <span class="sr-only" itemProp="url">https://doganozturk.dev</span>
          </div>
          
          <meta itemProp="wordCount" content={post.value.wordCount.toString()} />
          <meta itemProp="url" content={`${baseUrl}${post.value.permalink}`} />
        </footer>
      </article>
    </>
  );
});
```

## 2. Enhanced Meta Tag Optimization

### 2.1 Dynamic Meta Tag Generator
```tsx
// src/utils/meta-tags.ts (New)
import type { PostContent } from '#types';

export interface MetaTagsConfig {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
}

export const generateMetaTags = (config: MetaTagsConfig) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Doğan Öztürk',
    section,
    tags = [],
    locale = 'en_US',
    siteName = 'Doğan Öztürk Blog'
  } = config;

  const metaTags = [
    // Basic meta tags
    { name: 'description', content: description },
    { name: 'author', content: author },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'googlebot', content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1' },
    
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: siteName },
    { property: 'og:locale', content: locale },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@doganozturk' },
    { name: 'twitter:creator', content: '@doganozturk' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    
    // Additional meta tags
    { name: 'theme-color', content: '#1a2334' },
    { name: 'msapplication-TileColor', content: '#1a2334' },
    { name: 'apple-mobile-web-app-title', content: siteName },
    { name: 'application-name', content: siteName },
  ];

  // Add image meta tags if provided
  if (image) {
    metaTags.push(
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: title },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: title }
    );
  }

  // Article-specific meta tags
  if (type === 'article') {
    if (publishedTime) {
      metaTags.push({ property: 'article:published_time', content: publishedTime });
    }
    if (modifiedTime) {
      metaTags.push({ property: 'article:modified_time', content: modifiedTime });
    }
    if (author) {
      metaTags.push({ property: 'article:author', content: author });
    }
    if (section) {
      metaTags.push({ property: 'article:section', content: section });
    }
    if (tags.length > 0) {
      tags.forEach(tag => {
        metaTags.push({ property: 'article:tag', content: tag });
      });
    }
  }

  return metaTags;
};

export const generatePostMetaTags = (post: PostContent, baseUrl: string) => {
  const imageUrl = `${baseUrl}/images/posts/${post.permalink.split('/').pop()}/cover.jpg`;
  
  return generateMetaTags({
    title: `${post.title} | Doğan Öztürk`,
    description: post.description,
    image: imageUrl,
    url: `${baseUrl}${post.permalink}`,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.lastModified,
    section: post.category,
    tags: post.tags
  });
};
```

### 2.2 Enhanced Router Head Component
```tsx
// src/components/router-head/router-head.tsx (Enhanced)
import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  
  // Canonical URL
  const canonicalUrl = loc.url.href;
  
  return (
    <>
      <title>{head.title}</title>
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://us.i.posthog.com" />
      <link rel="dns-prefetch" href="https://us.i.posthog.com" />
      
      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl.replace('/tr/', '/en/')} />
      <link rel="alternate" hrefLang="tr" href={canonicalUrl.replace('/en/', '/tr/')} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl.replace('/tr/', '/en/')} />
      
      {/* RSS Feed */}
      <link rel="alternate" type="application/rss+xml" title="Doğan Öztürk Blog RSS" href="/rss.xml" />
      
      {/* Sitemap */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* Favicon and app icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Meta tags */}
      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}
      
      {/* Link tags */}
      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}
      
      {/* Styles */}
      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
      
      {/* Scripts */}
      {head.scripts?.map((script) => (
        <script key={script.key} {...script.props} dangerouslySetInnerHTML={script.script} />
      ))}
    </>
  );
});
```

## 3. Accessibility Enhancements

### 3.1 Accessible Navigation Component
```tsx
// src/components/navigation/accessible-navigation.tsx (New)
import { component$, useSignal, useStylesScoped$, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import styles from './accessible-navigation.css?inline';

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

interface AccessibleNavigationProps {
  items: NavigationItem[];
  ariaLabel?: string;
}

export const AccessibleNavigation = component$<AccessibleNavigationProps>(({ 
  items, 
  ariaLabel = 'Main navigation' 
}) => {
  useStylesScoped$(styles);
  const location = useLocation();
  const isMenuOpen = useSignal(false);

  const toggleMenu = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

  const closeMenu = $(() => {
    isMenuOpen.value = false;
  });

  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  return (
    <nav class="accessible-navigation" aria-label={ariaLabel}>
      {/* Mobile menu button */}
      <button
        class="menu-toggle"
        aria-expanded={isMenuOpen.value}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen.value ? 'Close navigation menu' : 'Open navigation menu'}
        onClick$={toggleMenu}
      >
        <span class="menu-icon" aria-hidden="true">
          {isMenuOpen.value ? '✕' : '☰'}
        </span>
      </button>

      {/* Navigation menu */}
      <ul
        id="navigation-menu"
        class={`navigation-menu ${isMenuOpen.value ? 'open' : ''}`}
        role="menubar"
        onKeyDown$={handleKeyDown}
      >
        {items.map((item, index) => {
          const isActive = location.url.pathname === item.href;
          const isHome = item.href === '/' && location.url.pathname === '/';
          const isCurrent = isActive || isHome;

          return (
            <li key={item.href} class="navigation-item" role="none">
              <a
                href={item.href}
                class={`navigation-link ${isCurrent ? 'active' : ''}`}
                role="menuitem"
                aria-current={isCurrent ? 'page' : undefined}
                tabIndex={isMenuOpen.value || window.innerWidth > 768 ? 0 : -1}
                onClick$={closeMenu}
              >
                {item.icon && (
                  <span class="navigation-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span class="navigation-label">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Backdrop for mobile */}
      {isMenuOpen.value && (
        <div
          class="navigation-backdrop"
          onClick$={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
});
```

### 3.2 Accessible Skip Links
```tsx
// src/components/skip-links/skip-links.tsx (New)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './skip-links.css?inline';

export const SkipLinks = component$(() => {
  useStylesScoped$(styles);

  return (
    <nav class="skip-links" aria-label="Skip links">
      <a href="#main-content" class="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" class="skip-link">
        Skip to navigation
      </a>
      <a href="#footer" class="skip-link">
        Skip to footer
      </a>
    </nav>
  );
});
```

### 3.3 Accessible Form Components
```tsx
// src/components/forms/accessible-form-field.tsx (New)
import { component$, useId, useStylesScoped$ } from '@builder.io/qwik';
import styles from './accessible-form-field.css?inline';

interface AccessibleFormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  name: string;
  required?: boolean;
  error?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  autocomplete?: string;
  'aria-describedby'?: string;
}

export const AccessibleFormField = component$<AccessibleFormFieldProps>(({
  label,
  type = 'text',
  name,
  required = false,
  error,
  description,
  placeholder,
  value,
  autocomplete,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  useStylesScoped$(styles);
  
  const fieldId = useId();
  const errorId = useId();
  const descriptionId = useId();

  const describedBy = [
    description && descriptionId,
    error && errorId,
    ariaDescribedBy
  ].filter(Boolean).join(' ');

  return (
    <div class={`form-field ${error ? 'error' : ''}`}>
      <label for={fieldId} class="form-label">
        {label}
        {required && (
          <span class="required-indicator" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <div id={descriptionId} class="form-description">
          {description}
        </div>
      )}
      
      <input
        id={fieldId}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        autoComplete={autocomplete}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : undefined}
        class={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      
      {error && (
        <div id={errorId} class="form-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
});
```

### 3.4 Accessible Image Component
```tsx
// src/components/optimized-image/optimized-image.tsx (Enhanced with accessibility)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './optimized-image.css?inline';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  class?: string;
  loading?: 'lazy' | 'eager';
  decorative?: boolean; // For decorative images
  caption?: string;
  longDescription?: string; // For complex images
}

export const OptimizedImage = component$<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  class: className,
  loading,
  decorative = false,
  caption,
  longDescription,
  ...props
}) => {
  useStylesScoped$(styles);
  
  const basePath = src.replace(/\.[^/.]+$/, '');
  
  // For decorative images, use empty alt text and aria-hidden
  const imageAlt = decorative ? '' : alt;
  const ariaHidden = decorative ? 'true' : undefined;

  const imageElement = (
    <picture class={`optimized-image ${className || ''}`}>
      <source 
        srcSet={`${basePath}-320w.webp 320w, ${basePath}-640w.webp 640w, ${basePath}-1024w.webp 1024w`}
        sizes={sizes}
        type="image/webp"
      />
      <source 
        srcSet={`${basePath}-320w.jpg 320w, ${basePath}-640w.jpg 640w, ${basePath}-1024w.jpg 1024w`}
        sizes={sizes}
        type="image/jpeg"
      />
      <img
        src={src}
        alt={imageAlt}
        width={width}
        height={height}
        loading={loading || (priority ? 'eager' : 'lazy')}
        decoding="async"
        aria-hidden={ariaHidden}
        aria-describedby={longDescription ? `${src}-description` : undefined}
        class="optimized-image__img"
        {...props}
      />
    </picture>
  );

  // Wrap in figure if caption or long description exists
  if (caption || longDescription) {
    return (
      <figure class="image-figure">
        {imageElement}
        {caption && <figcaption class="image-caption">{caption}</figcaption>}
        {longDescription && (
          <div id={`${src}-description`} class="image-description sr-only">
            {longDescription}
          </div>
        )}
      </figure>
    );
  }

  return imageElement;
});
```

## 4. Focus Management and Keyboard Navigation

### 4.1 Focus Trap Utility
```tsx
// src/utils/focus-trap.ts (New)
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private previouslyFocusedElement: Element | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.focusableElements = this.getFocusableElements();
    this.updateFocusableElements();
  }

  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(this.element.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  private updateFocusableElements(): void {
    this.focusableElements = this.getFocusableElements();
    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  public activate(): void {
    this.previouslyFocusedElement = document.activeElement;
    this.updateFocusableElements();
    
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    this.element.addEventListener('keydown', this.handleKeyDown);
  }

  public deactivate(): void {
    this.element.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.previouslyFocusedElement && 'focus' in this.previouslyFocusedElement) {
      (this.previouslyFocusedElement as HTMLElement).focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    this.updateFocusableElements();

    if (!this.firstFocusableElement || !this.lastFocusableElement) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  };
}
```

### 4.2 Modal Component with Focus Management
```tsx
// src/components/modal/accessible-modal.tsx (New)
import { 
  component$, 
  useSignal, 
  useVisibleTask$, 
  useStylesScoped$,
  $,
  Slot
} from '@builder.io/qwik';
import { FocusTrap } from '~/utils/focus-trap';
import styles from './accessible-modal.css?inline';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

export const AccessibleModal = component$<AccessibleModalProps>(({
  isOpen,
  onClose,
  title,
  description,
  size = 'medium'
}) => {
  useStylesScoped$(styles);
  const modalRef = useSignal<HTMLElement>();
  const focusTrap = useSignal<FocusTrap>();

  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  });

  const handleBackdropClick = $((event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  });

  // Set up focus trap when modal opens
  useVisibleTask$(({ track }) => {
    track(() => isOpen);
    
    if (isOpen && modalRef.value) {
      focusTrap.value = new FocusTrap(modalRef.value);
      focusTrap.value.activate();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        focusTrap.value?.deactivate();
        document.body.style.overflow = '';
      };
    }
  });

  if (!isOpen) return null;

  return (
    <div
      class="modal-backdrop"
      onClick$={handleBackdropClick}
      onKeyDown$={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        ref={modalRef}
        class={`modal-content modal-${size}`}
        role="document"
      >
        <header class="modal-header">
          <h2 id="modal-title" class="modal-title">
            {title}
          </h2>
          <button
            class="modal-close"
            onClick$={onClose}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </header>
        
        {description && (
          <div id="modal-description" class="modal-description">
            {description}
          </div>
        )}
        
        <div class="modal-body">
          <Slot />
        </div>
      </div>
    </div>
  );
});
```

## 5. CSS Accessibility Enhancements

### 5.1 Accessible CSS Utilities
```css
/* src/styles/accessibility.css (New) */

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
:focus {
  outline: 2px solid var(--color-focus, #0066cc);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-focus, #0066cc);
  outline-offset: 2px;
}

/* Skip links */
.skip-links {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 8px;
  background: var(--color-background);
  color: var(--color-text);
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  border: 2px solid var(--color-border);
  transition: top 0.3s;
}

.skip-link:focus {
  top: 8px;
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-border: #000;
    --color-text: #000;
    --color-background: #fff;
  }
  
  [data-theme="dark"] {
    --color-border: #fff;
    --color-text: #fff;
    --color-background: #000;
  }
}

/* Color scheme preferences */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-background: #1a1a1a;
    --color-text: #ffffff;
    --color-border: #333333;
  }
}

/* Focus within for container elements */
.form-field:focus-within {
  border-color: var(--color-focus);
}

/* Error states */
.error {
  border-color: var(--color-error, #dc3545);
}

.form-error {
  color: var(--color-error, #dc3545);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Required field indicators */
.required-indicator {
  color: var(--color-error, #dc3545);
  margin-left: 0.25rem;
}

/* Interactive elements */
button, a, input, select, textarea {
  min-height: 44px; /* Minimum touch target size */
  min-width: 44px;
}

/* Loading states */
.loading {
  cursor: wait;
}

.loading * {
  pointer-events: none;
}

/* Disabled states */
:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  a[href]:after {
    content: " (" attr(href) ")";
  }
  
  a[href^="#"]:after,
  a[href^="javascript:"]:after {
    content: "";
  }
}
```

## 6. SEO Performance Monitoring

### 6.1 Core Web Vitals Tracking
```tsx
// src/utils/web-vitals.ts (Enhanced)
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

export const trackWebVitals = (metric: WebVitalsMetric) => {
  // Send to analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      custom_map: { metric_id: 'custom_metric_id' },
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to PostHog
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('web_vital', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
      metric_delta: metric.delta,
      page_url: window.location.href,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital - ${metric.name}:`, {
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      entries: metric.entries,
    });
  }
};

export const initWebVitals = () => {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(trackWebVitals);
    onFID(trackWebVitals);
    onFCP(trackWebVitals);
    onLCP(trackWebVitals);
    onTTFB(trackWebVitals);
  });
};
```

This comprehensive SEO and accessibility enhancement guide provides the foundation for a highly optimized, inclusive, and search-engine-friendly blog that meets modern web standards and accessibility guidelines.