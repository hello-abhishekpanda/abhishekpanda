'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  Braces,
  BookOpen,
  ChevronDown,
  Cloud,
  Cpu,
  Database,
  Layers,
  Search,
  Tag,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { classifyPost, BLOG_CATEGORY_ORDER } from './blog-taxonomy';

export type BlogPost = {
  title: string;
  url: string;
  description?: string;
  image?: string;
  date?: string;
  paid?: boolean;
  categories?: string[];
  tags?: string[];
};

type Props = {
  posts: BlogPost[];
  substackUrl: string;
  categoryOrder?: string[];
};

const categoryIcons: Record<string, LucideIcon> = {
  MLOps: Activity,
  'Data & Analytics': Database,
  'Machine Learning': BrainCircuit,
  'Deep Learning & Computer Vision': Cpu,
  'Generative AI & RAG': Layers,
  'AI Agents & Automation': Workflow,
  'Workflows & Automation': Workflow,
  'Cloud & DevOps': Cloud,
  '.NET & Software Engineering': Braces,
  Python: Wrench,
  'AI & Engineering': BookOpen,
};

function SubstackMark() {
  return <img src="/logos/substack.svg" alt="" width={28} height={28} />;
}

export default function BlogCatalog({ posts, substackUrl, categoryOrder = [] }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [technology, setTechnology] = useState('All');
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const categorized = useMemo(() => posts.map((post) => {
    const inferred = classifyPost(post.title, post.description || '');
    return {
      ...post,
      categories: post.categories?.length ? post.categories : inferred.categories,
      tags: Array.from(new Set([...inferred.tags, ...(post.tags || [])])),
    };
  }), [posts]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, Set<string>>();
    for (const post of categorized) {
      for (const label of post.categories) {
        const urls = counts.get(label) || new Set<string>();
        urls.add(post.url);
        counts.set(label, urls);
      }
    }
    return counts;
  }, [categorized]);

  const technologyCounts = useMemo(() => {
    const counts = new Map<string, Set<string>>();
    for (const post of categorized) {
      for (const tag of post.tags) {
        const urls = counts.get(tag) || new Set<string>();
        urls.add(post.url);
        counts.set(tag, urls);
      }
    }
    return Array.from(counts, ([label, urls]) => ({ label, count: urls.size }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [categorized]);

  const filtered = categorized.filter((post) => {
    const matchesCategory = category === 'All' || post.categories.includes(category);
    const matchesTechnology = technology === 'All' || post.tags.includes(technology);
    const searchable = `${post.title} ${post.description || ''} ${post.categories.join(' ')} ${post.tags.join(' ')}`.toLowerCase();
    return matchesCategory && matchesTechnology && searchable.includes(query.trim().toLowerCase());
  });

  const defaultOrder = [...BLOG_CATEGORY_ORDER];
  const categoryNames = [...categoryOrder, ...defaultOrder, ...categoryCounts.keys()]
    .filter((name, index, all) => categoryCounts.has(name) && all.indexOf(name) === index);

  function toggleCategory(name: string) {
    setCollapsed((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);
  }

  function selectTechnology(tag: string) {
    setTechnology((current) => current === tag ? 'All' : tag);
  }

  return (
    <section className="section catalog blog-catalog">
      <div className="blog-masthead">
        <div className="page-heading">
          <div className="eyebrow">STACKEDIN / THE ENGINEERING NOTEBOOK</div>
          <h1>Ideas, made practical.</h1>
          <p>Explore posts by discipline, then filter by the technologies and topics inside each series.</p>
        </div>
        <a
          className="blog-substack-link"
          href={substackUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open StackedIn on Substack"
          title="Open StackedIn on Substack"
        >
          <SubstackMark />
        </a>
      </div>

      <div className="blog-control-panel">
        <div className="blog-control-row">
          <label className="blog-search">
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, topics, or technologies"
              aria-label="Search posts"
            />
          </label>
          <label className="blog-select-wrap">
            <Layers size={16} aria-hidden="true" />
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
              <option value="All">All categories</option>
              {categoryNames.map((name) => <option key={name} value={name}>{name} ({categoryCounts.get(name)?.size || 0})</option>)}
            </select>
          </label>
          <label className="blog-select-wrap">
            <Tag size={16} aria-hidden="true" />
            <select value={technology} onChange={(event) => setTechnology(event.target.value)} aria-label="Filter by technology or topic">
              <option value="All">All technologies</option>
              {technologyCounts.map(({ label, count }) => <option key={label} value={label}>{label} ({count})</option>)}
            </select>
          </label>
          <div className="blog-total-count" aria-live="polite">
            <strong>{filtered.length}</strong>
            <span>{filtered.length === 1 ? 'post' : 'posts'} of {categorized.length}</span>
          </div>
        </div>

        <div className="blog-sync-row">
          <span className="blog-sync-status">
            <span className="blog-status-dot" />
            Published archive · {categorized.length} posts
          </span>
          <a className="blog-sync-button" href={substackUrl} target="_blank" rel="noreferrer">
            Follow on Substack <ArrowUpRight size={15} />
          </a>
        </div>
      </div>

      {filtered.length ? (
        <div className="blog-category-list">
          {categoryNames.map((name) => {
            const groupPosts = filtered.filter((post) => post.categories.includes(name));
            if (!groupPosts.length) return null;
            const Icon = categoryIcons[name] || BookOpen;
            const isOpen = !collapsed.includes(name);
            const groupTags = Array.from(new Set(groupPosts.flatMap((post) => post.tags)))
              .sort((a, b) => (technologyCounts.findIndex((tag) => tag.label === a) - technologyCounts.findIndex((tag) => tag.label === b)));

            return (
              <section className={`blog-category${isOpen ? ' is-open' : ''}`} key={name}>
                <button
                  className="blog-category-toggle"
                  type="button"
                  onClick={() => toggleCategory(name)}
                  aria-expanded={isOpen}
                >
                  <span className="blog-category-icon"><Icon size={21} aria-hidden="true" /></span>
                  <span className="blog-category-copy">
                    <strong>{name}</strong>
                    <small>{groupTags.length} topics · select to browse this collection</small>
                  </span>
                  <span className="blog-category-count">{groupPosts.length} {groupPosts.length === 1 ? 'post' : 'posts'}</span>
                  <ChevronDown className="blog-category-chevron" size={19} aria-hidden="true" />
                </button>

                {isOpen && (
                  <div className="blog-category-content">
                    <div className="blog-topic-list" aria-label={`${name} topics`}>
                      <span className="blog-topic-label">Topics</span>
                      {groupTags.map((tag) => {
                        const count = groupPosts.filter((post) => post.tags.includes(tag)).length;
                        const active = technology === tag;
                        return (
                          <button
                            key={tag}
                            type="button"
                            className={active ? 'blog-topic is-active' : 'blog-topic'}
                            aria-pressed={active}
                            onClick={() => selectTechnology(tag)}
                          >
                            <Tag size={12} aria-hidden="true" /> {tag}<span>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="article-grid blog-article-grid">
                      {groupPosts.map((post, index) => (
                        <a className="article-card" href={post.url} target="_blank" rel="noreferrer" key={`${name}-${post.url}`}>
                          <div className={`article-art art-${index % 5}`}>
                            {post.image
                              ? <img src={post.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                              : <><BookOpen size={33} /><span>{name}</span></>}
                            <span className="article-arrow"><ArrowUpRight size={18} /></span>
                          </div>
                          <div className="article-body">
                            <div className="post-meta">
                              {post.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                              {post.paid && <span>Subscriber</span>}
                            </div>
                            <h2>{post.title}</h2>
                            {post.description && <p>{post.description}</p>}
                            <div className="article-bottom">
                              <span>{post.date || 'Published on Substack'}</span>
                              <span>Read article <ArrowUpRight size={14} /></span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="blog-empty-state">
          <Search size={24} />
          <strong>No posts match these filters.</strong>
          <span>Clear the search or choose another technology.</span>
          <button type="button" onClick={() => { setQuery(''); setCategory('All'); setTechnology('All'); }}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
