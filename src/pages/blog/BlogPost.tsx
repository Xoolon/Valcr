// src/pages/blog/BlogPost.tsx
// Renders both static (posts.ts) and dynamic (DB) blog posts.
// Lookup order: DB first (supports drafts for admin), then static fallback.
// Ad banner shows just below the article title on every post.

import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, ArrowRight, Eye } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdBanner'
import { BLOG_POSTS as STATIC_POSTS } from '@/pages/blog/posts'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface DynamicPost {
  slug: string; title: string; subtitle?: string; excerpt: string
  category: string; content: string; read_time: string
  calculator_slug?: string; calculator_cta?: string
  keywords?: string[]; author_name?: string
  views?: number; published_at?: string; created_at?: string
  is_published?: boolean
}

function formatDate(d?: string): string {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
  catch { return '' }
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { token } = useAuthStore()
  const [dynPost, setDynPost] = useState<DynamicPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    fetch(`${API}/blog/${slug}`, { headers })
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.ok ? r.json() : null
      })
      .then(d => { if (d) setDynPost(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug, token])

  // Static fallback
  const staticPost = STATIC_POSTS.find(p => p.slug === slug)

  // Still loading and no static post to show immediately
  if (loading && !staticPost) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-3xl mx-auto space-y-6">
        <div className="h-6 bg-ink-800 rounded w-24 animate-pulse" />
        <div className="h-12 bg-ink-800 rounded animate-pulse" />
        <div className="h-4 bg-ink-800 rounded w-3/4 animate-pulse" />
        <div className="h-64 bg-ink-800 rounded animate-pulse" />
      </div>
    )
  }

  // DB post takes precedence; fall back to static
  const post = dynPost || staticPost

  if (notFound && !staticPost) return <Navigate to="/blog" replace />
  if (!post) return <Navigate to="/blog" replace />

  // Unify field names between static and dynamic
  const title = post.title
  const excerpt = post.excerpt
  const category = post.category
  const readTime = (post as any).readTime || (post as any).read_time || '5 min read'
  const content = (post as any).content || ''
  const calcSlug = (post as any).calculatorSlug || (post as any).calculator_slug
  const calcCta = (post as any).calculatorCta || (post as any).calculator_cta || 'Try the calculator'
  const keywords = (post as any).keywords || []
  const date = formatDate((post as any).published_at || (post as any).date)
  const views = (post as any).views
  const isDraft = dynPost && !dynPost.is_published

  const STATIC_SLUGS = new Set(STATIC_POSTS.map(p => p.slug))
  const isHtml = STATIC_SLUGS.has(slug!) || (dynPost && dynPost.content?.trim().startsWith('<'))

  // For static posts: dangerouslySetInnerHTML. For dynamic plain-text DB posts: render same.
  const renderContent = () => {
    if (isHtml) {
      return (
        <div
          className="prose-valcr"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
    // Dynamic posts stored as plain text with blank-line paragraphs
    return (
      <div className="prose-valcr">
        {content.split('\n\n').map((para: string, i: number) => (
          <p key={i} className="text-ink-300 leading-relaxed mb-4">{para}</p>
        ))}
      </div>
    )
  }

  // Related posts (2 from same category, excluding current)
  const allStatic = STATIC_POSTS.filter(p => p.slug !== slug)
  const related = allStatic
    .filter(p => p.category === category)
    .slice(0, 2)
    .concat(allStatic.slice(0, 2))
    .slice(0, 2)

  return (
    <>
      <SEOHead
        title={`${title} | Valcr Blog`}
        description={excerpt}
        canonicalPath={`/blog/${slug}`}
        keywords={keywords}
      />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <Link to="/blog"
            className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-200 transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" />Back to Blog
          </Link>

          {/* Draft badge */}
          {isDraft && (
            <div className="mb-4 px-4 py-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono rounded-xl">
              DRAFT — visible to admins only
            </div>
          )}

          {/* Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-2.5 py-0.5">
                {category}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-600 font-mono">
                <Clock className="w-3 h-3" />{readTime}
              </span>
              {date && <span className="text-xs text-ink-600 font-mono">{date}</span>}
              {views != null && views > 0 && (
                <span className="flex items-center gap-1 text-xs text-ink-700 font-mono">
                  <Eye className="w-3 h-3" />{views.toLocaleString()} views
                </span>
              )}
            </div>
            <h1 className="font-display font-800 text-4xl sm:text-5xl text-ink-50 leading-tight mb-4">
              {title}
            </h1>
            <p className="text-ink-300 text-xl leading-relaxed">{excerpt}</p>
          </div>

          <div className="border-t border-ink-800 mb-8" />

          {/* ── AD BANNER — just below title, above article body ──────────── */}
          <AdBanner className="mb-8" />

          {/* Article body */}
          {renderContent()}

          {/* Calculator CTA */}
          {calcSlug && (
            <div className="mt-12 card p-6 border-acid/20 bg-acid/5">
              <p className="text-xs font-mono text-acid mb-2 uppercase tracking-widest">Run the numbers</p>
              <h3 className="font-display font-700 text-ink-50 text-lg mb-2">{calcCta}</h3>
              <p className="text-ink-400 text-sm mb-4">
                Apply this to your own business with the free calculator. No account required.
              </p>
              <Link to={`/calculators/${calcSlug}`} className="btn-primary text-sm">
                Open Calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12 border-t border-ink-800 pt-10">
              <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-6">More from the blog</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(p => (
                  <Link key={p.slug} to={`/blog/${p.slug}`}
                    className="card p-5 hover:border-acid/30 hover:bg-acid/5 transition-all group block">
                    <span className="text-xs font-mono text-acid">{p.category}</span>
                    <h4 className="font-display font-700 text-ink-100 text-sm mt-2 mb-2 leading-snug group-hover:text-ink-50 transition-colors">
                      {p.title}
                    </h4>
                    <span className="text-xs text-ink-600 font-mono">{(p as any).readTime || '5 min read'}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
