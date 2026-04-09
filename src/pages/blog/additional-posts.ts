// ============================================================
// MISSING BLOG POSTS — Add these to your existing posts.ts
// Copy each object into the BLOG_POSTS array in posts.ts
// These cover the remaining 11 calculators that had no blog post
// ============================================================

// ── 1. Break-Even Units ───────────────────────────────────────────────────────
export const POST_BREAK_EVEN_UNITS = {
  slug: 'break-even-units-guide',
  title: 'Break-Even Analysis: How Many Units You Need to Sell Before You Profit',
  excerpt: 'Running a promotion, testing a new product, or scaling a campaign? Break-even units tells you the exact sales volume you need before you make a single dollar of profit.',
  category: 'Margins',
  readTime: '6 min read',
  date: 'Mar 18, 2025',
  keywords: ['break even units calculator', 'break even analysis ecommerce', 'how many units to break even', 'contribution margin formula'],
  calculatorSlug: 'break-even-units',
  calculatorCta: 'Calculate your break-even units',
  content: `
<h2>Why Break-Even Analysis Is the Most Underused Tool in E-Commerce</h2>
<p>Most store owners make product and campaign decisions by gut feel. They launch a new SKU, run a sale, or scale an ad set and wait to see if the numbers look good at the end of the month. Break-even analysis gives you a specific, pre-launch answer: how many units do I need to sell before I stop losing money on this?</p>
<p>That question sounds basic. The answer is frequently surprising.</p>

<h2>The Two Metrics You Need</h2>
<p>Break-even analysis requires two inputs: your fixed costs for the period and your contribution margin per unit.</p>
<p><strong>Fixed costs</strong> are costs that do not change with sales volume. Your Shopify subscription, warehouse lease, and salaries are fixed. You pay them whether you sell 10 units or 10,000.</p>
<p><strong>Contribution margin per unit</strong> is selling price minus all variable costs per unit — product cost, payment processing, shipping, and any variable platform fees. Every unit you sell contributes this amount toward covering your fixed costs. After fixed costs are covered, the contribution margin becomes profit.</p>

<h2>The Break-Even Formula</h2>
<p><strong>Break-Even Units = Total Fixed Costs ÷ Contribution Margin Per Unit</strong></p>
<p>Example: Monthly fixed costs of $4,200. Selling price $49.99. Variable costs per unit $22 (COGS $16, shipping $4, processing $2). Contribution margin = $49.99 − $22 = $27.99.</p>
<p>Break-even = $4,200 ÷ $27.99 = 150 units per month.</p>
<p>You need to sell 151 units before you make a single dollar of profit. Sales 1–150 are paying down fixed costs. Unit 151 and every one after it contributes $27.99 to your bottom line.</p>

<h2>The Contribution Margin Ratio</h2>
<p>The contribution margin ratio (CMR) expresses contribution margin as a percentage of selling price: $27.99 ÷ $49.99 = 56%. This is more useful than the raw unit number when comparing products or evaluating pricing changes.</p>
<p><strong>Break-Even Revenue = Fixed Costs ÷ CMR</strong></p>
<p>Using our example: $4,200 ÷ 0.56 = $7,500 in revenue to break even. You can use this to check whether your revenue target is realistic for your cost structure.</p>

<h2>Using Break-Even for Promotions</h2>
<p>Discounts reduce contribution margin directly. A 20% discount on a $49.99 product brings selling price to $39.99. Variable costs stay at $22. Contribution margin drops from $27.99 to $17.99 — a 36% reduction. Your break-even units jump from 150 to 234. You need to sell 56% more units just to reach the same profit as before the promotion.</p>
<p>This is why promotions that do not drive sufficient volume increase damage your profitability even when revenue goes up. Always calculate break-even units at the promotional price before committing to a discount.</p>

<h2>The Break-Even Point for Ad Campaigns</h2>
<p>For ad campaigns, treat your ad spend as a fixed cost for the period. Add it to your other fixed costs. Your break-even units then includes the sales required to recover the ad spend. If your break-even is 250 units with $3,000 ad spend and your current conversion rate is 1%, you need 25,000 visitors to break even. Is that achievable with your ad budget? Now you know before you spend the money.</p>

<h2>What a Healthy Contribution Margin Looks Like</h2>
<ul>
  <li><strong>Below 30% CMR:</strong> Very little room to absorb fixed costs or invest in marketing. Revisit pricing or COGS.</li>
  <li><strong>30–50% CMR:</strong> Workable for most e-commerce categories. Watch fixed cost creep.</li>
  <li><strong>50–70% CMR:</strong> Strong. Typical of well-positioned brands with good supplier terms.</li>
  <li><strong>Above 70% CMR:</strong> Excellent. Usually private-label or digital-adjacent products.</li>
</ul>
`
}

// ── 2. Cash Flow Runway ───────────────────────────────────────────────────────
export const POST_CASH_FLOW_RUNWAY = {
  slug: 'cash-flow-runway-guide',
  title: 'Cash Flow Runway: How Many Months Until You Run Out of Money?',
  excerpt: 'Revenue and profitability do not prevent cash crises. Knowing your runway gives you the time to act before the problem becomes a crisis. Here is how to calculate it correctly.',
  category: 'Finance',
  readTime: '7 min read',
  date: 'Mar 22, 2025',
  keywords: ['cash flow runway calculator', 'ecommerce cash flow', 'how to calculate burn rate', 'runway months ecommerce'],
  calculatorSlug: 'cash-flow-runway',
  calculatorCta: 'Calculate your cash flow runway',
  content: `
<h2>Why Profitable Businesses Run Out of Cash</h2>
<p>The most dangerous financial situation in e-commerce is not a money-losing business — it is a cash-negative profitable business. A store can show accounting profit every month and still face a cash crisis, because profit is an accounting concept and cash flow is reality.</p>
<p>The gap opens in three common ways: inventory builds up faster than revenue comes in, payment processors hold funds during disputes, or advertising spend runs ahead of collections. In each case, your P&L looks fine while your bank account drains.</p>
<p>Cash flow runway is the number of months your current cash balance lasts at your current rate of expenditure. It is the one metric that determines whether you have time to fix a problem or whether you are already too late.</p>

<h2>The Burn Rate Calculation</h2>
<p><strong>Monthly Burn = Total Monthly Operating Expenses − Monthly Revenue</strong></p>
<p>If your monthly expenses are $28,000 and your monthly revenue is $35,000, your burn is negative — you are net positive $7,000 per month. Your runway is theoretically unlimited.</p>
<p>If your monthly expenses are $42,000 and your monthly revenue is $38,000, your burn is $4,000 per month. With $50,000 in the bank, your runway is 12.5 months.</p>

<h2>The Runway Formula</h2>
<p><strong>Runway (months) = Current Cash Balance ÷ Monthly Net Burn</strong></p>
<p>But this simple version assumes flat revenue. Most growing stores are not flat — they are growing. The accurate version adjusts for monthly revenue growth:</p>
<p>If revenue grows at 10% per month and current burn is $4,000, each subsequent month the burn rate decreases. The runway extends significantly compared to the flat-revenue calculation. The break-even month — when revenue exceeds expenses — is a critical milestone to calculate explicitly.</p>

<h2>What to Do With Your Runway Number</h2>
<p><strong>Above 18 months:</strong> Comfortable. Focus on growth. Monitor quarterly.</p>
<p><strong>12–18 months:</strong> Adequate but monitor monthly. Any unexpected expense or revenue shortfall narrows this fast.</p>
<p><strong>6–12 months:</strong> Attention required. Identify two or three levers to extend runway: reduce discretionary spend, accelerate collections, or pursue revenue-based financing if growth metrics support it.</p>
<p><strong>Below 6 months:</strong> Urgency. You need to either cut burn meaningfully or find capital. Do not wait.</p>

<h2>The Inventory Problem</h2>
<p>E-commerce businesses have a cash flow challenge unique to product businesses: inventory ties up cash. $50,000 sitting in a warehouse is $50,000 not available for payroll, advertising, or contingencies. Your runway calculation should always include inventory days outstanding — how many months of revenue is currently tied up in inventory?</p>
<p>A business with 6 months of runway and 4 months of inventory value sitting in a warehouse is actually in a much tighter position than the raw runway number suggests. Liquidating slow-moving inventory at a discount is sometimes the right call precisely because it converts a fixed asset into cash that extends runway.</p>

<h2>Revenue-Based Financing and Cash Flow</h2>
<p>If your business is growing but cash-constrained, revenue-based financing (RBF) lets you borrow against future revenue. The repayment is a percentage of monthly revenue rather than a fixed payment, which means your repayment scales with your business rather than creating a fixed obligation during slow months.</p>
<p>RBF is most appropriate when: your growth metrics are strong, your gross margin is above 40%, and you need capital to fund inventory or marketing that has a clear ROI. It is not appropriate for funding operating losses or replacing revenue that is structurally declining.</p>
`
}

// ── 3. Customer Acquisition Cost ─────────────────────────────────────────────
export const POST_CAC = {
  slug: 'customer-acquisition-cost-guide',
  title: 'The CAC Calculation Most E-Commerce Brands Get Wrong',
  excerpt: 'Dividing ad spend by new customers is not CAC — it is ad cost per customer. True CAC includes agency fees, tool subscriptions, your team\'s time, and every other cost of winning a new customer.',
  category: 'Advertising',
  readTime: '7 min read',
  date: 'Apr 2, 2025',
  keywords: ['customer acquisition cost calculator', 'how to calculate cac', 'ecommerce cac benchmark', 'ltv cac ratio', 'true cac'],
  calculatorSlug: 'customer-acquisition-cost',
  calculatorCta: 'Calculate your true CAC',
  content: `
<h2>The CAC Calculation That Is Almost Always Wrong</h2>
<p>Ask most e-commerce operators how they calculate CAC and they say: total ad spend divided by new customers acquired. Clean. Simple. Wrong.</p>
<p>Ad spend divided by customers is your paid acquisition cost per customer. It excludes every other cost involved in bringing that customer through the door. When you add those in, the number almost always looks meaningfully worse — and the decisions it informs are different.</p>

<h2>What Belongs in a True CAC Calculation</h2>
<p><strong>Paid advertising spend:</strong> Meta, Google, TikTok, Pinterest, Amazon Sponsored, and any other paid channels. This is what most brands count. It is the start, not the end.</p>
<p><strong>Influencer and affiliate fees:</strong> If you pay creators or affiliates to drive traffic that converts to new customers, those costs belong in CAC. Many brands run influencer programmes off the marketing P&L without ever allocating the cost per customer acquired.</p>
<p><strong>Agency and freelancer costs:</strong> If you pay an agency to manage your Meta campaigns, the agency fee is a customer acquisition cost. It does not help to know your ad cost per customer if a $5,000/month agency is powering those results.</p>
<p><strong>Tool subscriptions for acquisition:</strong> Attribution software, creative testing tools, landing page builders used for acquisition campaigns. These are real acquisition costs.</p>
<p><strong>A fraction of marketing team time:</strong> If you or a team member spends time on acquisition activities, that time has a cost. Even founders doing acquisition work themselves are spending time with an opportunity cost.</p>

<h2>The Complete CAC Formula</h2>
<p><strong>True CAC = (Ad Spend + Influencer/Affiliate Fees + Agency Costs + Acquisition Tool Subscriptions + Allocated Team Time) ÷ New Customers Acquired</strong></p>

<h2>CAC Benchmarks by Channel</h2>
<p>CAC varies enormously by channel and category. Rough benchmarks for DTC e-commerce in the US market:</p>
<ul>
  <li><strong>Paid social (Meta):</strong> $25–$75 for low-ticket items, $60–$200+ for premium</li>
  <li><strong>Paid search (Google):</strong> $30–$100, highly category dependent</li>
  <li><strong>Organic/SEO:</strong> Very low ongoing marginal CAC, high upfront content investment</li>
  <li><strong>Email (list growth):</strong> $2–$10 per subscriber if capturing at the right conversion rate</li>
  <li><strong>Influencer:</strong> Highly variable, $20–$500+ per customer depending on conversion</li>
</ul>

<h2>The LTV:CAC Ratio</h2>
<p>CAC in isolation is not actionable. A $80 CAC is excellent if LTV is $500. It is catastrophic if LTV is $60. The LTV:CAC ratio contextualises your acquisition cost against the lifetime value of what you are acquiring.</p>
<ul>
  <li><strong>Below 1:1:</strong> You lose money acquiring every customer</li>
  <li><strong>1–2:1:</strong> Unsustainable. You are acquiring customers at thin margin</li>
  <li><strong>3:1:</strong> Standard target for healthy DTC businesses</li>
  <li><strong>5:1+:</strong> Often means under-investing in acquisition — you are leaving growth untouched</li>
</ul>

<h2>Payback Period: The More Actionable Metric</h2>
<p>LTV is a long-run estimate. Payback period is concrete: how many months until the revenue from a customer covers the cost of acquiring them?</p>
<p><strong>Payback Period = CAC ÷ Monthly Gross Profit Per Customer</strong></p>
<p>A payback period under 12 months is healthy for most bootstrapped brands. Above 24 months and you need significant working capital to grow — each new customer costs more than you recover for two years.</p>
`
}

// ── 4. Pricing Strategy ───────────────────────────────────────────────────────
export const POST_PRICING_STRATEGY = {
  slug: 'ecommerce-pricing-strategy-guide',
  title: 'E-Commerce Pricing Strategy: How to Price for Margin, Not Competition',
  excerpt: 'Pricing from competitor benchmarks is a race to the bottom. Pricing from your costs and margin targets gives you sustainable economics. Here is the framework and the formulas.',
  category: 'Margins',
  readTime: '8 min read',
  date: 'Apr 5, 2025',
  keywords: ['ecommerce pricing strategy', 'how to price products ecommerce', 'markup vs margin', 'pricing calculator ecommerce', 'target margin pricing'],
  calculatorSlug: 'pricing-strategy',
  calculatorCta: 'Calculate your pricing targets',
  content: `
<h2>The Problem With Competitor-Based Pricing</h2>
<p>The most common pricing method in e-commerce is also the most dangerous: look at what competitors charge, price slightly lower, and hope volume makes up for margin. This is how commoditised markets form and how brands end up with structurally unsustainable unit economics.</p>
<p>Competitor prices tell you nothing about your competitor's cost structure. They may be loss-leading to gain market share. They may have supplier relationships you do not have. They may be running at a loss and not know it. Pricing from their number anchors you to someone else's broken economics.</p>
<p>The correct approach is to price from your costs — specifically, from your target gross margin — and use competitor prices as a market validation check, not as a starting point.</p>

<h2>Markup vs Margin: The Confusion That Costs Real Money</h2>
<p>Most e-commerce operators use these terms interchangeably. They are not interchangeable and confusing them leads to systematic underpricing.</p>
<p><strong>Markup</strong> is profit expressed as a percentage of cost: if a product costs $20 and sells for $50, the markup is ($50 − $20) ÷ $20 = 150%.</p>
<p><strong>Margin</strong> is profit expressed as a percentage of price: ($50 − $20) ÷ $50 = 60%.</p>
<p>These are different numbers. A 50% markup gives you a 33% margin, not a 50% margin. If you are targeting a 50% margin and using markup math to price, you will consistently price too low. Run the numbers on your current products and check which calculation you have been using.</p>

<h2>Pricing From a Target Margin</h2>
<p>The correct formula for target-margin pricing:</p>
<p><strong>Selling Price = Total Unit Cost ÷ (1 − Target Margin)</strong></p>
<p>Example: Your landed cost is $18 (product, shipping, duties, processing) and you want a 55% gross margin. Price = $18 ÷ (1 − 0.55) = $18 ÷ 0.45 = $40.</p>
<p>Now check the market: do competitors price near $40? If yes, you are well-positioned. If competitors are at $28, you have a cost, differentiation, or positioning problem — not a pricing problem.</p>

<h2>The Markup Multiplier Shortcut</h2>
<p>If you have a consistent target margin, your markup multiplier — the number you multiply your cost by to get your price — stays constant:</p>
<p><strong>Markup Multiplier = 1 ÷ (1 − Target Margin)</strong></p>
<ul>
  <li>30% target margin: multiplier = 1.43x</li>
  <li>40% target margin: multiplier = 1.67x</li>
  <li>50% target margin: multiplier = 2.0x</li>
  <li>60% target margin: multiplier = 2.5x</li>
</ul>
<p>Multiply your landed cost by this number and you hit your target margin every time. Useful for rapidly pricing new products without recalculating each time.</p>

<h2>What Is a Minimum Viable Price?</h2>
<p>Your minimum viable price is the floor below which you lose money after all variable costs — the point at which contribution margin hits zero. It is calculated as:</p>
<p><strong>Minimum Price = Variable Costs Per Unit</strong></p>
<p>Selling below minimum price means you pay for every unit you sell out of fixed cost coverage or equity. No amount of volume makes this sustainable.</p>

<h2>Price Anchoring and Psychological Pricing</h2>
<p>Once you have your target-margin price, consider how you present it. Pricing research consistently shows that $49.99 and $48 outperform $50 and $47 despite the trivial difference. Charm pricing (ending in .99 or .95) works in most consumer contexts.</p>
<p>More importantly, product line pricing and anchoring work powerfully: offering a premium version at a higher price makes your mid-range product look like better value. Price your product line as a set, not as individual decisions.</p>
`
}

// ── 5. Refund Rate Impact ────────────────────────────────────────────────────
export const POST_REFUND_RATE = {
  slug: 'refund-rate-impact-guide',
  title: 'How Refund Rate Is Silently Eating Your E-Commerce Margin',
  excerpt: 'A 10% refund rate does not cost you 10% of revenue. It costs you the original transaction fees, the product, the return shipping, and the operational overhead. The true cost compounds.',
  category: 'Operations',
  readTime: '6 min read',
  date: 'Apr 8, 2025',
  keywords: ['ecommerce refund rate', 'return rate calculator', 'refund impact ecommerce', 'how refunds affect profit', 'shopify refund rate'],
  calculatorSlug: 'refund-rate-impact',
  calculatorCta: 'Calculate your refund rate impact',
  content: `
<h2>The True Cost of a Refund Is Not the Refund Amount</h2>
<p>When a customer returns a product and receives a $45 refund, your loss is not $45. It is frequently $65–$80 when you account for every component of that transaction. This is why refund rate is one of the most damaging hidden costs in e-commerce and one of the least-tracked.</p>

<h2>The Full Cost Stack of a Refund</h2>
<p><strong>The refund itself:</strong> You return the customer's payment. Your payment processor usually does not return the processing fee — you absorb it on both the original transaction and sometimes the refund transaction.</p>
<p><strong>COGS:</strong> If the returned product is damaged, non-resaleable, or a consumable, you lose the product cost entirely. Even restockable products carry some probability of damage (typically 15–30%).</p>
<p><strong>Outbound shipping:</strong> You paid to ship the product to the customer. That cost is not recoverable.</p>
<p><strong>Return shipping:</strong> If you offer free returns, this is entirely your cost. Even when customers pay return shipping, the operational cost on your end remains.</p>
<p><strong>Restocking labour:</strong> Someone physically handles the return — inspecting, repackaging, re-shelving, or disposing of it. At any reasonable labour rate, this adds $3–$8 per return.</p>
<p><strong>Opportunity cost:</strong> The inventory was out of circulation during the return cycle. In peak demand periods, this has real revenue impact.</p>

<h2>Refund Rate Benchmarks by Category</h2>
<ul>
  <li><strong>Apparel and footwear:</strong> 20–30% — the highest category due to fit issues</li>
  <li><strong>Electronics:</strong> 15–25% — high due to technical issues and buyer's remorse</li>
  <li><strong>Home goods and furniture:</strong> 8–15%</li>
  <li><strong>Beauty and skincare:</strong> 5–10%</li>
  <li><strong>Health and supplements:</strong> 3–8%</li>
  <li><strong>Digital and software:</strong> 5–15%</li>
</ul>
<p>If your refund rate is significantly above these benchmarks for your category, it is a product or expectation-management problem. If it is significantly below, you may have a quality product or an overly restrictive returns policy that is suppressing conversion.</p>

<h2>The Margin Impact Formula</h2>
<p>Total monthly refund cost = Refund rate × Monthly revenue × (1 + COGS% + Shipping% + Processing%)</p>
<p>Example: $80K monthly revenue, 8% refund rate, 35% COGS, 5% outbound shipping, 3% processing. Estimated refund cost = $80K × 0.08 × 1.43 = $9,152 per month, $109,824 per year.</p>
<p>That is over 13% of revenue disappearing into returns. A business reporting 25% net margin is actually running closer to 12% once return costs are properly accounted.</p>

<h2>How to Reduce Refund Rate Without Hurting Conversion</h2>
<p><strong>Product photography and video:</strong> The most effective single intervention. Returns from "item not as described" drop dramatically when product imagery is accurate, detailed, and shows scale. Video dramatically reduces apparel and shoe returns.</p>
<p><strong>Sizing guides and fit technology:</strong> For apparel brands, a detailed size guide with real customer measurements referenced reduces fit-driven returns by 15–25%.</p>
<p><strong>Set accurate expectations in copy:</strong> Overselling or vague product descriptions cause disappointed customers who return products that would have satisfied them if expectations were set correctly.</p>
<p><strong>Post-purchase experience:</strong> A proactive email sequence with usage instructions, care guidance, and support contact reduces returns that stem from user error rather than product failure.</p>
`
}

// ── 6. Bundle Pricing Optimizer ───────────────────────────────────────────────
export const POST_BUNDLE_PRICING = {
  slug: 'bundle-pricing-optimizer-guide',
  title: 'Bundle Pricing: How to Increase AOV Without Destroying Margin',
  excerpt: 'Bundles done wrong compress margin while appearing to increase revenue. Done right, they improve both AOV and profitability. The math is less intuitive than most brands assume.',
  category: 'Margins',
  readTime: '6 min read',
  date: 'Apr 10, 2025',
  keywords: ['bundle pricing ecommerce', 'product bundle strategy', 'bundle pricing calculator', 'aov bundle discount', 'bundle margin'],
  calculatorSlug: 'bundle-pricing-optimizer',
  calculatorCta: 'Optimise your bundle pricing',
  content: `
<h2>When Bundles Hurt Profitability</h2>
<p>The logic behind product bundles is simple: offer multiple items together at a slight discount, the customer perceives better value and buys more, average order value increases and everyone wins. The problem is that this logic ignores margin.</p>
<p>Consider a brand selling two products individually: Product A at $35 with a $15 cost (57% margin), and Product B at $25 with an $18 cost (28% margin). They bundle at $50 — a 16.7% discount. Average individual transaction was $30. Bundle AOV is $50 — an impressive 67% increase.</p>
<p>But the bundle margin is ($50 − $33) ÷ $50 = 34%. The average individual margin was closer to 42%. The bundle sells more items per transaction while making less per dollar. At scale, this erodes profitability.</p>

<h2>The Correct Way to Evaluate a Bundle</h2>
<p>You need to compare three numbers: the margin on each product sold individually, the blended margin if sold separately at the same combined AOV, and the actual bundle margin at the discounted price.</p>
<p>A bundle is financially beneficial when bundle margin exceeds the weighted average individual product margin. If your bundle combines high-margin and low-margin items, heavy discounting will almost always pull the bundle margin below the high-margin item baseline.</p>

<h2>The Bundle Margin Formula</h2>
<p><strong>Bundle Margin = (Bundle Price − Total Variable Costs) ÷ Bundle Price × 100</strong></p>
<p>Where total variable costs include the COGS of every item in the bundle plus any incremental packaging or fulfilment costs (bundles often require different packaging).</p>

<h2>When Bundles Make Sense Despite Lower Margin</h2>
<p>Lower per-unit margin is acceptable when: the bundle drives meaningful fulfilment cost savings (one shipment instead of two), the bundle introduces a customer to a second product they subsequently reorder independently, or the bundle displaces a competitor sale that would otherwise go elsewhere.</p>
<p>The key is knowing when you are making that trade consciously versus discovering it retroactively in your monthly numbers.</p>

<h2>Bundle Pricing Strategies That Work</h2>
<p><strong>Anchor on the hero product:</strong> Price the bundle so the hero product appears at its normal price and the add-on is the discounted item. "Get [Product A] and [Product B] for $55 — [Product B] at 30% off." The hero maintains perceived value and the customer focuses on the add-on discount.</p>
<p><strong>Build-your-own bundles:</strong> Allow customers to select items for a discount at a threshold quantity or order value. This shifts bundle composition optimisation to the customer while you set the discount structure. Mix at a higher margin than forced bundles.</p>
<p><strong>Consumable + durable bundles:</strong> Pairing a reusable product with its consumable refill is a high-margin bundle approach because the durable typically carries high margin and introduces the customer to a recurring purchase cycle.</p>

<h2>The Platform Fee Factor</h2>
<p>Don't forget that your platform fee (Shopify, Amazon referral) is calculated on the bundle selling price, not the individual item prices. A 15% Amazon referral fee on a $60 bundle is $9. On the two items sold separately at $35 and $25 it is also $9 ($5.25 + $3.75). The fee is not a differentiating factor here — but payment processing and fulfilment costs can differ meaningfully.</p>
`
}

// ── 7. Influencer ROI ──────────────────────────────────────────────────────────
export const POST_INFLUENCER_ROI = {
  slug: 'influencer-roi-calculator-guide',
  title: 'Influencer Marketing ROI: How to Know If a Campaign Made Money Before You Sign',
  excerpt: 'Most brands evaluate influencer campaigns by feel — follower count, engagement rate, brand alignment. None of those are the question. The question is: did it make money?',
  category: 'Advertising',
  readTime: '7 min read',
  date: 'Apr 12, 2025',
  keywords: ['influencer marketing roi', 'influencer roi calculator', 'how to measure influencer campaigns', 'influencer cost per customer', 'dtc influencer strategy'],
  calculatorSlug: 'influencer-roi-calculator',
  calculatorCta: 'Calculate your influencer campaign ROI',
  content: `
<h2>The Metric That Actually Tells You If an Influencer Campaign Worked</h2>
<p>Brands evaluate influencer campaigns primarily through reach metrics: impressions, views, engagement rate, click-through rate. These are upstream metrics. They tell you what happened before the purchase, not whether the purchase happened or whether it was profitable.</p>
<p>The only metric that tells you whether an influencer campaign was worth running is return on influencer investment — the ratio of gross profit generated to total campaign cost. Everything else is a proxy.</p>

<h2>The Full Cost of an Influencer Campaign</h2>
<p>Most brands count only the creator fee. The full cost includes:</p>
<p><strong>Creator fee:</strong> The negotiated payment for the post, story, video, or series of content.</p>
<p><strong>Product gifting:</strong> The landed cost of product sent to the creator for seeding or as compensation. At scale this is non-trivial — sending 50 units of a $30-cost product is $1,500 in product cost alone.</p>
<p><strong>Agency or management fee:</strong> If you work through a creator management agency or influencer marketing platform, their margin (typically 15–30%) adds to your campaign cost.</p>
<p><strong>Creative production:</strong> Post-production, graphic design, or coordination costs if your team is involved in the content.</p>
<p><strong>Tracking and attribution tooling:</strong> The portion of your attribution platform cost attributable to the campaign period.</p>

<h2>The ROI Calculation</h2>
<p><strong>Revenue attributed to campaign = Total campaign spend × ROAS</strong></p>
<p><strong>Gross profit = Revenue × Gross margin</strong></p>
<p><strong>Campaign net profit = Gross profit − Total campaign cost</strong></p>
<p><strong>Campaign ROAS = Revenue attributed ÷ Total campaign cost</strong></p>
<p>A campaign that drives $12,000 in revenue from a $3,000 total cost at 40% gross margin generates $4,800 gross profit and $1,800 net profit. Campaign ROAS is 4x. Net ROI is 60%.</p>
<p>A campaign with 50,000 views and 3,500 link clicks but $800 in attributed revenue from a $2,500 campaign cost is a money-losing brand-awareness buy, not a profitable performance channel.</p>

<h2>Attribution: The Hard Part</h2>
<p>Influencer attribution is genuinely difficult. Link clicks through unique affiliate links or discount codes give you direct attribution, but they miss customers who see content, search the brand later, and convert without the code. Industry estimates suggest direct attribution captures 30–60% of actual influencer-influenced purchases.</p>
<p>Practical approaches: unique discount codes for each creator, post-purchase surveys asking "how did you find us," and UTM parameters on links in bio. No method is perfect but direct attribution through codes is the most actionable for calculating campaign ROI.</p>

<h2>Pre-Campaign Evaluation Framework</h2>
<p>Before signing, model the campaign with conservative assumptions:</p>
<ul>
  <li>Follower count × realistic reach rate (typically 20–40% for Instagram posts, 5–15% for feed)</li>
  <li>× conservative engagement to link click rate (0.5–2%)</li>
  <li>× realistic link conversion rate for cold traffic (0.5–2.5%)</li>
  <li>= estimated orders × AOV = estimated revenue</li>
</ul>
<p>If revenue estimate × gross margin − total campaign cost is negative in the conservative scenario, the campaign only works if brand-building value justifies the cost — make that decision explicitly.</p>

<h2>When Influencer Marketing Is Worth Running at Break-Even</h2>
<p>Some brands rationally run influencer campaigns that break even on first-purchase ROI because the customer LTV justifies the acquisition. A subscription brand with strong retention can afford a $60 first-purchase acquisition cost if 12-month LTV is $300. Model LTV-adjusted ROI when evaluating any channel where repeat purchase is likely.</p>
`
}

// ── 8. Shipping Cost Optimizer ────────────────────────────────────────────────
export const POST_SHIPPING = {
  slug: 'shipping-cost-optimizer-guide',
  title: 'How Dimensional Weight Pricing Works — and Why It Is Costing You Money',
  excerpt: 'Shipping carriers charge by dimensional weight, not actual weight, for most packages. A lightweight item in a large box can cost twice as much to ship as a heavy item in an efficient box. Here is how to optimise.',
  category: 'Operations',
  readTime: '6 min read',
  date: 'Apr 14, 2025',
  keywords: ['dimensional weight shipping', 'shipping cost calculator ecommerce', 'usps shipping calculator', 'how to reduce shipping costs', 'dimensional weight formula'],
  calculatorSlug: 'shipping-cost-optimizer',
  calculatorCta: 'Calculate your shipping cost',
  content: `
<h2>Why Your Shipping Costs Are Higher Than Expected</h2>
<p>Most e-commerce operators know their average shipping cost as a single number pulled from their carrier invoices. What they often do not know is how much of that cost is being driven by inefficient packaging — specifically, paying for air.</p>
<p>UPS, FedEx, and DHL all price packages at the higher of actual weight or dimensional weight. USPS uses dimensional weight for packages over one cubic foot. For a lightweight product in a larger-than-necessary box, dimensional weight can be 2–3x the actual weight — meaning you are paying 2–3x the baseline rate for the space your package occupies in a truck.</p>

<h2>The Dimensional Weight Formula</h2>
<p><strong>DIM Weight (lbs) = (Length × Width × Height in inches) ÷ 139</strong></p>
<p>For UPS and FedEx ground: divide by 139 for domestic US shipments.</p>
<p>Example: a package that is 12" × 10" × 8" and weighs 2 lbs has a DIM weight of (12 × 10 × 8) ÷ 139 = 6.9 lbs. You pay the 6.9 lbs rate, not the 2 lbs rate. If the rate difference between 2 lbs and 7 lbs is $3 per package and you ship 1,000 packages per month, that is $3,000 in avoidable shipping cost.</p>

<h2>How to Optimise Your Packaging</h2>
<p><strong>Right-size your boxes:</strong> Order boxes that fit your most-shipped product SKUs precisely. An inventory of 5–7 box sizes that cover your product range tightly will meaningfully reduce average DIM weight without adding significant operational complexity.</p>
<p><strong>Poly mailers for appropriate products:</strong> For non-fragile items — apparel, accessories, soft goods — poly mailers eliminate dimensional weight entirely and cost $0.20–$0.50 versus $1.50–$4 for a corrugated box. The savings compound across every shipment.</p>
<p><strong>Custom-sized boxes for high-volume SKUs:</strong> If one SKU accounts for 30% of your shipment volume, a custom die-cut box sized exactly for that product can save $0.80–$2.00 per shipment. At 3,000 shipments per month, a $1.20 per-shipment saving is $43,200 per year — well above the tooling cost for a custom box run.</p>

<h2>Carrier Rate Comparison</h2>
<p>USPS Priority Mail is often significantly cheaper for packages under 2 lbs and under 12" in all dimensions. UPS and FedEx Ground win for heavier or larger packages and for packages travelling more than 1,000 miles. No single carrier is always cheapest — smart operators rate-shop at the point of fulfilment using a multi-carrier platform.</p>
<p>Shopify Shipping, EasyPost, ShipStation, and ShipBob all offer multi-carrier rate comparison and negotiated discounts not available on retail carrier rates. The negotiated rates alone can represent 20–40% savings versus walking into a UPS store.</p>

<h2>Shipping as a Percentage of AOV</h2>
<p>The target metric is shipping cost as a percentage of average order value. For most DTC brands shipping small items, a healthy range is 8–15% of AOV. Above 20% and you have a structural problem — either pricing is too low, AOV is too low, or shipping costs are not optimised. Below 5% and you are probably under-investing in packaging quality or over-pricing to compensate.</p>
<p>If you offer free shipping, your entire shipping cost sits in your COGS structure. Make sure your pricing reflects the real shipping cost of each unit, not just a blended average — high-weight or oversized SKUs can have shipping costs that make them unprofitable at free-shipping pricing levels.</p>
`
}

// ── 9. Etsy Fee Calculator ────────────────────────────────────────────────────
export const POST_ETSY = {
  slug: 'etsy-fee-calculator-guide',
  title: 'Etsy Fees Explained: What You Actually Pay on Every Sale',
  excerpt: 'Etsy charges its transaction fee on your item price AND your shipping. Most sellers calculate only one of those. Here is the complete fee stack and how to price profitably on Etsy.',
  category: 'Margins',
  readTime: '5 min read',
  date: 'Apr 16, 2025',
  keywords: ['etsy fees calculator', 'etsy seller fees 2025', 'how much does etsy charge', 'etsy transaction fee', 'etsy profit margin'],
  calculatorSlug: 'etsy-fee-calculator',
  calculatorCta: 'Calculate your Etsy fees',
  content: `
<h2>The Etsy Fee Most Sellers Forget</h2>
<p>Ask an Etsy seller what fee Etsy charges and they will usually say "6.5% transaction fee." That is correct but incomplete. Etsy charges its 6.5% transaction fee on the total amount the buyer pays — item price plus shipping. If you charge $35 for an item and $6 shipping, Etsy calculates its fee on $41.</p>
<p>For a seller charging $6 in shipping that actually costs them $5.50, the Etsy transaction fee alone ($0.39 on the shipping amount) nearly eliminates their shipping margin. At scale, this adds up.</p>

<h2>The Complete Etsy Fee Stack</h2>
<p><strong>Listing fee: $0.20 per item.</strong> Charged when you publish a listing. Renews automatically every 4 months if the item does not sell ($0.20 per renewal), and again each time the item sells.</p>
<p><strong>Transaction fee: 6.5% of total payment.</strong> Calculated on item price + any shipping charges + gift wrapping charges. Note: not on sales tax (Etsy collects and remits that separately in most US states).</p>
<p><strong>Payment processing fee: 3% + $0.25 per transaction</strong> (for Etsy Payments in the US). This rate varies by country. In the UK it is 4% + £0.20. In Australia it is 3% + AUD 0.25.</p>
<p><strong>Etsy Ads (optional but commonly used):</strong> Variable based on your daily budget and category competition. Etsy's algorithm determines your cost per click.</p>
<p><strong>Offsite Ads fee:</strong> If Etsy runs ads for your products on Google, Facebook, or other platforms and a sale results, Etsy charges 12–15% of the total order value. Sellers above $10,000 in annual Etsy sales cannot opt out of Offsite Ads.</p>

<h2>The Net Margin Calculation</h2>
<p>For a typical item priced at $42 with $6 shipping, cost of goods $12, and listing fee $0.20:</p>
<ul>
  <li>Revenue: $42.00</li>
  <li>Transaction fee (6.5% × $48): −$3.12</li>
  <li>Payment processing (3% × $48 + $0.25): −$1.69</li>
  <li>Listing fee: −$0.20</li>
  <li>Shipping cost: −$5.50</li>
  <li>COGS: −$12.00</li>
  <li><strong>Net profit: $19.49 (46.4% margin)</strong></li>
</ul>
<p>Before Offsite Ads. If an Offsite Ad drove the sale, the 15% fee ($7.20) reduces net profit to $12.29 — a 29.3% margin.</p>

<h2>Pricing for Etsy Profitably</h2>
<p>The correct pricing approach is to build your complete fee stack into your pricing formula before setting prices:</p>
<p><strong>Minimum Viable Price = (COGS + Fixed Fees) ÷ (1 − Variable Fee Rate)</strong></p>
<p>Where variable fee rate is the sum of transaction fee (6.5%) + payment processing rate (3%) = 9.5%. Fixed fees are listing fee and your actual shipping cost.</p>
<p>Never set your price by looking at competitor prices and pricing slightly lower. Price from your costs and accept that your pricing will be higher than sellers who have not done this math and are unknowingly working at a loss.</p>
`
}

// ── 10. Profit Per SKU ──────────────────────────────────────────────────────
export const POST_PROFIT_PER_SKU = {
  slug: 'profit-per-sku-guide',
  title: 'Profit Per SKU: Why Your Best-Selling Product Is Probably Not Your Most Profitable',
  excerpt: 'Revenue by SKU and profit by SKU are different rankings. The product you sell most of is often not the one making you the most money. Here is how to find out which is which.',
  category: 'Margins',
  readTime: '7 min read',
  date: 'Apr 18, 2025',
  keywords: ['profit per sku calculator', 'sku profitability analysis', 'ecommerce product margin', 'most profitable products ecommerce', 'sku analysis'],
  calculatorSlug: 'profit-per-sku',
  calculatorCta: 'Calculate your profit per SKU',
  content: `
<h2>The Difference Between Sales Rank and Profit Rank</h2>
<p>Most e-commerce dashboards optimise for revenue. Shopify's default analytics show your top products by sales and by revenue. Amazon's Seller Central shows units sold and revenue. These are the metrics you look at daily. They are also the wrong metrics for understanding where your profit is actually coming from.</p>
<p>Revenue by SKU and profit by SKU are different rankings. A product that sells 500 units at $29.99 generates $14,995 in revenue. A product that sells 120 units at $79.99 generates $9,598 in revenue — 36% less. But if the first product has a $22 landed cost (26.7% margin) and the second has a $28 landed cost (65% margin), the second product generates $6,238 in gross profit while the first generates $3,999. The lower-revenue product is 56% more profitable.</p>
<p>Optimising for units sold or revenue without understanding per-SKU profit means you are potentially marketing, advertising, and inventory-planning around the wrong products.</p>

<h2>What to Include in SKU Cost</h2>
<p>To calculate accurate per-SKU profitability, your cost must include all variable costs that are specific to selling that unit:</p>
<ul>
  <li><strong>Product cost:</strong> What you paid the supplier per unit</li>
  <li><strong>Inbound shipping per unit:</strong> Total inbound freight ÷ units in the shipment</li>
  <li><strong>Customs and duties per unit:</strong> If applicable</li>
  <li><strong>Payment processing:</strong> Percentage of selling price + flat fee</li>
  <li><strong>Return rate cost:</strong> (Return rate × Product cost × (1 + return handling factor))</li>
  <li><strong>Any SKU-specific advertising:</strong> If you run targeted campaigns for specific products</li>
</ul>
<p>Overhead costs like platform subscriptions, salaries, and warehouse rent are fixed costs and should not be allocated per-SKU for contribution margin analysis — they belong in your operating expense calculations.</p>

<h2>The SKU Profitability Matrix</h2>
<p>Plot your SKUs on two axes: gross margin percentage on the vertical axis and sales volume (units or revenue) on the horizontal axis. This gives you four quadrants:</p>
<ul>
  <li><strong>High margin, high volume (top right):</strong> Your best products. Prioritise inventory, advertising, and placement.</li>
  <li><strong>High margin, low volume (top left):</strong> Underperforming profitable products. Invest in marketing to move them right.</li>
  <li><strong>Low margin, high volume (bottom right):</strong> Revenue drivers that may be margin drains. Examine whether advertising is profitable on these SKUs specifically.</li>
  <li><strong>Low margin, low volume (bottom left):</strong> Candidates for discontinuation. They consume inventory capital and operational attention without commensurate return.</li>
</ul>

<h2>Using SKU Profitability to Guide Ad Spend</h2>
<p>If you are running Facebook or Google ads without SKU-level ROAS targets, you are almost certainly spending disproportionately on low-margin products. Your highest-selling items are most likely to win ad auctions based on click-through rates and quality scores — but that does not mean they are worth advertising at the same intensity as your high-margin items.</p>
<p>Calculate a separate break-even ROAS for each SKU. Allocate ad budget based on which SKUs have the headroom to remain profitable at your achievable ROAS. High-margin products can be profitable at lower ROAS targets — and that changes your bidding strategy significantly.</p>

<h2>The Long-Tail SKU Problem</h2>
<p>Many e-commerce businesses accumulate long tails of SKUs over time — colour variants, size runs, seasonal items, or experimental products. Each SKU has carrying costs, listing costs, and operational complexity. A product that sells 3 units per month at a $4 contribution margin is generating $144 per year — and consuming space, listing management, customer service, and inventory capital that may be worth significantly more than that in other uses.</p>
<p>Run the SKU profitability analysis annually and cull the products where the true cost of carrying the SKU exceeds the contribution it generates.</p>
`
}

// ── 11. Ad Spend Budget Calculator ─────────────────────────────────────────
export const POST_AD_SPEND = {
  slug: 'ad-spend-budget-calculator-guide',
  title: 'How to Set Your E-Commerce Ad Budget Based on What the Math Supports',
  excerpt: 'Setting an ad budget by feel or as a fixed percentage of last month\'s revenue is the wrong approach. Your ad budget should be derived from your revenue target, your margin, and your achievable ROAS. Here is the framework.',
  category: 'Advertising',
  readTime: '6 min read',
  date: 'Apr 20, 2025',
  keywords: ['ecommerce ad spend budget', 'how much to spend on ads ecommerce', 'facebook ads budget calculator', 'ad spend percentage revenue', 'ad budget formula'],
  calculatorSlug: 'ad-spend-budget-calculator',
  calculatorCta: 'Calculate your ad spend budget',
  content: `
<h2>Why "Spend 10% of Revenue on Ads" Is a Starting Point, Not a Strategy</h2>
<p>The most common approach to ad budgeting in e-commerce is to pick a percentage of revenue — "we spend 15% of revenue on advertising" — and hold to it. This is a useful guardrail but it is not derived from the economics of your business. The right ad budget is not a percentage of your past revenue. It is a function of your target revenue, your margins, and your achievable ROAS.</p>
<p>A business with 60% gross margins and a 5x achievable ROAS can profitably spend 20% of revenue on ads and generate strong net margins. A business with 25% gross margins and a 2.5x achievable ROAS will lose money at 10% of revenue. The percentage is a symptom of the underlying economics, not the strategy.</p>

<h2>The Revenue-to-Budget Framework</h2>
<p>Work backward from your revenue target:</p>
<ol>
  <li><strong>Set your revenue target:</strong> How much revenue do you want to drive through paid channels this month?</li>
  <li><strong>Apply your gross margin:</strong> Revenue target × gross margin = gross profit available</li>
  <li><strong>Determine what fraction of gross profit you are willing to spend on acquisition:</strong> This is your marketing efficiency ratio. Most DTC brands target 30–50% of gross profit on acquisition in growth phases.</li>
  <li><strong>That determines your maximum budget:</strong> Revenue target × gross margin × marketing efficiency ratio</li>
</ol>
<p>Example: $100,000 revenue target, 45% gross margin, 40% marketing efficiency. Maximum ad budget = $100,000 × 0.45 × 0.40 = $18,000.</p>
<p>Verify against ROAS: $100,000 revenue ÷ $18,000 spend = 5.56x ROAS required. Is that achievable in your category? If not, adjust the efficiency ratio or the revenue target.</p>

<h2>The Budget as a Percentage of Revenue</h2>
<p>Inverting the framework gives you your budget as a percentage of revenue: 45% gross margin × 40% efficiency = 18% of revenue on ads. This is what your business can sustain given its economics. It is not derived from what competitors spend — it is derived from your own margin structure.</p>
<p>If your gross margin were 30%, the same efficiency ratio would give you 12% of revenue. Trying to spend 18% would mean you are spending advertising dollars you do not have the margin to support.</p>

<h2>Organic Revenue: The Modifier You Must Account For</h2>
<p>Your paid ad budget should only target the revenue you need from paid channels. If 30% of your revenue is organic (SEO, social, word-of-mouth), your paid target is 70% of your overall revenue target. Ignoring organic revenue leads to over-spending on paid channels and subsidising acquisition for customers who were going to come anyway.</p>
<p>Track your organic revenue fraction monthly. As your brand grows and SEO compounds, your organic percentage should increase — and your required ad spend as a percentage of total revenue should decrease even as absolute ad spend grows.</p>

<h2>The Monthly Budget Phasing Problem</h2>
<p>Ad spend is not evenly efficient across the month. The first few days of a new campaign or month often have higher CPMs as your algorithms re-learn. End of month often sees aggressive competitor bidding that raises costs. A fixed monthly budget spent evenly can underperform a flexible budget that concentrates spend in your historically highest-efficiency windows.</p>
<p>Most platforms allow you to set campaign-level budgets with daily caps. Use this to front-load spend in identified high-conversion periods (often mid-week, Tuesday through Thursday for most B2C categories) and pull back on your low-conversion windows. Same total budget, better average ROAS.</p>
`
}

// Export all as array to spread into BLOG_POSTS in posts.ts
export const ADDITIONAL_BLOG_POSTS = [
  POST_BREAK_EVEN_UNITS,
  POST_CASH_FLOW_RUNWAY,
  POST_CAC,
  POST_PRICING_STRATEGY,
  POST_REFUND_RATE,
  POST_BUNDLE_PRICING,
  POST_INFLUENCER_ROI,
  POST_SHIPPING,
  POST_ETSY,
  POST_PROFIT_PER_SKU,
  POST_AD_SPEND,
]
