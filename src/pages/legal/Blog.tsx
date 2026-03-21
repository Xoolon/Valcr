import { Link } from 'react-router-dom'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { BLOG_POSTS } from '@/pages/blog/posts'

const CATEGORIES = ['All', 'Margins', 'Advertising', 'Inventory', 'Subscriptions', 'Amazon', 'Payments']

export function BlogPage() {
  return (
    <>
      <SEOHead
        title="Blog | Valcr — E-Commerce Operator Guides"
        description="Guides for e-commerce operators on margins, ROAS, inventory, LTV, Amazon FBA, and more. Built around the calculators you use."
        canonicalPath="/blog"
        keywords={['ecommerce blog', 'shopify guides', 'amazon fba tips', 'ecommerce margins', 'roas calculator guide']}
      />
<div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
  <div className="max-w-5xl mx-auto">

          <div className="mb-12">
            <span className="section-tag mb-4 inline-flex">
              <BookOpen className="w-3 h-3" />
              Blog
            </span>
            <h1 className="font-display font-800 text-5xl text-ink-50 leading-tight mb-4">
              Guides for operators.
            </h1>
            <p className="text-ink-300 text-xl max-w-2xl">
              Deep dives on the maths behind e-commerce decisions. Every post connects to a calculator
              so you can run the numbers for your own business.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                  cat === 'All'
                    ? 'bg-acid/10 border-acid/30 text-acid'
                    : 'bg-ink-900 border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="card-hover p-6 group block">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-2.5 py-0.5">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink-600 font-mono">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="font-display font-700 text-ink-100 text-lg leading-snug mb-3 group-hover:text-ink-50 transition-colors">
                  {post.title}
                </h2>
                <p className="text-ink-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-600 font-mono">{post.date}</span>
                  <span className="flex items-center gap-1 text-xs text-acid font-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}