// src/pages/comparisons/ComparisonPage.tsx
// Dynamic renderer for all comparison pages.
// Route: /compare/:slug
// Add to App.tsx:
//   import { ComparisonPage } from '@/pages/comparisons/ComparisonPage'
//   <Route path="/compare/:slug" element={<ComparisonPage />} />

import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdBanner'
import { getComparisonPage, COMPARISON_PAGES } from './index'

export function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>()
  const page = getComparisonPage(slug!)
  if (!page) return <Navigate to="/calculators" replace />

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // JSON-LD structured data for SEO (FAQ schema)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqItems.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        canonicalPath={`/compare/${page.slug}`}
        keywords={page.keywords}
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-ink-600 mb-8">
            <Link to="/" className="hover:text-acid transition-colors">Home</Link>
            <span>/</span>
            <Link to="/calculators" className="hover:text-acid transition-colors">Calculators</Link>
            <span>/</span>
            <span className="text-ink-400">Compare</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-3 py-1 mb-4 inline-block">
              Comparison
            </span>
            <h1 className="font-display font-800 text-4xl sm:text-5xl text-ink-50 leading-tight mb-4">
              {page.heroHeadline}
            </h1>
            <p className="text-ink-300 text-xl leading-relaxed max-w-2xl">
              {page.heroSubline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to={`/calculators/${page.calculatorSlug}`}
                className="btn-primary text-base px-6 py-3">
                Try the free calculator <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#comparison-table"
                className="btn-secondary text-base px-6 py-3">
                See comparison table ↓
              </a>
            </div>
          </div>

          {/* Ad banner */}
          <AdBanner className="mb-10" />

          {/* Comparison table */}
          <div id="comparison-table" className="mb-14">
            <h2 className="font-display font-800 text-2xl text-ink-50 mb-6">
              Feature comparison: Valcr vs {page.competitorName}
            </h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-800">
                    <th className="text-left p-4 text-xs font-mono text-ink-600 uppercase tracking-widest w-1/2">
                      Feature
                    </th>
                    <th className="text-center p-4 text-xs font-mono text-acid uppercase tracking-widest">
                      Valcr
                    </th>
                    <th className="text-center p-4 text-xs font-mono text-ink-500 uppercase tracking-widest">
                      {page.competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.tableRows.map((row, i) => (
                    <tr key={i}
                      className={`border-b border-ink-800/50 ${row.valcrWins ? 'bg-acid/3' : ''}`}>
                      <td className="p-4 text-sm text-ink-200">{row.feature}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-mono ${row.valcrWins ? 'text-acid' : 'text-ink-400'}`}>
                          {row.valcr}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs font-mono text-ink-500">{row.competitor}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editorial sections */}
          <div className="space-y-10 mb-14">
            {page.sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-display font-800 text-2xl text-ink-50 mb-4">
                  {section.heading}
                </h2>
                <div className="prose-valcr">
                  {section.body.split('\n\n').map((para, j) => (
                    <p key={j} className="text-ink-300 leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="card p-8 border-acid/20 bg-acid/5 mb-14">
            <p className="text-xs font-mono text-acid uppercase tracking-widest mb-2">
              Free — no account required
            </p>
            <h3 className="font-display font-800 text-2xl text-ink-50 mb-3">
              Run the calculation now
            </h3>
            <p className="text-ink-300 mb-6">
              Takes 30 seconds. No spreadsheet setup. No formula errors. Just the right number.
            </p>
            <Link to={`/calculators/${page.calculatorSlug}`} className="btn-primary text-base px-6 py-3">
              Open calculator <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* FAQ */}
          {page.faqItems.length > 0 && (
            <div className="mb-14">
              <h2 className="font-display font-800 text-2xl text-ink-50 mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-2">
                {page.faqItems.map((faq, i) => (
                  <div key={i} className="card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex items-center justify-between w-full p-5 text-left gap-4">
                      <span className="font-display font-700 text-ink-100 text-sm leading-snug">
                        {faq.q}
                      </span>
                      {openFaq === i
                        ? <ChevronUp className="w-4 h-4 text-acid shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-ink-600 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5">
                        <p className="text-ink-300 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related comparisons */}
          <div>
            <h2 className="font-display font-800 text-xl text-ink-50 mb-4">
              Other comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPARISON_PAGES
                .filter(p => p.slug !== page.slug)
                .slice(0, 4)
                .map(p => (
                  <Link key={p.slug} to={`/compare/${p.slug}`}
                    className="card p-4 hover:border-acid/30 hover:bg-acid/5 transition-all group block">
                    <p className="text-xs font-mono text-acid mb-1">vs {p.competitorName}</p>
                    <p className="font-display font-700 text-ink-100 text-sm leading-snug group-hover:text-ink-50 transition-colors">
                      {p.title}
                    </p>
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
