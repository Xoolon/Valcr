import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { CalculatorForm } from '@/components/CalculatorForm'
import { CalculatorCard } from '@/components/CalculatorCard'
import { getCalculator, getRelatedCalculators } from '@/calculators'
import { useCalcStore } from '@/store'
import clsx from 'clsx'

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