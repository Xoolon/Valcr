import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdBanner'
import { CalculatorForm } from '@/components/CalculatorForm'
import { CalculatorCard } from '@/components/CalculatorCard'
import { getCalculator, getRelatedCalculators } from '@/calculators'
import { useCalcStore } from '@/store'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/pages/blog/posts'

export function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>()
  const calculator = slug ? getCalculator(slug) : undefined
  const related = slug ? getRelatedCalculators(slug) : []
  const { addRecent } = useCalcStore()

  useEffect(() => {
    if (calculator) addRecent(calculator.slug)
  }, [calculator?.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!calculator) return <Navigate to="/calculators" replace />

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.name,
    description: calculator.description,
    url: `https://valcr.site/calculators/${calculator.slug}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: calculator.fields.map((f) => f.label).join(', '),
  }

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: calculator.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <SEOHead
        title={calculator.seoTitle}
        description={calculator.seoDescription}
        keywords={calculator.seoKeywords}
        canonicalPath={`/calculators/${calculator.slug}`}
        ogType="website"
        structuredData={structuredData}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm mb-5" aria-label="Breadcrumb">
            <Link to="/" className="text-ink-600 hover:text-ink-300 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-ink-700" />
            <Link to="/calculators" className="text-ink-600 hover:text-ink-300 transition-colors">Calculators</Link>
            <ChevronRight className="w-3 h-3 text-ink-700" />
            <span className="text-ink-300">{calculator.shortName}</span>
          </nav>

          {/* Page header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl"
                style={{ background: `${calculator.color}18`, border: `1px solid ${calculator.color}30` }}
              >
                {calculator.icon}
              </div>
              <span
                className="text-xs font-mono font-500 px-2.5 py-1 rounded-full"
                style={{ color: calculator.color, background: `${calculator.color}15`, border: `1px solid ${calculator.color}25` }}
              >
                {calculator.category === 'ecommerce' ? 'E-Commerce' : 'Freelancer'}
              </span>
            </div>
            <h1 className="font-display font-800 text-3xl sm:text-5xl text-ink-50 leading-tight mb-2 sm:mb-3">
              {calculator.name}
            </h1>
            <p className="text-ink-300 text-base sm:text-xl leading-relaxed max-w-2xl">
              {calculator.description}
            </p>
          </div>

          {/* Calculator — side by side on desktop, stacked on mobile */}
          <CalculatorForm calculator={calculator} />

          <AdBanner className="mt-8 mb-2" />

          {/* How it works */}
          <section className="mt-12 sm:mt-16 max-w-3xl">
            <h2 className="font-display font-800 text-xl sm:text-2xl text-ink-50 mb-4">
              How the {calculator.shortName} Calculator Works
            </h2>
            <div className="prose-valcr">
              <p className="text-ink-300 text-base leading-relaxed mb-4">
                {calculator.description} Unlike generic tools, this calculator pre-fills industry-standard defaults and explains exactly what the output means for your business.
              </p>
              <p className="text-ink-400 text-sm leading-relaxed">
                Adjust the inputs to match your specific situation. Results update instantly as you type — no submit button needed.
              </p>
            </div>
          </section>

          {/* FAQ */}
          {calculator.faqs.length > 0 && (
            <section className="mt-10 sm:mt-12 max-w-3xl">
              <h2 className="font-display font-800 text-xl sm:text-2xl text-ink-50 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {calculator.faqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </section>
          )}

          <AdBanner className="mt-8 mb-2" />

          <BenchmarksSection slug={calculator.slug} />
          <RelatedBlogPost slug={calculator.slug} />

          {/* Related calculators */}
          {related.length > 0 && (
            <section className="mt-12 sm:mt-16">
              <h2 className="font-display font-800 text-xl sm:text-2xl text-ink-50 mb-6">
                Related Calculators
              </h2>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                {related.map((calc) => (
                  <CalculatorCard key={calc.slug} calculator={calc} compact />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-ink-800/50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-display font-700 text-ink-100 text-sm leading-snug">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-ink-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink-400 shrink-0" />}
      </button>
      <div className={clsx('overflow-hidden transition-all duration-300', open ? 'max-h-96' : 'max-h-0')}>
        <p className="px-4 sm:px-5 pb-5 text-sm text-ink-300 leading-relaxed border-t border-ink-800 pt-4">
          {answer}
        </p>
      </div>
    </div>
  )
}

const BENCHMARKS: Record<string, { title: string; items: { label: string; value: string; note: string }[] }> = {
  'true-landed-cost': {
    title: 'Gross Margin Benchmarks by Category',
    items: [
      { label: 'Below 30%', value: '⚠️ Danger', note: 'Ad spend and overheads will likely push you into loss' },
      { label: '30–50%', value: '🟡 Viable', note: 'Tight but workable — minimise returns and platform fees' },
      { label: '50–70%', value: '✅ Healthy', note: 'Typical of well-run private-label DTC brands' },
      { label: 'Above 70%', value: '🚀 Excellent', note: 'Strong pricing power or very low COGS' },
    ],
  },
  'shopify-profit-margin': {
    title: 'Shopify Net Margin Benchmarks',
    items: [
      { label: 'Below 10%', value: '⚠️ Thin', note: 'One bad month of returns or ad spend swings kills profit' },
      { label: '10–20%', value: '🟡 Average', note: 'Typical for DTC brands reinvesting heavily in growth' },
      { label: '20–35%', value: '✅ Healthy', note: 'Room to invest in acquisition and absorb volatility' },
      { label: 'Above 35%', value: '🚀 Strong', note: 'Excellent for scaling — consider increasing ad spend' },
    ],
  },
  'break-even-units': {
    title: 'Contribution Margin Benchmarks',
    items: [
      { label: 'Below $5', value: '⚠️ Very Low', note: 'Hard to cover fixed costs without very high volume' },
      { label: '$5–$15', value: '🟡 Moderate', note: 'Common in commodity or low-price-point products' },
      { label: '$15–$40', value: '✅ Good', note: 'Solid margin per unit — break-even is manageable' },
      { label: 'Above $40', value: '🚀 Strong', note: 'High-ticket or high-margin product — low volume needed' },
    ],
  },
  'roas-calculator': {
    title: 'ROAS Benchmarks by Category',
    items: [
      { label: 'Apparel & fashion', value: '3.5–5x target', note: 'Break-even typically 2.0–2.5x' },
      { label: 'Beauty & skincare', value: '3–4x target', note: 'Higher margins allow lower break-even (~1.8x)' },
      { label: 'Electronics & tech', value: '4–6x target', note: 'Thin margins — break-even often 3x+' },
      { label: 'Supplements & consumables', value: '2.5–4x target', note: 'LTV matters — repeat orders change the math' },
    ],
  },
  'customer-acquisition-cost': {
    title: 'LTV:CAC Ratio Benchmarks',
    items: [
      { label: 'Below 1:1', value: '🔴 Losing money', note: 'Every customer costs more to acquire than they generate' },
      { label: '1:1 – 3:1', value: '🟡 Borderline', note: 'Viable but thin — focus on reducing CAC or increasing LTV' },
      { label: '3:1 – 5:1', value: '✅ Healthy', note: 'Industry standard target for e-commerce' },
      { label: 'Above 5:1', value: '🚀 Consider scaling', note: 'Potentially under-investing in acquisition' },
    ],
  },
  'inventory-reorder-point': {
    title: 'Service Level Benchmarks',
    items: [
      { label: '90% service level', value: 'Low buffer', note: 'Stockout 10% of the time — acceptable for slow movers' },
      { label: '95% service level', value: 'Standard', note: 'Recommended default for most DTC products' },
      { label: '99% service level', value: 'High buffer', note: 'Essential for Amazon FBA — stockouts tank rankings' },
      { label: 'Amazon FBA', value: '99% recommended', note: 'Ranking recovery after stockout takes weeks' },
    ],
  },
  'cash-flow-runway': {
    title: 'Runway Benchmarks for E-Commerce',
    items: [
      { label: 'Below 3 months', value: '🔴 Critical', note: 'Raise funds, cut burn, or find revenue urgently' },
      { label: '3–6 months', value: '⚠️ Concerning', note: 'Identify path to profitability immediately' },
      { label: '6–12 months', value: '🟡 Manageable', note: 'Enough time to act but do not delay decisions' },
      { label: 'Above 12 months', value: '✅ Comfortable', note: 'Can invest in growth with confidence' },
    ],
  },
  'subscription-ltv': {
    title: 'Subscription LTV:CAC Benchmarks',
    items: [
      { label: 'Below 1:1', value: '🔴 Unsustainable', note: 'Losing money on every customer acquired' },
      { label: '1:1 – 3:1', value: '🟡 Borderline', note: 'Thin — reduce churn or lower CAC' },
      { label: '3:1 – 5:1', value: '✅ Healthy', note: 'Strong unit economics for a subscription business' },
      { label: 'Above 5:1', value: '🚀 Scale aggressively', note: 'Increase acquisition spend — your economics support it' },
    ],
  },
  'amazon-fba-calculator': {
    title: 'FBA Net Margin Benchmarks',
    items: [
      { label: 'Below 10%', value: '⚠️ Danger zone', note: 'One fee increase or PPC efficiency drop kills profit' },
      { label: '10–20%', value: '🟡 Average', note: 'Competitive categories typically land here' },
      { label: '20–30%', value: '✅ Healthy', note: 'Good buffer — can absorb PPC increases' },
      { label: 'Above 30%', value: '🚀 Excellent', note: 'Strong brand or supply chain advantage' },
    ],
  },
  'pricing-strategy': {
    title: 'Markup Benchmarks by Channel',
    items: [
      { label: 'Amazon FBA', value: '2.5–4x COGS', note: 'Accounts for referral, fulfilment, and PPC' },
      { label: 'Shopify DTC', value: '3–5x COGS', note: 'Must cover CAC, platform fees, and ops' },
      { label: 'Wholesale', value: '1.5–2.5x COGS', note: 'Lower margin — volume dependent' },
      { label: 'Retail (brick & mortar)', value: '2–3x wholesale', note: 'Retailer adds their own 50–100% markup' },
    ],
  },
  'refund-rate-impact': {
    title: 'Return Rate Benchmarks by Category',
    items: [
      { label: 'Apparel & footwear', value: '20–30%', note: 'Highest in e-commerce — size issues dominate' },
      { label: 'Electronics', value: '15–20%', note: 'Expectation mismatch and DOA products' },
      { label: 'Home & garden', value: '8–12%', note: 'Damage in transit is the main driver' },
      { label: 'Beauty & health', value: '5–8%', note: 'Lower returns due to hygiene and consumable nature' },
    ],
  },
  'bundle-pricing-optimizer': {
    title: 'Bundle Discount Benchmarks',
    items: [
      { label: '5–10% discount', value: '🟡 Weak incentive', note: 'May not drive bundle adoption over individual purchase' },
      { label: '10–20% discount', value: '✅ Sweet spot', note: 'Strong enough to convert, preserves healthy margin' },
      { label: '20–30% discount', value: '⚠️ Check margins', note: 'Good for AOV but monitor margin delta carefully' },
      { label: 'Above 30%', value: '🔴 Risky', note: 'Likely negative margin delta — losing money per bundle' },
    ],
  },
  'influencer-roi-calculator': {
    title: 'Influencer Campaign Benchmarks',
    items: [
      { label: 'Nano (1K–10K followers)', value: '1–5% conv rate', note: 'High engagement, low reach — good for niche products' },
      { label: 'Micro (10K–100K)', value: '0.5–2% conv rate', note: 'Best ROI tier for most DTC brands' },
      { label: 'Macro (100K–1M)', value: '0.1–0.5% conv rate', note: 'Brand awareness play more than direct response' },
      { label: 'Mega (1M+)', value: '0.05–0.2% conv rate', note: 'Very expensive per conversion — justifiable at scale only' },
    ],
  },
  'chargeback-impact': {
    title: 'Chargeback Rate Thresholds',
    items: [
      { label: 'Below 0.5%', value: '✅ Safe', note: 'Well below monitoring thresholds — no action needed' },
      { label: '0.5–0.9%', value: '🟡 Watch closely', note: 'Approaching Visa standard threshold — investigate causes' },
      { label: '0.9–1.8%', value: '⚠️ Monitoring program', note: 'Visa VCMP territory — fines and mandatory remediation' },
      { label: 'Above 1.8%', value: '🔴 Account at risk', note: 'High-risk threshold — merchant account termination risk' },
    ],
  },
  'shipping-cost-optimizer': {
    title: 'Shipping Cost as % of AOV Benchmarks',
    items: [
      { label: 'Below 5%', value: '✅ Excellent', note: 'Easily absorbed — free shipping offer is viable' },
      { label: '5–10%', value: '🟡 Manageable', note: 'Free shipping threshold strategy recommended' },
      { label: '10–15%', value: '⚠️ High', note: 'Consider dimensional weight optimisation and rate shopping' },
      { label: 'Above 15%', value: '🔴 Critical', note: 'Shipping is eroding margin significantly — optimise packaging' },
    ],
  },
  'wholesale-margin-calculator': {
    title: 'Wholesale Margin Benchmarks',
    items: [
      { label: 'Below 30%', value: '⚠️ Too thin', note: 'Cannot absorb trade discounts or returns profitably' },
      { label: '30–45%', value: '🟡 Acceptable', note: 'Viable but leaves little room for negotiation' },
      { label: '45–60%', value: '✅ Healthy', note: 'Industry standard for most consumer goods categories' },
      { label: 'Above 60%', value: '🚀 Strong', note: 'Excellent — can offer meaningful trade discounts' },
    ],
  },
  'etsy-fee-calculator': {
    title: 'Etsy Net Margin Benchmarks',
    items: [
      { label: 'Below 10%', value: '⚠️ Unsustainable', note: 'You are not paying yourself for your time' },
      { label: '10–25%', value: '🟡 Thin', note: 'Consider raising prices — Etsy buyers expect premium' },
      { label: '25–45%', value: '✅ Healthy', note: 'Good margin for handmade and creative products' },
      { label: 'Above 45%', value: '🚀 Excellent', note: 'Strong — room to invest in materials and photography' },
    ],
  },
  'profit-per-sku': {
    title: 'SKU Profitability Benchmarks',
    items: [
      { label: 'Below 10% margin', value: '🔴 Cut or reprice', note: 'Not worth the operational complexity to carry' },
      { label: '10–25% margin', value: '🟡 Marginal', note: 'Keep only if it drives other sales or fills out range' },
      { label: '25–45% margin', value: '✅ Core product', note: 'Healthy SKU — maintain and defend' },
      { label: 'Above 45% margin', value: '🚀 Hero SKU', note: 'Invest in ads and inventory — this is your engine' },
    ],
  },
  'ad-spend-budget-calculator': {
    title: 'Ad Spend as % of Revenue Benchmarks',
    items: [
      { label: 'Below 10%', value: '🟡 Under-investing', note: 'Potentially leaving growth on the table' },
      { label: '10–20%', value: '✅ Mature brand', note: 'Efficient — strong organic and repeat purchase base' },
      { label: '20–35%', value: '✅ Growth phase', note: 'Normal for brands scaling aggressively' },
      { label: 'Above 35%', value: '⚠️ Check margins', note: 'High dependency on paid — build organic channels' },
    ],
  },
  'email-marketing-roi': {
    title: 'Email Marketing Benchmarks',
    items: [
      { label: 'Open rate below 15%', value: '⚠️ Low', note: 'Clean list and improve subject lines urgently' },
      { label: 'Open rate 20–30%', value: '✅ Industry avg', note: 'Healthy — focus on click rates to grow revenue' },
      { label: 'Revenue/sub below $0.05', value: '⚠️ Low value', note: 'Segmentation and offers need improvement' },
      { label: 'Revenue/sub $0.50+', value: '🚀 Best in class', note: 'Scale list growth aggressively' },
    ],
  },
}

function BenchmarksSection({ slug }: { slug: string }) {
  const data = BENCHMARKS[slug]
  if (!data) return null
  return (
    <section className="mt-10 max-w-3xl">
      <h2 className="font-display font-800 text-xl sm:text-2xl text-ink-50 mb-5">
        {data.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.items.map((item) => (
          <div key={item.label} className="card p-4">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <p className="font-display font-700 text-ink-100 text-sm">{item.label}</p>
              <span className="text-xs font-mono text-acid shrink-0">{item.value}</span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedBlogPost({ slug }: { slug: string }) {
  const post = BLOG_POSTS.find((p) => p.calculatorSlug === slug)
  if (!post) return null
  return (
    <section className="mt-10 max-w-3xl">
      <h2 className="font-display font-800 text-xl sm:text-2xl text-ink-50 mb-5">
        Further Reading
      </h2>
      <Link to={`/blog/${post.slug}`} className="card-hover p-5 block group">
        <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-2.5 py-0.5">
          {post.category}
        </span>
        <h3 className="font-display font-700 text-ink-100 text-base mt-3 mb-2 leading-snug group-hover:text-ink-50 transition-colors">
          {post.title}
        </h3>
        <p className="text-ink-400 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
        <span className="flex items-center gap-1 text-xs text-acid font-600">
          Read the guide <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </section>
  )
}