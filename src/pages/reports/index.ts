// src/pages/reports/index.ts
// Industry benchmark reports at /reports/:slug
// These are SEO pages targeting "[industry] benchmarks [year/quarter]" queries
// which generate strong backlinks from other content creators citing the data.
//
// Structure: anchor data (public sources) + Valcr aggregate data when available
// Purely for SEO and authority building — same transparent source attribution
// as the benchmark system.
//
// Route: /reports/:slug
// Add to App.tsx:
//   <Route path="/reports/:slug" element={<ReportPage />} />
// Also add a /reports index listing:
//   <Route path="/reports" element={<ReportsIndex />} />

export interface ReportMetric {
  name: string
  value: string
  change?: string
  changePositive?: boolean
  context: string
  source: string
}

export interface ReportSection {
  heading: string
  body: string
  metrics?: ReportMetric[]
}

export interface IndustryReport {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  quarter: string       // e.g. "Q1 2025"
  publishDate: string   // e.g. "April 2025"
  summary: string       // 2-3 sentence executive summary
  dataSources: { name: string; url: string; n: string }[]
  sections: ReportSection[]
  calculatorCtas: { label: string; slug: string }[]
}

export const INDUSTRY_REPORTS: IndustryReport[] = [
  {
    slug: 'ecommerce-margins-q1-2025',
    title: 'E-Commerce Margin Benchmarks — Q1 2025',
    metaTitle: 'E-Commerce Profit Margin Benchmarks Q1 2025 | Valcr Industry Report',
    metaDescription: 'Anonymized e-commerce margin benchmarks for Q1 2025. Gross margin, net margin, ROAS, and CAC data across Shopify, Amazon FBA, and Etsy operators. Updated quarterly.',
    keywords: [
      'ecommerce profit margin benchmarks 2025',
      'shopify average profit margin q1 2025',
      'ecommerce gross margin benchmark report',
      'dtc brand margin benchmarks q1 2025',
      'amazon fba profit margin industry average',
    ],
    quarter: 'Q1 2025',
    publishDate: 'April 2025',
    summary: 'E-commerce gross margins held broadly steady in Q1 2025 despite persistent cost pressure, with the median Shopify DTC operator reporting 44–47% gross margin. Net margins remain under pressure from rising ad costs, with ROAS declining approximately 9% year-over-year for mid-market brands while smaller brands showed improvement.',
    dataSources: [
      { name: 'TrueProfit — 5,000+ Shopify Stores Analysis 2025–2026', url: 'https://trueprofit.io/blog/ecommerce-profit-margins', n: '5,000+' },
      { name: 'Jungle Scout State of the Amazon Seller 2025', url: 'https://www.junglescout.com/resources/reports/amazon-seller-report-2025/', n: '1,500' },
      { name: 'Onramp Funds Ecommerce Profit Margin Benchmarks 2025', url: 'https://www.onrampfunds.com/resources/10-profit-margin-benchmarks-for-ecommerce-2025', n: 'N/A' },
      { name: 'upcounting.com Average eCommerce ROAS 2025', url: 'https://www.upcounting.com/blog/average-ecommerce-roas', n: 'N/A' },
      { name: 'A2X / Ecom CFO Ecommerce P&L Benchmark Report Q2 2025', url: 'https://ecomcfo.co/key-insights-from-our-q2-pl-benchmark-report/', n: '20 brands' },
    ],
    sections: [
      {
        heading: 'Gross Margin',
        body: `Gross margin — revenue minus cost of goods sold — remained the most stable P&L line for e-commerce operators in Q1 2025. The median gross margin across Shopify DTC stores held at approximately 45%, consistent with the prior year despite tariff headwinds on imported goods. Operators largely absorbed cost pressure through pricing adjustments and SKU rationalisation rather than allowing margin erosion.

Category variation remains significant. Beauty and skincare brands continue to report the strongest gross margins at 50–70%, driven by low COGS on proprietary formulations and strong brand pricing power. Electronics face the tightest margins at 15–25% gross, requiring much higher ROAS thresholds to remain profitable on paid acquisition.`,
        metrics: [
          { name: 'Shopify DTC median gross margin', value: '45%', context: 'Broadly stable year-over-year', source: 'TrueProfit 5,000+ stores', changePositive: true },
          { name: 'Amazon FBA median net margin', value: '15%', context: '73% of sellers above 10% net margin', source: 'Jungle Scout 2025 (n=1,500)', changePositive: true },
          { name: 'Beauty/skincare gross margin range', value: '50–70%', context: 'Category leading; driven by brand equity', source: 'Onramp Funds 2025', changePositive: true },
          { name: 'Electronics gross margin range', value: '15–25%', context: 'Category lagging; high competition', source: 'Onramp Funds 2025', changePositive: false },
        ],
      },
      {
        heading: 'ROAS and Advertising Efficiency',
        body: `Advertising efficiency continued its downward trend in Q1 2025. The average ROAS across e-commerce brands reached approximately 2.87:1, while the median in 2024 was recorded at 2.04:1 — meaning half of all e-commerce brands operated below a 2:1 ratio before accounting for their full cost structure.

The divergence between revenue cohorts is notable. Brands under $10M annual revenue showed a 16.5% ROAS improvement in Q1 2025 — the result of smaller brands becoming more disciplined on acquisition efficiency as their larger competitors over-invested. Mid-market brands ($10M–$50M) saw ROAS decline approximately 9%, compounded by a 32% increase in fixed marketing costs (agencies, creative production, headcount).

Meta CPM inflation of 15–22% across most verticals is the primary driver of ROAS compression for brands that did not offset it with creative velocity improvements or channel diversification.`,
        metrics: [
          { name: 'Average ecommerce ROAS', value: '2.87x', change: 'Flat to prior year', source: 'upcounting.com 2025', changePositive: false, context: 'Industry average across all ecommerce sectors in Q1 2025' },
          { name: 'Median ecommerce ROAS (2024)', value: '2.04x', context: '50% of brands below this level', source: 'upcounting.com 2025', changePositive: false },
          { name: 'ROAS decline — mid-market brands', value: '−9%', context: '$10M–$50M revenue cohort', source: 'A2X/EcomCFO Q2 2025', changePositive: false },
          { name: 'ROAS improvement — small brands', value: '+16.5%', context: 'Under-$10M revenue cohort', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
        ],
      },
      {
        heading: 'Customer Acquisition Cost',
        body: `Customer acquisition costs continued to diverge by platform and category. Shopify merchants maintain a structural CAC advantage of approximately 18% over Amazon sellers, reflecting lower marketplace competition and the ability to build owned marketing channels.

Blended CAC for DTC Shopify brands in Q1 2025 ranged from $25 for efficient low-ticket operators to $95 for premium category brands. The critical metric is not absolute CAC but LTV:CAC ratio. The industry benchmark target remains 3:1 — for every $1 spent acquiring a customer, the brand should generate $3 in gross lifetime value. Brands consistently below 2:1 are acquiring customers at unsustainable economics regardless of growth rate.

Payback period — the months until a customer's revenue covers the acquisition cost — remained the most actionable metric for operators managing cash flow. Target payback under 12 months for bootstrapped brands; above 18 months typically requires external capital to sustain.`,
        metrics: [
          { name: 'Shopify DTC blended CAC range', value: '$25–$95', context: 'Low-ticket to premium category', source: 'Onramp Funds 2025', changePositive: false },
          { name: 'Shopify vs Amazon CAC advantage', value: '18% lower', context: 'For Shopify merchants vs Amazon sellers', source: 'Onramp Funds 2025', changePositive: true },
          { name: 'Target LTV:CAC ratio', value: '3:1', context: 'Industry standard for sustainable DTC growth', source: 'Industry consensus', changePositive: true },
          { name: 'Target payback period', value: '6–12 months', context: 'For bootstrapped DTC brands', source: 'Onramp Funds 2025', changePositive: true },
        ],
      },
      {
        heading: 'Net Margin',
        body: `Net margin — the bottom line after all operating expenses, not just COGS — remains the most unforgiving benchmark. The median net margin for Shopify DTC operators sits at 10–13%, with top performers reaching 20%+. Amazon FBA sellers report slightly lower net margins of 5–15%, reflecting higher marketplace fees and the additional cost layer of FBA fulfilment.

These figures require significant context. Net margin calculations vary significantly in what they include. Many published figures exclude owner compensation, marketing agency fees, and software subscriptions — costs that can individually run 5–15% of revenue. When all operating costs are fully loaded, the "true" net margin for the typical small e-commerce operator is often 5–8 percentage points below reported figures.

The practical implication: if your reported net margin is 15%, your cash-flow-adjusted net margin — the money actually available for reinvestment or withdrawal — is likely 7–10%.`,
        metrics: [
          { name: 'Shopify DTC median net margin', value: '10–13%', context: 'Best performers reach 20%+', source: 'TrueProfit 5,000+ stores / Onramp Funds 2025', changePositive: false },
          { name: 'Amazon FBA median net margin', value: '5–15%', context: '73% of sellers above 10%', source: 'Jungle Scout 2025', changePositive: false },
          { name: 'EBITDA margin: small brands (median)', value: '8%+', context: 'At or above median for every revenue cohort', source: 'A2X/EcomCFO 2025', changePositive: true },
          { name: 'EBITDA margin: small brands improvement', value: '+57%', context: 'Under-$10M cohort improvement Q1–Q2 2025', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
        ],
      },
    ],
    calculatorCtas: [
      { label: 'Calculate your Shopify profit margin', slug: 'shopify-profit-margin' },
      { label: 'Calculate your true ROAS', slug: 'roas-calculator' },
      { label: 'Calculate your true CAC', slug: 'customer-acquisition-cost' },
    ],
  },

  {
    slug: 'amazon-fba-benchmarks-2025',
    title: 'Amazon FBA Profit Benchmarks 2025 — Margins, Fees, and ROAS by Category',
    metaTitle: 'Amazon FBA Profit Benchmarks 2025 | Margins, ROI, and FBA Fee Impact | Valcr',
    metaDescription: 'Amazon FBA profit margin benchmarks for 2025. Net margin, ROI on inventory, ROAS, and fee breakdown data from Jungle Scout\'s 2025 survey of 1,500 Amazon sellers.',
    keywords: [
      'amazon fba profit margin benchmarks 2025',
      'amazon seller average margin 2025',
      'amazon fba roi benchmark',
      'fba seller profit statistics 2025',
    ],
    quarter: 'Full Year 2025',
    publishDate: 'February 2025',
    summary: '89% of Amazon sellers report profitability in 2025, with 73% maintaining net margins above 10%. The median FBA seller net margin sits at approximately 15%, with enterprise brands outperforming significantly. Rising fulfilment fees and increased PPC competition remain the primary margin pressures.',
    dataSources: [
      { name: 'Jungle Scout State of the Amazon Seller 2025', url: 'https://www.junglescout.com/resources/reports/amazon-seller-report-2025/', n: '1,500' },
      { name: 'Jungle Scout State of the Amazon Seller 2024', url: 'https://www.junglescout.com/resources/reports/amazon-seller-report-2024/', n: '2,000' },
      { name: 'Onramp Funds Ecommerce Profit Margin Benchmarks 2025', url: 'https://www.onrampfunds.com/resources/10-profit-margin-benchmarks-for-ecommerce-2025', n: 'N/A' },
    ],
    sections: [
      {
        heading: 'Amazon FBA Profitability Overview',
        body: `The 2025 Amazon seller landscape shows improving aggregate profitability despite significant fee pressure. According to Jungle Scout's survey of 1,500 Amazon sellers and businesses, 89% of active FBA sellers reported being profitable — a figure that has remained broadly stable over the past three years.

The distribution of margins is highly skewed. Over half of profitable Amazon sellers report margins above 15%, while enterprise-level sellers ($1M+ annual revenue) significantly outperform the median. The key determinant of long-term profitability for FBA sellers is not category selection but margin discipline — specifically, maintaining a true net margin after all fees including PPC spend that justifies the inventory capital deployed.`,
        metrics: [
          { name: 'FBA sellers reporting profitability', value: '89%', context: 'Of active Amazon sellers surveyed', source: 'Jungle Scout 2025 (n=1,500)', changePositive: true },
          { name: 'FBA sellers with margin >10%', value: '73%', context: 'Of profitable sellers', source: 'Jungle Scout 2025', changePositive: true },
          { name: 'FBA sellers with margin >15%', value: '55%+', context: 'Of profitable sellers', source: 'Jungle Scout 2025', changePositive: true },
          { name: 'Median FBA net margin', value: '~15%', context: 'After all fees, pre-PPC adjustment', source: 'Jungle Scout 2025 / Onramp Funds 2025', changePositive: true },
        ],
      },
      {
        heading: 'The Full FBA Fee Stack',
        body: `Most Amazon profit calculators only account for the referral fee and FBA fulfilment fee. These two costs are the most visible but represent only two of six meaningful cost components in FBA unit economics.

The referral fee ranges from 8% (electronics) to 20% (jewellery), with most consumer goods categories at 15%. FBA fulfilment fees start at approximately $3.22 for small standard items and increase rapidly with weight and size. Together these two fees are what Amazon's own Revenue Calculator shows.

Missing from that calculator: monthly storage fees ($0.75–$2.40/cubic foot depending on season), inbound shipping ($0.50–$3+ per unit from supplier), prep and labelling ($0.50–$1.50), and PPC spend per unit — the cost most likely to determine whether a product is actually profitable. A product with $4 net margin after Amazon's visible fees becomes $0 at $4 average PPC cost per sale, which is common in competitive categories.`,
        metrics: [
          { name: 'Standard referral fee (most categories)', value: '15%', context: 'Of selling price on every sale', source: 'Amazon fee schedule 2025', changePositive: false },
          { name: 'FBA fulfilment fee — small standard', value: '$3.22+', context: 'Per unit; increases with size/weight', source: 'Amazon fee schedule 2025', changePositive: false },
          { name: 'Peak season storage (Oct–Dec)', value: '$2.40/cu ft', context: '3.2x standard rate — applies to all inventory', source: 'Amazon fee schedule 2025', changePositive: false },
          { name: 'Typical PPC cost per unit — competitive', value: '$1–$8', context: 'The cost Amazon\'s calculator omits', source: 'Industry analysis 2025', changePositive: false },
        ],
      },
    ],
    calculatorCtas: [
      { label: 'Calculate your true Amazon FBA profit', slug: 'amazon-fba-calculator' },
      { label: 'Calculate your break-even ROAS', slug: 'roas-calculator' },
    ],
  },

  {
    slug: 'shopify-benchmarks-q2-2025',
    title: 'Shopify Merchant Benchmarks — Q2 2025',
    metaTitle: 'Shopify Merchant Benchmark Report Q2 2025 | Margins, ROAS, CAC | Valcr',
    metaDescription: 'Shopify merchant profit margin, ROAS, and CAC benchmarks for Q2 2025. Data from 5,000+ Shopify stores — gross margin, net margin, ad spend efficiency, and return rates.',
    keywords: [
      'shopify merchant benchmarks 2025',
      'shopify average profit margin q2 2025',
      'shopify store performance benchmarks',
      'dtc shopify metrics benchmark report q2',
    ],
    quarter: 'Q2 2025',
    publishDate: 'September 2025',
    summary: 'Shopify merchants showed divergent performance in Q2 2025, with gross margins holding steady at 44–47% despite rising COGS pressure, while net margins came under pressure from increasing ad costs. Small brands (under $10M) outperformed mid-market on profitability efficiency, benefiting from leaner cost structures and better creative discipline.',
    dataSources: [
      { name: 'TrueProfit — 5,000+ Shopify Stores Analysis 2025–2026', url: 'https://trueprofit.io/blog/ecommerce-profit-margins', n: '5,000+' },
      { name: 'A2X / Ecom CFO Ecommerce P&L Benchmark Report Q2 2025', url: 'https://www.a2xaccounting.com/ecommerce-accounting-hub/q2-2025-report', n: '20 brands' },
      { name: 'Chargeflow Verified Shopify Statistics 2024–2025', url: 'https://www.chargeflow.io/blog/shopify-statistics', n: 'N/A' },
    ],
    sections: [
      {
        heading: 'Gross Margin Performance',
        body: `Shopify merchant gross margins demonstrated notable resilience in Q2 2025. Despite tariff-driven cost increases on imported goods affecting multiple product categories, the median gross margin across 5,000+ Shopify stores held at approximately 45% — essentially flat with Q1 and the prior year. Operators absorbed cost pressure primarily through price increases and strategic SKU rationalisation, protecting margins rather than allowing them to compress.

The A2X/Ecom CFO P&L benchmark report, which aggregates detailed P&L data from 20 real DTC brands, confirmed this pattern: gross margin held "remarkably steady across all cohorts despite tariff headwinds — mostly flat to +2.38 points." This is a meaningful signal — it suggests e-commerce operators have pricing power sufficient to pass through cost increases in the current environment.`,
        metrics: [
          { name: 'Median Shopify gross margin', value: '44–47%', context: 'Across 5,000+ stores; broadly flat year-over-year', source: 'TrueProfit 2025–2026', changePositive: true },
          { name: 'Gross margin YoY change (mid-market)', value: '+2.38pp', context: 'Despite tariff headwinds', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
        ],
      },
      {
        heading: 'Ad Spend and ROAS',
        body: `The headline story of Q2 2025 for Shopify merchants was the widening gap between ad spend and ROAS. Many brands deployed significantly more advertising dollars in Q2 while seeing limited incremental revenue impact. The underlying cause: Meta CPM inflation of 15–22% across most DTC verticals, compressing returns for brands that did not offset with improved creative performance.

The result was a double squeeze for mid-market brands — fixed marketing costs (agencies, creative production, in-house headcount) rose 31.83% on average while ROAS declined approximately 9%. This combination directly compressed EBITDA for the $10M–$50M cohort.

Smaller brands bucked the trend with a 16.51% ROAS improvement — the result of founder-led creative iteration, greater flexibility in channel allocation, and leaner overhead structures that larger brands struggle to replicate.`,
        metrics: [
          { name: 'ROAS change — mid-market brands', value: '−9%', context: '$10M–$50M revenue cohort, Q2 2025', source: 'A2X/EcomCFO Q2 2025', changePositive: false },
          { name: 'ROAS change — small brands', value: '+16.5%', context: 'Under-$10M revenue cohort, Q2 2025', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
          { name: 'Fixed marketing cost increase (mid-market)', value: '+31.8%', context: 'Agencies, creative, headcount', source: 'A2X/EcomCFO Q2 2025', changePositive: false },
          { name: 'Email marketing conversion rate', value: '4.29%', context: 'Highest conversion rate for Shopify stores by channel', source: 'Chargeflow/Shopify Stats 2025', changePositive: true },
        ],
      },
      {
        heading: 'EBITDA and Profitability',
        body: `The EBITDA picture in Q2 2025 was the sharpest illustration of the growing performance gap between small and mid-market e-commerce brands. Small brands (under $10M) reported a 56.95% EBITDA improvement on average, driven by overhead discipline — G&A as a percentage of revenue fell from 25.36% to 23.00%, and fixed marketing spend fell alongside it. The combination of more efficient paid spend and leaner overhead drove the improvement.

Mid-market brands moved in the opposite direction. The double squeeze of higher ad costs and lower ROAS produced meaningful EBITDA compression. Larger brands ($50M+) showed average improvement of 12.36%, but the median was -0.92% — a few high performers pulled the average up while the typical large brand got slightly less profitable.

The practical benchmark: if your EBITDA margin is above 8%, you are at or above the median in every revenue cohort. Below 0%, you are in the bottom 5% regardless of size.`,
        metrics: [
          { name: 'EBITDA improvement — small brands', value: '+57%', context: 'Under-$10M cohort, average improvement', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
          { name: 'EBITDA margin benchmark (median)', value: '8%+', context: 'At or above median for all revenue cohorts', source: 'A2X/EcomCFO 2025', changePositive: true },
          { name: 'G&A as % of revenue — small brands', value: '23%', context: 'Down from 25.36% prior year', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
          { name: 'Revenue growth — top 5% of brands', value: '31–57%', context: 'Regardless of cohort size', source: 'A2X/EcomCFO Q2 2025', changePositive: true },
        ],
      },
    ],
    calculatorCtas: [
      { label: 'Calculate your Shopify profit margin', slug: 'shopify-profit-margin' },
      { label: 'Calculate your break-even ROAS', slug: 'roas-calculator' },
      { label: 'Calculate your cash flow runway', slug: 'cash-flow-runway' },
    ],
  },
]

export const getReport = (slug: string) =>
  INDUSTRY_REPORTS.find(r => r.slug === slug)
