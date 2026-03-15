import { Link } from 'react-router-dom'
import { Calculator, Globe, Zap, Users } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { CALCULATORS } from '@/calculators'

export function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Valcr — E-Commerce Calculators for Operators"
        description="Valcr builds deeply specialized calculators for e-commerce operators. Know your numbers: landed cost, ROAS, break-even, LTV, and more."
        canonicalPath="/about"
      />

      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <div className="mb-16">
            <span className="section-tag mb-6 inline-flex">
              <Globe className="w-3 h-3" />
              About
            </span>
            <h1 className="font-display font-800 text-5xl text-ink-50 leading-tight mb-6">
              Built for operators<br />who run on numbers.
            </h1>
            <p className="text-ink-300 text-xl leading-relaxed">
              Valcr is a collection of deeply specialized calculators designed for e-commerce operators,
              founders, and marketers. We don't do generic. Every calculator targets a specific decision
              you face when running an online business.
            </p>
          </div>

          {/* Mission */}
          <div className="card p-8 mb-10">
            <h2 className="font-display font-800 text-2xl text-ink-50 mb-4">Why we exist</h2>
            <div className="space-y-4 text-ink-300 leading-relaxed">
              <p>
                Most financial calculators on the internet are built for accountants — they're generic,
                slow, and don't speak the language of e-commerce. You search for "landed cost calculator"
                and get a spreadsheet from 2015 or a tool that doesn't know what Shopify Payments is.
              </p>
              <p>
                We started Valcr because we were tired of rebuilding the same Google Sheets every time
                we needed to quickly model a product's true margin, figure out a safe reorder point,
                or understand what a 2% increase in chargeback rate was actually costing us.
              </p>
              <p>
                Every calculator on Valcr is built around a specific question an operator actually asks.
                The math is transparent, the defaults are realistic, and the results are explained in
                plain language — not just a number.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: `${CALCULATORS.length}+`, label: 'Calculators' },
              { value: '100%', label: 'Free to use' },
              { value: '0', label: 'Ads, ever' },
              { value: '1-line', label: 'To embed' },
            ].map((stat) => (
              <div key={stat.label} className="card p-5 text-center">
                <p className="font-display font-800 text-2xl text-acid mb-1">{stat.value}</p>
                <p className="text-xs text-ink-400 font-mono uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Principles */}
          <div className="mb-10">
            <h2 className="font-display font-800 text-2xl text-ink-50 mb-6">How we build</h2>
            <div className="space-y-4">
              {[
                {
                  icon: <Calculator className="w-5 h-5" />,
                  title: 'Transparent math',
                  desc: 'Every formula is documented. You should understand exactly how your result was calculated, not just trust a black box.',
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Fast by default',
                  desc: 'All calculators run entirely in your browser. No server round-trips, no loading spinners. Results update as you type.',
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: 'Operator-first defaults',
                  desc: 'Default values are based on real e-commerce benchmarks, not made-up numbers. The tool should work well even before you customize it.',
                },
                {
                  icon: <Globe className="w-5 h-5" />,
                  title: 'Embeddable everywhere',
                  desc: 'Any calculator can be embedded on your own site with one line of code. Add decision-making tools directly to your content.',
                },
              ].map((p) => (
                <div key={p.title} className="card p-5 flex gap-4">
                  <div className="w-9 h-9 shrink-0 bg-acid/10 border border-acid/20 rounded-lg flex items-center justify-center text-acid">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-ink-100 mb-1">{p.title}</h3>
                    <p className="text-ink-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's coming */}
          <div className="card p-8 mb-10">
            <h2 className="font-display font-800 text-2xl text-ink-50 mb-4">What's coming</h2>
            <p className="text-ink-300 leading-relaxed mb-4">
              Phase 1 covers the core e-commerce operator toolkit: margin, ROAS, LTV, inventory, cash flow,
              Amazon FBA, chargeback impact, and more. Phase 2 adds a freelancer and agency suite — project
              profitability, hourly rate calculators, retainer modelling, and client ROI tools.
            </p>
            <p className="text-ink-300 leading-relaxed">
              Longer term, Valcr calculators become embeddable components for newsletters, blogs, and
              SaaS products — letting you add financial decision tools to your own audience without
              building them from scratch.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/calculators" className="btn-primary">
              <Calculator className="w-4 h-4" />
              Explore calculators
            </Link>
            <Link to="/pricing" className="btn-secondary">
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
