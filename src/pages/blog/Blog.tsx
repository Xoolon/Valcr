// src/pages/blog/Blog.tsx
// Merges static posts (posts.ts) with dynamic posts from Supabase API.
// Dynamic posts override static posts if slugs clash (so you can retire a
// static post by publishing a DB version with the same slug).

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, ArrowRight, Search } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { BLOG_POSTS as STATIC_POSTS } from '@/pages/blog/posts'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date?: string
  published_at?: string
  calculatorSlug?: string
  calculator_slug?: string
  is_published?: boolean
  views?: number
}

// Format a date string for display
function formatDate(d?: string): string {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return '' }
}

export function BlogPage() {
  const [dynamicPosts, setDynamicPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${API}/blog?limit=100`)
      .then(r => r.ok ? r.json() : { posts: [] })
      .then(d => setDynamicPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Merge: DB posts take precedence over static posts with same slug
  const dbSlugs = new Set(dynamicPosts.map(p => p.slug))
  const filteredStatic = STATIC_POSTS.filter(p => !dbSlugs.has(p.slug))
  const allPosts: BlogPost[] = [
    ...dynamicPosts,
    ...filteredStatic,
  ].sort((a, b) => {
    // Handle both published_at (dynamic) and date (static) properties
    const da = (a as any).published_at || a.date || ''
    const db = (b as any).published_at || b.date || ''
    return da > db ? -1 : 1
  })

  // Build category list
  const categories = ['All', ...Array.from(new Set(allPosts.map(p => p.category))).sort()]

  // Filter
  const visible = allPosts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <>
      <SEOHead
        title="Blog | Valcr — E-Commerce Operator Guides"
        description="Guides for e-commerce operators on margins, ROAS, inventory, LTV, Amazon FBA, chargebacks, and more. Every post connects to a free calculator."
        canonicalPath="/blog"
        keywords={['ecommerce blog','shopify guides','amazon fba tips','ecommerce margins','roas calculator guide','landed cost guide']}
      />

      <div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <span className="section-tag mb-4 inline-flex">
              <BookOpen className="w-3 h-3" />Blog
            </span>
            <h1 className="font-display font-800 text-5xl text-ink-50 leading-tight mb-4">
              Guides for operators.
            </h1>
            <p className="text-ink-300 text-xl max-w-2xl">
              Deep dives on the maths behind e-commerce decisions. Every post connects to a calculator
              so you can run the numbers for your own business.
            </p>
          </div>

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
              <input
                type="text" placeholder="Search posts…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'bg-acid/10 border-acid/30 text-acid'
                      : 'bg-ink-900 border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Post count */}
          <p className="text-xs font-mono text-ink-600 mb-6">
            {visible.length} {visible.length === 1 ? 'post' : 'posts'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="card p-6 animate-pulse h-44" />)}
            </div>
          ) : visible.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-ink-700">
              <p className="text-ink-400">No posts found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {visible.map(post => (
                <Link key={post.slug} to={`/blog/${post.slug}`}
                  className="card p-6 hover:border-acid/30 hover:bg-acid/5 transition-all group block">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-2.5 py-0.5">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-600 font-mono">
                      <Clock className="w-3 h-3" />
                      {post.readTime || (post as any).read_time || '5 min read'}
                    </span>
                  </div>
                  <h2 className="font-display font-700 text-ink-100 text-lg leading-snug mb-3 group-hover:text-ink-50 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-ink-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-600 font-mono">
                      {formatDate((post as any).published_at || post.date)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-acid font-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}