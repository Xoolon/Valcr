import { useState } from 'react'
import { Search } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { CalculatorCard } from '@/components/CalculatorCard'
import { CALCULATORS } from '@/calculators'

export function CalculatorsPage() {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? CALCULATORS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.tagline.toLowerCase().includes(query.toLowerCase()) ||
          c.targetQuery.toLowerCase().includes(query.toLowerCase())
      )
    : CALCULATORS

  const ecommerce = filtered.filter((c) => c.category === 'ecommerce')

  return (
    <>
      <SEOHead
        title="All 20 E-Commerce Calculators | Valcr"
        description="Browse 20 specialized calculators for e-commerce operators. Shopify margins, landed cost, ROAS, CAC, Amazon FBA, Etsy fees, wholesale margin, and more. All free."
        keywords={[
          'ecommerce calculators', 'shopify calculator', 'amazon fba calculator',
          'etsy fee calculator', 'wholesale margin calculator', 'roas calculator',
          'ecommerce tools', 'profit per sku calculator',
        ]}
        canonicalPath="/calculators"
      />

      <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <span className="section-tag mb-3 sm:mb-4 inline-flex">Calculator Directory</span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="font-display font-800 text-3xl sm:text-5xl text-ink-50 leading-tight">
                  All Calculators
                </h1>
                <p className="text-ink-400 mt-2 sm:mt-3 text-base sm:text-lg">
                  {CALCULATORS.length} specialized tools. All free. No account required.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search calculators..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* E-Commerce grid — 2 cols on mobile, 3 on tablet, 4 on desktop */}
          {ecommerce.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <h2 className="font-display font-700 text-lg sm:text-xl text-ink-50">E-Commerce</h2>
                <span className="text-xs font-mono text-ink-600 bg-ink-800 px-2 py-0.5 rounded">
                  {ecommerce.length} tools
                </span>
              </div>
              {/* 2 per row on mobile, 3 on sm, 4 on lg */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {ecommerce.map((calc) => (
                  <CalculatorCard key={calc.slug} calculator={calc} />
                ))}
              </div>
            </section>
          )}

          {/* Coming soon */}
          {!query && (
            <section>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <h2 className="font-display font-700 text-lg sm:text-xl text-ink-200">Freelancer & Agency</h2>
                <span className="text-xs font-mono text-ink-600 bg-ink-800 px-2 py-0.5 rounded">Coming soon</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { name: 'True Hourly Rate', desc: 'Real rate after taxes and overhead' },
                  { name: 'Project Profitability', desc: 'Net profit after all costs' },
                  { name: 'Agency Capacity', desc: 'Maximum concurrent projects' },
                  { name: 'Retainer Pricing', desc: 'Retainer vs project revenue' },
                  { name: 'Tax Estimator', desc: 'Quarterly estimated taxes' },
                ].map((calc) => (
                  <div key={calc.name} className="card p-4 sm:p-6 opacity-50 cursor-not-allowed">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ink-800 flex items-center justify-center mb-3 sm:mb-4">
                      <span className="text-ink-600 text-base sm:text-lg">🔒</span>
                    </div>
                    <h3 className="font-display font-700 text-ink-50 text-xs sm:text-sm mb-1">{calc.name}</h3>
                    <p className="text-ink-400 text-xs leading-relaxed hidden sm:block">{calc.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="card p-12 sm:p-16 text-center">
              <p className="text-ink-400 text-base sm:text-lg">No calculators match "{query}"</p>
              <button onClick={() => setQuery('')} className="btn-ghost mt-4 text-sm">
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}