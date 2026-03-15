import { Link } from 'react-router-dom'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'

const POSTS = [
  {
    slug: 'true-landed-cost-guide',
    title: 'The Complete Guide to True Landed Cost for E-Commerce',
    excerpt: 'Most Shopify stores are underpricing their products because they only count COGS. True landed cost includes customs duty, payment processing fees, return rates, and more. Here\'s how to calculate it properly.',
    category: 'Margins',
    readTime: '8 min read',
    date: 'Feb 28, 2025',
  },
  {
    slug: 'break-even-roas-explained',
    title: 'Break-Even ROAS: The Number Every Meta Advertiser Needs to Know',
    excerpt: 'ROAS alone tells you nothing about profitability. Break-even ROAS is the minimum return you need before a campaign costs you money. We explain the formula and common mistakes.',
    category: 'Advertising',
    readTime: '6 min read',
    date: 'Feb 14, 2025',
  },
  {
    slug: 'inventory-reorder-point-safety-stock',
    title: 'Reorder Points and Safety Stock: How to Never Stock Out Again',
    excerpt: 'Stockouts cost you more than just lost sales — they tank your Amazon rank and train customers to buy elsewhere. This guide walks through the maths of reorder points and how service level percentage affects your safety stock buffer.',
    category: 'Inventory',
    readTime: '10 min read',
    date: 'Jan 31, 2025',
  },
  {
    slug: 'subscription-ltv-churn',
    title: 'Why Churn Rate Destroys LTV Faster Than You Think',
    excerpt: 'A 5% monthly churn rate means losing 46% of your customers every year. The compounding effect on LTV is brutal — and most subscription businesses don\'t realise how sensitive their unit economics are to small churn improvements.',
    category: 'Subscriptions',
    readTime: '7 min read',
    date: 'Jan 15, 2025',
  },
  {
    slug: 'amazon-fba-true-profit',
    title: 'Amazon FBA: What Your True Profit Margin Actually Is',
    excerpt: 'Between referral fees, fulfilment fees, storage fees, PPC spend, inbound shipping, and prep costs — most FBA sellers have no idea what they\'re actually making per unit. We break down the full calculation.',
    category: 'Amazon',
    readTime: '9 min read',
    date: 'Jan 3, 2025',
  },
  {
    slug: 'chargeback-rate-visa-threshold',
    title: 'The Chargeback Rate That Gets Your Account Terminated',
    excerpt: 'Visa\'s standard chargeback threshold is 1%. Exceed it for two consecutive months and you\'re in the Standard Monitoring Program. Here\'s what chargebacks are really costing you — beyond the dispute fees.',
    category: 'Payments',
    readTime: '5 min read',
    date: 'Dec 19, 2024',
  },
]

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

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
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

          {/* Category filter */}
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

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {POSTS.map((post) => (
              <article key={post.slug} className="card-hover p-6 group cursor-pointer">
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
              </article>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="card p-8 text-center border-dashed border-ink-700">
            <BookOpen className="w-6 h-6 text-ink-600 mx-auto mb-3" />
            <p className="font-display font-700 text-ink-200 mb-2">Full posts coming soon</p>
            <p className="text-ink-400 text-sm max-w-md mx-auto">
              These articles are in production. In the meantime, every calculator has a built-in
              explanation and FAQ — try one below.
            </p>
            <Link to="/calculators" className="btn-secondary mt-5 inline-flex">
              Go to calculators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
