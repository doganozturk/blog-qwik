# Content Management Improvements Guide

## Overview

This guide focuses on enhancing content management capabilities for your Qwik blog, including advanced search functionality, RSS feed generation, content organization, internationalization, and dynamic content features.

## 1. Advanced Search Implementation

### 1.1 Client-Side Search with Fuzzy Matching
```tsx
// src/utils/search-engine.ts (New)
export interface SearchableContent {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category?: string;
  permalink: string;
  date: string;
  lang: string;
}

export interface SearchResult extends SearchableContent {
  score: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

export class SearchEngine {
  private content: SearchableContent[] = [];
  private searchIndex: Map<string, Set<string>> = new Map();

  constructor(content: SearchableContent[]) {
    this.content = content;
    this.buildIndex();
  }

  private buildIndex(): void {
    this.content.forEach(item => {
      const words = this.extractWords(item);
      words.forEach(word => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(item.id);
      });
    });
  }

  private extractWords(item: SearchableContent): string[] {
    const text = [
      item.title,
      item.description,
      item.content,
      ...item.tags,
      item.category || ''
    ].join(' ').toLowerCase();

    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private calculateScore(item: SearchableContent, query: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    let score = 0;
    const matchedFields: string[] = [];

    // Title matches (highest weight)
    const titleMatches = this.countMatches(item.title, queryWords);
    if (titleMatches > 0) {
      score += titleMatches * 10;
      matchedFields.push('title');
    }

    // Description matches (medium weight)
    const descMatches = this.countMatches(item.description, queryWords);
    if (descMatches > 0) {
      score += descMatches * 5;
      matchedFields.push('description');
    }

    // Content matches (lower weight)
    const contentMatches = this.countMatches(item.content, queryWords);
    if (contentMatches > 0) {
      score += contentMatches * 2;
      matchedFields.push('content');
    }

    // Tag matches (high weight)
    const tagMatches = item.tags.reduce((acc, tag) => 
      acc + this.countMatches(tag, queryWords), 0);
    if (tagMatches > 0) {
      score += tagMatches * 8;
      matchedFields.push('tags');
    }

    // Category matches (medium weight)
    if (item.category) {
      const categoryMatches = this.countMatches(item.category, queryWords);
      if (categoryMatches > 0) {
        score += categoryMatches * 6;
        matchedFields.push('category');
      }
    }

    return score;
  }

  private countMatches(text: string, queryWords: string[]): number {
    const lowerText = text.toLowerCase();
    return queryWords.reduce((count, word) => {
      const matches = (lowerText.match(new RegExp(word, 'gi')) || []).length;
      return count + matches;
    }, 0);
  }

  private highlight(text: string, query: string): string {
    const queryWords = query.toLowerCase().split(/\s+/);
    let highlightedText = text;

    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
  }

  public search(query: string, options: {
    limit?: number;
    lang?: string;
    category?: string;
    minScore?: number;
  } = {}): SearchResult[] {
    const { limit = 10, lang, category, minScore = 1 } = options;

    if (!query.trim()) return [];

    let results = this.content
      .map(item => {
        const score = this.calculateScore(item, query);
        return {
          ...item,
          score,
          matchedFields: [],
          highlights: {
            title: this.highlight(item.title, query),
            description: this.highlight(item.description, query)
          }
        };
      })
      .filter(result => result.score >= minScore);

    // Apply filters
    if (lang) {
      results = results.filter(result => result.lang === lang);
    }

    if (category) {
      results = results.filter(result => result.category === category);
    }

    // Sort by score and date
    results.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; // Higher score first
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newer first
    });

    return results.slice(0, limit);
  }

  public getRecommendations(currentPostId: string, limit = 3): SearchableContent[] {
    const currentPost = this.content.find(item => item.id === currentPostId);
    if (!currentPost) return [];

    const recommendations = this.content
      .filter(item => item.id !== currentPostId)
      .map(item => {
        let score = 0;

        // Same category bonus
        if (item.category === currentPost.category) {
          score += 5;
        }

        // Common tags bonus
        const commonTags = item.tags.filter(tag => 
          currentPost.tags.includes(tag)
        ).length;
        score += commonTags * 3;

        // Same language bonus
        if (item.lang === currentPost.lang) {
          score += 2;
        }

        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations;
  }
}
```

### 1.2 Search Component with Real-time Results
```tsx
// src/components/search/advanced-search.tsx (New)
import { 
  component$, 
  useSignal, 
  useComputed$, 
  useResource$, 
  Resource,
  useStylesScoped$,
  $
} from '@builder.io/qwik';
import { SearchEngine, type SearchResult } from '~/utils/search-engine';
import styles from './advanced-search.css?inline';

interface AdvancedSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

export const AdvancedSearch = component$<AdvancedSearchProps>(({ onResultClick }) => {
  useStylesScoped$(styles);
  
  const query = useSignal('');
  const isOpen = useSignal(false);
  const selectedCategory = useSignal('');
  const selectedLang = useSignal('en');
  const isLoading = useSignal(false);

  // Load search data
  const searchData = useResource$(async () => {
    // This would typically load from your posts
    const { getPosts } = await import('~/routes/index');
    const posts = await getPosts();
    
    return posts.map(post => ({
      id: post.permalink,
      title: post.title,
      description: post.description,
      content: post.description, // In real implementation, load full content
      tags: post.tags || [],
      category: post.category,
      permalink: post.permalink,
      date: post.date,
      lang: post.lang
    }));
  });

  // Compute search results
  const searchResults = useComputed$(() => {
    if (!query.value.trim() || !searchData.value) return [];
    
    const engine = new SearchEngine(searchData.value);
    return engine.search(query.value, {
      limit: 8,
      lang: selectedLang.value || undefined,
      category: selectedCategory.value || undefined
    });
  });

  const handleSearch = $((event: Event) => {
    const target = event.target as HTMLInputElement;
    query.value = target.value;
    isOpen.value = target.value.length > 0;
  });

  const handleResultClick = $((result: SearchResult) => {
    onResultClick?.(result);
    isOpen.value = false;
    query.value = '';
  });

  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      isOpen.value = false;
      query.value = '';
    }
  });

  return (
    <div class="advanced-search">
      <div class="search-input-container">
        <input
          type="search"
          placeholder="Search posts, tags, categories..."
          value={query.value}
          onInput$={handleSearch}
          onFocus$={() => isOpen.value = query.value.length > 0}
          onKeyDown$={handleKeyDown}
          class="search-input"
          aria-label="Search blog posts"
          aria-expanded={isOpen.value}
          aria-haspopup="listbox"
          role="combobox"
        />
        
        <div class="search-filters">
          <select
            bind:value={selectedLang}
            class="search-filter"
            aria-label="Filter by language"
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
          
          <select
            bind:value={selectedCategory}
            class="search-filter"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="nodejs">Node.js</option>
          </select>
        </div>
      </div>

      {isOpen.value && (
        <div class="search-results" role="listbox" aria-label="Search results">
          <Resource
            value={searchData}
            onPending={() => (
              <div class="search-loading">Searching...</div>
            )}
            onResolved={() => (
              <div class="search-results-list">
                {searchResults.value.length === 0 ? (
                  <div class="no-results" role="option">
                    No results found for "{query.value}"
                  </div>
                ) : (
                  searchResults.value.map((result, index) => (
                    <button
                      key={result.id}
                      class="search-result-item"
                      onClick$={() => handleResultClick(result)}
                      role="option"
                      aria-selected="false"
                    >
                      <div class="result-header">
                        <h4 
                          class="result-title"
                          dangerouslySetInnerHTML={result.highlights.title}
                        />
                        <span class="result-score">{result.score}</span>
                      </div>
                      
                      <p 
                        class="result-description"
                        dangerouslySetInnerHTML={result.highlights.description}
                      />
                      
                      <div class="result-meta">
                        <time class="result-date">
                          {new Date(result.date).toLocaleDateString()}
                        </time>
                        
                        {result.category && (
                          <span class="result-category">{result.category}</span>
                        )}
                        
                        {result.tags.length > 0 && (
                          <div class="result-tags">
                            {result.tags.slice(0, 3).map(tag => (
                              <span key={tag} class="result-tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          />
        </div>
      )}

      {isOpen.value && (
        <div 
          class="search-backdrop"
          onClick$={() => isOpen.value = false}
          aria-hidden="true"
        />
      )}
    </div>
  );
});
```

## 2. RSS Feed Generation

### 2.1 RSS Feed Endpoint
```tsx
// src/routes/rss.xml/index.ts (New)
import type { RequestHandler } from '@builder.io/qwik-city';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  category?: string;
  author?: string;
}

export const onGet: RequestHandler = async ({ text, url, cacheControl }) => {
  // Cache RSS feed for 1 hour
  cacheControl({
    maxAge: 60 * 60,
    staleWhileRevalidate: 60 * 60 * 24
  });

  try {
    const { getPosts } = await import('../index');
    const posts = await getPosts();
    const baseUrl = url.origin;
    
    const rssItems: RSSItem[] = posts.map(post => ({
      title: post.title,
      description: post.description,
      link: `${baseUrl}${post.permalink}`,
      pubDate: new Date(post.date).toUTCString(),
      guid: `${baseUrl}${post.permalink}`,
      category: post.category,
      author: 'doganozturk2005@gmail.com (Doğan Öztürk)'
    }));

    const rssXml = generateRSSXML({
      title: 'Doğan Öztürk Blog',
      description: 'Reflections on Technology, Culture, and Life',
      link: baseUrl,
      language: 'en-US',
      managingEditor: 'doganozturk2005@gmail.com (Doğan Öztürk)',
      webMaster: 'doganozturk2005@gmail.com (Doğan Öztürk)',
      lastBuildDate: new Date().toUTCString(),
      items: rssItems
    });

    text(200, rssXml, {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    });

  } catch (error) {
    console.error('RSS generation error:', error);
    text(500, 'Error generating RSS feed');
  }
};

interface RSSChannel {
  title: string;
  description: string;
  link: string;
  language: string;
  managingEditor: string;
  webMaster: string;
  lastBuildDate: string;
  items: RSSItem[];
}

function generateRSSXML(channel: RSSChannel): string {
  const escapeXML = (str: string) => 
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(channel.title)}</title>
    <description>${escapeXML(channel.description)}</description>
    <link>${channel.link}</link>
    <language>${channel.language}</language>
    <managingEditor>${channel.managingEditor}</managingEditor>
    <webMaster>${channel.webMaster}</webMaster>
    <lastBuildDate>${channel.lastBuildDate}</lastBuildDate>
    <atom:link href="${channel.link}/rss.xml" rel="self" type="application/rss+xml"/>
    
    ${channel.items.map(item => `
    <item>
      <title>${escapeXML(item.title)}</title>
      <description>${escapeXML(item.description)}</description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.category ? `<category>${escapeXML(item.category)}</category>` : ''}
      ${item.author ? `<author>${item.author}</author>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;
}
```

### 2.2 JSON Feed Implementation
```tsx
// src/routes/feed.json/index.ts (New)
import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ json, url, cacheControl }) => {
  cacheControl({
    maxAge: 60 * 60,
    staleWhileRevalidate: 60 * 60 * 24
  });

  try {
    const { getPosts } = await import('../index');
    const posts = await getPosts();
    const baseUrl = url.origin;

    const feed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Doğan Öztürk Blog',
      description: 'Reflections on Technology, Culture, and Life',
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/feed.json`,
      icon: `${baseUrl}/favicon/favicon-32x32.png`,
      favicon: `${baseUrl}/favicon/favicon-16x16.png`,
      language: 'en-US',
      authors: [
        {
          name: 'Doğan Öztürk',
          url: baseUrl,
          avatar: `${baseUrl}/images/avatar.jpg`
        }
      ],
      items: posts.map(post => ({
        id: `${baseUrl}${post.permalink}`,
        url: `${baseUrl}${post.permalink}`,
        title: post.title,
        content_html: post.description,
        summary: post.description,
        image: `${baseUrl}/images/posts/${post.permalink.split('/').pop()}/cover.jpg`,
        date_published: new Date(post.date).toISOString(),
        authors: [
          {
            name: 'Doğan Öztürk',
            url: baseUrl
          }
        ],
        tags: post.tags || [],
        language: post.lang
      }))
    };

    json(200, feed);

  } catch (error) {
    console.error('JSON feed generation error:', error);
    json(500, { error: 'Failed to generate JSON feed' });
  }
};
```

## 3. Content Organization and Navigation

### 3.1 Dynamic Category Pages
```tsx
// src/routes/category/[category]/index.tsx (New)
import { component$, Resource } from '@builder.io/qwik';
import { 
  routeLoader$, 
  type DocumentHead,
  type StaticGenerateHandler 
} from '@builder.io/qwik-city';
import { PostSummaryList } from '~/components/post-summary-list/post-summary-list';

export const useCategoryLoader = routeLoader$(async ({ params, error }) => {
  const category = params.category;
  
  try {
    const { getPosts } = await import('../../index');
    const allPosts = await getPosts();
    
    const categoryPosts = allPosts.filter(post => 
      post.category?.toLowerCase() === category.toLowerCase()
    );

    if (categoryPosts.length === 0) {
      throw error(404, `No posts found in category: ${category}`);
    }

    // Get category metadata
    const categoryMeta = getCategoryMetadata(category);

    return {
      category,
      posts: categoryPosts,
      meta: categoryMeta,
      count: categoryPosts.length
    };

  } catch (err) {
    console.error(`Failed to load category: ${category}`, err);
    throw error(500, 'Failed to load category posts');
  }
});

function getCategoryMetadata(category: string) {
  const categories: Record<string, { title: string; description: string; icon: string }> = {
    'javascript': {
      title: 'JavaScript',
      description: 'Deep dives into JavaScript language features, frameworks, and best practices.',
      icon: '📜'
    },
    'react': {
      title: 'React',
      description: 'React development patterns, hooks, and modern React techniques.',
      icon: '⚛️'
    },
    'nodejs': {
      title: 'Node.js',
      description: 'Server-side JavaScript development with Node.js and related technologies.',
      icon: '🌟'
    },
    'technology': {
      title: 'Technology',
      description: 'Thoughts and insights on the latest technology trends and innovations.',
      icon: '💻'
    }
  };

  return categories[category.toLowerCase()] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Posts about ${category}`,
    icon: '📝'
  };
}

export default component$(() => {
  const categoryData = useCategoryLoader();

  return (
    <>
      <header class="category-header">
        <div class="category-icon">
          {categoryData.value.meta.icon}
        </div>
        <div class="category-info">
          <h1 class="category-title">{categoryData.value.meta.title}</h1>
          <p class="category-description">{categoryData.value.meta.description}</p>
          <p class="category-count">
            {categoryData.value.count} post{categoryData.value.count !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <main class="category-content">
        <PostSummaryList data={categoryData.value.posts} />
      </main>
    </>
  );
});

// Static generation for all categories
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const { getPosts } = await import('../../index');
  const posts = await getPosts();
  
  const categories = [...new Set(
    posts
      .map(post => post.category)
      .filter(Boolean)
  )];

  return {
    params: categories.map(category => ({ category: category!.toLowerCase() }))
  };
};

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useCategoryLoader);
  
  return {
    title: `${data.meta.title} Posts | Doğan Öztürk`,
    meta: [
      { name: 'description', content: data.meta.description },
      { property: 'og:title', content: `${data.meta.title} Posts` },
      { property: 'og:description', content: data.meta.description }
    ]
  };
};
```

### 3.2 Tag-based Navigation
```tsx
// src/routes/tag/[tag]/index.tsx (New)
import { component$ } from '@builder.io/qwik';
import { 
  routeLoader$, 
  type DocumentHead,
  type StaticGenerateHandler 
} from '@builder.io/qwik-city';
import { PostSummaryList } from '~/components/post-summary-list/post-summary-list';

export const useTagLoader = routeLoader$(async ({ params, error }) => {
  const tag = params.tag;
  
  try {
    const { getPosts } = await import('../../index');
    const allPosts = await getPosts();
    
    const tagPosts = allPosts.filter(post => 
      post.tags?.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    );

    if (tagPosts.length === 0) {
      throw error(404, `No posts found with tag: ${tag}`);
    }

    // Get related tags
    const relatedTags = getRelatedTags(tagPosts, tag);

    return {
      tag,
      posts: tagPosts,
      count: tagPosts.length,
      relatedTags
    };

  } catch (err) {
    console.error(`Failed to load tag: ${tag}`, err);
    throw error(500, 'Failed to load tag posts');
  }
});

function getRelatedTags(posts: any[], currentTag: string): string[] {
  const tagCounts = new Map<string, number>();
  
  posts.forEach(post => {
    post.tags?.forEach((tag: string) => {
      if (tag.toLowerCase() !== currentTag.toLowerCase()) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}

export default component$(() => {
  const tagData = useTagLoader();

  return (
    <>
      <header class="tag-header">
        <h1 class="tag-title">
          Posts tagged with "{tagData.value.tag}"
        </h1>
        <p class="tag-count">
          {tagData.value.count} post{tagData.value.count !== 1 ? 's' : ''}
        </p>
        
        {tagData.value.relatedTags.length > 0 && (
          <div class="related-tags">
            <h3>Related Tags</h3>
            <div class="tag-list">
              {tagData.value.relatedTags.map(relatedTag => (
                <a 
                  key={relatedTag}
                  href={`/tag/${relatedTag.toLowerCase()}`}
                  class="tag-link"
                >
                  {relatedTag}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main class="tag-content">
        <PostSummaryList data={tagData.value.posts} />
      </main>
    </>
  );
});

// Static generation for all tags
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const { getPosts } = await import('../../index');
  const posts = await getPosts();
  
  const allTags = new Set<string>();
  posts.forEach(post => {
    post.tags?.forEach(tag => allTags.add(tag.toLowerCase()));
  });

  return {
    params: Array.from(allTags).map(tag => ({ tag }))
  };
};

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useTagLoader);
  
  return {
    title: `"${data.tag}" Tag | Doğan Öztürk`,
    meta: [
      { 
        name: 'description', 
        content: `All posts tagged with "${data.tag}". ${data.count} posts found.` 
      }
    ]
  };
};
```

## 4. Content Archive and Pagination

### 4.1 Archive Page with Date-based Navigation
```tsx
// src/routes/archive/index.tsx (New)
import { component$, useComputed$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';

export const useArchiveLoader = routeLoader$(async () => {
  const { getPosts } = await import('../index');
  const posts = await getPosts();
  
  // Group posts by year and month
  const archive = posts.reduce((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('en', { month: 'long' });
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, any[]>>);

  return {
    archive,
    totalPosts: posts.length,
    years: Object.keys(archive).map(Number).sort((a, b) => b - a)
  };
});

export default component$(() => {
  const archiveData = useArchiveLoader();

  const archiveStats = useComputed$(() => {
    const stats = {
      totalYears: archiveData.value.years.length,
      averagePostsPerYear: Math.round(archiveData.value.totalPosts / archiveData.value.years.length),
      mostProductiveYear: 0,
      mostProductiveYearCount: 0
    };

    archiveData.value.years.forEach(year => {
      const yearPostCount = Object.values(archiveData.value.archive[year])
        .reduce((sum, monthPosts) => sum + monthPosts.length, 0);
      
      if (yearPostCount > stats.mostProductiveYearCount) {
        stats.mostProductiveYear = year;
        stats.mostProductiveYearCount = yearPostCount;
      }
    });

    return stats;
  });

  return (
    <div class="archive-page">
      <header class="archive-header">
        <h1>Post Archive</h1>
        <div class="archive-stats">
          <div class="stat">
            <span class="stat-number">{archiveData.value.totalPosts}</span>
            <span class="stat-label">Total Posts</span>
          </div>
          <div class="stat">
            <span class="stat-number">{archiveStats.value.totalYears}</span>
            <span class="stat-label">Years</span>
          </div>
          <div class="stat">
            <span class="stat-number">{archiveStats.value.averagePostsPerYear}</span>
            <span class="stat-label">Avg Posts/Year</span>
          </div>
        </div>
      </header>

      <main class="archive-content">
        {archiveData.value.years.map(year => (
          <section key={year} class="archive-year">
            <h2 class="year-title">
              {year}
              <span class="year-count">
                ({Object.values(archiveData.value.archive[year])
                  .reduce((sum, monthPosts) => sum + monthPosts.length, 0)} posts)
              </span>
            </h2>
            
            <div class="year-months">
              {Object.entries(archiveData.value.archive[year]).map(([month, posts]) => (
                <div key={month} class="archive-month">
                  <h3 class="month-title">
                    {month}
                    <span class="month-count">({posts.length})</span>
                  </h3>
                  
                  <ul class="month-posts">
                    {posts.map(post => (
                      <li key={post.permalink} class="archive-post">
                        <a href={post.permalink} class="post-link">
                          <span class="post-title">{post.title}</span>
                          <time class="post-date">
                            {new Date(post.date).toLocaleDateString()}
                          </time>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Post Archive | Doğan Öztürk',
  meta: [
    {
      name: 'description',
      content: 'Browse all blog posts organized by date. Complete archive of technology articles, tutorials, and insights.'
    }
  ]
};
```

### 4.2 Paginated Posts Listing
```tsx
// src/routes/posts/index.tsx (New)
import { component$ } from '@builder.io/qwik';
import { 
  routeLoader$, 
  useLocation,
  type DocumentHead 
} from '@builder.io/qwik-city';
import { PostSummaryList } from '~/components/post-summary-list/post-summary-list';
import { Pagination } from '~/components/pagination/pagination';

const POSTS_PER_PAGE = 10;

export const usePostsLoader = routeLoader$(async ({ query }) => {
  const page = parseInt(query.get('page') || '1', 10);
  const category = query.get('category') || '';
  const tag = query.get('tag') || '';
  
  const { getPosts } = await import('../index');
  let allPosts = await getPosts();
  
  // Apply filters
  if (category) {
    allPosts = allPosts.filter(post => 
      post.category?.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (tag) {
    allPosts = allPosts.filter(post =>
      post.tags?.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    );
  }

  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const validPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (validPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    pagination: {
      currentPage: validPage,
      totalPages,
      totalPosts,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
      postsPerPage: POSTS_PER_PAGE
    },
    filters: {
      category,
      tag
    }
  };
});

export default component$(() => {
  const postsData = usePostsLoader();
  const location = useLocation();

  const generatePageUrl = (page: number) => {
    const url = new URL(location.url);
    url.searchParams.set('page', page.toString());
    return url.pathname + url.search;
  };

  return (
    <div class="posts-page">
      <header class="posts-header">
        <h1>All Posts</h1>
        <div class="posts-meta">
          {postsData.value.filters.category && (
            <span class="filter-tag">Category: {postsData.value.filters.category}</span>
          )}
          {postsData.value.filters.tag && (
            <span class="filter-tag">Tag: {postsData.value.filters.tag}</span>
          )}
          <span class="posts-count">
            {postsData.value.pagination.totalPosts} total posts
          </span>
        </div>
      </header>

      <main class="posts-content">
        <PostSummaryList data={postsData.value.posts} />
        
        <Pagination
          currentPage={postsData.value.pagination.currentPage}
          totalPages={postsData.value.pagination.totalPages}
          generateUrl={generatePageUrl}
          hasNextPage={postsData.value.pagination.hasNextPage}
          hasPrevPage={postsData.value.pagination.hasPrevPage}
        />
      </main>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(usePostsLoader);
  const { currentPage, totalPages } = data.pagination;
  
  const title = currentPage === 1 
    ? 'All Posts | Doğan Öztürk'
    : `Posts - Page ${currentPage} of ${totalPages} | Doğan Öztürk`;

  return {
    title,
    meta: [
      {
        name: 'description',
        content: `Browse all blog posts. Page ${currentPage} of ${totalPages}.`
      }
    ]
  };
};
```

### 4.3 Pagination Component
```tsx
// src/components/pagination/pagination.tsx (New)
import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './pagination.css?inline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  generateUrl: (page: number) => string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export const Pagination = component$<PaginationProps>(({
  currentPage,
  totalPages,
  generateUrl,
  hasNextPage,
  hasPrevPage,
  showFirstLast = true,
  maxVisible = 5
}) => {
  useStylesScoped$(styles);

  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const showStartEllipsis = pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  return (
    <nav class="pagination" aria-label="Pagination navigation">
      <ul class="pagination-list">
        {/* First page */}
        {showFirstLast && currentPage > 1 && (
          <li class="pagination-item">
            <a 
              href={generateUrl(1)}
              class="pagination-link"
              aria-label="Go to first page"
            >
              First
            </a>
          </li>
        )}

        {/* Previous page */}
        {hasPrevPage && (
          <li class="pagination-item">
            <a 
              href={generateUrl(currentPage - 1)}
              class="pagination-link pagination-prev"
              aria-label="Go to previous page"
            >
              ‹ Previous
            </a>
          </li>
        )}

        {/* First page number if not shown */}
        {showStartEllipsis && (
          <>
            <li class="pagination-item">
              <a href={generateUrl(1)} class="pagination-link">1</a>
            </li>
            <li class="pagination-item">
              <span class="pagination-ellipsis">…</span>
            </li>
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map(pageNum => (
          <li key={pageNum} class="pagination-item">
            {pageNum === currentPage ? (
              <span 
                class="pagination-link pagination-current"
                aria-current="page"
                aria-label={`Current page, page ${pageNum}`}
              >
                {pageNum}
              </span>
            ) : (
              <a 
                href={generateUrl(pageNum)}
                class="pagination-link"
                aria-label={`Go to page ${pageNum}`}
              >
                {pageNum}
              </a>
            )}
          </li>
        ))}

        {/* Last page number if not shown */}
        {showEndEllipsis && (
          <>
            <li class="pagination-item">
              <span class="pagination-ellipsis">…</span>
            </li>
            <li class="pagination-item">
              <a href={generateUrl(totalPages)} class="pagination-link">
                {totalPages}
              </a>
            </li>
          </>
        )}

        {/* Next page */}
        {hasNextPage && (
          <li class="pagination-item">
            <a 
              href={generateUrl(currentPage + 1)}
              class="pagination-link pagination-next"
              aria-label="Go to next page"
            >
              Next ›
            </a>
          </li>
        )}

        {/* Last page */}
        {showFirstLast && currentPage < totalPages && (
          <li class="pagination-item">
            <a 
              href={generateUrl(totalPages)}
              class="pagination-link"
              aria-label="Go to last page"
            >
              Last
            </a>
          </li>
        )}
      </ul>
      
      <div class="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
});
```

This comprehensive content management enhancement provides advanced search capabilities, RSS feeds, organized navigation, and pagination - all the tools needed for a professional blog platform.