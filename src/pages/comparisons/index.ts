// src/pages/comparisons/index.ts
// Comparison page definitions - one per major search intent
// These pages target "X vs Y" and "alternative to X" queries
// which have extremely high purchase intent and low competition
// for a new domain.

export interface ComparisonPage {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  heroHeadline: string
  heroSubline: string
  competitorName: string
  competitorType: 'spreadsheet' | 'template' | 'tool'
  calculatorSlug: string
  tableRows: { feature: string; valcr: string; competitor: string; valcrWins: boolean }[]
  sections: { heading: string; body: string }[]
  faqItems: { q: string; a: string }[]
}

export const COMPARISON_PAGES: ComparisonPage[] = [
  {
    slug: 'shopify-profit-margin-calculator-vs-google-sheets',
    title: 'Shopify Profit Margin Calculator vs Google Sheets',
    metaTitle: 'Shopify Profit Margin Calculator vs Google Sheets — Which Is Better? | Valcr',
    metaDescription: 'Valcr vs Google Sheets for Shopify profit margin calculation. See why a dedicated calculator beats manual spreadsheet formulas when you need to include all 6 fee types.',
    keywords: [
      'shopify profit margin calculator vs google sheets',
      'shopify profit formula google sheets',
      'alternative to google sheets profit calculator shopify',
      'shopify margin calculator better than excel',
    ],
    heroHeadline: 'Shopify Profit Margin Calculator vs Google Sheets',
    heroSubline: 'Spreadsheet formulas only count two costs. Shopify charges six. Here\'s what the gap costs you.',
    competitorName: 'Google Sheets',
    competitorType: 'spreadsheet',
    calculatorSlug: 'shopify-profit-margin',
    tableRows: [
      { feature: 'Shopify plan cost included', valcr: '✓ Always included', competitor: '✗ Manually added (usually forgotten)', valcrWins: true },
      { feature: 'Transaction fees (non-Shopify Payments)', valcr: '✓ Calculated automatically', competitor: '✗ Rarely set up correctly', valcrWins: true },
      { feature: 'Payment processing (2.9% + $0.30)', valcr: '✓ Per-transaction calculation', competitor: '⚠ Sometimes included', valcrWins: true },
      { feature: 'App subscription costs per order', valcr: '✓ Amortized per unit', competitor: '✗ Almost never included', valcrWins: true },
      { feature: 'Return rate impact', valcr: '✓ Built into calculation', competitor: '✗ Separate manual step', valcrWins: true },
      { feature: 'Blended ad spend per unit', valcr: '✓ Included in net margin', competitor: '✗ Tracked separately', valcrWins: true },
      { feature: 'Setup time', valcr: '✓ 0 minutes', competitor: '✗ 30–90 minutes', valcrWins: true },
      { feature: 'Mobile friendly', valcr: '✓ Works on any device', competitor: '⚠ Google Sheets app required', valcrWins: true },
      { feature: 'Custom formulas', valcr: '✗ Not customizable', competitor: '✓ Fully customizable', valcrWins: false },
      { feature: 'Team collaboration', valcr: '✗ Single user', competitor: '✓ Shared access', valcrWins: false },
    ],
    sections: [
      {
        heading: 'The six costs most Google Sheets templates miss',
        body: `The most common Shopify profit margin formula found in spreadsheets is: (Revenue − COGS) ÷ Revenue. It is a reasonable starting point and will give you the wrong number almost every time.

A complete Shopify profit margin calculation requires six inputs, not two. Platform fees (your Shopify plan cost amortized per order), transaction fees (0.5–2% if you are not on Shopify Payments), payment processing (2.9% + $0.30 per transaction on Shopify Payments), app subscription costs per unit sold, return rate losses, and blended ad spend per unit.

When you add all six, the typical Shopify store's "40% gross margin" becomes 18–24% true net margin. That gap — 16 to 22 percentage points — is the number most operators do not know until they are already in trouble.

Valcr's Shopify Profit Margin Calculator accounts for all six costs. You enter your numbers once. It returns the full picture in under 30 seconds. No formula setup, no cell referencing, no accidentally deleting a dependency.`,
      },
      {
        heading: 'When Google Sheets is the better choice',
        body: `Google Sheets wins when you need to track dozens of SKUs simultaneously, share access with a finance team, build custom dashboards, or integrate with other spreadsheet-based workflows. If you have a bookkeeper, an accountant, or a team managing a spreadsheet-based P&L, stay there.

Valcr is for the operator who needs the correct answer right now — before a product launch, before setting ad budget, before deciding whether a promotion is profitable. The calculation that takes 90 minutes to set up in Sheets takes 30 seconds in Valcr, and it will never have a broken formula or a cell that was accidentally overwritten.`,
      },
      {
        heading: 'Why the missing costs matter so much',
        body: `Consider a Shopify store with $50,000 monthly revenue. A typical Google Sheets margin calculation shows 38% gross margin — $19,000 in profit. Add the six fee categories properly: Shopify Business plan $299 ($6 per order at 50 orders/month), transaction fees 1% ($500), payment processing ($1,450), apps averaging $400/month ($8 per order), 8% return rate ($1,520 absorbed), $8,000 blended ad spend allocated per unit. True net margin: approximately 17% — $8,500 in actual profit. The spreadsheet overestimated by $10,500 per month, $126,000 per year.

The decisions made on the wrong number — hiring, inventory, ad spend — are the decisions that create cash flow crises that look inexplicable from the outside.`,
      },
    ],
    faqItems: [
      {
        q: 'Can I use both Valcr and Google Sheets?',
        a: 'Yes, and this is actually a good approach. Use Valcr to run quick pre-decision calculations and reality-checks on your margin assumptions, then use Google Sheets for your actual monthly P&L tracking and SKU-level analysis where you want persistent data and collaboration.',
      },
      {
        q: 'Does Valcr include the Shopify Payments rate vs third-party processor difference?',
        a: 'Yes. The calculator lets you specify your payment processing rate (2.9% + $0.30 for Shopify Payments) and your transaction fee separately (0% on Shopify Payments, 0.5–2% on other plans with third-party processors). Both are factored into the net margin calculation.',
      },
      {
        q: 'Is the Valcr calculator free?',
        a: 'All 20 calculators at valcr.site are free with no account required. Pro features (benchmark comparisons, saved calculations, PDF exports) require a $9/month subscription.',
      },
      {
        q: 'What about the Shopify Profit Margin template on Shopify\'s own website?',
        a: "Shopify's native dashboard shows revenue and COGS-based gross margin. It does not calculate net margin after all fee types, and it cannot show you where your margin sits relative to other stores in your category. Valcr does both.",
      },
    ],
  },

  {
    slug: 'landed-cost-calculator-vs-excel-template',
    title: 'True Landed Cost Calculator vs Excel Templates',
    metaTitle: 'True Landed Cost Calculator vs Excel Template — Valcr vs Spreadsheet | Valcr',
    metaDescription: 'Compare using a dedicated landed cost calculator vs Excel templates. Why most landed cost spreadsheets miss duties, payment processing, and return rate — and what that costs you.',
    keywords: [
      'landed cost calculator vs excel template',
      'true landed cost excel template alternative',
      'landed cost formula spreadsheet',
      'import landed cost calculator better than excel',
    ],
    heroHeadline: 'True Landed Cost Calculator vs Excel Templates',
    heroSubline: 'Most landed cost formulas stop at freight. The real cost includes six more line items that consistently get missed.',
    competitorName: 'Excel Templates',
    competitorType: 'template',
    calculatorSlug: 'true-landed-cost',
    tableRows: [
      { feature: 'Product cost', valcr: '✓ Included', competitor: '✓ Included', valcrWins: false },
      { feature: 'Inbound freight per unit', valcr: '✓ Included', competitor: '✓ Usually included', valcrWins: false },
      { feature: 'Customs duty rate (by HS code)', valcr: '✓ Applied correctly to declared value', competitor: '⚠ Sometimes included, often wrong', valcrWins: true },
      { feature: 'Payment processing (per sale)', valcr: '✓ Calculated on selling price', competitor: '✗ Almost never included', valcrWins: true },
      { feature: 'Return rate cost', valcr: '✓ Amortized across all units', competitor: '✗ Rarely included', valcrWins: true },
      { feature: 'True gross margin output', valcr: '✓ After all 6 cost components', competitor: '⚠ After 2–3 components only', valcrWins: true },
      { feature: 'Setup time', valcr: '✓ 0 minutes', competitor: '✗ 20–60 minutes', valcrWins: true },
      { feature: 'Multi-SKU batch analysis', valcr: '✗ One product at a time', competitor: '✓ Unlimited rows', valcrWins: false },
    ],
    sections: [
      {
        heading: 'Why most landed cost calculations are understated by 15–30%',
        body: `The landed cost formula most Excel templates use is: Product Cost + Freight + Duties. This is a solid foundation that still leaves out the costs that actually determine whether a product is profitable to sell.

Payment processing is charged on every sale — 2.9% + $0.30 on Shopify, 3% + various flat fees on Amazon. On a $35 product, that is $1.32 per unit that your landed cost template does not include. At 1,000 units per month, that is $1,320 per month in costs you did not see coming.

Returns are even more significant. A 10% return rate on 1,000 units means 100 returns. Each return involves the original product cost, return shipping, and processing time. Spread across all 1,000 units, that adds a meaningful per-unit cost that changes your margin calculation — especially in high-return categories like apparel.`,
      },
      {
        heading: 'The true landed cost formula',
        body: `Complete landed cost = Product cost + (Product cost × customs duty rate) + inbound freight per unit + cargo insurance per unit + prep and labeling (if applicable) + (selling price × payment processing rate + flat fee) + (product cost × return rate × return absorption factor).

This is what Valcr calculates. When you run it against a simplified freight-plus-COGS estimate, the difference is typically 8–18% of the selling price — the gap between thinking you have a 45% margin and actually having a 27% margin.`,
      },
    ],
    faqItems: [
      {
        q: 'What customs duty rate should I enter?',
        a: 'Look up your product\'s HS (Harmonized System) code in the US International Trade Commission tariff schedule at usitc.gov. Consumer goods typically range from 0–20%. Your freight forwarder can also provide this — it is on your commercial invoice.',
      },
      {
        q: 'Does this work for Amazon FBA landed cost?',
        a: 'Valcr has a separate Amazon FBA Calculator that accounts for the full FBA cost stack: referral fee, fulfillment fee, storage, inbound shipping, and PPC per unit. The True Landed Cost calculator is best suited for Shopify/WooCommerce DTC products.',
      },
      {
        q: 'What is a good landed cost as a percentage of selling price?',
        a: 'For most e-commerce categories, a healthy landed cost is 35–55% of selling price, leaving 45–65% gross margin before operating expenses. Electronics and commodities run 75–85% landed cost (15–25% gross margin). Beauty and skincare often run 25–40% landed cost (60–75% gross margin).',
      },
    ],
  },

  {
    slug: 'roas-calculator-vs-manual-formula',
    title: 'ROAS Calculator vs Manual Formula — Why Break-Even ROAS Changes Everything',
    metaTitle: 'ROAS Calculator vs Manual Formula | Break-Even ROAS Explained | Valcr',
    metaDescription: 'Using ROAS without knowing your break-even ROAS is like driving without knowing how much gas you have. Valcr calculates both. Here\'s why it matters.',
    keywords: [
      'roas calculator vs manual formula',
      'break even roas calculator',
      'roas formula spreadsheet alternative',
      'what is break even roas calculator',
    ],
    heroHeadline: 'ROAS Calculator vs Manual Formula',
    heroSubline: 'A 4x ROAS sounds great. If your break-even ROAS is 4.5x, you\'re losing money on every sale. Know the floor first.',
    competitorName: 'Manual ROAS formula',
    competitorType: 'spreadsheet',
    calculatorSlug: 'roas-calculator',
    tableRows: [
      { feature: 'ROAS calculation', valcr: '✓ Revenue ÷ Ad Spend', competitor: '✓ Revenue ÷ Ad Spend', valcrWins: false },
      { feature: 'Break-even ROAS', valcr: '✓ 1 ÷ (1 − total cost %)', competitor: '✗ Manual calculation required', valcrWins: true },
      { feature: 'Profit margin on ad revenue', valcr: '✓ Calculated automatically', competitor: '✗ Separate step', valcrWins: true },
      { feature: 'COGS included in break-even', valcr: '✓ Yes', competitor: '⚠ If manually added', valcrWins: true },
      { feature: 'Platform fees in break-even', valcr: '✓ Yes', competitor: '✗ Rarely', valcrWins: true },
      { feature: 'LTV adjustment option', valcr: '✓ Repeat purchase modifier', competitor: '✗ Requires separate model', valcrWins: true },
    ],
    sections: [
      {
        heading: 'Why ROAS alone is the wrong metric to optimize for',
        body: `ROAS (Revenue ÷ Ad Spend) tells you how much revenue your ads generate. It does not tell you whether that revenue is profitable. A 4x ROAS on a product with 20% gross margin generates zero net profit — your COGS alone consumes 80% of revenue, and your 25% ad cost brings you to 105% of revenue. You are losing money.

Break-even ROAS is calculated as: 1 ÷ (1 − total cost percentage). If your total variable costs (COGS + platform fees + payment processing + shipping) are 72% of revenue, your break-even ROAS is 1 ÷ 0.28 = 3.57x. Every campaign below 3.57x is unprofitable regardless of volume. This is the number that determines your bidding floor.

The median ROAS for ecommerce brands in 2024 was 2.04 — meaning half of all ecommerce businesses were operating below a 2:1 ratio. Without knowing their break-even ROAS, most of those operators had no idea whether their campaigns were profitable or not.`,
      },
      {
        heading: 'The three ROAS numbers every advertiser should track',
        body: `Break-even ROAS: The floor below which every sale costs you money. Calculate this first. Anything below it means you are paying to lose.

Target ROAS: Break-even × 1.3–1.5. This is your campaign target that builds in a margin buffer and covers your fixed operating costs.

Efficiency ceiling: The point above which you are leaving growth on the table. If your target is 4x and you are consistently hitting 8x, you are under-spending on acquisition — potentially missing customers who would have been profitable at 5x.

Most operators know only their actual ROAS. Valcr gives you all three.`,
      },
    ],
    faqItems: [
      {
        q: 'What is a good ROAS for Shopify stores in 2025?',
        a: `The average ecommerce ROAS was approximately 2.87x in 2025. But "good" entirely depends on your margin structure. At 45% gross margin, break-even ROAS is 1.82x — so 2.87x would be healthy. At 25% gross margin, break-even is 4x — so 2.87x would mean you\'re losing money on every ad-acquired customer.`,
      },
      {
        q: 'How is break-even ROAS different from target ROAS?',
        a: 'Break-even ROAS is the floor — the minimum to not lose money on ad spend. Target ROAS adds a buffer above break-even to cover fixed costs and generate real profit. A typical target is break-even + 30–50%.',
      },
      {
        q: 'Does this work for Amazon Sponsored Products ROAS?',
        a: 'Yes. Enter your Amazon referral fee + FBA fee + product cost as your total cost percentage. The break-even ROAS will reflect your true floor for Amazon PPC profitability. Note that Amazon reports ACoS (Advertising Cost of Sales) rather than ROAS — they are inverses: ROAS = 1 ÷ ACoS.',
      },
    ],
  },

  {
    slug: 'amazon-fba-calculator-vs-amazon-revenue-calculator',
    title: 'Valcr Amazon FBA Calculator vs Amazon\'s Own Revenue Calculator',
    metaTitle: 'Valcr Amazon FBA Calculator vs Amazon Revenue Calculator | Which Is Better? | Valcr',
    metaDescription: 'Amazon\'s built-in Revenue Calculator only covers referral fees and FBA fees. Valcr adds PPC cost per unit, inbound shipping, prep costs, and storage — the costs that determine real profit.',
    keywords: [
      'amazon fba calculator vs amazon revenue calculator',
      'better amazon fba profit calculator',
      'amazon fba calculator that includes ppc',
      'true amazon fba profit calculator alternative',
    ],
    heroHeadline: 'Valcr Amazon FBA Calculator vs Amazon\'s Revenue Calculator',
    heroSubline: 'Amazon shows you two fees. Your profit depends on six. Here\'s what\'s missing from their calculator.',
    competitorName: "Amazon's Revenue Calculator",
    competitorType: 'tool',
    calculatorSlug: 'amazon-fba-calculator',
    tableRows: [
      { feature: 'Referral fee (15%)', valcr: '✓', competitor: '✓', valcrWins: false },
      { feature: 'FBA fulfillment fee', valcr: '✓', competitor: '✓', valcrWins: false },
      { feature: 'Monthly storage fee per unit', valcr: '✓ Allocated per unit', competitor: '✗ Not included', valcrWins: true },
      { feature: 'Inbound shipping cost', valcr: '✓ Per unit calculation', competitor: '✗ Not included', valcrWins: true },
      { feature: 'Prep and labeling cost', valcr: '✓ Optional input', competitor: '✗ Not included', valcrWins: true },
      { feature: 'PPC / Sponsored Products cost per unit', valcr: '✓ Critical input', competitor: '✗ Never included', valcrWins: true },
      { feature: 'True net margin output', valcr: '✓ After all 6 components', competitor: '✗ Shows "estimated profit" without 4 key costs', valcrWins: true },
      { feature: 'ROI on inventory', valcr: '✓ Calculated automatically', competitor: '✗ Not shown', valcrWins: true },
    ],
    sections: [
      {
        heading: 'What Amazon\'s calculator does not show you',
        body: `Amazon's Revenue Calculator is useful for a quick check on whether referral fees and FBA fulfillment costs leave room for profit. It is not a true profitability calculator.

The four costs Amazon does not include are the ones that most commonly make profitable-looking products unprofitable in practice. Monthly storage: at $0.75/cubic foot (October–December rate $2.40), slow-moving inventory can accumulate $0.50–$2+ per unit in storage fees per quarter. Inbound shipping: getting inventory from your supplier to Amazon FBA centres costs $0.50–$3+ per unit depending on origin, weight, and method. Prep costs: labeling, polybagging, inspection — typically $0.50–$1.50 per unit for third-party prep. PPC spend: the most important omission. In competitive categories, PPC cost per unit sold is $1–$8. A product with a $4 net margin from Amazon's calculator becomes $0 net margin at $4 PPC per unit — and the product cannot rank without that PPC spend.`,
      },
      {
        heading: 'The complete FBA profit formula',
        body: `True FBA Net Profit = Selling Price − (Referral Fee + FBA Fulfillment Fee + Monthly Storage per Unit + Inbound Shipping per Unit + Prep Cost per Unit + PPC Spend per Unit + Product Cost).

Run this before you place any inventory purchase order. If true net profit is below $3–4 per unit at your target price, the product is marginal — any fee increase, any storage backup, any increase in PPC competition eliminates the profit entirely.`,
      },
    ],
    faqItems: [
      {
        q: 'What is a good net margin for Amazon FBA products?',
        a: 'Industry benchmarks from Jungle Scout\'s 2025 survey of 1,500 Amazon sellers show that 73% of profitable sellers achieve net margins above 10%, with the median around 15%. Margins above 20% after all fees are considered strong for FBA.',
      },
      {
        q: 'How do I calculate PPC cost per unit?',
        a: 'Take your total monthly PPC spend for a product and divide by units sold from PPC-attributed orders. If you spend $800 on Sponsored Products and drive 200 units sold through ads, your PPC cost per unit is $4. Include this in your FBA profit calculation.',
      },
      {
        q: 'Does Valcr account for the Q4 storage fee increase?',
        a: 'The calculator lets you input your storage fee rate directly. Amazon charges $0.75/cubic foot January–September and $2.40/cubic foot October–December. Enter the applicable rate for your planning period.',
      },
    ],
  },

  {
    slug: 'cac-calculator-vs-spreadsheet',
    title: 'Customer Acquisition Cost Calculator vs Spreadsheet — Why Ad Spend ÷ Customers Is Wrong',
    metaTitle: 'CAC Calculator vs Spreadsheet Formula | True Customer Acquisition Cost | Valcr',
    metaDescription: 'Dividing ad spend by new customers underestimates your true CAC by 40% or more. Valcr\'s CAC calculator includes agency fees, tools, and team time. See the real number.',
    keywords: [
      'customer acquisition cost calculator vs spreadsheet',
      'true cac calculator ecommerce',
      'how to calculate real cac shopify',
      'cac formula better than spreadsheet',
    ],
    heroHeadline: 'CAC Calculator vs Spreadsheet Formula',
    heroSubline: 'Ad spend ÷ new customers = your ad cost per customer. That\'s not your CAC. The real number is 40% higher.',
    competitorName: 'Spreadsheet formula (ad spend ÷ customers)',
    competitorType: 'spreadsheet',
    calculatorSlug: 'customer-acquisition-cost',
    tableRows: [
      { feature: 'Paid advertising spend', valcr: '✓', competitor: '✓', valcrWins: false },
      { feature: 'Agency/freelancer management fees', valcr: '✓', competitor: '✗ Almost never included', valcrWins: true },
      { feature: 'Influencer and affiliate costs', valcr: '✓', competitor: '✗ Tracked separately if at all', valcrWins: true },
      { feature: 'Attribution and analytics tool cost', valcr: '✓', competitor: '✗ Not included', valcrWins: true },
      { feature: 'Marketing team time allocation', valcr: '✓', competitor: '✗ Never included', valcrWins: true },
      { feature: 'LTV:CAC ratio output', valcr: '✓ Automatic', competitor: '✗ Requires separate LTV calculation', valcrWins: true },
      { feature: 'Payback period in months', valcr: '✓ Automatic', competitor: '✗ Separate step', valcrWins: true },
    ],
    sections: [
      {
        heading: 'The five costs missing from your CAC calculation',
        body: `The most common CAC calculation in e-commerce: total monthly ad spend ÷ new customers acquired. This number is useful. It is also consistently 30–50% below the true cost of customer acquisition.

Five cost categories are routinely excluded. Agency and freelancer fees: if you pay $3,000/month to a performance marketing agency, that cost belongs in CAC. It enabled those customers as much as the ad spend did. Influencer and affiliate fees: a $5,000 influencer campaign that drove 50 new customers added $100 to your CAC per customer, but most brands do not allocate this to their acquisition metric. Tool subscriptions: your attribution software, landing page builder, and creative testing tool are all acquisition costs. They do not exist for any other purpose. Marketing team time: even at founder level, hours spent on acquisition activities have an opportunity cost. Email platform cost for acquisition sequences: the proportion of your email platform used for lead nurturing and welcome series is an acquisition cost.

Add all five and the true CAC is almost always 30–50% above the ad-only figure.`,
      },
      {
        heading: 'Why LTV:CAC ratio matters more than CAC alone',
        body: `A $60 CAC is excellent if LTV is $300. It is catastrophic if LTV is $55. CAC in isolation is not an actionable metric — it requires LTV context to mean anything.

The industry standard target is a 3:1 LTV:CAC ratio. Below 1:1 means you lose money acquiring every customer. At 3:1 you have a sustainable growth model. Above 5:1 often means under-investment in acquisition.

Valcr calculates LTV:CAC ratio automatically once you enter both your complete CAC and your average customer LTV. It also outputs payback period — the number of months until a customer's cumulative revenue covers the cost of acquiring them. Target payback under 12 months for most bootstrapped DTC brands.`,
      },
    ],
    faqItems: [
      {
        q: 'What is a good CAC for a Shopify DTC brand?',
        a: 'CAC benchmarks vary significantly by product category and AOV. Low-ticket items ($20–50): target CAC $15–35. Mid-ticket ($50–150): $30–75. Premium ($150+): $60–200+. The more important benchmark is your LTV:CAC ratio — aim for 3:1 or higher regardless of the absolute CAC number.',
      },
      {
        q: 'Should I include organic acquisition in my CAC calculation?',
        a: 'There are two valid approaches. Blended CAC divides all marketing costs (paid + organic) by all new customers. Paid CAC divides only paid costs by paid-attributed customers. Track both — blended CAC tells you overall acquisition efficiency, paid CAC tells you your paid channel performance.',
      },
    ],
  },

  {
    slug: 'etsy-fee-calculator-vs-etsy-built-in-stats',
    title: 'Etsy Fee Calculator vs Etsy\'s Built-In Stats — What Etsy Doesn\'t Show You',
    metaTitle: 'Etsy Fee Calculator vs Etsy Stats | True Etsy Profit Per Sale | Valcr',
    metaDescription: 'Etsy\'s Stats page shows revenue. It does not calculate your real profit after all three fee types. Valcr\'s Etsy fee calculator shows what you actually keep per sale.',
    keywords: [
      'etsy fee calculator vs etsy stats',
      'how to calculate true etsy profit',
      'etsy profit calculator better than etsy dashboard',
      'etsy fees all types calculator',
    ],
    heroHeadline: 'Etsy Fee Calculator vs Etsy\'s Built-In Dashboard',
    heroSubline: 'Etsy charges three separate fees on every sale — including one on your shipping charge most sellers forget.',
    competitorName: "Etsy's Stats dashboard",
    competitorType: 'tool',
    calculatorSlug: 'etsy-fee-calculator',
    tableRows: [
      { feature: 'Listing fee ($0.20)', valcr: '✓', competitor: '✓ Shown in payment account', valcrWins: false },
      { feature: 'Transaction fee (6.5% of item + shipping)', valcr: '✓ Applied to full payment including shipping', competitor: '⚠ Shown in total but not broken out per sale', valcrWins: true },
      { feature: 'Payment processing fee (3% + $0.25)', valcr: '✓ Per transaction', competitor: '⚠ Shown in aggregate', valcrWins: true },
      { feature: 'Offsite Ads fee (12–15%)', valcr: '✓ Optional input', competitor: '⚠ Shown separately, not in profit view', valcrWins: true },
      { feature: 'Net profit per sale output', valcr: '✓ After all fees and COGS', competitor: '✗ Not calculated', valcrWins: true },
      { feature: 'Net margin %', valcr: '✓', competitor: '✗ Not shown', valcrWins: true },
    ],
    sections: [
      {
        heading: 'The Etsy fee most sellers forget: transaction fee on shipping',
        body: `Etsy's transaction fee is 6.5% of the total amount the buyer pays — including shipping charges. If you charge $35 for an item and $6 for shipping, Etsy calculates its fee on $41. This adds $0.39 in fees on shipping revenue that most sellers do not account for.

At scale, this adds up. A seller charging $6 shipping on 500 orders per month incurs $195 in transaction fees on shipping alone — nearly $2,400 per year that most Etsy sellers have never calculated explicitly.

Valcr's Etsy Fee Calculator applies the transaction fee correctly to the full payment amount, then adds payment processing on top, then adds your listing fee. The result is your true net profit per sale — not the revenue number Etsy shows in your stats dashboard.`,
      },
      {
        heading: 'The Offsite Ads trap — when you can\'t opt out',
        body: `Etsy's Offsite Ads programme places your listings on Google, Facebook, and other platforms and charges you 15% of the order value (12% if you\'ve made over $10,000 on Etsy) when a sale results. Sellers above $10,000 in annual Etsy revenue cannot opt out.

This fee is charged in addition to your transaction and processing fees. On a $42 total order (item + shipping), it adds $6.30 in fees — before the 6.5% transaction fee and 3% processing fee. Total Etsy fees on that sale: $6.30 + $2.73 + $1.26 + $0.25 listing = $10.54. That is 25% of the order value in fees alone.

Know your numbers before you scale Etsy traffic through any external channel.`,
      },
    ],
    faqItems: [
      {
        q: 'Does Etsy show me my profit per item anywhere?',
        a: 'No. Etsy\'s Stats dashboard shows revenue, orders, and fee totals, but does not calculate per-item profit or net margin. It also does not include your COGS or materials cost. You have to calculate true profit externally — which is exactly what Valcr\'s Etsy fee calculator does.',
      },
      {
        q: 'What is a good profit margin on Etsy?',
        a: 'Healthy Etsy margins vary significantly by product type. Handmade goods with $10–20 material cost sold at $45–60 can achieve 40–55% net margin after all fees. Digital products have near-zero COGS and can achieve 80%+ margins. Physical items with high material cost and labour often run 20–35% net margin after fees.',
      },
    ],
  },
]

export const getComparisonPage = (slug: string) =>
  COMPARISON_PAGES.find(p => p.slug === slug)
