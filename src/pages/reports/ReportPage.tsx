// src/pages/reports/ReportPage.tsx
// Renders individual industry benchmark reports.
// Route: /reports/:slug

import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, TrendingDown, Minus, ExternalLink, BarChart2 } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdBanner'
import { getReport, INDUSTRY_REPORTS } from './index'

function MetricCard({ metric }: { metric: { name: string; value: string; change?: string; changePositive?: boolean; context?: string; source: string } }) {
  return (
    <div className="card p-4 border-ink-700">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest leading-tight">
          {metric.name}
        </p>
        {metric.changePositive !== undefined && (
          metric.changePositive
            ? <TrendingUp className="w-3.5 h-3.5 text-acid shrink-0 mt-0.5" />
            : <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
        )}
      </div>
      <p className="font-display font-800 text-2xl text-ink-50 mb-1">{metric.value}</p>
      {metric.context && (
        <p className="text-xs text-ink-400 mb-1">{metric.context}</p>
      )}
      {metric.change && (
        <p className="text-xs text-ink-500">{metric.change}</p>
      )}
      <p className="text-[10px] text-ink-700 font-mono mt-2 border-t border-ink-800 pt-2">
        Source: {metric.source}
      </p>
    </div>
  )
}

export function ReportPage() {
  const { slug } = useParams<{ slug: string }>()
  const report = getReport(slug!)
  if (!report) return <Navigate to="/reports" replace />

  // JSON-LD for article schema (helps Google feature it as a data source)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: report.title,
    description: report.metaDescription,
    datePublished: report.publishDate,
    publisher: {
      '@type': 'Organization',
      name: 'Valcr',
      url: 'https://valcr.site',
    },
    about: { '@type': 'Thing', name: 'E-Commerce Profit Margins and Benchmarks' },
  }

  return (
    <>
      <SEOHead
        title={report.metaTitle}
        description={report.metaDescription}
        canonicalPath={`/reports/${report.slug}`}
        keywords={report.keywords}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-ink-600 mb-8">
            <Link to="/" className="hover:text-acid transition-colors">Home</Link>
            <span>/</span>
            <Link to="/reports" className="hover:text-acid transition-colors">Reports</Link>
            <span>/</span>
            <span className="text-ink-400">{report.quarter}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-3 py-1">
                {report.quarter}
              </span>
              <span className="text-xs font-mono text-ink-600">Published {report.publishDate}</span>
            </div>
            <h1 className="font-display font-800 text-4xl sm:text-5xl text-ink-50 leading-tight mb-4">
              {report.title}
            </h1>
            <p className="text-ink-300 text-xl leading-relaxed">{report.summary}</p>
          </div>

          {/* Data sources */}
          <div className="card p-5 mb-10 border-ink-700">
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">
              Data sources
            </p>
            <div className="space-y-2">
              {report.dataSources.map((src, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-mono text-acid mt-0.5">→</span>
                  <div>
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-ink-200 hover:text-acid transition-colors flex items-center gap-1">
                      {src.name} <ExternalLink className="w-3 h-3" />
                    </a>
                    {src.n !== 'N/A' && (
                      <p className="text-xs text-ink-600 font-mono">n = {src.n}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-ink-700 mt-4 italic">
              Valcr aggregates publicly available industry data with source attribution.
              As Valcr's operator dataset grows, future reports will incorporate anonymised,
              aggregated user data directly. All sources are linked above for verification.
            </p>
          </div>

          {/* Ad banner */}
          <AdBanner className="mb-10" />

          {/* Report sections */}
          {report.sections.map((section, i) => (
            <div key={i} className="mb-14">
              <h2 className="font-display font-800 text-2xl text-ink-50 mb-6">
                {section.heading}
              </h2>

              {/* Metrics grid */}
              {section.metrics && section.metrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {section.metrics.map((metric, j) => (
                    <MetricCard key={j} metric={metric} />
                  ))}
                </div>
              )}

              {/* Body text */}
              <div className="prose-valcr">
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} className="text-ink-300 leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Calculator CTAs */}
          <div className="card p-8 border-acid/20 bg-acid/5 mb-14">
            <p className="text-xs font-mono text-acid uppercase tracking-widest mb-2">
              Apply these benchmarks to your business
            </p>
            <h3 className="font-display font-800 text-2xl text-ink-50 mb-3">
              See where you stand
            </h3>
            <p className="text-ink-300 mb-6">
              Run your own numbers through our free calculators and compare your metrics
              to the industry benchmarks in this report.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {report.calculatorCtas.map((cta, i) => (
                <Link key={i} to={`/calculators/${cta.slug}`}
                  className={i === 0 ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>
                  {cta.label} <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Other reports */}
          <div>
            <h2 className="font-display font-800 text-xl text-ink-50 mb-4">Other reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INDUSTRY_REPORTS
                .filter(r => r.slug !== report.slug)
                .map(r => (
                  <Link key={r.slug} to={`/reports/${r.slug}`}
                    className="card p-5 hover:border-acid/30 hover:bg-acid/5 transition-all group block">
                    <span className="text-xs font-mono text-acid">{r.quarter}</span>
                    <h4 className="font-display font-700 text-ink-100 text-sm mt-1 leading-snug group-hover:text-ink-50 transition-colors">
                      {r.title}
                    </h4>
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}


// ── Reports index listing ─────────────────────────────────────────────────────
// src/pages/reports/ReportsIndex.tsx — /reports landing page

export function ReportsIndex() {
  const articleListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Valcr E-Commerce Benchmark Reports',
    description: 'Quarterly e-commerce profit margin, ROAS, and CAC benchmark reports for DTC and marketplace operators.',
    url: 'https://valcr.site/reports',
    hasPart: INDUSTRY_REPORTS.map(r => ({
      '@type': 'Report',
      name: r.title,
      url: `https://valcr.site/reports/${r.slug}`,
    })),
  }

  return (
    <>
      <SEOHead
        title="E-Commerce Benchmark Reports | Margins, ROAS, CAC | Valcr"
        description="Quarterly benchmark reports for e-commerce operators. Profit margins, ROAS, CAC, and more — sourced from published industry data and Valcr operator aggregates."
        canonicalPath="/reports"
        keywords={[
          'ecommerce benchmark reports',
          'shopify profit margin benchmarks',
          'amazon fba benchmarks 2025',
          'ecommerce industry data quarterly',
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleListSchema) }}
      />

      <div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          <div className="mb-12">
            <span className="text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-3 py-1 mb-4 inline-block">
              <BarChart2 className="w-3 h-3 inline mr-1" />Industry Reports
            </span>
            <h1 className="font-display font-800 text-5xl text-ink-50 leading-tight mb-4">
              E-Commerce Benchmarks
            </h1>
            <p className="text-ink-300 text-xl max-w-2xl">
              Quarterly benchmark data for operators who want to know where they
              actually stand — not where they think they stand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {INDUSTRY_REPORTS.map(report => (
              <Link key={report.slug} to={`/reports/${report.slug}`}
                className="card p-6 hover:border-acid/30 hover:bg-acid/5 transition-all group block">
                <span className="text-xs font-mono text-acid mb-3 inline-block">
                  {report.quarter}
                </span>
                <h2 className="font-display font-700 text-ink-100 text-lg leading-snug mb-3 group-hover:text-ink-50 transition-colors">
                  {report.title}
                </h2>
                <p className="text-ink-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {report.summary}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {report.dataSources.slice(0, 2).map((src, i) => (
                    <span key={i} className="text-[10px] font-mono text-ink-600 bg-ink-800 px-2 py-0.5 rounded">
                      {src.name.split(' ')[0]}
                    </span>
                  ))}
                  <span className="text-xs text-acid font-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Read report <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 card p-6 border-acid/20 bg-acid/5">
            <p className="text-xs font-mono text-acid uppercase tracking-widest mb-2">
              Data note
            </p>
            <p className="text-ink-300 text-sm leading-relaxed">
              Valcr benchmark reports currently source data from published industry research
              with full attribution. As Valcr's operator dataset grows, future reports will
              incorporate anonymised, aggregated data from real calculations run on the platform —
              the same methodology used by EcomCFO, TrueProfit, and Jungle Scout in their
              respective datasets. Reports are updated quarterly.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
