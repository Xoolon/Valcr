// src/lib/structuredData.ts
// JSON-LD structured data helpers for all page types.
// Inject into <head> using React Helmet or a simple script tag.
// These schemas help Google understand pages and can unlock rich results.

const SITE = 'https://valcr.site'
const ORG_NAME = 'Valcr'

// ── Organization schema (add to index.html head once) ──────────────────────
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME,
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  description: 'Financial intelligence platform for e-commerce operators. 20 free calculators for Shopify, Amazon FBA, and Etsy sellers.',
  sameAs: [
    'https://twitter.com/valcrsite',
  ],
}

// ── WebSite schema with sitelinks searchbox (add to index.html head once) ──
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: ORG_NAME,
  url: SITE,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE}/calculators?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// ── Calculator page schema ──────────────────────────────────────────────────
export function calculatorSchema(calc: {
  name: string
  description: string
  slug: string
  inputs: { name: string; description: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${calc.name} — Valcr`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: `${SITE}/calculators/${calc.slug}`,
    description: calc.description,
    featureList: calc.inputs.map(i => i.name).join(', '),
    creator: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE,
    },
  }
}

// ── Blog post schema ────────────────────────────────────────────────────────
export function blogPostSchema(post: {
  title: string
  excerpt: string
  slug: string
  date: string
  author?: string
  keywords: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    keywords: post.keywords.join(', '),
    url: `${SITE}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Valcr Team',
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE}/blog/${post.slug}`,
    },
  }
}

// ── Report schema ───────────────────────────────────────────────────────────
export function reportSchema(report: {
  title: string
  description: string
  slug: string
  publishDate: string
  quarter: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Report',
    name: report.title,
    description: report.description,
    url: `${SITE}/reports/${report.slug}`,
    datePublished: report.publishDate,
    about: [
      { '@type': 'Thing', name: 'E-Commerce Profit Margins' },
      { '@type': 'Thing', name: 'ROAS Benchmarks' },
      { '@type': 'Thing', name: 'Customer Acquisition Cost' },
    ],
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE,
    },
    temporalCoverage: report.quarter,
  }
}

// ── FAQ schema (for comparison pages) ──────────────────────────────────────
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

// ── BreadcrumbList schema ───────────────────────────────────────────────────
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  }
}

// ── Usage in Calculator.tsx ────────────────────────────────────────────────
/*
import { calculatorSchema, breadcrumbSchema } from '@/lib/structuredData'

// In your Calculator page component:
const calc = CALCULATORS.find(c => c.slug === slug)

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(calculatorSchema({
        name: calc.name,
        description: calc.description,
        slug: calc.slug,
        inputs: calc.inputs,
      }))
    }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Calculators', path: '/calculators' },
        { name: calc.name, path: `/calculators/${calc.slug}` },
      ]))
    }} />
    ...
  </>
)
*/
