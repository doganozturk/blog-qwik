# Modern Qwik Patterns Implementation Guide

## Overview

This guide demonstrates how to implement the latest Qwik patterns and features to modernize your blog. Focus areas include server functions, route actions, enhanced loaders, and advanced component patterns using Qwik 1.14+ features.

## 1. Server Functions with `server$()`

### 1.1 Analytics Tracking
```tsx
// src/utils/analytics.ts (New)
import { server$ } from '@builder.io/qwik-city';

// Server-side analytics tracking
export const trackPageView = server$(function(data: {
  path: string;
  title: string;
  referrer?: string;
  userAgent?: string;
}) {
  // Access request context
  const ip = this.request.headers.get('x-forwarded-for') || 
             this.request.headers.get('x-real-ip') || 
             'unknown';
  
  // Server-side analytics logging
  console.log('Page View:', {
    ...data,
    ip,
    timestamp: new Date().toISOString(),
    host: this.url.hostname
  });
  
  // Send to analytics service (example with PostHog)
  if (process.env.POSTHOG_API_KEY) {
    await fetch('https://us.i.posthog.com/capture/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: process.env.POSTHOG_API_KEY,
        event: 'page_view',
        properties: {
          ...data,
          ip,
          $current_url: this.url.href
        }
      })
    });
  }
});

// Server-side error tracking
export const trackError = server$(function(error: {
  message: string;
  stack?: string;
  component?: string;
  userAgent?: string;
}) {
  console.error('Client Error:', {
    ...error,
    timestamp: new Date().toISOString(),
    url: this.url.href,
    userAgent: this.request.headers.get('user-agent')
  });
  
  // You could send to error tracking service like Sentry here
});

// Server-side performance tracking  
export const trackPerformanceMetric = server$(function(metric: {
  name: string;
  value: number;
  path: string;
}) {
  console.log('Performance Metric:', {
    ...metric,
    timestamp: new Date().toISOString(),
    userAgent: this.request.headers.get('user-agent')
  });
});
```

### 1.2 Content Management Server Functions
```tsx
// src/utils/content-server.ts (New)
import { server$ } from '@builder.io/qwik-city';
import type { PostSummary } from '~/types';

// Server-side post search
export const searchPosts = server$(async function(query: string): Promise<PostSummary[]> {
  if (!query || query.length < 2) {
    return [];
  }
  
  // Import posts on server (this runs only on server)
  const { getPosts } = await import('~/routes/index');
  const allPosts = await getPosts();
  
  // Server-side search logic
  const searchTerms = query.toLowerCase().split(' ');
  
  return allPosts.filter(post => {
    const searchableText = `${post.title} ${post.description}`.toLowerCase();
    return searchTerms.every(term => searchableText.includes(term));
  });
});

// Server-side post statistics
export const getPostStats = server$(async function(permalink: string) {
  // This could fetch from a database or analytics API
  return {
    views: Math.floor(Math.random() * 1000), // Placeholder
    readTime: Math.ceil(Math.random() * 10),
    likes: Math.floor(Math.random() * 50)
  };
});

// Server-side sitemap generation
export const generateSitemap = server$(async function() {
  const { getPosts } = await import('~/routes/index');
  const posts = await getPosts();
  
  const baseUrl = this.url.origin;
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}${post.permalink}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  return sitemap;
});
```

### 1.3 Integrating Server Functions in Components
```tsx
// src/routes/layout.tsx (Enhanced with analytics)
import { component$, useOnDocument, $ } from '@builder.io/qwik';
import { trackPageView, trackError } from '~/utils/analytics';

export default component$(() => {
  // Track page views
  useOnDocument('DOMContentLoaded', $(async () => {
    try {
      await trackPageView({
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }));
  
  // Global error handling
  useOnDocument('error', $(async (event) => {
    const error = (event as ErrorEvent);
    await trackError({
      message: error.message,
      stack: error.error?.stack,
      component: 'global'
    });
  }));

  // ... rest of component
});
```

## 2. Route Actions with `routeAction$()`

### 2.1 Contact Form with Validation
```tsx
// src/routes/contact/index.tsx (New)
import { component$, useSignal } from '@builder.io/qwik';
import { 
  routeAction$, 
  routeLoader$, 
  Form, 
  zod$, 
  z,
  type DocumentHead 
} from '@builder.io/qwik-city';

// Validation schema
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0) // Bot protection
});

type ContactForm = z.infer<typeof ContactSchema>;

// Rate limiting loader
export const useRateLimitLoader = routeLoader$(async ({ cookie, error }) => {
  const lastSubmission = cookie.get('last_contact_submission')?.value;
  
  if (lastSubmission) {
    const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
    const cooldownPeriod = 5 * 60 * 1000; // 5 minutes
    
    if (timeSinceLastSubmission < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastSubmission) / 1000 / 60);
      throw error(429, `Please wait ${remainingTime} minutes before submitting again`);
    }
  }
  
  return { canSubmit: true };
});

// Contact form action
export const useContactAction = routeAction$(async (data, { cookie, error }) => {
  try {
    // Honeypot check
    if (data.honeypot) {
      throw new Error('Bot detected');
    }
    
    // Rate limiting
    cookie.set('last_contact_submission', Date.now().toString(), {
      path: '/',
      maxAge: 5 * 60, // 5 minutes
      sameSite: 'lax'
    });
    
    // Send email (example with nodemailer or service)
    await sendContactEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    });
    
    return {
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    };
    
  } catch (err) {
    console.error('Contact form error:', err);
    return {
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again.'
    };
  }
}, zod$(ContactSchema));

// Email sending function (server-side)
async function sendContactEmail(data: Omit<ContactForm, 'honeypot'>) {
  // Example implementation - replace with your email service
  if (process.env.SMTP_HOST) {
    // Use nodemailer or your preferred email service
    console.log('Sending email:', data);
  }
}

export default component$(() => {
  const contactAction = useContactAction();
  const rateLimitData = useRateLimitLoader();
  const isSubmitting = useSignal(false);

  return (
    <div class="contact-page">
      <h1>Contact Me</h1>
      
      {contactAction.value?.success && (
        <div class="success-message">
          {contactAction.value.message}
        </div>
      )}
      
      {contactAction.value?.success === false && (
        <div class="error-message">
          {contactAction.value.message}
        </div>
      )}
      
      <Form 
        action={contactAction}
        onSubmitCompleted$={() => {
          isSubmitting.value = false;
        }}
        preventdefault:submit
      >
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={contactAction.formData?.get('name') || ''}
          />
          {contactAction.value?.fieldErrors?.name && (
            <span class="field-error">{contactAction.value.fieldErrors.name}</span>
          )}
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={contactAction.formData?.get('email') || ''}
          />
          {contactAction.value?.fieldErrors?.email && (
            <span class="field-error">{contactAction.value.fieldErrors.email}</span>
          )}
        </div>

        <div class="form-group">
          <label for="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={contactAction.formData?.get('subject') || ''}
          />
          {contactAction.value?.fieldErrors?.subject && (
            <span class="field-error">{contactAction.value.fieldErrors.subject}</span>
          )}
        </div>

        <div class="form-group">
          <label for="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={contactAction.formData?.get('message') || ''}
          />
          {contactAction.value?.fieldErrors?.message && (
            <span class="field-error">{contactAction.value.fieldErrors.message}</span>
          )}
        </div>

        {/* Honeypot field for bot protection */}
        <input
          name="honeypot"
          type="text"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <button 
          type="submit" 
          disabled={isSubmitting.value || contactAction.isRunning}
          onClick$={() => isSubmitting.value = true}
        >
          {contactAction.isRunning ? 'Sending...' : 'Send Message'}
        </button>
      </Form>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contact - Doğan Öztürk',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with Doğan Öztürk. Send a message about web development, JavaScript, or any other topic.'
    }
  ]
};
```

### 2.2 Newsletter Subscription Action
```tsx
// src/components/newsletter-signup/newsletter-signup.tsx (New)
import { component$, useSignal } from '@builder.io/qwik';
import { routeAction$, Form, zod$, z } from '@builder.io/qwik-city';

const NewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consent: z.boolean().refine(val => val === true, 'You must agree to receive emails')
});

export const useNewsletterAction = routeAction$(async (data, { cookie }) => {
  try {
    // Check if already subscribed
    const existingSubscription = cookie.get(`newsletter_${data.email}`)?.value;
    if (existingSubscription) {
      return {
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      };
    }
    
    // Add to newsletter service (e.g., Mailchimp, ConvertKit)
    await addToNewsletter(data.email);
    
    // Set cookie to prevent duplicate subscriptions
    cookie.set(`newsletter_${data.email}`, 'subscribed', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax'
    });
    
    return {
      success: true,
      message: 'Successfully subscribed to the newsletter!'
    };
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    };
  }
}, zod$(NewsletterSchema));

async function addToNewsletter(email: string) {
  // Example newsletter service integration
  if (process.env.MAILCHIMP_API_KEY) {
    // Mailchimp integration
    console.log('Adding to newsletter:', email);
  }
}

export const NewsletterSignup = component$(() => {
  const newsletterAction = useNewsletterAction();
  const email = useSignal('');

  return (
    <div class="newsletter-signup">
      <h3>Stay Updated</h3>
      <p>Get notified about new posts and tech insights.</p>
      
      {newsletterAction.value?.success && (
        <div class="success-message">
          {newsletterAction.value.message}
        </div>
      )}
      
      {newsletterAction.value?.success === false && (
        <div class="error-message">
          {newsletterAction.value.message}
        </div>
      )}
      
      {!newsletterAction.value?.success && (
        <Form action={newsletterAction}>
          <div class="newsletter-form">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              bind:value={email}
            />
            
            <div class="consent-checkbox">
              <input
                type="checkbox"
                id="newsletter-consent"
                name="consent"
                required
              />
              <label for="newsletter-consent">
                I agree to receive newsletter emails
              </label>
            </div>
            
            <button type="submit" disabled={newsletterAction.isRunning}>
              {newsletterAction.isRunning ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </Form>
      )}
    </div>
  );
});
```

## 3. Enhanced Route Loaders

### 3.1 Post Data Loader with Caching
```tsx
// src/routes/(posts)/[...slug]/index.tsx (Enhanced)
import { component$, Resource } from '@builder.io/qwik';
import { 
  routeLoader$, 
  type DocumentHead,
  type StaticGenerateHandler 
} from '@builder.io/qwik-city';

// Enhanced post loader with caching and validation
export const usePostLoader = routeLoader$(async ({ params, error, cacheControl }) => {
  const slug = params.slug;
  
  // Set cache control headers
  cacheControl({
    maxAge: 60 * 60 * 24, // 1 day
    staleWhileRevalidate: 60 * 60 * 24 * 7 // 1 week
  });
  
  try {
    // Dynamic import of the specific post
    const postModule = await import(`../../../(posts)/${slug}/index.mdx`).catch(() => null);
    
    if (!postModule) {
      throw error(404, 'Post not found');
    }
    
    // Extract frontmatter and content
    const frontmatter = postModule.frontmatter || {};
    const title = frontmatter.title || 'Untitled Post';
    const date = frontmatter.date || new Date().toISOString();
    const description = frontmatter.description || '';
    
    // Get reading time estimate
    const readingTime = calculateReadingTime(postModule.body || '');
    
    // Get post statistics
    const stats = await getPostStats(slug);
    
    return {
      title,
      description,
      date,
      readingTime,
      stats,
      content: postModule.default,
      frontmatter
    };
    
  } catch (err) {
    console.error(`Failed to load post: ${slug}`, err);
    throw error(500, 'Failed to load post content');
  }
});

// Related posts loader
export const useRelatedPostsLoader = routeLoader$(async ({ params }) => {
  const currentSlug = params.slug;
  
  try {
    const { getPosts } = await import('~/routes/index');
    const allPosts = await getPosts();
    
    // Simple related posts algorithm (you could enhance this)
    const relatedPosts = allPosts
      .filter(post => !post.permalink.includes(currentSlug))
      .sort(() => Math.random() - 0.5) // Random selection
      .slice(0, 3);
    
    return relatedPosts;
  } catch (error) {
    console.error('Failed to load related posts:', error);
    return [];
  }
});

// Reading time calculation utility
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default component$(() => {
  const post = usePostLoader();
  const relatedPosts = useRelatedPostsLoader();

  return (
    <article class="post">
      <header class="post-header">
        <h1>{post.value.title}</h1>
        <div class="post-meta">
          <time>{new Date(post.value.date).toLocaleDateString()}</time>
          <span>·</span>
          <span>{post.value.readingTime} min read</span>
          <span>·</span>
          <span>{post.value.stats.views} views</span>
        </div>
      </header>
      
      <div class="post-content">
        <post.value.content />
      </div>
      
      <footer class="post-footer">
        <h3>Related Posts</h3>
        <Resource
          value={relatedPosts}
          onResolved={(posts) => (
            <div class="related-posts">
              {posts.map(relatedPost => (
                <a 
                  key={relatedPost.permalink} 
                  href={relatedPost.permalink}
                  class="related-post"
                >
                  <h4>{relatedPost.title}</h4>
                  <p>{relatedPost.description}</p>
                </a>
              ))}
            </div>
          )}
        />
      </footer>
    </article>
  );
});

// Static generation for all posts
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const { getPosts } = await import('~/routes/index');
  const posts = await getPosts();
  
  return {
    params: posts.map(post => ({
      slug: post.permalink.replace(/^\//, '').replace(/\/$/, '')
    }))
  };
};

// Dynamic head based on post data
export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePostLoader);
  
  return {
    title: post.title,
    meta: [
      { name: 'description', content: post.description },
      { name: 'author', content: 'Doğan Öztürk' },
      { property: 'article:published_time', content: post.date },
      { property: 'article:author', content: 'Doğan Öztürk' },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.description },
      { property: 'og:type', content: 'article' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: post.title },
      { property: 'twitter:description', content: post.description }
    ]
  };
};
```

### 3.2 Global Navigation Loader
```tsx
// src/routes/layout.tsx (Enhanced with navigation loader)
import { routeLoader$ } from '@builder.io/qwik-city';

// Global navigation data loader
export const useNavigationLoader = routeLoader$(async ({ cacheControl }) => {
  // Cache navigation data for 1 hour
  cacheControl({
    maxAge: 60 * 60,
    staleWhileRevalidate: 60 * 60 * 24
  });
  
  try {
    const { getPosts } = await import('./index');
    const recentPosts = await getPosts();
    
    // Get categories from posts
    const categories = [...new Set(
      recentPosts
        .map(post => post.frontmatter?.category)
        .filter(Boolean)
    )];
    
    // Navigation structure
    return {
      mainNav: [
        { label: 'Home', href: '/', active: false },
        { label: 'Posts', href: '/posts', active: false },
        { label: 'About', href: '/about', active: false },
        { label: 'Contact', href: '/contact', active: false }
      ],
      categories,
      recentPosts: recentPosts.slice(0, 5),
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/doganozturk', icon: 'github' },
        { platform: 'Twitter', url: 'https://twitter.com/doganozturk', icon: 'twitter' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/doganozturk', icon: 'linkedin' }
      ]
    };
  } catch (error) {
    console.error('Failed to load navigation data:', error);
    return {
      mainNav: [],
      categories: [],
      recentPosts: [],
      socialLinks: []
    };
  }
});
```

## 4. Advanced Component Patterns

### 4.1 Lazy-Loaded Search Component
```tsx
// src/components/search/search.tsx (New)
import { 
  component$, 
  useSignal, 
  useTask$, 
  useResource$, 
  Resource,
  $
} from '@builder.io/qwik';
import { searchPosts } from '~/utils/content-server';

export const Search = component$(() => {
  const query = useSignal('');
  const isOpen = useSignal(false);
  const debounceTimeout = useSignal<number>();

  // Debounced search resource
  const searchResults = useResource$<any[]>(async ({ track, cleanup }) => {
    const searchQuery = track(() => query.value);
    
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }
    
    // Cleanup previous timeout
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
    }
    
    // Debounce search
    await new Promise(resolve => {
      debounceTimeout.value = window.setTimeout(resolve, 300);
      cleanup(() => clearTimeout(debounceTimeout.value));
    });
    
    // Perform search on server
    return await searchPosts(searchQuery);
  });

  // Handle keyboard navigation
  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      isOpen.value = false;
      query.value = '';
    }
  });

  return (
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          type="search"
          placeholder="Search posts..."
          bind:value={query}
          onFocus$={() => isOpen.value = true}
          onKeyDown$={handleKeyDown}
          class="search-input"
        />
        
        {isOpen.value && query.value.length >= 2 && (
          <div class="search-results">
            <Resource
              value={searchResults}
              onPending={() => (
                <div class="search-loading">Searching...</div>
              )}
              onResolved={(results) => (
                <div class="search-results-list">
                  {results.length === 0 ? (
                    <div class="no-results">No posts found</div>
                  ) : (
                    results.map(post => (
                      <a 
                        key={post.permalink}
                        href={post.permalink}
                        class="search-result-item"
                        onClick$={() => {
                          isOpen.value = false;
                          query.value = '';
                        }}
                      >
                        <h4>{post.title}</h4>
                        <p>{post.description}</p>
                        <time>{new Date(post.date).toLocaleDateString()}</time>
                      </a>
                    ))
                  )}
                </div>
              )}
              onRejected={() => (
                <div class="search-error">Failed to search posts</div>
              )}
            />
          </div>
        )}
      </div>
      
      {/* Backdrop to close search */}
      {isOpen.value && (
        <div 
          class="search-backdrop"
          onClick$={() => isOpen.value = false}
        />
      )}
    </div>
  );
});
```

### 4.2 Progressive Enhancement Pattern
```tsx
// src/components/progressive-counter/progressive-counter.tsx (New)
import { 
  component$, 
  useSignal, 
  useVisibleTask$, 
  useStore,
  $,
  noSerialize
} from '@builder.io/qwik';

interface CounterState {
  count: number;
  isClient: boolean;
  animation?: any; // noSerialize for non-serializable objects
}

export const ProgressiveCounter = component$(() => {
  const state = useStore<CounterState>({
    count: 0,
    isClient: false
  });

  // Only run on client when component becomes visible
  useVisibleTask$(() => {
    state.isClient = true;
    
    // Client-side enhancements
    const animateCount = (from: number, to: number) => {
      const duration = 300;
      const start = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(from + (to - from) * easeOut);
        
        state.count = currentCount;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    // Store animation function
    state.animation = noSerialize(animateCount);
  });

  const incrementCount = $(() => {
    if (state.isClient && state.animation) {
      // Smooth animation on client
      state.animation(state.count, state.count + 1);
    } else {
      // Immediate update on server/fallback
      state.count++;
    }
  });

  return (
    <div class="progressive-counter">
      <button 
        onClick$={incrementCount}
        class={`counter-button ${state.isClient ? 'enhanced' : 'basic'}`}
      >
        Count: {state.count}
        {state.isClient && <span class="sparkle">✨</span>}
      </button>
      
      {!state.isClient && (
        <noscript>
          <style>{`
            .counter-button.basic {
              background: #ccc;
            }
            .sparkle { display: none; }
          `}</style>
        </noscript>
      )}
    </div>
  );
});
```

## 5. Advanced Routing Patterns

### 5.1 Dynamic API Endpoints
```tsx
// src/routes/api/posts/[slug]/index.ts (New)
import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params, json, error, cacheControl }) => {
  const { slug } = params;
  
  // Set cache headers
  cacheControl({
    maxAge: 60 * 60, // 1 hour
    staleWhileRevalidate: 60 * 60 * 24 // 1 day
  });
  
  try {
    // Load post data
    const postModule = await import(`../../../(posts)/${slug}/index.mdx`).catch(() => null);
    
    if (!postModule) {
      throw error(404, 'Post not found');
    }
    
    // Return JSON response
    json(200, {
      slug,
      title: postModule.frontmatter?.title || 'Untitled',
      description: postModule.frontmatter?.description || '',
      date: postModule.frontmatter?.date || new Date().toISOString(),
      readingTime: calculateReadingTime(postModule.body || ''),
      wordCount: (postModule.body || '').split(/\s+/).length
    });
    
  } catch (err) {
    console.error(`API error for post ${slug}:`, err);
    throw error(500, 'Internal server error');
  }
};

function calculateReadingTime(content: string): number {
  return Math.ceil(content.split(/\s+/).length / 200);
}
```

### 5.2 Sitemap Generation Endpoint
```tsx
// src/routes/sitemap.xml/index.ts (New)
import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ text, url, cacheControl }) => {
  // Cache sitemap for 1 day
  cacheControl({
    maxAge: 60 * 60 * 24,
    staleWhileRevalidate: 60 * 60 * 24 * 7
  });
  
  try {
    const { getPosts } = await import('../index');
    const posts = await getPosts();
    const baseUrl = url.origin;
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/posts</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}${post.permalink}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    text(200, sitemap, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400'
    });
    
  } catch (error) {
    console.error('Sitemap generation error:', error);
    text(500, 'Error generating sitemap');
  }
};
```

This guide demonstrates how to leverage modern Qwik patterns to create a more robust, performant, and feature-rich blog application. These patterns take advantage of Qwik's unique server-side capabilities while maintaining excellent client-side performance.