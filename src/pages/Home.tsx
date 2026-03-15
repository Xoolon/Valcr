import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Zap, Code2, TrendingUp, Lock } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { CalculatorCard } from '@/components/CalculatorCard'
import { CALCULATORS } from '@/calculators'

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant results',
    desc: 'Results update as you type. No submit button. No wait.',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'SEO-first design',
    desc: 'Every calculator targets a specific search query. You get found.',
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: 'Embeddable everywhere',
    desc: 'One line of code. Add any calculator to any website.',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Pro features',
    desc: 'Save calculations, compare scenarios, export PDFs.',
  },
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'E-Commerce Calculators',
  description: 'Specialized calculators for e-commerce operators',
  itemListElement: CALCULATORS.slice(0, 6).map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    url: `https://valcr.site/calculators/${c.slug}`,
  })),
}

export function HomePage() {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? CALCULATORS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.tagline.toLowerCase().includes(query.toLowerCase()) ||
          c.targetQuery.toLowerCase().includes(query.toLowerCase())
      )
    : CALCULATORS

  return (
    <>
      <SEOHead
        title="Valcr — Professional Calculators for E-Commerce Operators"
        description="Free specialized calculators for e-commerce operators. True landed cost, Shopify margins, ROAS, CAC, Amazon FBA fees, and 15+ more. Built for serious sellers."
        keywords={['ecommerce calculator', 'shopify calculator', 'landed cost calculator', 'ROAS calculator', 'amazon fba calculator']}
        canonicalPath="/"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-acid/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex mb-6">
            <span className="section-tag">
              <span className="w-1.5 h-1.5 bg-acid rounded-full animate-pulse" />
              15 calculators · Free to use
            </span>
          </div>

          <h1 className="font-display font-800 text-5xl sm:text-6xl lg:text-7xl text-ink-50 leading-[0.95] tracking-tight mb-6 text-balance stagger-child">
            Know your{' '}
            <span className="gradient-text">exact numbers.</span>
            <br />
            No guessing.
          </h1>

          <p className="text-ink-300 text-xl sm:text-2xl font-body font-300 max-w-2xl mx-auto leading-relaxed mb-10 stagger-child">
            Deeply specialized calculators for e-commerce operators. Each one speaks your language, pre-fills industry defaults, and explains the math.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 stagger-child">
            <Link to="/calculators" className="btn-primary text-base px-8 py-4">
              <TrendingUp className="w-4 h-4" />
              Browse Calculators
            </Link>
            <Link to="/pricing" className="btn-secondary text-base px-8 py-4">
              See Pro features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto stagger-child">
            {[
              { value: '15+', label: 'Calculators' },
              { value: '$0', label: 'To start' },
              { value: '∞', label: 'Scenarios' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-800 text-3xl text-acid tabular-nums">{stat.value}</p>
                <p className="text-xs font-display font-600 text-ink-600 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Directory */}
      <section className="py-16 px-4 sm:px-6" id="calculators">
        <div className="max-w-7xl mx-auto">
          {/* Header + Search */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="section-tag mb-3 inline-flex">Phase 1</span>
              <h2 className="font-display font-800 text-3xl text-ink-50">
                E-Commerce Suite
              </h2>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Search calculators..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-9 text-sm py-2.5"
              />
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filtered.map((calc) => (
                <CalculatorCard key={calc.slug} calculator={calc} compact />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-ink-400 font-display">No calculators match "{query}"</p>
            </div>
          )}

          {/* Phase 2 teaser */}
          <div className="mt-8 card p-6 border-dashed border-ink-700/60 flex items-center justify-between">
            <div>
              <span className="section-tag mb-2 inline-flex">Coming Month 4+</span>
              <h3 className="font-display font-700 text-ink-50">Freelancer & Agency Suite</h3>
              <p className="text-ink-400 text-sm mt-1">True hourly rate, project profitability, tax estimator, and more.</p>
            </div>
            <Link to="/pricing" className="btn-ghost shrink-0">
              Get notified <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 border-t border-ink-800">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-12">
            <span className="section-tag mb-4 inline-flex">Why Valcr</span>
            <h2 className="font-display font-800 text-4xl text-ink-50 leading-tight">
              Built for the long tail. <br />
              <span className="text-ink-400">Not the generic middle.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="w-10 h-10 bg-acid/10 border border-acid/20 rounded-xl flex items-center justify-center text-acid mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-700 text-ink-50 mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-acid/5 to-sky/5 pointer-events-none" />
            <span className="section-tag mb-6 inline-flex">Pro Plan</span>
            <h2 className="font-display font-800 text-4xl text-ink-50 mb-4">
              Save. Compare. Export.
            </h2>
            <p className="text-ink-300 text-lg max-w-lg mx-auto mb-8">
              Pro users save unlimited calculations, compare scenarios side-by-side, and export to PDF. $9/month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-base px-8 py-4">
                <Zap className="w-4 h-4" />
                Start Pro — $9/mo
              </Link>
              <Link to="/pricing" className="btn-secondary text-base px-8 py-4">
                See all plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
