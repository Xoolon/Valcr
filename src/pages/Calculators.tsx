import { useState } from 'react'
import { Search } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { CalculatorCard } from '@/components/CalculatorCard'
import { CALCULATORS } from '@/calculators'
import { AdBanner } from '@/components/AdBanner'

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
        title="All E-Commerce Calculators | Valcr"
        description="Browse 15+ specialized calculators for e-commerce operators. Shopify margins, landed cost, ROAS, CAC, Amazon FBA, break-even, and more. All free."
        keywords={['ecommerce calculators', 'shopify calculator', 'amazon fba calculator', 'ecommerce tools']}
        canonicalPath="/calculators"
      />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className="section-tag mb-4 inline-flex">Calculator Directory</span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="font-display font-800 text-5xl text-ink-50 leading-tight">
                  All Calculators
                </h1>
                <p className="text-ink-400 mt-3 text-lg">
                  {CALCULATORS.length} specialized tools. All free. No account required.
                </p>
              </div>

              {/* Search */}
              <div className="relative sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name or topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* E-Commerce Section */}
          {ecommerce.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display font-700 text-xl text-ink-50">E-Commerce</h2>
                <span className="text-xs font-mono text-ink-600 bg-ink-800 px-2 py-0.5 rounded">
                  {ecommerce.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ecommerce.map((calc) => (
                  <CalculatorCard key={calc.slug} calculator={calc} />
                ))}
              </div>
            </section>
          )}

         {!query && <AdBanner className="my-6" />}

          {/* Freelancer teaser */}
          {!query && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display font-700 text-xl text-ink-200">Freelancer & Agency</h2>
                <span className="text-xs font-mono text-ink-600 bg-ink-800 px-2 py-0.5 rounded">Coming soon</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'True Hourly Rate', desc: 'Real rate after taxes, overhead, and non-billable hours' },
                  { name: 'Project Profitability', desc: 'Net profit after all contractor, tool, and time costs' },
                  { name: 'Agency Capacity Planner', desc: 'Maximum concurrent projects at current headcount' },
                  { name: 'Retainer vs Project Pricing', desc: 'Which model maximizes annual revenue' },
                  { name: 'Freelancer Tax Estimator', desc: 'Quarterly estimated taxes for US and UK freelancers' },
                ].map((calc) => (
                  <div key={calc.name} className="card p-6 opacity-50">
                    <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center mb-4">
                      <span className="text-ink-600 text-lg">🔒</span>
                    </div>
                    <h3 className="font-display font-700 text-ink-50 text-sm mb-1.5">{calc.name}</h3>
                    <p className="text-ink-400 text-sm">{calc.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="card p-16 text-center">
              <p className="text-ink-400 text-lg">No calculators match "{query}"</p>
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
