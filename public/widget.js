/*!
 * Valcr Embed Widget v1.0.0
 * https://valcr.site
 *
 * Drop-in calculator embed for any website.
 * Zero dependencies. ~8KB gzipped.
 *
 * Usage:
 *   <div data-valcr-calc="shopify-profit-margin"
 *        data-valcr-key="emb_live_xxxx"
 *        data-valcr-theme="#C8FF57"
 *        data-valcr-brand="false">
 *   </div>
 *   <script src="https://valcr.site/widget.js" async></script>
 *
 * Attributes:
 *   data-valcr-calc    (required) calculator slug
 *   data-valcr-key     (required) your embed key
 *   data-valcr-theme   (optional) accent color hex, default #C8FF57
 *   data-valcr-brand   (optional) "false" to hide "Powered by Valcr" footer
 *   data-valcr-lead    (optional) "true" to enable lead capture form
 *   data-valcr-width   (optional) container width, default "100%"
 */
(function (global) {
  'use strict';

  // ─── Configuration ──────────────────────────────────────────────────────────

  var API_BASE = 'https://3.88.158.219/api/v1';
  // In production this should be: var API_BASE = 'https://api.valcr.site/api/v1';

  var VERSION = '1.0.0';

  // ─── Calculator Definitions ─────────────────────────────────────────────────
  // Self-contained math engine — no dependency on the React app

  var CALCULATORS = {
    'shopify-profit-margin': {
      name: 'Shopify Profit Margin',
      fields: [
        { key: 'selling_price', label: 'Selling Price', prefix: '$', default: 50, min: 0 },
        { key: 'cogs', label: 'Cost of Goods', prefix: '$', default: 20, min: 0 },
        { key: 'shipping_cost', label: 'Shipping Cost', prefix: '$', default: 5, min: 0 },
        { key: 'transaction_fee_pct', label: 'Transaction Fee', suffix: '%', default: 2.9, min: 0, max: 100 },
        { key: 'ad_spend', label: 'Ad Spend (per sale)', prefix: '$', default: 5, min: 0 }
      ],
      calculate: function (v) {
        var revenue = v.selling_price;
        var txFee = revenue * (v.transaction_fee_pct / 100);
        var totalCost = v.cogs + v.shipping_cost + txFee + v.ad_spend;
        var profit = revenue - totalCost;
        var margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        return {
          profit: { label: 'Net Profit', value: profit, prefix: '$', highlight: true },
          margin: { label: 'Profit Margin', value: margin, suffix: '%', highlight: false },
          total_cost: { label: 'Total Cost', value: totalCost, prefix: '$', highlight: false }
        };
      }
    },
    'roas-calculator': {
      name: 'ROAS Calculator',
      fields: [
        { key: 'revenue', label: 'Revenue Generated', prefix: '$', default: 5000, min: 0 },
        { key: 'ad_spend', label: 'Ad Spend', prefix: '$', default: 1000, min: 0 }
      ],
      calculate: function (v) {
        var roas = v.ad_spend > 0 ? v.revenue / v.ad_spend : 0;
        var profit = v.revenue - v.ad_spend;
        var roi = v.ad_spend > 0 ? (profit / v.ad_spend) * 100 : 0;
        return {
          roas: { label: 'ROAS', value: roas, suffix: 'x', highlight: true },
          roi: { label: 'ROI', value: roi, suffix: '%', highlight: false },
          profit: { label: 'Net Profit', value: profit, prefix: '$', highlight: false }
        };
      }
    },
    'break-even-units': {
      name: 'Break-Even Calculator',
      fields: [
        { key: 'fixed_costs', label: 'Fixed Costs / Month', prefix: '$', default: 2000, min: 0 },
        { key: 'selling_price', label: 'Price Per Unit', prefix: '$', default: 49, min: 0 },
        { key: 'variable_cost', label: 'Variable Cost / Unit', prefix: '$', default: 15, min: 0 }
      ],
      calculate: function (v) {
        var contribution = v.selling_price - v.variable_cost;
        var units = contribution > 0 ? Math.ceil(v.fixed_costs / contribution) : 0;
        var revenue = units * v.selling_price;
        return {
          break_even_units: { label: 'Break-Even Units', value: units, highlight: true },
          break_even_revenue: { label: 'Break-Even Revenue', value: revenue, prefix: '$', highlight: false },
          contribution_margin: { label: 'Contribution Margin', value: contribution, prefix: '$', highlight: false }
        };
      }
    },
    'customer-acquisition-cost': {
      name: 'CAC Calculator',
      fields: [
        { key: 'total_spend', label: 'Total Marketing Spend', prefix: '$', default: 5000, min: 0 },
        { key: 'new_customers', label: 'New Customers Acquired', default: 100, min: 1 }
      ],
      calculate: function (v) {
        var cac = v.new_customers > 0 ? v.total_spend / v.new_customers : 0;
        return {
          cac: { label: 'Customer Acquisition Cost', value: cac, prefix: '$', highlight: true },
          efficiency: { label: 'Cost per Lead (est.)', value: cac * 0.3, prefix: '$', highlight: false }
        };
      }
    },
    'amazon-fba-calculator': {
      name: 'Amazon FBA Calculator',
      fields: [
        { key: 'selling_price', label: 'Selling Price', prefix: '$', default: 29.99, min: 0 },
        { key: 'product_cost', label: 'Product Cost', prefix: '$', default: 8, min: 0 },
        { key: 'shipping_to_fba', label: 'Shipping to FBA', prefix: '$', default: 2, min: 0 },
        { key: 'fba_fee', label: 'FBA Fulfillment Fee', prefix: '$', default: 4.5, min: 0 },
        { key: 'referral_fee_pct', label: 'Referral Fee', suffix: '%', default: 15, min: 0, max: 100 }
      ],
      calculate: function (v) {
        var referralFee = v.selling_price * (v.referral_fee_pct / 100);
        var totalCost = v.product_cost + v.shipping_to_fba + v.fba_fee + referralFee;
        var profit = v.selling_price - totalCost;
        var margin = v.selling_price > 0 ? (profit / v.selling_price) * 100 : 0;
        var roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
        return {
          profit: { label: 'Net Profit', value: profit, prefix: '$', highlight: true },
          margin: { label: 'Margin', value: margin, suffix: '%', highlight: false },
          roi: { label: 'ROI', value: roi, suffix: '%', highlight: false }
        };
      }
    },
    'wholesale-margin-calculator': {
      name: 'Wholesale Margin',
      fields: [
        { key: 'wholesale_price', label: 'Wholesale Price', prefix: '$', default: 25, min: 0 },
        { key: 'cost_price', label: 'Cost Price', prefix: '$', default: 10, min: 0 }
      ],
      calculate: function (v) {
        var profit = v.wholesale_price - v.cost_price;
        var margin = v.wholesale_price > 0 ? (profit / v.wholesale_price) * 100 : 0;
        var markup = v.cost_price > 0 ? (profit / v.cost_price) * 100 : 0;
        return {
          profit: { label: 'Gross Profit', value: profit, prefix: '$', highlight: true },
          margin: { label: 'Margin', value: margin, suffix: '%', highlight: false },
          markup: { label: 'Markup', value: markup, suffix: '%', highlight: false }
        };
      }
    },
    'etsy-fee-calculator': {
      name: 'Etsy Fee Calculator',
      fields: [
        { key: 'item_price', label: 'Item Price', prefix: '$', default: 35, min: 0 },
        { key: 'shipping_price', label: 'Shipping Charged', prefix: '$', default: 5, min: 0 },
        { key: 'item_cost', label: 'Your Item Cost', prefix: '$', default: 10, min: 0 }
      ],
      calculate: function (v) {
        var listingFee = 0.20;
        var transactionFee = (v.item_price + v.shipping_price) * 0.065;
        var paymentProcessing = (v.item_price + v.shipping_price) * 0.03 + 0.25;
        var totalFees = listingFee + transactionFee + paymentProcessing;
        var netRevenue = v.item_price - totalFees - v.item_cost;
        var margin = v.item_price > 0 ? (netRevenue / v.item_price) * 100 : 0;
        return {
          net_profit: { label: 'Net Profit', value: netRevenue, prefix: '$', highlight: true },
          total_fees: { label: 'Total Etsy Fees', value: totalFees, prefix: '$', highlight: false },
          margin: { label: 'Margin', value: margin, suffix: '%', highlight: false }
        };
      }
    },
    'ad-spend-budget-calculator': {
      name: 'Ad Spend Budget',
      fields: [
        { key: 'revenue_goal', label: 'Monthly Revenue Goal', prefix: '$', default: 20000, min: 0 },
        { key: 'avg_order_value', label: 'Average Order Value', prefix: '$', default: 65, min: 1 },
        { key: 'target_roas', label: 'Target ROAS', suffix: 'x', default: 3, min: 0.1 }
      ],
      calculate: function (v) {
        var orders_needed = v.avg_order_value > 0 ? v.revenue_goal / v.avg_order_value : 0;
        var ad_budget = v.target_roas > 0 ? v.revenue_goal / v.target_roas : 0;
        var cpa = orders_needed > 0 ? ad_budget / orders_needed : 0;
        return {
          ad_budget: { label: 'Ad Budget Needed', value: ad_budget, prefix: '$', highlight: true },
          cpa: { label: 'Target CPA', value: cpa, prefix: '$', highlight: false },
          orders_needed: { label: 'Orders Needed', value: Math.ceil(orders_needed), highlight: false }
        };
      }
    },
    'email-marketing-roi': {
      name: 'Email Marketing ROI',
      fields: [
        { key: 'list_size', label: 'Email List Size', default: 5000, min: 1 },
        { key: 'open_rate', label: 'Open Rate', suffix: '%', default: 22, min: 0, max: 100 },
        { key: 'click_rate', label: 'Click Rate', suffix: '%', default: 3, min: 0, max: 100 },
        { key: 'conversion_rate', label: 'Conversion Rate', suffix: '%', default: 2, min: 0, max: 100 },
        { key: 'avg_order_value', label: 'Avg Order Value', prefix: '$', default: 75, min: 0 },
        { key: 'monthly_cost', label: 'Monthly ESP Cost', prefix: '$', default: 99, min: 0 }
      ],
      calculate: function (v) {
        var opens = v.list_size * (v.open_rate / 100);
        var clicks = opens * (v.click_rate / 100);
        var conversions = clicks * (v.conversion_rate / 100);
        var revenue = conversions * v.avg_order_value;
        var roi = v.monthly_cost > 0 ? ((revenue - v.monthly_cost) / v.monthly_cost) * 100 : 0;
        return {
          revenue: { label: 'Estimated Revenue', value: revenue, prefix: '$', highlight: true },
          roi: { label: 'Email ROI', value: roi, suffix: '%', highlight: false },
          conversions: { label: 'Conversions', value: Math.round(conversions), highlight: false }
        };
      }
    },
    'profit-per-sku': {
      name: 'Profit Per SKU',
      fields: [
        { key: 'revenue', label: 'Revenue per Unit', prefix: '$', default: 45, min: 0 },
        { key: 'cogs', label: 'COGS per Unit', prefix: '$', default: 12, min: 0 },
        { key: 'fulfillment', label: 'Fulfillment Cost', prefix: '$', default: 6, min: 0 },
        { key: 'returns_pct', label: 'Return Rate', suffix: '%', default: 5, min: 0, max: 100 }
      ],
      calculate: function (v) {
        var returnCost = v.revenue * (v.returns_pct / 100);
        var totalCost = v.cogs + v.fulfillment + returnCost;
        var profit = v.revenue - totalCost;
        var margin = v.revenue > 0 ? (profit / v.revenue) * 100 : 0;
        return {
          profit: { label: 'Profit per Unit', value: profit, prefix: '$', highlight: true },
          margin: { label: 'Net Margin', value: margin, suffix: '%', highlight: false },
          return_cost: { label: 'Return Cost (per unit)', value: returnCost, prefix: '$', highlight: false }
        };
      }
    },
    'cash-flow-runway': {
      name: 'Cash Flow Runway',
      fields: [
        { key: 'cash_on_hand', label: 'Cash on Hand', prefix: '$', default: 50000, min: 0 },
        { key: 'monthly_revenue', label: 'Monthly Revenue', prefix: '$', default: 15000, min: 0 },
        { key: 'monthly_expenses', label: 'Monthly Expenses', prefix: '$', default: 18000, min: 0 }
      ],
      calculate: function (v) {
        var net_burn = v.monthly_expenses - v.monthly_revenue;
        var runway = net_burn > 0 ? v.cash_on_hand / net_burn : 999;
        var profitable = net_burn <= 0;
        return {
          runway: { label: 'Months of Runway', value: profitable ? 999 : Math.floor(runway), highlight: true },
          net_burn: { label: 'Monthly Burn', value: net_burn, prefix: '$', highlight: false },
          status: { label: 'Profitability', value: profitable ? 1 : 0, highlight: false }
        };
      }
    },
    'subscription-ltv': {
      name: 'Subscription LTV',
      fields: [
        { key: 'monthly_revenue', label: 'Monthly Revenue / User', prefix: '$', default: 29, min: 0 },
        { key: 'churn_rate', label: 'Monthly Churn Rate', suffix: '%', default: 5, min: 0.1, max: 100 },
        { key: 'cac', label: 'Customer Acquisition Cost', prefix: '$', default: 120, min: 0 }
      ],
      calculate: function (v) {
        var lifespan = 1 / (v.churn_rate / 100);
        var ltv = v.monthly_revenue * lifespan;
        var ltv_cac = v.cac > 0 ? ltv / v.cac : 0;
        return {
          ltv: { label: 'Customer LTV', value: ltv, prefix: '$', highlight: true },
          ltv_cac_ratio: { label: 'LTV:CAC Ratio', value: ltv_cac, suffix: 'x', highlight: false },
          payback_months: { label: 'Payback Period', value: v.monthly_revenue > 0 ? Math.ceil(v.cac / v.monthly_revenue) : 0, suffix: ' mo', highlight: false }
        };
      }
    },
    'true-landed-cost': {
      name: 'True Landed Cost',
      fields: [
        { key: 'product_cost', label: 'Product Cost', prefix: '$', default: 20, min: 0 },
        { key: 'freight', label: 'Freight / Shipping', prefix: '$', default: 3, min: 0 },
        { key: 'duties_pct', label: 'Import Duties', suffix: '%', default: 7.5, min: 0, max: 100 },
        { key: 'insurance', label: 'Insurance', prefix: '$', default: 0.5, min: 0 },
        { key: 'other_fees', label: 'Other Fees', prefix: '$', default: 1, min: 0 }
      ],
      calculate: function (v) {
        var duties = v.product_cost * (v.duties_pct / 100);
        var total = v.product_cost + v.freight + duties + v.insurance + v.other_fees;
        var markup = v.product_cost > 0 ? ((total - v.product_cost) / v.product_cost) * 100 : 0;
        return {
          landed_cost: { label: 'True Landed Cost', value: total, prefix: '$', highlight: true },
          duties_amount: { label: 'Duties Amount', value: duties, prefix: '$', highlight: false },
          total_markup: { label: 'Landed Cost Markup', value: markup, suffix: '%', highlight: false }
        };
      }
    },
    'inventory-reorder-point': {
      name: 'Reorder Point',
      fields: [
        { key: 'avg_daily_sales', label: 'Avg Daily Sales (units)', default: 20, min: 0 },
        { key: 'lead_time_days', label: 'Lead Time (days)', default: 14, min: 1 },
        { key: 'safety_stock_days', label: 'Safety Stock (days)', default: 7, min: 0 }
      ],
      calculate: function (v) {
        var rop = v.avg_daily_sales * v.lead_time_days;
        var safety = v.avg_daily_sales * v.safety_stock_days;
        var total_rop = rop + safety;
        return {
          reorder_point: { label: 'Reorder Point', value: total_rop, suffix: ' units', highlight: true },
          safety_stock: { label: 'Safety Stock', value: safety, suffix: ' units', highlight: false },
          days_cover: { label: 'Days of Cover', value: v.lead_time_days + v.safety_stock_days, suffix: ' days', highlight: false }
        };
      }
    }
  };

  // ─── Formatting ─────────────────────────────────────────────────────────────

  function formatValue(value, result) {
    if (value === null || value === undefined || isNaN(value)) return '—';
    var num = parseFloat(value);

    // Special case: runway of 999 = profitable
    if (result && result.label === 'Months of Runway' && num >= 999) return '∞';
    if (result && result.label === 'Profitability') return num === 1 ? 'Profitable ✓' : 'Burning Cash';

    var prefix = result && result.prefix ? result.prefix : '';
    var suffix = result && result.suffix ? result.suffix : '';

    // Format number
    var abs = Math.abs(num);
    var formatted;
    if (abs >= 1000000) {
      formatted = (num / 1000000).toFixed(2) + 'M';
    } else if (abs >= 1000) {
      formatted = num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (suffix === '%' || suffix === 'x') {
      formatted = num.toFixed(1);
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
      '@media(max-width:480px){.valcr-body{grid-template-columns:1fr}}',

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

      // Lead capture
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

      // Error / loading states
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
    this.focusTimers = {};
  }

  ValcrWidget.prototype.init = function () {
    if (!this.calcSlug) {
      this._renderError('Missing data-valcr-calc attribute.');
      return;
    }

    var calc = CALCULATORS[this.calcSlug];
    if (!calc) {
      // Try to fetch from API if not in local registry
      this._renderError('Calculator "' + this.calcSlug + '" not found. Check your data-valcr-calc attribute.');
      return;
    }

    this.calc = calc;

    // Set initial values from defaults
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

    // Build widget HTML
    var html = '<div class="valcr-widget" id="' + this.id + '" style="width:' + this.width + '">';

    // Header
    html += '<div class="valcr-header">';
    html += '<div class="valcr-header-top">';
    html += '<span class="valcr-calc-name">' + this._esc(this.calc.name) + '</span>';
    html += '<span class="valcr-accent-dot"></span>';
    html += '</div>';
    html += '</div>';

    // Body: inputs + results
    html += '<div class="valcr-body">';

    // Inputs column
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
      html += ' step="any"';
      html += '>';
      if (hasSuffix) html += '<span class="valcr-suffix">' + this._esc(field.suffix) + '</span>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>'; // end inputs

    // Results column
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
    html += '</div>'; // end results

    html += '</div>'; // end body

    // Lead capture
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

    // Footer
    if (this.showBrand) {
      html += '<div class="valcr-footer">';
      html += '<a class="valcr-powered" href="https://valcr.site?ref=widget" target="_blank" rel="noopener">';
      html += 'Powered by <strong>Valcr</strong>';
      html += '</a>';
      html += '</div>';
    }

    html += '</div>'; // end widget

    this.container.innerHTML = html;

    // Bind events
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

    // Lead capture
    if (this.showLead) {
      var leadBtn = document.getElementById(this.id + '-lead-btn');
      if (leadBtn) {
        leadBtn.addEventListener('click', function () {
          var emailInput = document.getElementById(self.id + '-lead-email');
          var email = emailInput ? emailInput.value.trim() : '';
          var successEl = document.getElementById(self.id + '-lead-success');

          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput && (emailInput.style.borderColor = '#ff6b6b');
            setTimeout(function () {
              emailInput && (emailInput.style.borderColor = '');
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

      // Toggle negative class
      if (isNeg) {
        el.classList.add('negative');
      } else {
        el.classList.remove('negative');
      }
    }

    // Emit telemetry for calculation
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
    this.container.innerHTML = '<div class="valcr-widget"><div class="valcr-error">' + this._esc(msg) + '</div></div>';
    injectStyles(this.accentColor, this.id);
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

  // Run on DOM ready, and also expose for manual init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose public API for manual use
  global.Valcr = {
    version: VERSION,
    init: initAll,
    Widget: ValcrWidget,
    calculators: Object.keys(CALCULATORS)
  };

}(typeof window !== 'undefined' ? window : this));
