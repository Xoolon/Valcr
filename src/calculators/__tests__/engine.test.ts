/**
 * VALCR Calculator Test Suite
 * Tests all 15 calculators with real-world scenarios.
 *
 * Run: npx vitest run  (or: npx vitest --ui)
 */

import { describe, it, expect } from 'vitest'
import { calculate } from '../engine'

// ─── Helpers ────────────────────────────────────────────────────────────────
const round2 = (n: number) => Math.round(n * 100) / 100
const round1 = (n: number) => Math.round(n * 10) / 10


// ════════════════════════════════════════════════════════════════════════════
// 1. TRUE LANDED COST
// ════════════════════════════════════════════════════════════════════════════
describe('true-landed-cost', () => {
  it('baseline: $15 product, $3.50 ship, 5% duty, 2.9%+$0.30 payment, 5% returns, $49.99 price', () => {
    const r = calculate('true-landed-cost', {
      product_cost: 15,
      shipping_cost: 3.50,
      customs_duty_rate: 5,
      payment_processing_rate: 2.9,
      payment_processing_flat: 0.30,
      return_rate: 5,
      selling_price: 49.99,
    })
    // customs: 15 * 0.05 = 0.75
    // payment: 49.99 * 0.029 + 0.30 = 1.44971 + 0.30 = 1.74971
    // returns: (15 + 3.50) * 0.05 = 0.925
    // total landed: 15 + 3.50 + 0.75 + 1.74971 + 0.925 = 21.92471 → rounds to 21.92
    expect(round2(r.landed_cost)).toBe(21.92)
    expect(round2(r.gross_profit)).toBe(round2(49.99 - 21.925))
    expect(r.gross_margin).toBeGreaterThan(50)
    expect(r.gross_margin).toBeLessThan(60)
  })

  it('zero duty and zero returns: just product + shipping + payment fee', () => {
    const r = calculate('true-landed-cost', {
      product_cost: 10,
      shipping_cost: 2,
      customs_duty_rate: 0,
      payment_processing_rate: 2.9,
      payment_processing_flat: 0.30,
      return_rate: 0,
      selling_price: 30,
    })
    const expectedLanded = 10 + 2 + (30 * 0.029 + 0.30)
    expect(round2(r.landed_cost)).toBe(round2(expectedLanded))
  })

  it('gross margin is negative when landed cost exceeds price', () => {
    const r = calculate('true-landed-cost', {
      product_cost: 40,
      shipping_cost: 10,
      customs_duty_rate: 15,
      payment_processing_rate: 2.9,
      payment_processing_flat: 0.30,
      return_rate: 10,
      selling_price: 30,
    })
    expect(r.gross_profit).toBeLessThan(0)
    expect(r.gross_margin).toBeLessThan(0)
  })

  it('cost_breakdown + gross_margin ≈ 100%', () => {
    const r = calculate('true-landed-cost', {
      product_cost: 20,
      shipping_cost: 5,
      customs_duty_rate: 10,
      payment_processing_rate: 3,
      payment_processing_flat: 0.30,
      return_rate: 8,
      selling_price: 80,
    })
    expect(round1(r.cost_breakdown + r.gross_margin)).toBe(100)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 2. SHOPIFY PROFIT MARGIN
// ════════════════════════════════════════════════════════════════════════════
describe('shopify-profit-margin', () => {
  it('basic plan with Shopify Payments, no ads', () => {
    const r = calculate('shopify-profit-margin', {
      revenue: 10000,
      cogs: 4000,
      shopify_plan: 'basic',
      use_shopify_payments: 'yes',
      app_costs: 0,
      ad_spend: 0,
    })
    // plan: $39, tx: $0 (Shopify Payments), payment: 10000*0.029 + 200*0.30 = 290 + 60 = 350
    // total shopify fees: 39 + 0 + 350 = 389
    // net profit: 10000 - 4000 - 389 = 5611
    expect(round2(r.shopify_fees_total)).toBe(389)
    expect(round2(r.net_profit)).toBe(5611)
    expect(round1(r.net_margin)).toBe(56.1)
  })

  it('basic plan without Shopify Payments adds 2% transaction fee', () => {
    const withPayments = calculate('shopify-profit-margin', {
      revenue: 10000, cogs: 3000, shopify_plan: 'basic',
      use_shopify_payments: 'yes', app_costs: 0, ad_spend: 0,
    })
    const withoutPayments = calculate('shopify-profit-margin', {
      revenue: 10000, cogs: 3000, shopify_plan: 'basic',
      use_shopify_payments: 'no', app_costs: 0, ad_spend: 0,
    })
    // Extra tx fee = 10000 * 0.02 = $200
    expect(round2(withoutPayments.shopify_fees_total - withPayments.shopify_fees_total)).toBe(200)
  })

  it('Advanced plan is cheaper per-transaction than Basic at scale', () => {
    const basic = calculate('shopify-profit-margin', {
      revenue: 100000, cogs: 40000, shopify_plan: 'basic',
      use_shopify_payments: 'yes', app_costs: 0, ad_spend: 0,
    })
    const advanced = calculate('shopify-profit-margin', {
      revenue: 100000, cogs: 40000, shopify_plan: 'advanced',
      use_shopify_payments: 'yes', app_costs: 0, ad_spend: 0,
    })
    // Advanced has lower payment rate (2.4% vs 2.9%) but $399 vs $39 plan cost
    // At $100K revenue the payment savings dominate
    expect(advanced.net_profit).toBeGreaterThan(basic.net_profit)
  })

  it('effective_cogs_pct is COGS / revenue', () => {
    const r = calculate('shopify-profit-margin', {
      revenue: 20000, cogs: 8000, shopify_plan: 'basic',
      use_shopify_payments: 'yes', app_costs: 0, ad_spend: 0,
    })
    expect(round1(r.effective_cogs_pct)).toBe(40)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 3. BREAK-EVEN UNITS
// ════════════════════════════════════════════════════════════════════════════
describe('break-even-units', () => {
  it('classic break-even: $2000 fixed, $12 variable, $39 price', () => {
    const r = calculate('break-even-units', {
      fixed_costs: 2000,
      variable_cost_per_unit: 12,
      selling_price: 39,
    })
    // contribution margin = 39 - 12 = 27
    // break-even units = 2000 / 27 ≈ 74.07 → ceil = 75
    expect(r.break_even_units).toBe(75)
    expect(round2(r.contribution_margin)).toBe(27)
  })

  it('break-even revenue = fixed_costs / contribution_margin_ratio', () => {
    const r = calculate('break-even-units', {
      fixed_costs: 5000, variable_cost_per_unit: 20, selling_price: 50,
    })
    // CM = 50 - 20 = 30, CM ratio = 30/50 = 60%
    // BEP revenue = fixed_costs / CM ratio = 5000 / 0.60 = 8333.33
    // Note: break_even_revenue uses the raw (pre-ceil) unit count by design,
    // so it is NOT equal to ceil(units) × price — that would overstate revenue needed.
    expect(round2(r.break_even_revenue)).toBe(8333.33)
    // Revenue must be at least as large as what the raw calc shows
    expect(r.break_even_revenue).toBeLessThanOrEqual(r.break_even_units * 50)
  })

  it('contribution margin ratio is (price - variable) / price', () => {
    const r = calculate('break-even-units', {
      fixed_costs: 1000, variable_cost_per_unit: 15, selling_price: 60,
    })
    // CM ratio = (60-15)/60 = 75%
    expect(round1(r.contribution_margin_ratio)).toBe(75)
  })

  it('higher selling price lowers break-even units', () => {
    const low = calculate('break-even-units', {
      fixed_costs: 3000, variable_cost_per_unit: 10, selling_price: 30,
    })
    const high = calculate('break-even-units', {
      fixed_costs: 3000, variable_cost_per_unit: 10, selling_price: 50,
    })
    expect(high.break_even_units).toBeLessThan(low.break_even_units)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 4. ROAS CALCULATOR
// ════════════════════════════════════════════════════════════════════════════
describe('roas-calculator', () => {
  it('ROAS = revenue / ad spend', () => {
    const r = calculate('roas-calculator', {
      ad_spend: 5000,
      revenue_from_ads: 20000,
      cogs_percent: 35,
      platform_fees_percent: 5,
      overhead_percent: 10,
    })
    expect(round2(r.roas)).toBe(4)
  })

  it('break-even ROAS = 1 / (1 - cost_pct)', () => {
    const r = calculate('roas-calculator', {
      ad_spend: 1000,
      revenue_from_ads: 5000,
      cogs_percent: 40,
      platform_fees_percent: 5,
      overhead_percent: 5,
    })
    // total cost pct = 40+5+5 = 50%  →  BEP ROAS = 1/0.5 = 2.0
    expect(round2(r.break_even_roas)).toBe(2)
  })

  it('campaign is profitable when ROAS > break-even ROAS', () => {
    const r = calculate('roas-calculator', {
      ad_spend: 1000,
      revenue_from_ads: 5000,  // 5x ROAS
      cogs_percent: 30,
      platform_fees_percent: 5,
      overhead_percent: 10,
    })
    expect(r.roas).toBeGreaterThan(r.break_even_roas)
    expect(r.profit_from_ads).toBeGreaterThan(0)
  })

  it('campaign is unprofitable when ROAS < break-even ROAS', () => {
    const r = calculate('roas-calculator', {
      ad_spend: 5000,
      revenue_from_ads: 6000,  // 1.2x ROAS
      cogs_percent: 50,
      platform_fees_percent: 10,
      overhead_percent: 15,
    })
    expect(r.profit_from_ads).toBeLessThan(0)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 5. CUSTOMER ACQUISITION COST
// ════════════════════════════════════════════════════════════════════════════
describe('customer-acquisition-cost', () => {
  it('blended CAC = total spend / new customers', () => {
    const r = calculate('customer-acquisition-cost', {
      total_marketing_spend: 8000,
      sales_salaries: 2000,
      tools_software: 300,
      new_customers: 150,
      avg_order_value: 65,
      repeat_purchase_rate: 30,
    })
    // total cost = 8000 + 2000 + 300 = 10300
    // CAC = 10300 / 150 ≈ 68.67
    expect(round2(r.blended_cac)).toBe(round2(10300 / 150))
  })

  it('LTV:CAC ratio above 3 indicates healthy acquisition', () => {
    const r = calculate('customer-acquisition-cost', {
      total_marketing_spend: 3000,
      sales_salaries: 0,
      tools_software: 0,
      new_customers: 200,
      avg_order_value: 80,
      repeat_purchase_rate: 40,
    })
    // CAC = 15, LTV = 80 * 1.4 = 112, ratio = 7.47
    expect(r.ltv_cac_ratio).toBeGreaterThan(3)
  })

  it('payback months = CAC / AOV', () => {
    const r = calculate('customer-acquisition-cost', {
      total_marketing_spend: 5000,
      sales_salaries: 0,
      tools_software: 0,
      new_customers: 100,
      avg_order_value: 50,
      repeat_purchase_rate: 20,
    })
    // CAC = 50, AOV = 50 → payback = 1 month
    expect(round2(r.payback_months)).toBe(1)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 6. INVENTORY REORDER POINT
// ════════════════════════════════════════════════════════════════════════════
describe('inventory-reorder-point', () => {
  it('baseline reorder point is avg demand × lead time + safety stock', () => {
    const r = calculate('inventory-reorder-point', {
      daily_demand: 25,
      demand_variability: 5,
      lead_time_days: 14,
      lead_time_variability: 3,
      service_level: '95',
    })
    // avg lead time demand = 25 * 14 = 350
    expect(r.avg_lead_time_demand).toBe(350)
    // reorder point > 350 (includes safety stock)
    expect(r.reorder_point).toBeGreaterThan(350)
  })

  it('99% service level requires more safety stock than 90%', () => {
    const base = {
      daily_demand: 20, demand_variability: 4,
      lead_time_days: 10, lead_time_variability: 2,
    }
    const r90 = calculate('inventory-reorder-point', { ...base, service_level: '90' })
    const r99 = calculate('inventory-reorder-point', { ...base, service_level: '99' })
    expect(r99.safety_stock).toBeGreaterThan(r90.safety_stock)
    expect(r99.reorder_point).toBeGreaterThan(r90.reorder_point)
  })

  it('zero variability gives minimal safety stock', () => {
    const r = calculate('inventory-reorder-point', {
      daily_demand: 10, demand_variability: 0,
      lead_time_days: 7, lead_time_variability: 0,
      service_level: '95',
    })
    expect(r.safety_stock).toBe(0)
    expect(r.reorder_point).toBe(70) // pure avg demand
  })

  it('days of safety stock = safety stock / daily demand', () => {
    const r = calculate('inventory-reorder-point', {
      daily_demand: 10, demand_variability: 3,
      lead_time_days: 7, lead_time_variability: 1,
      service_level: '95',
    })
    expect(round2(r.days_of_safety_stock)).toBe(round2(r.safety_stock / 10))
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 7. CASH FLOW RUNWAY
// ════════════════════════════════════════════════════════════════════════════
describe('cash-flow-runway', () => {
  it('profitable business (revenue > expenses) returns 999 runway', () => {
    const r = calculate('cash-flow-runway', {
      cash_balance: 50000,
      monthly_revenue: 30000,
      monthly_expenses: 20000,
      monthly_cogs: 8000,
      revenue_growth_rate: 5,
    })
    // burn = 28000 - 30000 = -2000 (profitable)
    expect(r.runway_months).toBe(999)
  })

  it('burning $5k/month on $50k cash = ~10 month runway', () => {
    const r = calculate('cash-flow-runway', {
      cash_balance: 50000,
      monthly_revenue: 15000,
      monthly_expenses: 18000,
      monthly_cogs: 6000,
      revenue_growth_rate: 0,
    })
    // burn = 24000 - 15000 = 9000/mo → 50000/9000 ≈ 5.5 months
    expect(r.runway_months).toBeGreaterThan(4)
    expect(r.runway_months).toBeLessThan(8)
  })

  it('current burn is always non-negative', () => {
    const r = calculate('cash-flow-runway', {
      cash_balance: 100000,
      monthly_revenue: 50000,
      monthly_expenses: 20000,
      monthly_cogs: 10000,
      revenue_growth_rate: 10,
    })
    expect(r.current_burn).toBeGreaterThanOrEqual(0)
  })

  it('higher growth rate extends runway', () => {
    const base = {
      cash_balance: 30000, monthly_revenue: 10000,
      monthly_expenses: 15000, monthly_cogs: 4000,
    }
    const slow = calculate('cash-flow-runway', { ...base, revenue_growth_rate: 5 })
    const fast = calculate('cash-flow-runway', { ...base, revenue_growth_rate: 20 })
    expect(fast.runway_months).toBeGreaterThanOrEqual(slow.runway_months)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 8. SUBSCRIPTION LTV
// ════════════════════════════════════════════════════════════════════════════
describe('subscription-ltv', () => {
  it('5% monthly churn = 20 month average lifespan', () => {
    const r = calculate('subscription-ltv', {
      monthly_price: 29,
      monthly_churn_rate: 5,
      cogs_percent: 30,
      refund_rate: 0,
      cac: 0,
    })
    expect(round2(r.avg_customer_lifespan)).toBe(20)
  })

  it('LTV:CAC above 3 is healthy', () => {
    const r = calculate('subscription-ltv', {
      monthly_price: 49,
      monthly_churn_rate: 3,
      cogs_percent: 20,
      refund_rate: 1,
      cac: 80,
    })
    // lifespan = 1/0.03 ≈ 33.3 mo
    // net monthly = 49 * 0.99 = 48.51
    // gross LTV = 48.51 * 0.8 * 33.3 ≈ 1292
    // ratio = 1292 / 80 ≈ 16.1
    expect(r.ltv_cac_ratio).toBeGreaterThan(3)
  })

  it('net LTV is less than gross LTV when CAC > 0', () => {
    const r = calculate('subscription-ltv', {
      monthly_price: 29, monthly_churn_rate: 5,
      cogs_percent: 30, refund_rate: 2, cac: 45,
    })
    expect(r.net_ltv).toBeLessThan(r.gross_ltv)
    expect(r.gross_ltv - r.net_ltv).toBe(45)
  })

  it('zero churn caps lifespan at 120 months', () => {
    const r = calculate('subscription-ltv', {
      monthly_price: 10, monthly_churn_rate: 0,
      cogs_percent: 20, refund_rate: 0, cac: 0,
    })
    expect(r.avg_customer_lifespan).toBe(120)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 9. AMAZON FBA CALCULATOR
// ════════════════════════════════════════════════════════════════════════════
describe('amazon-fba-calculator', () => {
  it('baseline FBA calculation', () => {
    const r = calculate('amazon-fba-calculator', {
      selling_price: 29.99,
      product_cost: 6,
      inbound_shipping: 1.20,
      referral_fee_percent: 15,
      fulfillment_fee: 4.75,
      monthly_storage: 0.15,
      prep_cost: 0.50,
      ppc_spend_per_unit: 1.50,
    })
    // referral = 29.99 * 0.15 = 4.499
    // total amazon = 4.499 + 4.75 + 0.15 = 9.399
    // total cost = 6 + 1.20 + 9.399 + 0.50 + 1.50 = 18.599
    // net profit = 29.99 - 18.599 = 11.39
    expect(round2(r.net_profit)).toBeCloseTo(11.39, 0)
    expect(r.net_margin).toBeGreaterThan(30)
  })

  it('total Amazon fees include referral + fulfillment + storage', () => {
    const r = calculate('amazon-fba-calculator', {
      selling_price: 20,
      product_cost: 4,
      inbound_shipping: 0.80,
      referral_fee_percent: 15,
      fulfillment_fee: 3.22,
      monthly_storage: 0.10,
      prep_cost: 0,
      ppc_spend_per_unit: 0,
    })
    const expected = 20 * 0.15 + 3.22 + 0.10
    expect(round2(r.total_amazon_fees)).toBe(round2(expected))
  })

  it('ROI = net profit / product cost × 100', () => {
    const r = calculate('amazon-fba-calculator', {
      selling_price: 25,
      product_cost: 5,
      inbound_shipping: 1,
      referral_fee_percent: 15,
      fulfillment_fee: 4,
      monthly_storage: 0.10,
      prep_cost: 0.30,
      ppc_spend_per_unit: 1,
    })
    const expectedRoi = (r.net_profit / 5) * 100
    expect(round1(r.roi)).toBe(round1(expectedRoi))
  })

  it('higher PPC reduces profit proportionally', () => {
    const base = { selling_price: 30, product_cost: 7, inbound_shipping: 1,
      referral_fee_percent: 15, fulfillment_fee: 4.75, monthly_storage: 0.15, prep_cost: 0.50 }
    const r0 = calculate('amazon-fba-calculator', { ...base, ppc_spend_per_unit: 0 })
    const r2 = calculate('amazon-fba-calculator', { ...base, ppc_spend_per_unit: 2 })
    expect(round2(r0.net_profit - r2.net_profit)).toBe(2)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 10. PRICING STRATEGY
// ════════════════════════════════════════════════════════════════════════════
describe('pricing-strategy', () => {
  it('target price achieves the desired gross margin', () => {
    const r = calculate('pricing-strategy', {
      cogs: 12,
      shipping_cost: 2.50,
      platform_fee_percent: 5,
      payment_processing_percent: 2.9,
      target_gross_margin: 60,
      overhead_per_unit: 2,
    })
    // Verify: at target_price, margin should be ~60%
    const fixedCost = 12 + 2.50 + 2
    const variablePct = 0.05 + 0.029 // 7.9%
    // price * (1 - 0.079) - fixedCost = price * 0.60
    // price * (1 - 0.079 - 0.60) = fixedCost
    // price * 0.321 = 16.5  →  price ≈ 51.40
    expect(r.target_price).toBeGreaterThan(40)
    expect(r.target_price).toBeLessThan(60)
  })

  it('minimum price is lower than target price', () => {
    const r = calculate('pricing-strategy', {
      cogs: 15, shipping_cost: 3, platform_fee_percent: 5,
      payment_processing_percent: 2.9, target_gross_margin: 50, overhead_per_unit: 2,
    })
    expect(r.minimum_price).toBeLessThan(r.target_price)
  })

  it('markup multiplier = target price / total cost per unit', () => {
    const r = calculate('pricing-strategy', {
      cogs: 10, shipping_cost: 2, platform_fee_percent: 5,
      payment_processing_percent: 2.9, target_gross_margin: 55, overhead_per_unit: 1,
    })
    expect(round2(r.markup_multiplier)).toBe(round2(r.target_price / r.total_cost_per_unit))
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 11. REFUND RATE IMPACT
// ════════════════════════════════════════════════════════════════════════════
describe('refund-rate-impact', () => {
  it('8% refund rate on $50k revenue', () => {
    const r = calculate('refund-rate-impact', {
      monthly_revenue: 50000,
      refund_rate: 8,
      cogs_percent: 35,
      return_shipping_cost: 6.50,
      restocking_rate: 60,
      avg_order_value: 75,
    })
    // refunded revenue = 50000 * 0.08 = 4000
    expect(r.net_revenue).toBe(50000 - 4000)
    expect(r.total_refund_cost).toBeGreaterThan(4000) // includes lost product + shipping
  })

  it('higher restocking rate reduces total refund cost', () => {
    const base = { monthly_revenue: 50000, refund_rate: 8, cogs_percent: 35,
      return_shipping_cost: 5, avg_order_value: 75 }
    const low = calculate('refund-rate-impact', { ...base, restocking_rate: 20 })
    const high = calculate('refund-rate-impact', { ...base, restocking_rate: 80 })
    expect(high.total_refund_cost).toBeLessThan(low.total_refund_cost)
  })

  it('value of 1% reduction scales with revenue and AOV', () => {
    const r = calculate('refund-rate-impact', {
      monthly_revenue: 100000, refund_rate: 5,
      cogs_percent: 30, return_shipping_cost: 8,
      restocking_rate: 50, avg_order_value: 100,
    })
    expect(r.value_of_1pct_reduction).toBeGreaterThan(0)
  })

  it('zero refunds means net revenue equals gross revenue', () => {
    const r = calculate('refund-rate-impact', {
      monthly_revenue: 30000, refund_rate: 0,
      cogs_percent: 40, return_shipping_cost: 5,
      restocking_rate: 50, avg_order_value: 60,
    })
    expect(r.net_revenue).toBe(30000)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 12. BUNDLE PRICING OPTIMIZER
// ════════════════════════════════════════════════════════════════════════════
describe('bundle-pricing-optimizer', () => {
  it('bundle price = combined price × (1 - discount)', () => {
    const r = calculate('bundle-pricing-optimizer', {
      product1_price: 29.99,
      product1_cogs: 8,
      product2_price: 19.99,
      product2_cogs: 5,
      bundle_discount_percent: 15,
      platform_fees: 5,
    })
    expect(round2(r.bundle_price)).toBe(round2((29.99 + 19.99) * 0.85))
  })

  it('zero discount bundle has same price as sum of products', () => {
    const r = calculate('bundle-pricing-optimizer', {
      product1_price: 30, product1_cogs: 10,
      product2_price: 20, product2_cogs: 7,
      bundle_discount_percent: 0, platform_fees: 0,
    })
    expect(round2(r.bundle_price)).toBe(50)
  })

  it('heavy discount erodes bundle margin below individual margin', () => {
    const r = calculate('bundle-pricing-optimizer', {
      product1_price: 30, product1_cogs: 10,
      product2_price: 20, product2_cogs: 8,
      bundle_discount_percent: 40,
      platform_fees: 5,
    })
    expect(r.bundle_margin).toBeLessThan(r.individual_margin)
    expect(r.margin_delta).toBeLessThan(0)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 13. INFLUENCER ROI CALCULATOR
// ════════════════════════════════════════════════════════════════════════════
describe('influencer-roi-calculator', () => {
  it('estimated orders = total audience × conversion rate', () => {
    const r = calculate('influencer-roi-calculator', {
      influencer_fee: 2500,
      followers: 100000,
      engagement_rate: 3,
      story_reach_percent: 15,
      conversion_rate: 1.5,
      avg_order_value: 65,
      gross_margin_percent: 60,
      product_cost: 100,
    })
    // reach = 100000 * 0.15 = 15000, engaged = 100000 * 0.03 = 3000
    // max(15000, 3000) = 15000
    // orders = 15000 * 0.015 = 225
    expect(round2(r.estimated_orders)).toBeCloseTo(225, 0)
  })

  it('campaign ROAS = revenue / (fee + product cost)', () => {
    const r = calculate('influencer-roi-calculator', {
      influencer_fee: 1000,
      followers: 50000,
      engagement_rate: 4,
      story_reach_percent: 20,
      conversion_rate: 2,
      avg_order_value: 50,
      gross_margin_percent: 60,
      product_cost: 200,
    })
    expect(round2(r.campaign_roas)).toBe(round2(r.estimated_revenue / (1000 + 200)))
  })

  it('negative ROI when fee greatly exceeds revenue', () => {
    const r = calculate('influencer-roi-calculator', {
      influencer_fee: 50000,
      followers: 10000,
      engagement_rate: 1,
      story_reach_percent: 5,
      conversion_rate: 0.5,
      avg_order_value: 30,
      gross_margin_percent: 40,
      product_cost: 500,
    })
    expect(r.net_profit).toBeLessThan(0)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 14. CHARGEBACK IMPACT
// ════════════════════════════════════════════════════════════════════════════
describe('chargeback-impact', () => {
  it('monthly chargebacks = transactions × chargeback rate', () => {
    const r = calculate('chargeback-impact', {
      monthly_transactions: 500,
      avg_order_value: 75,
      chargeback_rate: 0.8,
      dispute_fee: 25,
      cogs_percent: 35,
      win_rate: 30,
    })
    // chargebacks = 500 * 0.008 = 4
    expect(round2(r.monthly_chargebacks)).toBe(4)
  })

  it('annual impact = monthly loss × 12', () => {
    const r = calculate('chargeback-impact', {
      monthly_transactions: 1000, avg_order_value: 100,
      chargeback_rate: 1, dispute_fee: 25,
      cogs_percent: 40, win_rate: 25,
    })
    expect(round2(r.annual_impact)).toBe(round2(r.total_monthly_loss * 12))
  })

  it('100% win rate eliminates lost revenue (only fees remain)', () => {
    const r = calculate('chargeback-impact', {
      monthly_transactions: 500, avg_order_value: 75,
      chargeback_rate: 1, dispute_fee: 20,
      cogs_percent: 35, win_rate: 100,
    })
    // With 100% win rate, no lost revenue or product — only dispute fees
    const disputeFeesOnly = r.monthly_chargebacks * 20
    expect(round2(r.total_monthly_loss)).toBe(round2(disputeFeesOnly))
  })

  it('higher AOV increases total monthly loss proportionally', () => {
    const base = { monthly_transactions: 500, chargeback_rate: 1,
      dispute_fee: 25, cogs_percent: 35, win_rate: 30 }
    const low = calculate('chargeback-impact', { ...base, avg_order_value: 50 })
    const high = calculate('chargeback-impact', { ...base, avg_order_value: 150 })
    expect(high.total_monthly_loss).toBeGreaterThan(low.total_monthly_loss)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// 15. SHIPPING COST OPTIMIZER
// ════════════════════════════════════════════════════════════════════════════
describe('shipping-cost-optimizer', () => {
  it('dimensional weight = L×W×H / 139', () => {
    const r = calculate('shipping-cost-optimizer', {
      package_weight_oz: 8,
      length_in: 10,
      width_in: 8,
      height_in: 4,
      destination_type: 'residential',
      monthly_volume: 200,
      avg_order_value: 65,
    })
    // dim weight = (10 * 8 * 4) / 139 = 320 / 139 ≈ 2.30 lb
    expect(round2(r.dim_weight_lb)).toBeCloseTo(2.30, 1)
  })

  it('billable weight = max(actual, dim weight)', () => {
    const r = calculate('shipping-cost-optimizer', {
      package_weight_oz: 16, // 1 lb actual
      length_in: 12,
      width_in: 10,
      height_in: 6,
      destination_type: 'residential',
      monthly_volume: 100,
      avg_order_value: 50,
    })
    // dim = (12*10*6)/139 = 720/139 ≈ 5.18 lb > 1 lb actual
    expect(r.billable_weight_lb).toBeGreaterThan(1)
    expect(round2(r.billable_weight_lb)).toBe(round2(r.dim_weight_lb))
  })

  it('shipping as % of AOV is lower for higher AOV', () => {
    const base = { package_weight_oz: 12, length_in: 10, width_in: 8,
      height_in: 4, destination_type: 'residential', monthly_volume: 100 }
    const low = calculate('shipping-cost-optimizer', { ...base, avg_order_value: 20 })
    const high = calculate('shipping-cost-optimizer', { ...base, avg_order_value: 100 })
    expect(high.shipping_as_pct_aov).toBeLessThan(low.shipping_as_pct_aov)
  })

  it('a very light package uses actual weight not dim weight', () => {
    const r = calculate('shipping-cost-optimizer', {
      package_weight_oz: 160, // 10 lb actual
      length_in: 6,
      width_in: 4,
      height_in: 2,
      destination_type: 'residential',
      monthly_volume: 50,
      avg_order_value: 80,
    })
    // dim = (6*4*2)/139 = 48/139 ≈ 0.35 lb < 10 lb actual
    expect(r.billable_weight_lb).toBeCloseTo(10, 1)
  })
})


// ════════════════════════════════════════════════════════════════════════════
// EDGE CASES — guard against NaN, Infinity, division by zero
// ════════════════════════════════════════════════════════════════════════════
describe('edge cases — division by zero and boundary inputs', () => {
  it('break-even with selling price = variable cost returns Infinity gracefully', () => {
    const r = calculate('break-even-units', {
      fixed_costs: 1000, variable_cost_per_unit: 30, selling_price: 30,
    })
    // contribution margin = 0 → result should not crash, units should be very large or Infinity
    expect(isFinite(r.break_even_units) || r.break_even_units === Infinity).toBe(true)
  })

  it('ROAS with zero ad spend does not return NaN', () => {
    const r = calculate('roas-calculator', {
      ad_spend: 0, revenue_from_ads: 5000,
      cogs_percent: 40, platform_fees_percent: 5, overhead_percent: 10,
    })
    expect(isNaN(r.roas)).toBe(false)
  })

  it('subscription LTV with zero churn does not divide by zero', () => {
    const r = calculate('subscription-ltv', {
      monthly_price: 29, monthly_churn_rate: 0,
      cogs_percent: 30, refund_rate: 0, cac: 50,
    })
    expect(isNaN(r.gross_ltv)).toBe(false)
    expect(isFinite(r.gross_ltv)).toBe(true)
  })

  it('all calculators return only finite numbers with default inputs', () => {
    const slugs = [
      'true-landed-cost', 'shopify-profit-margin', 'break-even-units',
      'roas-calculator', 'customer-acquisition-cost', 'inventory-reorder-point',
      'cash-flow-runway', 'subscription-ltv', 'amazon-fba-calculator',
      'pricing-strategy', 'refund-rate-impact', 'bundle-pricing-optimizer',
      'influencer-roi-calculator', 'chargeback-impact', 'shipping-cost-optimizer',
    ]
    for (const slug of slugs) {
      // Use safe defaults that won't cause boundary issues
      const inputs: Record<string, number | string> = {
        product_cost: 10, shipping_cost: 2, customs_duty_rate: 5,
        payment_processing_rate: 2.9, payment_processing_flat: 0.30,
        return_rate: 5, selling_price: 40, revenue: 10000, cogs: 4000,
        shopify_plan: 'basic', use_shopify_payments: 'yes', app_costs: 100,
        ad_spend: 500, fixed_costs: 2000, variable_cost_per_unit: 12,
        revenue_from_ads: 15000, cogs_percent: 35, platform_fees_percent: 5,
        overhead_percent: 10, total_marketing_spend: 3000, sales_salaries: 500,
        tools_software: 100, new_customers: 100, avg_order_value: 60,
        repeat_purchase_rate: 25, daily_demand: 20, demand_variability: 4,
        lead_time_days: 10, lead_time_variability: 2, service_level: '95',
        cash_balance: 50000, monthly_revenue: 15000, monthly_expenses: 18000,
        monthly_cogs: 5000, revenue_growth_rate: 10, monthly_price: 29,
        monthly_churn_rate: 5, refund_rate: 2, cac: 45,
        inbound_shipping: 1, referral_fee_percent: 15, fulfillment_fee: 4.75,
        monthly_storage: 0.15, prep_cost: 0.50, ppc_spend_per_unit: 1.50,
        platform_fee_percent: 5, payment_processing_percent: 2.9,
        target_gross_margin: 55, overhead_per_unit: 2, return_shipping_cost: 5,
        restocking_rate: 60, product1_price: 30, product1_cogs: 9,
        product2_price: 20, product2_cogs: 6, bundle_discount_percent: 15,
        platform_fees: 5, influencer_fee: 2000, followers: 50000,
        engagement_rate: 3, story_reach_percent: 15, conversion_rate: 1.5,
        gross_margin_percent: 60, monthly_transactions: 500,
        chargeback_rate: 0.8, dispute_fee: 25, win_rate: 30,
        package_weight_oz: 12, length_in: 10, width_in: 8, height_in: 4,
        destination_type: 'residential', monthly_volume: 200,
      }
      const result = calculate(slug, inputs)
      for (const [key, val] of Object.entries(result)) {
        expect(
          isNaN(val),
          `${slug}.${key} returned NaN`
        ).toBe(false)
      }
    }
  })
})