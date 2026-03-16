import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { BLOG_POSTS } from './posts'
import { AdBanner } from '@/components/AdBanner'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  return (
    <>
      <SEOHead
        title={`${post.title} | Valcr Blog`}
        description={post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        keywords={post.keywords}
      />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-200 transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-2.5 py-0.5">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-600 font-mono">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
              <span className="text-xs text-ink-600 font-mono">{post.date}</span>
            </div>
            <h1 className="font-display font-800 text-4xl sm:text-5xl text-ink-50 leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-ink-300 text-xl leading-relaxed">{post.excerpt}</p>
          </div>

          <div className="border-t border-ink-800 mb-10" />

          <div className="border-t border-ink-800 mb-6" />

          {/* Ad — top of article */}
          <AdBanner className="mb-8" />

          <div

            className="prose-valcr"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.calculatorSlug && (
            <div className="mt-12 card p-6 border-acid/20 bg-acid/5">
              <p className="text-xs font-mono text-acid mb-2 uppercase tracking-widest">Run the numbers</p>
              <h3 className="font-display font-700 text-ink-50 text-lg mb-2">{post.calculatorCta}</h3>
              <p className="text-ink-400 text-sm mb-4">Use the free calculator to apply this to your own business.</p>
              <Link to={`/calculators/${post.calculatorSlug}`} className="btn-primary text-sm">
                Open Calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="mt-12 border-t border-ink-800 pt-10">
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-6">More from the blog</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2).map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="card-hover p-5 group block">
                  <span className="text-xs font-mono text-acid">{p.category}</span>
                  <h4 className="font-display font-700 text-ink-100 text-sm mt-2 mb-2 leading-snug group-hover:text-ink-50 transition-colors">
                    {p.title}
                  </h4>
                  <span className="text-xs text-ink-600 font-mono">{p.readTime}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}