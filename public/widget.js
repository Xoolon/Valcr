
(function (global) {
  'use strict';

  var API_BASE = 'https://api.valcr.site/api/v1';
  var VERSION = '1.1.0';

  // ─── Calculator Definitions ─────────────────────────────────────────────────

  var CALCULATORS = {

    // 1. True Landed Cost
    'true-landed-cost': {
      name: 'True Landed Cost',
      fields: [
        { key: 'product_cost',            label: 'Product Cost',              prefix: '$', default: 15.00, min: 0 },
        { key: 'shipping_cost',           label: 'Shipping Cost (per unit)',   prefix: '$', default: 3.50,  min: 0 },
        { key: 'customs_duty_rate',       label: 'Customs Duty Rate',          suffix: '%', default: 5,     min: 0, max: 100 },
        { key: 'payment_processing_rate', label: 'Payment Processing Rate',    suffix: '%', default: 2.9,   min: 0, max: 10 },
        { key: 'payment_processing_flat', label: 'Payment Processing Flat Fee',prefix: '$', default: 0.30,  min: 0 },
        { key: 'return_rate',             label: 'Return Rate',                suffix: '%', default: 5,     min: 0, max: 100 },
        { key: 'selling_price',           label: 'Selling Price',              prefix: '$', default: 49.99, min: 0 }
      ],
      calculate: function (v) {
        var duty = v.product_cost * (v.customs_duty_rate / 100);
        var payFee = v.selling_price * (v.payment_processing_rate / 100) + v.payment_processing_flat;
        var returnCost = (v.product_cost + v.shipping_cost) * (v.return_rate / 100);
        var landed = v.product_cost + v.shipping_cost + duty + payFee + returnCost;
        var grossProfit = v.selling_price - landed;
        var grossMargin = v.selling_price > 0 ? (grossProfit / v.selling_price) * 100 : 0;
        var costPct = v.selling_price > 0 ? (landed / v.selling_price) * 100 : 0;
        return {
          landed_cost:    { label: 'True Landed Cost',  value: landed,       prefix: '$', highlight: true },
          gross_profit:   { label: 'Gross Profit',      value: grossProfit,  prefix: '$', highlight: false },
          gross_margin:   { label: 'Gross Margin',      value: grossMargin,  suffix: '%', highlight: false },
          cost_breakdown: { label: 'Cost as % of Price',value: costPct,      suffix: '%', highlight: false }
        };
      }
    },

    // 2. Shopify Profit Margin
    'shopify-profit-margin': {
      name: 'Shopify Profit Margin',
      fields: [
        { key: 'revenue',    label: 'Monthly Revenue',    prefix: '$', default: 10000, min: 0 },
        { key: 'cogs',       label: 'Cost of Goods Sold', prefix: '$', default: 4000,  min: 0 },
        { key: 'shopify_plan', label: 'Shopify Plan Monthly Fee', prefix: '$', default: 39, min: 0,
          description: 'Starter $5 / Basic $39 / Shopify $105 / Advanced $399 / Plus $2300' },
        { key: 'transaction_fee_pct', label: 'Transaction Fee %', suffix: '%', default: 2, min: 0, max: 5,
          description: '0% with Shopify Payments, 0.5–2% without' },
        { key: 'app_costs',  label: 'Monthly App Costs',  prefix: '$', default: 150,   min: 0 },
        { key: 'ad_spend',   label: 'Monthly Ad Spend',   prefix: '$', default: 1500,  min: 0 }
      ],
      calculate: function (v) {
        var txFee = v.revenue * (v.transaction_fee_pct / 100);
        var shopifyFees = v.shopify_plan + txFee + v.app_costs;
        var netProfit = v.revenue - v.cogs - shopifyFees - v.ad_spend;
        var netMargin = v.revenue > 0 ? (netProfit / v.revenue) * 100 : 0;
        var cogsPct = v.revenue > 0 ? (v.cogs / v.revenue) * 100 : 0;
        return {
          net_profit:          { label: 'Net Profit',          value: netProfit,   prefix: '$', highlight: true },
          net_margin:          { label: 'Net Margin',          value: netMargin,   suffix: '%', highlight: true },
          shopify_fees_total:  { label: 'Total Shopify Fees',  value: shopifyFees, prefix: '$', highlight: false },
          effective_cogs_pct:  { label: 'Effective COGS %',    value: cogsPct,     suffix: '%', highlight: false }
        };
      }
    },

    // 3. Break-Even Units
    'break-even-units': {
      name: 'Break-Even Calculator',
      fields: [
        { key: 'fixed_costs',           label: 'Monthly Fixed Costs',      prefix: '$', default: 2000, min: 0 },
        { key: 'variable_cost_per_unit',label: 'Variable Cost per Unit',   prefix: '$', default: 12,   min: 0 },
        { key: 'selling_price',         label: 'Selling Price per Unit',   prefix: '$', default: 39,   min: 0.01 }
      ],
      calculate: function (v) {
        var contribution = v.selling_price - v.variable_cost_per_unit;
        var units = contribution > 0 ? Math.ceil(v.fixed_costs / contribution) : 0;
        var revenue = units * v.selling_price;
        var cmRatio = v.selling_price > 0 ? (contribution / v.selling_price) * 100 : 0;
        return {
          break_even_units:          { label: 'Break-Even Units / Month', value: units,       highlight: true },
          break_even_revenue:        { label: 'Break-Even Revenue',       value: revenue,     prefix: '$', highlight: true },
          contribution_margin:       { label: 'Contribution Margin',      value: contribution,prefix: '$', highlight: false },
          contribution_margin_ratio: { label: 'Contribution Margin %',    value: cmRatio,     suffix: '%', highlight: false }
        };
      }
    },

    // 4. ROAS Calculator
    'roas-calculator': {
      name: 'ROAS Calculator',
      fields: [
        { key: 'ad_spend',          label: 'Monthly Ad Spend',              prefix: '$', default: 5000,  min: 0 },
        { key: 'revenue_from_ads',  label: 'Revenue from Ads',              prefix: '$', default: 20000, min: 0 },
        { key: 'cogs_percent',      label: 'COGS as % of Revenue',          suffix: '%', default: 35,    min: 0, max: 100 },
        { key: 'platform_fees_percent', label: 'Platform Fees %',           suffix: '%', default: 5,     min: 0, max: 20 },
        { key: 'overhead_percent',  label: 'Fixed Overhead % of Revenue',   suffix: '%', default: 10,    min: 0, max: 100 }
      ],
      calculate: function (v) {
        var roas = v.ad_spend > 0 ? v.revenue_from_ads / v.ad_spend : 0;
        var totalVarPct = v.cogs_percent + v.platform_fees_percent + v.overhead_percent;
        var profitFromAds = v.revenue_from_ads * (1 - totalVarPct / 100) - v.ad_spend;
        var breakEvenRoas = totalVarPct < 100 ? 1 / (1 - totalVarPct / 100) : 0;
        var netMargin = v.revenue_from_ads > 0 ? (profitFromAds / v.revenue_from_ads) * 100 : 0;
        return {
          roas:                         { label: 'ROAS',                      value: roas,          suffix: 'x', highlight: true },
          profit_from_ads:              { label: 'Profit from Ad Revenue',     value: profitFromAds, prefix: '$', highlight: true },
          break_even_roas:              { label: 'Break-Even ROAS',            value: breakEvenRoas, suffix: 'x', highlight: false },
          profit_margin_on_ad_revenue:  { label: 'Net Margin on Ad Revenue',   value: netMargin,     suffix: '%', highlight: false }
        };
      }
    },

    // 5. Customer Acquisition Cost
    'customer-acquisition-cost': {
      name: 'CAC Calculator',
      fields: [
        { key: 'total_marketing_spend', label: 'Total Monthly Marketing Spend', prefix: '$', default: 8000,  min: 0 },
        { key: 'sales_salaries',        label: 'Sales & Marketing Salaries',    prefix: '$', default: 2000,  min: 0 },
        { key: 'tools_software',        label: 'Tools & Software (monthly)',     prefix: '$', default: 300,   min: 0 },
        { key: 'new_customers',         label: 'New Customers This Month',                   default: 150,   min: 1 },
        { key: 'avg_order_value',       label: 'Average Order Value',           prefix: '$', default: 65,    min: 0 },
        { key: 'repeat_purchase_rate',  label: 'Repeat Purchase Rate (12mo)',   suffix: '%', default: 30,    min: 0, max: 100 }
      ],
      calculate: function (v) {
        var totalSpend = v.total_marketing_spend + v.sales_salaries + v.tools_software;
        var cac = v.new_customers > 0 ? totalSpend / v.new_customers : 0;
        var ltv12 = v.avg_order_value * (1 + v.repeat_purchase_rate / 100);
        var ltvCac = cac > 0 ? ltv12 / cac : 0;
        var payback = v.avg_order_value > 0 ? Math.ceil(cac / (v.avg_order_value / 12)) : 0;
        return {
          blended_cac:   { label: 'Blended CAC',         value: cac,     prefix: '$', highlight: true },
          ltv_12mo:      { label: '12-Month LTV',         value: ltv12,   prefix: '$', highlight: true },
          ltv_cac_ratio: { label: 'LTV:CAC Ratio',        value: ltvCac,  suffix: 'x', highlight: false },
          payback_months:{ label: 'CAC Payback Period',   value: payback, suffix: ' mo', highlight: false }
        };
      }
    },

    // 6. Inventory Reorder Point
    'inventory-reorder-point': {
      name: 'Reorder Point Calculator',
      fields: [
        { key: 'daily_demand',          label: 'Average Daily Unit Sales',      default: 25,  min: 1 },
        { key: 'demand_variability',    label: 'Demand Variability (std dev/day)', default: 5, min: 0 },
        { key: 'lead_time_days',        label: 'Supplier Lead Time (days)',      default: 14,  min: 1 },
        { key: 'lead_time_variability', label: 'Lead Time Variability (days)',   default: 3,   min: 0 },
        { key: 'service_level_z',       label: 'Service Level Z-Score',          default: 1.65, min: 0,
          description: '90%=1.28 / 95%=1.65 / 99%=2.33' }
      ],
      calculate: function (v) {
        var avgLeadDemand = v.daily_demand * v.lead_time_days;
        var safety = v.service_level_z * Math.sqrt(
          v.lead_time_days * Math.pow(v.demand_variability, 2) +
          Math.pow(v.daily_demand, 2) * Math.pow(v.lead_time_variability, 2)
        );
        var rop = Math.ceil(avgLeadDemand + safety);
        var safetyDays = v.daily_demand > 0 ? safety / v.daily_demand : 0;
        return {
          reorder_point:       { label: 'Reorder Point (units)',         value: rop,            suffix: ' units', highlight: true },
          safety_stock:        { label: 'Safety Stock',                  value: Math.ceil(safety), suffix: ' units', highlight: true },
          avg_lead_time_demand:{ label: 'Avg Demand During Lead Time',   value: Math.ceil(avgLeadDemand), suffix: ' units', highlight: false },
          days_of_safety_stock:{ label: 'Days of Safety Stock',          value: Math.ceil(safetyDays), suffix: ' days', highlight: false }
        };
      }
    },

    // 7. Cash Flow Runway
    'cash-flow-runway': {
      name: 'Cash Flow Runway',
      fields: [
        { key: 'cash_balance',       label: 'Current Cash Balance',   prefix: '$', default: 50000, min: 0 },
        { key: 'monthly_revenue',    label: 'Monthly Revenue',        prefix: '$', default: 15000, min: 0 },
        { key: 'monthly_expenses',   label: 'Total Monthly Expenses', prefix: '$', default: 22000, min: 0 },
        { key: 'monthly_cogs',       label: 'Monthly COGS',           prefix: '$', default: 6000,  min: 0 },
        { key: 'revenue_growth_rate',label: 'Monthly Revenue Growth', suffix: '%', default: 10,    min: -50, max: 200 }
      ],
      calculate: function (v) {
        var burn = v.monthly_expenses - v.monthly_revenue;
        var runway;
        if (burn <= 0) {
          runway = 999;
        } else if (v.revenue_growth_rate > 0) {
          // Estimate runway accounting for growth
          var cash = v.cash_balance;
          var rev = v.monthly_revenue;
          var month = 0;
          while (cash > 0 && month < 120) {
            cash -= (v.monthly_expenses - rev);
            rev *= (1 + v.revenue_growth_rate / 100);
            month++;
          }
          runway = month;
        } else {
          runway = Math.floor(v.cash_balance / burn);
        }
        var beMonth = burn > 0 ? Math.ceil(Math.log(v.monthly_expenses / v.monthly_revenue) / Math.log(1 + v.revenue_growth_rate / 100)) : 0;
        var zeroRev = v.monthly_revenue * Math.pow(1 + v.revenue_growth_rate / 100, runway);
        return {
          current_burn:      { label: 'Current Monthly Burn', value: Math.max(0, burn), prefix: '$', highlight: true },
          runway_months:     { label: 'Runway (months)',       value: runway === 999 ? 999 : runway, highlight: true },
          breakeven_month:   { label: 'Months to Break-Even',  value: beMonth > 0 ? beMonth : 0, highlight: false },
          zero_date_revenue: { label: 'Revenue at Zero Cash',  value: runway < 999 ? zeroRev : 0, prefix: '$', highlight: false }
        };
      }
    },

    // 8. Subscription LTV
    'subscription-ltv': {
      name: 'Subscription LTV',
      fields: [
        { key: 'monthly_price',      label: 'Monthly Subscription Price', prefix: '$', default: 29,  min: 0 },
        { key: 'monthly_churn_rate', label: 'Monthly Churn Rate',         suffix: '%', default: 5,   min: 0.01, max: 100 },
        { key: 'cogs_percent',       label: 'COGS as % of Revenue',       suffix: '%', default: 30,  min: 0, max: 100 },
        { key: 'refund_rate',        label: 'Monthly Refund Rate',         suffix: '%', default: 2,   min: 0, max: 100 },
        { key: 'cac',               label: 'Customer Acquisition Cost',   prefix: '$', default: 45,  min: 0 }
      ],
      calculate: function (v) {
        var lifespan = 1 / (v.monthly_churn_rate / 100);
        var grossMargin = 1 - v.cogs_percent / 100 - v.refund_rate / 100;
        var grossLtv = v.monthly_price * lifespan * grossMargin;
        var netLtv = grossLtv - v.cac;
        var ltvCac = v.cac > 0 ? grossLtv / v.cac : 0;
        return {
          avg_customer_lifespan:{ label: 'Avg Customer Lifespan', value: lifespan.toFixed(1), suffix: ' mo', highlight: true },
          gross_ltv:            { label: 'Gross LTV',             value: grossLtv,            prefix: '$', highlight: true },
          net_ltv:              { label: 'Net LTV (after CAC)',   value: netLtv,              prefix: '$', highlight: true },
          ltv_cac_ratio:        { label: 'LTV:CAC Ratio',         value: ltvCac,              suffix: 'x', highlight: false }
        };
      }
    },

    // 9. Amazon FBA
    'amazon-fba-calculator': {
      name: 'Amazon FBA Calculator',
      fields: [
        { key: 'selling_price',       label: 'Selling Price',              prefix: '$', default: 29.99, min: 0.01 },
        { key: 'product_cost',        label: 'Product Cost',               prefix: '$', default: 6.00,  min: 0 },
        { key: 'inbound_shipping',    label: 'Inbound Shipping (per unit)',prefix: '$', default: 1.20,  min: 0 },
        { key: 'referral_fee_percent',label: 'Amazon Referral Fee %',      suffix: '%', default: 15,    min: 0, max: 45 },
        { key: 'fulfillment_fee',     label: 'FBA Fulfillment Fee',        prefix: '$', default: 4.75,  min: 0 },
        { key: 'monthly_storage',     label: 'Monthly Storage (per unit)', prefix: '$', default: 0.15,  min: 0 },
        { key: 'prep_cost',           label: 'Prep / Labeling Cost',       prefix: '$', default: 0.50,  min: 0 },
        { key: 'ppc_spend_per_unit',  label: 'PPC Cost per Unit Sold',     prefix: '$', default: 1.50,  min: 0 }
      ],
      calculate: function (v) {
        var referralFee = v.selling_price * (v.referral_fee_percent / 100);
        var totalAmazonFees = referralFee + v.fulfillment_fee + v.monthly_storage + v.prep_cost;
        var totalCost = v.product_cost + v.inbound_shipping + totalAmazonFees + v.ppc_spend_per_unit;
        var netProfit = v.selling_price - totalCost;
        var netMargin = v.selling_price > 0 ? (netProfit / v.selling_price) * 100 : 0;
        var roi = v.product_cost > 0 ? (netProfit / v.product_cost) * 100 : 0;
        return {
          net_profit:        { label: 'Net Profit per Unit',  value: netProfit,      prefix: '$', highlight: true },
          net_margin:        { label: 'Net Margin',           value: netMargin,      suffix: '%', highlight: true },
          total_amazon_fees: { label: 'Total Amazon Fees',    value: totalAmazonFees,prefix: '$', highlight: false },
          roi:               { label: 'ROI on Product Cost',  value: roi,            suffix: '%', highlight: false }
        };
      }
    },

    // 10. Pricing Strategy
    'pricing-strategy': {
      name: 'Product Pricing Strategy',
      fields: [
        { key: 'cogs',                      label: 'COGS per Unit',              prefix: '$', default: 12,   min: 0 },
        { key: 'shipping_cost',             label: 'Shipping Cost (per unit)',   prefix: '$', default: 2.50, min: 0 },
        { key: 'platform_fee_percent',      label: 'Platform Fee %',             suffix: '%', default: 5,    min: 0, max: 30 },
        { key: 'payment_processing_percent',label: 'Payment Processing %',       suffix: '%', default: 2.9,  min: 0, max: 10 },
        { key: 'target_gross_margin',       label: 'Target Gross Margin',        suffix: '%', default: 60,   min: 1, max: 99 },
        { key: 'overhead_per_unit',         label: 'Overhead per Unit',          prefix: '$', default: 2,    min: 0 }
      ],
      calculate: function (v) {
        var fixedCost = v.cogs + v.shipping_cost + v.overhead_per_unit;
        // Price = fixedCost / (1 - platform% - payment% - targetMargin%)
        var divisor = 1 - (v.platform_fee_percent + v.payment_processing_percent + v.target_gross_margin) / 100;
        var targetPrice = divisor > 0 ? fixedCost / divisor : 0;
        // Minimum viable price = break even (0% margin)
        var minDivisor = 1 - (v.platform_fee_percent + v.payment_processing_percent) / 100;
        var minPrice = minDivisor > 0 ? fixedCost / minDivisor : 0;
        var totalCost = fixedCost + targetPrice * (v.platform_fee_percent + v.payment_processing_percent) / 100;
        var markup = fixedCost > 0 ? targetPrice / fixedCost : 0;
        return {
          minimum_price:       { label: 'Minimum Viable Price',   value: minPrice,   prefix: '$', highlight: false },
          target_price:        { label: 'Price for Target Margin', value: targetPrice,prefix: '$', highlight: true },
          total_cost_per_unit: { label: 'Total Cost per Unit',     value: totalCost,  prefix: '$', highlight: false },
          markup_multiplier:   { label: 'Markup Multiplier',       value: markup,     suffix: 'x', highlight: false }
        };
      }
    },

    // 11. Refund Rate Impact
    'refund-rate-impact': {
      name: 'Refund Rate Impact',
      fields: [
        { key: 'monthly_revenue',     label: 'Monthly Gross Revenue',       prefix: '$', default: 50000, min: 0 },
        { key: 'refund_rate',         label: 'Current Refund Rate',         suffix: '%', default: 8,     min: 0, max: 100 },
        { key: 'cogs_percent',        label: 'COGS as % of Revenue',        suffix: '%', default: 35,    min: 0, max: 100 },
        { key: 'return_shipping_cost',label: 'Return Shipping Cost / Order',prefix: '$', default: 6.50,  min: 0 },
        { key: 'restocking_rate',     label: '% of Returns Resellable',     suffix: '%', default: 60,    min: 0, max: 100 },
        { key: 'avg_order_value',     label: 'Average Order Value',         prefix: '$', default: 75,    min: 0.01 }
      ],
      calculate: function (v) {
        var numRefunds = (v.monthly_revenue / v.avg_order_value) * (v.refund_rate / 100);
        var lostRevenue = numRefunds * v.avg_order_value;
        var lostCogs = lostRevenue * (v.cogs_percent / 100) * (1 - v.restocking_rate / 100);
        var shippingCost = numRefunds * v.return_shipping_cost;
        var totalRefundCost = lostRevenue + lostCogs + shippingCost;
        var netRevenue = v.monthly_revenue - lostRevenue;
        var refundPct = v.monthly_revenue > 0 ? (totalRefundCost / v.monthly_revenue) * 100 : 0;
        var valuePct = v.monthly_revenue * 0.01 / v.avg_order_value * (v.avg_order_value + v.cogs_percent / 100 * v.avg_order_value * (1 - v.restocking_rate / 100) + v.return_shipping_cost);
        return {
          net_revenue:           { label: 'Net Revenue After Refunds', value: netRevenue,      prefix: '$', highlight: true },
          total_refund_cost:     { label: 'Total Monthly Refund Cost', value: totalRefundCost, prefix: '$', highlight: true },
          refunds_as_pct_revenue:{ label: 'Refunds as % of Revenue',  value: refundPct,       suffix: '%', highlight: false },
          value_of_1pct_reduction:{ label: 'Value of 1% Less Returns',value: valuePct,        prefix: '$', highlight: false }
        };
      }
    },

    // 12. Bundle Pricing Optimizer
    'bundle-pricing-optimizer': {
      name: 'Bundle Pricing Optimizer',
      fields: [
        { key: 'product1_price',        label: 'Product 1 Individual Price', prefix: '$', default: 29.99, min: 0 },
        { key: 'product1_cogs',         label: 'Product 1 COGS',             prefix: '$', default: 8,     min: 0 },
        { key: 'product2_price',        label: 'Product 2 Individual Price', prefix: '$', default: 19.99, min: 0 },
        { key: 'product2_cogs',         label: 'Product 2 COGS',             prefix: '$', default: 5,     min: 0 },
        { key: 'bundle_discount_percent',label: 'Bundle Discount %',         suffix: '%', default: 15,    min: 0, max: 80 },
        { key: 'platform_fees',         label: 'Platform Fees %',            suffix: '%', default: 5,     min: 0, max: 30 }
      ],
      calculate: function (v) {
        var combinedPrice = v.product1_price + v.product2_price;
        var combinedCogs = v.product1_cogs + v.product2_cogs;
        var bundlePrice = combinedPrice * (1 - v.bundle_discount_percent / 100);
        var platformFee = bundlePrice * (v.platform_fees / 100);
        var bundleProfit = bundlePrice - combinedCogs - platformFee;
        var bundleMargin = bundlePrice > 0 ? (bundleProfit / bundlePrice) * 100 : 0;
        var individualPlatformFee = combinedPrice * (v.platform_fees / 100);
        var individualProfit = combinedPrice - combinedCogs - individualPlatformFee;
        var individualMargin = combinedPrice > 0 ? (individualProfit / combinedPrice) * 100 : 0;
        var marginDelta = bundleMargin - individualMargin;
        return {
          bundle_price:      { label: 'Bundle Price',            value: bundlePrice,     prefix: '$', highlight: true },
          bundle_margin:     { label: 'Bundle Gross Margin',     value: bundleMargin,    suffix: '%', highlight: true },
          individual_margin: { label: 'Individual Sales Margin', value: individualMargin,suffix: '%', highlight: false },
          margin_delta:      { label: 'Margin Difference',       value: marginDelta,     suffix: '%', highlight: false }
        };
      }
    },

    // 13. Influencer ROI
    'influencer-roi-calculator': {
      name: 'Influencer Marketing ROI',
      fields: [
        { key: 'influencer_fee',       label: 'Influencer Fee',              prefix: '$', default: 2500,   min: 0 },
        { key: 'followers',            label: 'Follower Count',                           default: 100000, min: 100 },
        { key: 'engagement_rate',      label: 'Engagement Rate',             suffix: '%', default: 3,      min: 0.1, max: 30 },
        { key: 'story_reach_percent',  label: 'Story / Reach Rate %',        suffix: '%', default: 15,     min: 0, max: 100 },
        { key: 'conversion_rate',      label: 'Link Conversion Rate',        suffix: '%', default: 1.5,    min: 0, max: 100 },
        { key: 'avg_order_value',      label: 'Average Order Value',         prefix: '$', default: 65,     min: 0.01 },
        { key: 'gross_margin_percent', label: 'Gross Margin %',              suffix: '%', default: 60,     min: 0, max: 100 },
        { key: 'product_cost',         label: 'Product / Gifting Cost',      prefix: '$', default: 100,    min: 0 }
      ],
      calculate: function (v) {
        var reach = v.followers * (v.story_reach_percent / 100);
        var clicks = reach * (v.engagement_rate / 100);
        var orders = Math.round(clicks * (v.conversion_rate / 100));
        var revenue = orders * v.avg_order_value;
        var grossProfit = revenue * (v.gross_margin_percent / 100);
        var netProfit = grossProfit - v.influencer_fee - v.product_cost;
        var roas = (v.influencer_fee + v.product_cost) > 0 ? revenue / (v.influencer_fee + v.product_cost) : 0;
        return {
          estimated_orders:  { label: 'Estimated Orders',          value: orders,    highlight: true },
          estimated_revenue: { label: 'Estimated Revenue',         value: revenue,   prefix: '$', highlight: true },
          net_profit:        { label: 'Net Profit from Campaign',  value: netProfit, prefix: '$', highlight: true },
          campaign_roas:     { label: 'Campaign ROAS',             value: roas,      suffix: 'x', highlight: false }
        };
      }
    },

    // 14. Chargeback Impact
    'chargeback-impact': {
      name: 'Chargeback Cost Calculator',
      fields: [
        { key: 'monthly_transactions', label: 'Monthly Transactions',         default: 500,  min: 1 },
        { key: 'avg_order_value',      label: 'Average Order Value', prefix: '$', default: 75, min: 0.01 },
        { key: 'chargeback_rate',      label: 'Chargeback Rate',     suffix: '%', default: 0.8,min: 0, max: 5, step: 0.1 },
        { key: 'dispute_fee',          label: 'Dispute Fee per Chargeback', prefix: '$', default: 25, min: 0 },
        { key: 'cogs_percent',         label: 'COGS as % of Revenue', suffix: '%', default: 35, min: 0, max: 100 },
        { key: 'win_rate',             label: 'Dispute Win Rate',     suffix: '%', default: 30, min: 0, max: 100 }
      ],
      calculate: function (v) {
        var chargebacks = Math.ceil(v.monthly_transactions * (v.chargeback_rate / 100));
        var lostRevenue = chargebacks * v.avg_order_value * (1 - v.win_rate / 100);
        var lostCogs = lostRevenue * (v.cogs_percent / 100);
        var disputeFees = chargebacks * v.dispute_fee;
        var totalLoss = lostRevenue + lostCogs + disputeFees;
        var costPer = chargebacks > 0 ? totalLoss / chargebacks : 0;
        return {
          monthly_chargebacks: { label: 'Monthly Chargebacks',  value: chargebacks,   highlight: true },
          total_monthly_loss:  { label: 'Total Monthly Loss',   value: totalLoss,     prefix: '$', highlight: true },
          cost_per_chargeback: { label: 'Cost per Chargeback',  value: costPer,       prefix: '$', highlight: false },
          annual_impact:       { label: 'Annual Impact',        value: totalLoss * 12,prefix: '$', highlight: false }
        };
      }
    },

    // 15. Shipping Cost Optimizer
    'shipping-cost-optimizer': {
      name: 'Shipping Cost Optimizer',
      fields: [
        { key: 'package_weight_oz', label: 'Package Weight (oz)',     default: 12,  min: 0.1 },
        { key: 'length_in',         label: 'Length (inches)',          default: 10,  min: 1 },
        { key: 'width_in',          label: 'Width (inches)',           default: 8,   min: 1 },
        { key: 'height_in',         label: 'Height (inches)',          default: 4,   min: 1 },
        { key: 'monthly_volume',    label: 'Monthly Shipments',        default: 200, min: 1 },
        { key: 'avg_order_value',   label: 'Average Order Value',      prefix: '$', default: 65, min: 0.01 },
        { key: 'residential_surcharge', label: 'Residential Surcharge (UPS/FedEx)', prefix: '$', default: 5.15, min: 0 }
      ],
      calculate: function (v) {
        var dimWeight = (v.length_in * v.width_in * v.height_in) / 139;
        var billableWeight = Math.max(v.package_weight_oz / 16, dimWeight);
        // Approximate USPS Ground Advantage (no residential surcharge)
        var uspsCost = 4.00 + billableWeight * 0.35;
        // Approximate UPS/FedEx Ground (with residential surcharge)
        var upsEstimate = 6.50 + billableWeight * 0.45 + v.residential_surcharge;
        var shippingPct = v.avg_order_value > 0 ? (uspsCost / v.avg_order_value) * 100 : 0;
        var monthlyUSPS = uspsCost * v.monthly_volume;
        return {
          dim_weight_lb:      { label: 'Dimensional Weight (lb)',    value: dimWeight,     suffix: ' lb', highlight: false },
          billable_weight_lb: { label: 'Billable Weight (lb)',       value: billableWeight,suffix: ' lb', highlight: false },
          estimated_cost_usps:{ label: 'Est. USPS Ground Advantage', value: uspsCost,      prefix: '$',   highlight: true },
          shipping_as_pct_aov:{ label: 'Shipping as % of AOV',      value: shippingPct,   suffix: '%',   highlight: false }
        };
      }
    },

    // 16. Wholesale Margin
    'wholesale-margin-calculator': {
      name: 'Wholesale Margin',
      fields: [
        { key: 'unit_cost',         label: 'Unit Cost (COGS + landed)',             prefix: '$', default: 12.00, min: 0 },
        { key: 'shipping_per_unit', label: 'Shipping to Retailer Per Unit',         prefix: '$', default: 2.00,  min: 0 },
        { key: 'wholesale_price',   label: 'Wholesale Price (charged to retailers)',prefix: '$', default: 30.00, min: 0 },
        { key: 'msrp',              label: 'MSRP / Retail Price',                   prefix: '$', default: 60.00, min: 0 },
        { key: 'moq',               label: 'Minimum Order Quantity (MOQ)',                        default: 50,    min: 1 }
      ],
      calculate: function (v) {
        var totalCost = v.unit_cost + v.shipping_per_unit;
        var wholesaleProfit = v.wholesale_price - totalCost;
        var wholesaleMargin = v.wholesale_price > 0 ? (wholesaleProfit / v.wholesale_price) * 100 : 0;
        var retailerProfit = v.msrp - v.wholesale_price;
        var retailerMargin = v.msrp > 0 ? (retailerProfit / v.msrp) * 100 : 0;
        var markup = v.unit_cost > 0 ? v.wholesale_price / v.unit_cost : 0;
        var moqInvestment = v.unit_cost * v.moq;
        var moqProfit = wholesaleProfit * v.moq;
        return {
          wholesale_margin: { label: 'Your Wholesale Margin',      value: wholesaleMargin, suffix: '%', highlight: true },
          retailer_margin:  { label: "Retailer's Margin at MSRP",  value: retailerMargin,  suffix: '%', highlight: false },
          markup_multiplier:{ label: 'Markup Multiplier',          value: markup,          suffix: 'x', highlight: false },
          moq_investment:   { label: 'MOQ Capital Required',       value: moqInvestment,   prefix: '$', highlight: false },
          moq_profit:       { label: 'MOQ Gross Profit',           value: moqProfit,       prefix: '$', highlight: false }
        };
      }
    },

    // 17. Etsy Fee Calculator
    'etsy-fee-calculator': {
      name: 'Etsy Fee Calculator',
      fields: [
        { key: 'listing_price',    label: 'Item Selling Price',                   prefix: '$', default: 35.00, min: 0 },
        { key: 'shipping_charged', label: 'Shipping Charged to Buyer',            prefix: '$', default: 5.00,  min: 0 },
        { key: 'cogs',             label: 'Cost of Goods (materials + labour)',   prefix: '$', default: 12.00, min: 0 },
        { key: 'etsy_ads_spend',   label: 'Monthly Etsy Ads Budget',              prefix: '$', default: 30.00, min: 0 },
        { key: 'monthly_listings', label: 'Active Listings (monthly renewal fee)',              default: 20,    min: 1 }
      ],
      calculate: function (v) {
        var listingFees = v.monthly_listings * 0.20;
        var transactionFee = (v.listing_price + v.shipping_charged) * 0.065;
        var paymentProcessing = (v.listing_price + v.shipping_charged) * 0.03 + 0.25;
        var totalFees = listingFees / Math.max(1, v.monthly_listings) + transactionFee + paymentProcessing;
        var feesPct = v.listing_price > 0 ? (totalFees / v.listing_price) * 100 : 0;
        var netProfit = v.listing_price - totalFees - v.cogs;
        var netMargin = v.listing_price > 0 ? (netProfit / v.listing_price) * 100 : 0;
        return {
          net_profit:     { label: 'Net Profit Per Sale',     value: netProfit, prefix: '$', highlight: true },
          net_margin:     { label: 'Net Margin',              value: netMargin, suffix: '%', highlight: false },
          total_fees:     { label: 'Total Etsy Fees Per Sale',value: totalFees, prefix: '$', highlight: false },
          total_fees_pct: { label: 'Fees as % of Sale',       value: feesPct,   suffix: '%', highlight: false }
        };
      }
    },

    // 18. Profit Per SKU
    'profit-per-sku': {
      name: 'Profit Per SKU',
      fields: [
        { key: 'monthly_revenue',      label: 'Monthly Revenue (this SKU)',  prefix: '$', default: 5000, min: 0 },
        { key: 'units_sold',           label: 'Units Sold Per Month',                     default: 120,  min: 1 },
        { key: 'cogs_per_unit',        label: 'COGS Per Unit',               prefix: '$', default: 12.00,min: 0 },
        { key: 'ad_spend_per_unit',    label: 'Ad Spend Per Unit Sold',      prefix: '$', default: 4.00, min: 0 },
        { key: 'platform_fees_percent',label: 'Platform Fees %',             suffix: '%', default: 5,    min: 0, max: 30 },
        { key: 'return_rate',          label: 'Return Rate',                 suffix: '%', default: 5,    min: 0, max: 100 },
        { key: 'storage_cost_per_unit',label: 'Storage / Fulfilment Per Unit',prefix: '$',default: 1.50, min: 0 }
      ],
      calculate: function (v) {
        var revenuePerUnit = v.units_sold > 0 ? v.monthly_revenue / v.units_sold : 0;
        var platformFee = revenuePerUnit * (v.platform_fees_percent / 100);
        var returnCost = revenuePerUnit * (v.return_rate / 100);
        var totalCost = v.cogs_per_unit + v.ad_spend_per_unit + platformFee + returnCost + v.storage_cost_per_unit;
        var profitPerUnit = revenuePerUnit - totalCost;
        var margin = revenuePerUnit > 0 ? (profitPerUnit / revenuePerUnit) * 100 : 0;
        var monthlyProfit = profitPerUnit * v.units_sold;
        var roi = v.cogs_per_unit > 0 ? (profitPerUnit / v.cogs_per_unit) * 100 : 0;
        return {
          profit_per_unit:    { label: 'Profit Per Unit',    value: profitPerUnit, prefix: '$', highlight: true },
          margin_per_unit:    { label: 'Margin Per Unit',    value: margin,        suffix: '%', highlight: false },
          monthly_profit:     { label: 'Monthly SKU Profit', value: monthlyProfit, prefix: '$', highlight: false },
          roi_per_unit:       { label: 'ROI on COGS',        value: roi,           suffix: '%', highlight: false },
          total_cost_per_unit:{ label: 'Total Cost Per Unit',value: totalCost,     prefix: '$', highlight: false }
        };
      }
    },

    // 19. Ad Spend Budget Calculator
    'ad-spend-budget-calculator': {
      name: 'Ad Spend Budget',
      fields: [
        { key: 'target_monthly_revenue',  label: 'Target Monthly Revenue',          prefix: '$', default: 30000, min: 0 },
        { key: 'current_monthly_revenue', label: 'Current Monthly Revenue',          prefix: '$', default: 20000, min: 0 },
        { key: 'target_roas',             label: 'Target ROAS',                                   default: 3.5,   min: 0.1, step: 0.1 },
        { key: 'blended_margin_percent',  label: 'Blended Gross Margin %',           suffix: '%', default: 55,    min: 0, max: 100 },
        { key: 'growth_goal_percent',     label: 'Organic Growth Rate (non-ad)',     suffix: '%', default: 10,    min: 0, max: 200 }
      ],
      calculate: function (v) {
        var organicRevenue = v.current_monthly_revenue * (1 + v.growth_goal_percent / 100);
        var revenueGap = Math.max(0, v.target_monthly_revenue - organicRevenue);
        var requiredBudget = v.target_roas > 0 ? revenueGap / v.target_roas : 0;
        var maxAffordable = v.target_monthly_revenue * (v.blended_margin_percent / 100);
        var recommendedBudget = Math.min(requiredBudget, maxAffordable);
        var budgetPct = v.target_monthly_revenue > 0 ? (recommendedBudget / v.target_monthly_revenue) * 100 : 0;
        var projectedRevenue = organicRevenue + (recommendedBudget * v.target_roas);
        return {
          required_ad_budget: { label: 'Required Ad Budget',      value: requiredBudget,  prefix: '$', highlight: true },
          recommended_budget: { label: 'Recommended Budget',      value: recommendedBudget,prefix: '$',highlight: false },
          budget_as_pct_revenue:{ label: 'Budget as % of Revenue',value: budgetPct,       suffix: '%', highlight: false },
          projected_revenue:  { label: 'Projected Revenue at Budget',value: projectedRevenue,prefix: '$',highlight: false },
          revenue_gap:        { label: 'Revenue Gap to Fill',     value: revenueGap,      prefix: '$', highlight: false }
        };
      }
    },

    // 20. Email Marketing ROI
    'email-marketing-roi': {
      name: 'Email Marketing ROI',
      fields: [
        { key: 'list_size',             label: 'Email List Size',                       default: 5000, min: 1 },
        { key: 'open_rate',             label: 'Average Open Rate',         suffix: '%', default: 22,   min: 0, max: 100 },
        { key: 'click_rate',            label: 'Click-Through Rate (of opens)', suffix: '%', default: 3.5, min: 0, max: 100 },
        { key: 'conversion_rate',       label: 'Purchase Conversion (of clicks)', suffix: '%', default: 4, min: 0, max: 100 },
        { key: 'avg_order_value',       label: 'Average Order Value',       prefix: '$', default: 65,   min: 0 },
        { key: 'gross_margin_percent',  label: 'Gross Margin %',            suffix: '%', default: 55,   min: 0, max: 100 },
        { key: 'platform_monthly_cost', label: 'Email Platform Monthly Cost',prefix: '$',default: 79,   min: 0 },
        { key: 'campaigns_per_month',   label: 'Campaigns Sent Per Month',              default: 8,    min: 1 }
      ],
      calculate: function (v) {
        var opens = v.list_size * (v.open_rate / 100);
        var clicks = opens * (v.click_rate / 100);
        var ordersPerCampaign = Math.round(clicks * (v.conversion_rate / 100));
        var totalOrders = ordersPerCampaign * v.campaigns_per_month;
        var revenue = totalOrders * v.avg_order_value;
        var grossProfit = revenue * (v.gross_margin_percent / 100);
        var netProfit = grossProfit - v.platform_monthly_cost;
        var roi = v.platform_monthly_cost > 0 ? ((grossProfit - v.platform_monthly_cost) / v.platform_monthly_cost) * 100 : 0;
        var revenuePerSub = v.list_size > 0 ? revenue / v.list_size : 0;
        return {
          monthly_revenue:      { label: 'Monthly Email Revenue',    value: revenue,         prefix: '$', highlight: true },
          roi:                  { label: 'Email Marketing ROI',       value: roi,             suffix: '%', highlight: false },
          revenue_per_subscriber:{ label: 'Revenue Per Subscriber',  value: revenuePerSub,   prefix: '$', highlight: false },
          net_profit:           { label: 'Monthly Net Profit',        value: netProfit,       prefix: '$', highlight: false },
          orders_per_campaign:  { label: 'Orders Per Campaign',       value: ordersPerCampaign,            highlight: false }
        };
      }
    }

  };

  // ─── Formatting ─────────────────────────────────────────────────────────────

  function formatValue(value, result) {
    if (value === null || value === undefined || isNaN(parseFloat(value))) return '—';
    var num = parseFloat(value);

    if (result && result.label === 'Runway (months)' && num >= 999) return '∞';

    var prefix = result && result.prefix ? result.prefix : '';
    var suffix = result && result.suffix ? result.suffix : '';

    var abs = Math.abs(num);
    var formatted;
    if (abs >= 1000000) {
      formatted = (num / 1000000).toFixed(2) + 'M';
    } else if (abs >= 10000) {
      formatted = num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (abs >= 1000) {
      formatted = num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    } else if (suffix === '%' || suffix === 'x') {
      formatted = num.toFixed(1);
    } else if (suffix === ' mo' || suffix === ' units' || suffix === ' days' || suffix === ' lb') {
      formatted = Number.isInteger(num) ? num.toString() : num.toFixed(1);
    } else {
      formatted = num.toFixed(2);
    }

    return prefix + formatted + suffix;
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────

  function injectStyles(accentColor, containerId) {
    var styleId = 'valcr-styles-' + containerId;
    if (document.getElementById(styleId)) return;

    var css = [
      '.valcr-widget{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
      'background:#0d0d12;color:#e8e8f0;border-radius:16px;overflow:hidden;',
      'border:1px solid rgba(255,255,255,0.08);box-shadow:0 4px 40px rgba(0,0,0,0.4)}',

      '.valcr-header{padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,0.06)}',
      '.valcr-header-top{display:flex;align-items:center;justify-content:space-between}',
      '.valcr-calc-name{font-size:14px;font-weight:600;letter-spacing:-0.01em;color:#f0f0fa}',
      '.valcr-accent-dot{width:7px;height:7px;border-radius:50%;background:' + accentColor + '}',

      '.valcr-body{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px}',
      '@media(max-width:520px){.valcr-body{grid-template-columns:1fr}}',

      '.valcr-inputs{display:flex;flex-direction:column;gap:12px}',
      '.valcr-results{display:flex;flex-direction:column;gap:10px}',

      '.valcr-field{display:flex;flex-direction:column;gap:4px}',
      '.valcr-label{font-size:11px;font-weight:500;color:rgba(200,200,220,0.55);',
      'letter-spacing:0.04em;text-transform:uppercase}',
      '.valcr-input-wrap{position:relative;display:flex;align-items:center}',
      '.valcr-prefix,.valcr-suffix{font-size:13px;color:rgba(200,200,220,0.4);',
      'position:absolute;pointer-events:none;font-weight:400}',
      '.valcr-prefix{left:10px}.valcr-suffix{right:10px}',
      '.valcr-input{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);',
      'border-radius:8px;padding:8px 10px;font-size:13px;color:#f0f0fa;outline:none;',
      'transition:border-color 0.15s,background 0.15s;-moz-appearance:textfield;box-sizing:border-box}',
      '.valcr-input::-webkit-inner-spin-button,.valcr-input::-webkit-outer-spin-button{-webkit-appearance:none}',
      '.valcr-input:focus{border-color:' + accentColor + '80;background:rgba(255,255,255,0.07)}',
      '.valcr-input.has-prefix{padding-left:24px}',
      '.valcr-input.has-suffix{padding-right:30px}',

      '.valcr-result-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);',
      'border-radius:10px;padding:12px 14px}',
      '.valcr-result-card.highlight{background:' + accentColor + '12;border-color:' + accentColor + '35}',
      '.valcr-result-label{font-size:10px;color:rgba(200,200,220,0.5);font-weight:500;',
      'text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px}',
      '.valcr-result-value{font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f0f0fa;',
      'font-variant-numeric:tabular-nums;line-height:1.1}',
      '.valcr-result-card.highlight .valcr-result-value{color:' + accentColor + '}',
      '.valcr-result-value.negative{color:#ff6b6b}',

      '.valcr-footer{padding:10px 20px;border-top:1px solid rgba(255,255,255,0.05);',
      'display:flex;align-items:center;justify-content:space-between}',
      '.valcr-powered{font-size:10px;color:rgba(200,200,220,0.25);text-decoration:none;',
      'transition:color 0.15s;letter-spacing:0.02em}',
      '.valcr-powered:hover{color:' + accentColor + '}',
      '.valcr-powered strong{color:' + accentColor + '80}',

      '.valcr-lead-form{padding:16px 20px 20px;border-top:1px solid rgba(255,255,255,0.06)}',
      '.valcr-lead-label{font-size:11px;font-weight:500;color:rgba(200,200,220,0.5);',
      'letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px}',
      '.valcr-lead-row{display:flex;gap:8px}',
      '.valcr-lead-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);',
      'border-radius:8px;padding:9px 12px;font-size:13px;color:#f0f0fa;outline:none;',
      'transition:border-color 0.15s;box-sizing:border-box}',
      '.valcr-lead-input:focus{border-color:' + accentColor + '80}',
      '.valcr-lead-input::placeholder{color:rgba(200,200,220,0.25)}',
      '.valcr-lead-btn{background:' + accentColor + ';color:#0d0d12;border:none;',
      'border-radius:8px;padding:9px 16px;font-size:12px;font-weight:700;cursor:pointer;',
      'transition:opacity 0.15s;white-space:nowrap;letter-spacing:0.02em}',
      '.valcr-lead-btn:hover{opacity:0.85}',
      '.valcr-lead-success{font-size:12px;color:' + accentColor + ';padding:4px 0}',

      '.valcr-error{padding:24px;text-align:center;color:rgba(200,200,220,0.5);font-size:13px}',
      '.valcr-loading{padding:24px;text-align:center}',
      '.valcr-spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,0.1);',
      'border-top-color:' + accentColor + ';border-radius:50%;animation:valcr-spin 0.7s linear infinite;',
      'margin:0 auto}',
      '@keyframes valcr-spin{to{transform:rotate(360deg)}}'
    ].join('');

    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ─── Telemetry ───────────────────────────────────────────────────────────────

  function Telemetry(embedKey, calcSlug) {
    this.embedKey = embedKey;
    this.calcSlug = calcSlug;
    this.queue = [];
    this.timer = null;
    var self = this;
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') self._flush();
    });
  }

  Telemetry.prototype.emit = function (eventType, data) {
    this.queue.push(Object.assign({
      event_type: eventType,
      calculator_slug: this.calcSlug,
      embed_key: this.embedKey,
      referrer: document.referrer || undefined,
      page_url: window.location.href
    }, data || {}));
    if (this.queue.length >= 5) {
      this._flush();
    } else {
      clearTimeout(this.timer);
      var self = this;
      this.timer = setTimeout(function () { self._flush(); }, 2000);
    }
  };

  Telemetry.prototype._flush = function () {
    if (!this.queue.length) return;
    var batch = this.queue.splice(0);
    try {
      navigator.sendBeacon
        ? navigator.sendBeacon(API_BASE + '/telemetry/events', JSON.stringify({ events: batch }))
        : fetch(API_BASE + '/telemetry/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: batch }),
            keepalive: true
          }).catch(function () {});
    } catch (e) { /* silent */ }
  };

  // ─── Lead Capture ────────────────────────────────────────────────────────────

  function submitLead(embedKey, calcSlug, email, inputs) {
    return fetch(API_BASE + '/embed/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embed_key: embedKey,
        calculator_slug: calcSlug,
        email: email,
        input_data: inputs
      })
    });
  }

  // ─── Widget Class ────────────────────────────────────────────────────────────

  function ValcrWidget(container) {
    this.container = container;
    this.calcSlug = container.getAttribute('data-valcr-calc') || '';
    this.embedKey = container.getAttribute('data-valcr-key') || '';
    this.accentColor = container.getAttribute('data-valcr-theme') || '#C8FF57';
    this.showBrand = container.getAttribute('data-valcr-brand') !== 'false';
    this.showLead = container.getAttribute('data-valcr-lead') === 'true';
    this.width = container.getAttribute('data-valcr-width') || '100%';
    this.id = 'valcr-' + Math.random().toString(36).slice(2, 8);
    this.values = {};
    this.telemetry = new Telemetry(this.embedKey, this.calcSlug);
  }

  ValcrWidget.prototype.init = function () {
    if (!this.calcSlug) {
      this._renderError('Missing data-valcr-calc attribute.');
      return;
    }
    var calc = CALCULATORS[this.calcSlug];
    if (!calc) {
      this._renderError('Calculator "' + this.calcSlug + '" not found. Available: ' + Object.keys(CALCULATORS).join(', '));
      return;
    }
    this.calc = calc;
    for (var i = 0; i < calc.fields.length; i++) {
      this.values[calc.fields[i].key] = calc.fields[i].default;
    }
    injectStyles(this.accentColor, this.id);
    this._render();
    this.telemetry.emit('calculator_opened');
  };

  ValcrWidget.prototype._render = function () {
    var results = this.calc.calculate(this.values);
    var self = this;

    var html = '<div class="valcr-widget" id="' + this.id + '" style="width:' + this.width + '">';

    html += '<div class="valcr-header">';
    html += '<div class="valcr-header-top">';
    html += '<span class="valcr-calc-name">' + this._esc(this.calc.name) + '</span>';
    html += '<span class="valcr-accent-dot"></span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="valcr-body">';
    html += '<div class="valcr-inputs">';
    for (var i = 0; i < this.calc.fields.length; i++) {
      var field = this.calc.fields[i];
      var val = this.values[field.key];
      var hasPrefix = !!field.prefix;
      var hasSuffix = !!field.suffix;
      var inputClasses = 'valcr-input' + (hasPrefix ? ' has-prefix' : '') + (hasSuffix ? ' has-suffix' : '');

      html += '<div class="valcr-field">';
      html += '<span class="valcr-label">' + this._esc(field.label) + '</span>';
      html += '<div class="valcr-input-wrap">';
      if (hasPrefix) html += '<span class="valcr-prefix">' + this._esc(field.prefix) + '</span>';
      html += '<input class="' + inputClasses + '" type="number"';
      html += ' data-key="' + field.key + '"';
      html += ' value="' + val + '"';
      if (field.min !== undefined) html += ' min="' + field.min + '"';
      if (field.max !== undefined) html += ' max="' + field.max + '"';
      html += ' step="' + (field.step || 'any') + '"';
      html += '>';
      if (hasSuffix) html += '<span class="valcr-suffix">' + this._esc(field.suffix) + '</span>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="valcr-results" id="' + this.id + '-results">';
    var resultKeys = Object.keys(results);
    for (var j = 0; j < resultKeys.length; j++) {
      var key = resultKeys[j];
      var result = results[key];
      var isHighlight = result.highlight;
      var numVal = parseFloat(result.value);
      var isNegative = !isNaN(numVal) && numVal < 0;
      var cardClass = 'valcr-result-card' + (isHighlight ? ' highlight' : '');
      var valClass = 'valcr-result-value' + (isNegative ? ' negative' : '');
      var formatted = formatValue(result.value, result);

      html += '<div class="' + cardClass + '">';
      html += '<div class="valcr-result-label">' + this._esc(result.label) + '</div>';
      html += '<div class="' + valClass + '" id="' + this.id + '-' + key + '">' + formatted + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    if (this.showLead) {
      html += '<div class="valcr-lead-form">';
      html += '<div class="valcr-lead-label">Get full report via email</div>';
      html += '<div class="valcr-lead-row">';
      html += '<input class="valcr-lead-input" id="' + this.id + '-lead-email" type="email" placeholder="your@email.com">';
      html += '<button class="valcr-lead-btn" id="' + this.id + '-lead-btn">Send</button>';
      html += '</div>';
      html += '<div class="valcr-lead-success" id="' + this.id + '-lead-success" style="display:none">✓ Check your inbox!</div>';
      html += '</div>';
    }

    if (this.showBrand) {
      html += '<div class="valcr-footer">';
      html += '<a class="valcr-powered" href="https://valcr.site?ref=widget" target="_blank" rel="noopener">';
      html += 'Powered by <strong>Valcr</strong>';
      html += '</a>';
      html += '</div>';
    }

    html += '</div>';
    this.container.innerHTML = html;
    this._bindEvents();
  };

  ValcrWidget.prototype._bindEvents = function () {
    var self = this;
    var inputs = this.container.querySelectorAll('.valcr-input');

    for (var i = 0; i < inputs.length; i++) {
      (function (input) {
        var key = input.getAttribute('data-key');
        var focusStart = null;

        input.addEventListener('focus', function () {
          focusStart = Date.now();
        });

        input.addEventListener('blur', function () {
          if (focusStart) {
            var duration = Date.now() - focusStart;
            focusStart = null;
            self.telemetry.emit('field_changed', {
              field_name: key,
              field_value: parseFloat(input.value) || 0,
              time_on_field_ms: duration
            });
          }
        });

        input.addEventListener('input', function () {
          var raw = input.value;
          var parsed = raw === '' ? 0 : parseFloat(raw);
          if (!isNaN(parsed)) {
            self.values[key] = parsed;
            self._updateResults();
          }
        });
      })(inputs[i]);
    }

    if (this.showLead) {
      var leadBtn = document.getElementById(this.id + '-lead-btn');
      if (leadBtn) {
        leadBtn.addEventListener('click', function () {
          var emailInput = document.getElementById(self.id + '-lead-email');
          var email = emailInput ? emailInput.value.trim() : '';
          var successEl = document.getElementById(self.id + '-lead-success');

          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (emailInput) emailInput.style.borderColor = '#ff6b6b';
            setTimeout(function () {
              if (emailInput) emailInput.style.borderColor = '';
            }, 1500);
            return;
          }

          leadBtn.disabled = true;
          leadBtn.textContent = '...';

          submitLead(self.embedKey, self.calcSlug, email, self.values)
            .then(function () {
              if (successEl) successEl.style.display = 'block';
              if (emailInput) emailInput.style.display = 'none';
              leadBtn.style.display = 'none';
              self.telemetry.emit('registration_completed', { field_name: 'lead_email' });
            })
            .catch(function () {
              leadBtn.disabled = false;
              leadBtn.textContent = 'Send';
            });
        });
      }
    }
  };

  ValcrWidget.prototype._updateResults = function () {
    var results = this.calc.calculate(this.values);
    var keys = Object.keys(results);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var result = results[key];
      var el = document.getElementById(this.id + '-' + key);
      if (!el) continue;

      var numVal = parseFloat(result.value);
      var isNeg = !isNaN(numVal) && numVal < 0;
      el.textContent = formatValue(result.value, result);

      if (isNeg) {
        el.classList.add('negative');
      } else {
        el.classList.remove('negative');
      }
    }

    this.telemetry.emit('calculation_run', {
      input_snapshot: Object.assign({}, this.values),
      output_snapshot: (function (r) {
        var out = {};
        var k = Object.keys(r);
        for (var i = 0; i < k.length; i++) out[k[i]] = r[k[i]].value;
        return out;
      })(results)
    });
  };

  ValcrWidget.prototype._renderError = function (msg) {
    injectStyles(this.accentColor, this.id);
    this.container.innerHTML = '<div class="valcr-widget"><div class="valcr-error">' + this._esc(msg) + '</div></div>';
  };

  ValcrWidget.prototype._esc = function (str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  // ─── Auto-init ───────────────────────────────────────────────────────────────

  function initAll() {
    var containers = document.querySelectorAll('[data-valcr-calc]');
    for (var i = 0; i < containers.length; i++) {
      var container = containers[i];
      if (!container.__valcr) {
        container.__valcr = new ValcrWidget(container);
        container.__valcr.init();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  global.Valcr = {
    version: VERSION,
    init: initAll,
    Widget: ValcrWidget,
    calculators: Object.keys(CALCULATORS)
  };

}(typeof window !== 'undefined' ? window : this));