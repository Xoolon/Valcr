export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  keywords: string[]
  calculatorSlug?: string
  calculatorCta?: string
  content: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'true-landed-cost-guide',
    title: 'The Complete Guide to True Landed Cost for E-Commerce',
    excerpt: 'Most Shopify stores are underpricing their products because they only count COGS. True landed cost includes customs duty, payment processing fees, return rates, and more.',
    category: 'Margins',
    readTime: '8 min read',
    date: 'Feb 28, 2025',
    keywords: ['landed cost calculator', 'true landed cost ecommerce', 'how to calculate landed cost', 'ecommerce unit economics'],
    calculatorSlug: 'true-landed-cost',
    calculatorCta: 'Calculate your true landed cost',
    content: `
<h2>Why Most E-Commerce Sellers Are Underpricing Their Products</h2>
<p>Ask a typical Shopify store owner what their unit cost is and they'll tell you the price their supplier charges. Maybe they'll add shipping. But that number is almost always wrong — usually by 20 to 40 percent.</p>
<p>True landed cost is the total cost of a unit <em>at the point of sale</em> — after every fee, every duty, every return, and every payment processing charge has been accounted for. It is the only number that gives you an accurate picture of your margin.</p>

<h2>What Goes Into True Landed Cost</h2>
<p>A complete landed cost calculation includes six components:</p>

<h3>1. Product Cost (COGS)</h3>
<p>The price your supplier charges per unit. This is what most sellers start and stop with. It is just the beginning.</p>

<h3>2. Inbound Shipping</h3>
<p>The cost to get inventory from your supplier to your warehouse or 3PL. For international shipments this includes freight forwarding fees, port handling charges, and last-mile delivery. Allocate this per unit based on your typical order quantities.</p>

<h3>3. Customs Duty</h3>
<p>If you import goods, your government charges import duty on the declared value of those goods. Rates vary by product category (HS code) and country of origin. For US imports, most consumer goods carry duties between 0 and 20 percent. You can look up your exact rate using the US International Trade Commission tariff schedule at usitc.gov.</p>
<p>Example: A product with a $15 COGS and a 5% duty rate adds $0.75 per unit. On a product selling for $49.99, that is 1.5% of your selling price — real money at scale.</p>

<h3>4. Payment Processing Fees</h3>
<p>Stripe, PayPal, and Shopify Payments all charge a percentage plus a flat fee on every transaction. The standard rate is 2.9% + $0.30. On a $49.99 sale that is $1.75 — every single time. This is one of the most-overlooked costs in e-commerce unit economics.</p>
<p>If you are on Shopify and not using Shopify Payments, you also pay an additional transaction fee of 0.5% to 2% depending on your plan. That can add up to hundreds of dollars per month at any real revenue level.</p>

<h3>5. Return Rate Cost</h3>
<p>Returns do not just mean you refund the customer. You also often absorb return shipping, lose the product to damage, and pay restocking labour. A 5% return rate means for every 100 units you sell, 5 come back. The cost of those 5 returns spreads across all 100 sales and increases your effective cost per unit.</p>
<p>Industry average return rates by category: apparel 20–30%, electronics 15–20%, beauty 5–10%, home goods 8–12%. If you are in apparel and ignoring returns in your unit economics, your margin picture is severely distorted.</p>

<h3>6. Outbound Shipping</h3>
<p>If you offer free shipping, the cost is yours entirely. If you charge for shipping, the portion above what you charge adds to landed cost. Many stores charge flat-rate shipping that does not cover their actual cost on heavy or oversized items.</p>

<h2>The Landed Cost Formula</h2>
<p>Putting it together:</p>
<p><strong>Landed Cost = Product Cost + Inbound Shipping + (Product Cost × Customs Rate) + (Selling Price × Payment Rate + Flat Fee) + (Product Cost + Shipping) × Return Rate</strong></p>
<p>Once you have your landed cost, your gross margin is simply:</p>
<p><strong>Gross Margin = (Selling Price − Landed Cost) ÷ Selling Price × 100</strong></p>

<h2>What Is a Healthy Gross Margin for E-Commerce?</h2>
<p>Benchmarks vary by category, but as a general guide:</p>
<ul>
  <li><strong>Below 30%</strong> — Difficult to operate. Ad spend, platform fees, and overheads will almost certainly push you into loss.</li>
  <li><strong>30–50%</strong> — Viable but tight. Little room for error on CAC or returns.</li>
  <li><strong>50–70%</strong> — Healthy. You can invest in growth and absorb volatility.</li>
  <li><strong>Above 70%</strong> — Excellent. Typical of private-label products with strong supplier relationships.</li>
</ul>

<h2>How to Use This in Pricing Decisions</h2>
<p>The right way to price is to start from your target margin and work backward. If you want a 55% gross margin and your landed cost is $22, your minimum selling price is $22 ÷ (1 − 0.55) = $48.89. Anything below that and you are not hitting your margin target before a single dollar of operating expense.</p>
<p>Run this calculation before you launch any new product. If the math does not work at a price the market will bear, the product economics do not work — no amount of volume will fix a negative contribution margin.</p>
    `,
  },
  {
    slug: 'break-even-roas-explained',
    title: 'Break-Even ROAS: The Number Every Meta Advertiser Needs to Know',
    excerpt: 'ROAS alone tells you nothing about profitability. Break-even ROAS is the minimum return you need before a campaign costs you money. We explain the formula and common mistakes.',
    category: 'Advertising',
    readTime: '6 min read',
    date: 'Feb 14, 2025',
    keywords: ['break even roas', 'roas calculator', 'what is a good roas', 'meta ads roas', 'facebook ads profitability'],
    calculatorSlug: 'roas-calculator',
    calculatorCta: 'Calculate your break-even ROAS',
    content: `
<h2>The Problem With Optimising for ROAS</h2>
<p>ROAS — Return on Ad Spend — is the metric most e-commerce advertisers use to judge campaign performance. A 4x ROAS means you earned $4 for every $1 spent. Simple, clean, easy to report. Also almost completely useless on its own.</p>
<p>Here is why: a 4x ROAS on a product with 80% gross margin is highly profitable. A 4x ROAS on a product with 20% gross margin after fees is a money-losing campaign. The ROAS number is identical. The outcomes are opposite.</p>
<p>Break-even ROAS fixes this. It is the minimum ROAS your campaign needs to achieve before it stops costing you money. Every dollar above break-even is profit. Every dollar below is a loss.</p>

<h2>How to Calculate Break-Even ROAS</h2>
<p>The formula is straightforward:</p>
<p><strong>Break-Even ROAS = 1 ÷ (1 − Total Cost Percentage)</strong></p>
<p>Where total cost percentage is the sum of all your variable costs as a share of revenue: COGS, platform fees, payment processing, and any overhead you want to include.</p>
<p>Example: If your COGS is 35% of revenue, platform fees are 5%, and payment processing is 3%, your total cost percentage is 43%. Your break-even ROAS is 1 ÷ (1 − 0.43) = 1.75x.</p>
<p>That means any campaign returning above 1.75x ROAS is contributing to profit. Below 1.75x and you are paying for customers at a loss.</p>

<h2>Why Most Advertisers Set Their ROAS Targets Too High</h2>
<p>It is common to see brands chasing 3x, 4x, or even 5x ROAS targets without knowing what their break-even actually is. In many cases the break-even is 1.4x or 1.6x — meaning campaigns at 2.5x ROAS that are being paused are actually quite profitable.</p>
<p>Overly aggressive ROAS targets lead to under-spending on acquisition, stunted growth, and over-reliance on returning customers. If you are consistently hitting your ROAS target, it may be too high.</p>

<h2>What Is a Good ROAS for E-Commerce?</h2>
<p>There is no universal answer — it depends entirely on your margins. But here are some rough benchmarks by category:</p>
<ul>
  <li><strong>Apparel:</strong> Break-even typically around 2.0–2.5x. Target 3.5–5x for healthy profitability.</li>
  <li><strong>Beauty and skincare:</strong> Break-even often 1.6–2.0x due to higher margins. Target 3–4x.</li>
  <li><strong>Electronics and tech accessories:</strong> Low margins mean break-even can be 3–4x. Be careful.</li>
  <li><strong>Supplements and consumables:</strong> Good margins, high repeat rate. Break-even 1.5–2.0x. LTV changes the math significantly.</li>
</ul>

<h2>The LTV Adjustment</h2>
<p>Break-even ROAS assumes a single purchase. If your product has strong repeat purchase rates, you can afford to acquire at a loss on the first order and recoup it on subsequent orders. This is why subscription businesses and high-repeat categories can sustain lower initial ROAS targets.</p>
<p>A customer who buys three times per year at $60 AOV has a 12-month LTV of $180. If your blended contribution margin is 50%, that customer is worth $90 in gross profit. If your CAC is $40, you are profitable over 12 months even if the first transaction barely covers costs.</p>
<p>Understanding LTV-adjusted break-even ROAS separates growing brands from ones that optimise themselves into stagnation.</p>

<h2>How to Use Break-Even ROAS in Practice</h2>
<p>Calculate your break-even ROAS before you launch any campaign. Use it as your floor, not your target. Set your campaign targets 30–50% above break-even to give yourself margin for error and creative variation. If campaigns cannot reach break-even consistently, the problem is either the creative, the audience, or the product margin — not the ROAS target.</p>
    `,
  },
  {
    slug: 'inventory-reorder-point-safety-stock',
    title: 'Reorder Points and Safety Stock: How to Never Stock Out Again',
    excerpt: 'Stockouts cost you more than just lost sales — they tank your Amazon rank and train customers to buy elsewhere. This guide walks through the maths of reorder points and safety stock.',
    category: 'Inventory',
    readTime: '10 min read',
    date: 'Jan 31, 2025',
    keywords: ['reorder point formula', 'safety stock calculation', 'inventory management ecommerce', 'stockout prevention', 'reorder point calculator'],
    calculatorSlug: 'inventory-reorder-point',
    calculatorCta: 'Calculate your reorder point and safety stock',
    content: `
<h2>The Real Cost of a Stockout</h2>
<p>Most inventory guides tell you stockouts cost you lost sales. That is true but it understates the damage considerably. When you go out of stock on Amazon, your organic ranking drops immediately and takes weeks to recover. When a returning customer finds your Shopify store out of stock, a meaningful percentage of them do not come back. And when you scramble to restock with an emergency air shipment instead of sea freight, your landed cost can triple.</p>
<p>The solution is a proper reorder system — a calculated reorder point that automatically triggers a purchase order before you run out.</p>

<h2>What Is a Reorder Point?</h2>
<p>A reorder point (ROP) is the inventory level at which you place a new purchase order. When your stock drops to this number, you order immediately. The reorder point is calculated to ensure you do not run out of stock before your new order arrives, even if demand is higher than expected or your supplier is slower than usual.</p>
<p><strong>Reorder Point = Average Daily Demand × Lead Time + Safety Stock</strong></p>
<p>For example: if you sell 25 units per day on average and your supplier takes 14 days to deliver, your base reorder point is 350 units. Add safety stock on top of that.</p>

<h2>What Is Safety Stock?</h2>
<p>Safety stock is a buffer above your expected demand during lead time. It exists to absorb two types of variability: demand spikes and supplier delays. Without it, any deviation from average causes a stockout.</p>
<p>The safety stock formula used by most inventory systems is:</p>
<p><strong>Safety Stock = Z × √(Lead Time × Demand SD² + Daily Demand² × Lead Time SD²)</strong></p>
<p>Where Z is a multiplier based on your desired service level:</p>
<ul>
  <li>90% service level: Z = 1.28</li>
  <li>95% service level: Z = 1.645</li>
  <li>99% service level: Z = 2.33</li>
</ul>
<p>A 95% service level means you will have stock available 95% of the time a customer wants to buy. The higher your service level, the more safety stock you carry, and the higher your carrying costs.</p>

<h2>How to Choose Your Service Level</h2>
<p>Service level is a business decision, not a math problem. The right level depends on:</p>
<ul>
  <li><strong>Stockout consequences:</strong> On Amazon, a stockout is catastrophic for rankings. A 99% service level is often justified. On a DTC Shopify store with a waitlist option, 90% may be fine.</li>
  <li><strong>Product margin:</strong> High-margin products can absorb more carrying cost to maintain higher service levels. Low-margin products need to minimise tied-up capital.</li>
  <li><strong>Supplier reliability:</strong> Highly variable lead times justify higher safety stock. Consistent suppliers allow you to carry less buffer.</li>
</ul>

<h2>A Worked Example</h2>
<p>You sell a skincare product with these characteristics: average daily demand 20 units (SD 4), average lead time 10 days (SD 2), desired service level 95% (Z = 1.645).</p>
<p>Variance: √(10 × 16 + 400 × 4) = √(160 + 1600) = √1760 ≈ 41.95</p>
<p>Safety stock: 1.645 × 41.95 ≈ 69 units</p>
<p>Reorder point: (20 × 10) + 69 = 269 units</p>
<p>When your inventory hits 269 units, place your order. By the time it arrives, your safety buffer is intact.</p>

<h2>Common Mistakes</h2>
<p><strong>Using monthly demand instead of daily:</strong> Reorder points are calculated in the same time unit as lead time. If lead time is in days, demand must be daily.</p>
<p><strong>Ignoring lead time variability:</strong> If your supplier is sometimes 8 days and sometimes 16 days, that variance belongs in the formula. Using average lead time alone understates your safety stock requirement significantly.</p>
<p><strong>Setting a reorder point and never updating it:</strong> Seasonal demand shifts, new marketing campaigns, and changing supplier relationships all change your optimal reorder point. Review quarterly at minimum.</p>
    `,
  },
  {
    slug: 'subscription-ltv-churn',
    title: 'Why Churn Rate Destroys LTV Faster Than You Think',
    excerpt: 'A 5% monthly churn rate means losing 46% of your customers every year. The compounding effect on LTV is brutal — and most subscription businesses do not realise how sensitive their unit economics are to small churn improvements.',
    category: 'Subscriptions',
    readTime: '7 min read',
    date: 'Jan 15, 2025',
    keywords: ['subscription ltv calculator', 'churn rate impact', 'customer lifetime value', 'subscription business metrics', 'how to calculate ltv'],
    calculatorSlug: 'subscription-ltv',
    calculatorCta: 'Calculate your subscription LTV',
    content: `
<h2>The Compounding Destruction of Churn</h2>
<p>Five percent monthly churn sounds manageable. You are losing one in twenty customers every month. But compounding works against you brutally in subscription businesses. After 12 months at 5% monthly churn, you retain only 54% of your original cohort. After 24 months, 29%. After 36 months, 16%.</p>
<p>Most subscription founders think of churn as a monthly problem. It is actually a compounding problem that shapes every unit economics metric in your business.</p>

<h2>How Churn Rate Determines LTV</h2>
<p>Customer Lifetime Value in a subscription model is determined primarily by churn rate. The formula for average customer lifespan is:</p>
<p><strong>Average Customer Lifespan (months) = 1 ÷ Monthly Churn Rate</strong></p>
<p>At 5% monthly churn, average lifespan is 20 months. At 3% churn, it is 33 months. At 10% churn, it is 10 months.</p>
<p>Your gross LTV then is:</p>
<p><strong>Gross LTV = Monthly Price × (1 − Refund Rate) × (1 − COGS%) × Average Lifespan</strong></p>

<h2>The Sensitivity of LTV to Small Churn Changes</h2>
<p>Consider a subscription at $29/month with 30% COGS:</p>
<ul>
  <li>At 10% churn: lifespan 10 months, gross LTV = $203</li>
  <li>At 5% churn: lifespan 20 months, gross LTV = $406</li>
  <li>At 3% churn: lifespan 33 months, gross LTV = $670</li>
</ul>
<p>Reducing churn from 5% to 3% — a two percentage point improvement — more than doubles LTV. That same improvement makes a CAC of $150 generate a 4.5x LTV:CAC ratio instead of 2.7x. Same product, same acquisition economics. Dramatically different business.</p>

<h2>What Is a Healthy LTV:CAC Ratio?</h2>
<p>The generally accepted benchmark is 3:1 — for every $1 spent acquiring a customer, you generate $3 in gross LTV. Below 1:1 means you are losing money on every customer you acquire. Between 1:1 and 3:1 is viable but leaves little margin for error. Above 5:1 often means you are under-investing in acquisition and leaving growth on the table.</p>

<h2>Payback Period Matters More Than LTV in Early Stage</h2>
<p>LTV is a long-term metric. What matters more early on is payback period — how many months until revenue from a customer covers the cost of acquiring them.</p>
<p><strong>Payback Period = CAC ÷ Monthly Gross Contribution</strong></p>
<p>A 12-month or shorter payback period is generally healthy for a bootstrapped subscription business. Beyond 18 months and you need significant working capital to grow.</p>

<h2>How to Reduce Churn: The Levers That Actually Work</h2>
<p><strong>Voluntary churn</strong> is reduced by improving product value, onboarding, and engagement. The most common reason customers cancel is not that they dislike the product — it is that they forget they are subscribed or do not use it enough to feel it is worth it.</p>
<p><strong>Involuntary churn</strong> — failed payments — is often 20–30% of total churn and is almost entirely preventable. Dunning sequences, smart payment retries, and card updater services can recover 40–60% of failed payment churn with minimal effort.</p>
    `,
  },
  {
    slug: 'amazon-fba-true-profit',
    title: 'Amazon FBA: What Your True Profit Margin Actually Is',
    excerpt: 'Between referral fees, fulfilment fees, storage fees, PPC spend, inbound shipping, and prep costs — most FBA sellers have no idea what they are actually making per unit.',
    category: 'Amazon',
    readTime: '9 min read',
    date: 'Jan 3, 2025',
    keywords: ['amazon fba profit calculator', 'amazon fba fees', 'fba profit margin', 'amazon seller fees', 'how to calculate amazon fba profit'],
    calculatorSlug: 'amazon-fba-calculator',
    calculatorCta: 'Calculate your true FBA profit',
    content: `
<h2>The Amazon Fee Stack Most Sellers Underestimate</h2>
<p>Amazon FBA sellers face one of the most complex fee structures in e-commerce. Unlike a Shopify store where you pay a plan fee and payment processing, FBA involves a layered stack of fees that each take a bite out of your revenue. Most sellers have a rough idea of their referral fee. Few account for all six components that determine true FBA profit.</p>

<h2>The Six Costs in FBA Unit Economics</h2>

<h3>1. Product Cost (COGS)</h3>
<p>Your supplier price per unit. The starting point, and for most FBA sellers the largest single cost.</p>

<h3>2. Inbound Shipping</h3>
<p>Getting your inventory from your supplier to Amazon's fulfilment centres. For imports from China this includes sea freight, port fees, customs clearance, and domestic trucking. Budget $0.50–$2.00 per unit for a typical small-to-medium sized product depending on weight and shipping method.</p>

<h3>3. Amazon Referral Fee</h3>
<p>Amazon charges a percentage of the selling price for every item sold. The rate varies by category. Most consumer goods are 15%. Certain electronics categories are 8%. Jewellery can be 20%. Check the Amazon fee schedule for your specific category — it matters.</p>

<h3>4. FBA Fulfilment Fee</h3>
<p>Amazon's fee for picking, packing, and shipping your order. It is charged per unit and is based on the product's size tier. As of 2024, fees for a standard small item under 1 lb start around $3.22. Oversized items can pay $10+ in fulfilment fees alone. This fee increases every February — build in a buffer.</p>

<h3>5. Monthly Storage Fee</h3>
<p>Amazon charges per cubic foot of storage space used. Standard rates are $0.75/cubic foot (January–September) and $2.40/cubic foot (October–December peak surcharge). Slow-moving inventory left in warehouses becomes increasingly expensive. Inventory sitting 365+ days triggers long-term storage fees.</p>

<h3>6. PPC Spend Per Unit</h3>
<p>Almost every competitive Amazon category requires Pay-Per-Click advertising to maintain visibility. Your PPC cost per unit is your total monthly ad spend divided by units sold. For new products in competitive categories, PPC can add $2–5+ per unit to your effective cost. This is the cost most sellers forget to include.</p>

<h2>The FBA Profit Formula</h2>
<p><strong>Net Profit = Selling Price − COGS − Inbound Shipping − Referral Fee − Fulfilment Fee − Storage Fee − Prep Cost − PPC Per Unit</strong></p>
<p><strong>Net Margin = Net Profit ÷ Selling Price × 100</strong></p>
<p><strong>ROI = Net Profit ÷ COGS × 100</strong></p>

<h2>What Are Good FBA Benchmarks?</h2>
<ul>
  <li><strong>Net margin below 10%</strong> — Very tight. One fee increase or a PPC efficiency drop can make the product unprofitable.</li>
  <li><strong>Net margin 15–25%</strong> — Healthy for most FBA categories. Enough buffer to absorb volatility.</li>
  <li><strong>Net margin above 30%</strong> — Strong. Usually indicates good supplier relationships or low competition.</li>
  <li><strong>ROI above 50%</strong> — Good capital efficiency. Your inventory is working hard.</li>
</ul>

<h2>The Most Common Margin Killer: Storage Fees on Slow Movers</h2>
<p>The biggest margin mistakes in FBA are usually not in the fee calculations — they are in inventory planning. Sending too much inventory to Amazon and paying months of storage fees on slow-moving stock is one of the most common ways FBA sellers erode profit. Calculate your ideal inventory days-of-cover (usually 30–60 days) and ship accordingly.</p>
    `,
  },
  {
    slug: 'chargeback-rate-visa-threshold',
    title: 'The Chargeback Rate That Gets Your Account Terminated',
    excerpt: 'Visa\'s standard chargeback threshold is 0.9%. Exceed it for two consecutive months and you\'re in the Standard Monitoring Program. Here\'s what chargebacks are really costing you.',
    category: 'Payments',
    readTime: '5 min read',
    date: 'Dec 19, 2024',
    keywords: ['chargeback rate ecommerce', 'visa chargeback threshold', 'chargeback impact calculator', 'how to reduce chargebacks', 'merchant chargeback rate'],
    calculatorSlug: 'chargeback-impact',
    calculatorCta: 'Calculate your chargeback impact',
    content: `
<h2>What Is a Chargeback and Why It Costs More Than the Refund</h2>
<p>A chargeback happens when a customer disputes a charge directly with their bank instead of requesting a refund through you. The bank reverses the transaction, takes the money back, and charges you a dispute fee on top. You lose the sale, lose the product, pay a fee, and spend staff time responding to the dispute.</p>
<p>But the real cost of chargebacks is not any individual transaction — it is the cumulative rate and what happens when it gets too high.</p>

<h2>The Thresholds That Matter</h2>
<p><strong>Visa Chargeback Monitoring Program (VCMP):</strong></p>
<ul>
  <li>Standard threshold: 0.9% chargeback rate and 100+ chargebacks per month</li>
  <li>High-risk threshold: 1.8% chargeback rate and 500+ chargebacks per month</li>
</ul>
<p><strong>Mastercard Excessive Chargeback Program (ECP):</strong></p>
<ul>
  <li>Excessive threshold: 1.5% chargeback rate and 100+ chargebacks per month</li>
  <li>High excessive threshold: 3.0% chargeback rate and 300+ chargebacks per month</li>
</ul>
<p>Once enrolled in a monitoring program, you have a remediation period to bring your rate down. If you fail, fines escalate and your merchant account can be terminated. Getting a new merchant account after termination is extremely difficult — you end up on the MATCH list, which most processors check before onboarding.</p>

<h2>What Your Chargeback Rate Is Actually Costing You Per Month</h2>
<p>Example: 500 transactions at $75 AOV, 1% chargeback rate, 30% win rate, $25 dispute fee:</p>
<ul>
  <li>Monthly chargebacks: 5</li>
  <li>Lost revenue (70% of disputes lost): 5 × $75 × 0.70 = $262.50</li>
  <li>Lost product cost (35% COGS): 5 × $75 × 0.35 × 0.70 = $91.88</li>
  <li>Dispute fees: 5 × $25 = $125</li>
  <li><strong>Total monthly loss: ~$479 | Annual: ~$5,750</strong></li>
</ul>
<p>At scale these numbers multiply quickly. A business doing 10,000 transactions per month at a 1% chargeback rate is losing $95,000+ per year.</p>

<h2>The Most Common Causes of Chargebacks</h2>
<p><strong>Friendly fraud (40–60%):</strong> The customer received the product but disputes the charge anyway. The best defence is clear billing descriptors, delivery confirmation, and a clear return policy.</p>
<p><strong>Item not received (20–30%):</strong> Shipping delays or delivery failures. Use tracked shipping and proactively communicate delays.</p>
<p><strong>Item not as described (10–20%):</strong> Product does not match the listing. Improve product photos and descriptions.</p>
<p><strong>Unauthorised transaction (10–15%):</strong> Actual fraud or a family member's purchase. Address Verification Service and 3D Secure authentication reduce this significantly.</p>

<h2>How to Reduce Your Chargeback Rate</h2>
<ol>
  <li>Make your billing descriptor clear and recognisable — many chargebacks happen because the customer does not recognise the charge</li>
  <li>Send proactive shipping confirmation and delivery notifications</li>
  <li>Enable 3D Secure for high-risk transactions — shifts fraud liability to the card issuer</li>
  <li>Have a visible, easy refund policy — customers who can easily get a refund rarely dispute</li>
  <li>Respond to every dispute with evidence — tracking numbers, delivery confirmation, communication records</li>
</ol>
    `,
  },
]