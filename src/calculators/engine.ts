// Pure math engine — no side effects, no UI dependencies

export interface CalcResult {
  [key: string]: number
}

export function calculate(slug: string, inputs: Record<string, number | string>): CalcResult {
  const n = (key: string, fallback = 0) => {
    const v = inputs[key]
    const num = typeof v === 'string' ? parseFloat(v) : v
    return isNaN(num) ? fallback : num
  }
  const pct = (key: string, fallback = 0) => n(key, fallback) / 100

  switch (slug) {
    case 'true-landed-cost': {
      const productCost = n('product_cost')
      const shippingCost = n('shipping_cost')
      const customsDutyRate = pct('customs_duty_rate')
      const paymentProcRate = pct('payment_processing_rate')
      const paymentProcFlat = n('payment_processing_flat')
      const returnRate = pct('return_rate')
      const sellingPrice = n('selling_price')

      const customsDuty = productCost * customsDutyRate
      const paymentFee = sellingPrice * paymentProcRate + paymentProcFlat
      const returnCost = (productCost + shippingCost) * returnRate
      const landedCost = productCost + shippingCost + customsDuty + paymentFee + returnCost
      const grossProfit = sellingPrice - landedCost
      const grossMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0
      const costBreakdown = sellingPrice > 0 ? (landedCost / sellingPrice) * 100 : 0

      return { landed_cost: landedCost, gross_profit: grossProfit, gross_margin: grossMargin, cost_breakdown: costBreakdown }
    }

    case 'shopify-profit-margin': {
      const revenue = n('revenue')
      const cogs = n('cogs')
      const plan = inputs['shopify_plan'] as string
      const useShopifyPayments = inputs['use_shopify_payments'] === 'yes'
      const appCosts = n('app_costs')
      const adSpend = n('ad_spend')

      const planCosts: Record<string, number> = {
        starter: 5, basic: 39, shopify: 105, advanced: 399, plus: 2300
      }
      const txFeeRates: Record<string, number> = {
        starter: 0.05, basic: 0.02, shopify: 0.01, advanced: 0.005, plus: 0
      }
      const paymentRates: Record<string, number> = {
        starter: 0.05, basic: 0.029, shopify: 0.026, advanced: 0.024, plus: 0.02
      }

      const planCost = planCosts[plan] ?? 39
      const txFee = useShopifyPayments ? 0 : (txFeeRates[plan] ?? 0.02) * revenue
      const paymentFee = (paymentRates[plan] ?? 0.029) * revenue + Math.floor(revenue / 50) * 0.30
      const shopifyFeesTotal = planCost + txFee + paymentFee
      const netProfit = revenue - cogs - shopifyFeesTotal - appCosts - adSpend
      const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
      const effectiveCogsPct = revenue > 0 ? (cogs / revenue) * 100 : 0

      return { net_profit: netProfit, net_margin: netMargin, shopify_fees_total: shopifyFeesTotal, effective_cogs_pct: effectiveCogsPct }
    }

    case 'break-even-units': {
      const fixedCosts = n('fixed_costs')
      const variableCost = n('variable_cost_per_unit')
      const sellingPrice = n('selling_price')

      const contributionMargin = sellingPrice - variableCost
      const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : Infinity
      const breakEvenRevenue = isFinite(breakEvenUnits) ? breakEvenUnits * sellingPrice : 0
      const cmRatio = sellingPrice > 0 ? (contributionMargin / sellingPrice) * 100 : 0

      return {
        break_even_units: Math.ceil(breakEvenUnits),
        break_even_revenue: breakEvenRevenue,
        contribution_margin: contributionMargin,
        contribution_margin_ratio: cmRatio,
      }
    }

    case 'roas-calculator': {
      const adSpend = n('ad_spend')
      const revenue = n('revenue_from_ads')
      const cogsPct = pct('cogs_percent')
      const platformFeesPct = pct('platform_fees_percent')
      const overheadPct = pct('overhead_percent')

      const roas = adSpend > 0 ? revenue / adSpend : 0
      const grossProfit = revenue * (1 - cogsPct - platformFeesPct)
      const overhead = revenue * overheadPct
      const profitFromAds = grossProfit - overhead - adSpend
      const totalCostPct = cogsPct + platformFeesPct + overheadPct
      const breakEvenRoas = 1 - totalCostPct > 0 ? 1 / (1 - totalCostPct) : Infinity
      const profitMarginOnAdRevenue = revenue > 0 ? (profitFromAds / revenue) * 100 : 0

      return { roas, profit_from_ads: profitFromAds, break_even_roas: breakEvenRoas, profit_margin_on_ad_revenue: profitMarginOnAdRevenue }
    }

    case 'customer-acquisition-cost': {
      const totalMarketing = n('total_marketing_spend')
      const salaries = n('sales_salaries')
      const tools = n('tools_software')
      const newCustomers = n('new_customers')
      const aov = n('avg_order_value')
      const repeatRate = pct('repeat_purchase_rate')

      const totalCost = totalMarketing + salaries + tools
      const blendedCac = newCustomers > 0 ? totalCost / newCustomers : 0
      const ltv12mo = aov * (1 + repeatRate)
      const ltvCacRatio = blendedCac > 0 ? ltv12mo / blendedCac : 0
      const paybackMonths = aov > 0 ? blendedCac / aov : 0

      return { blended_cac: blendedCac, ltv_12mo: ltv12mo, ltv_cac_ratio: ltvCacRatio, payback_months: paybackMonths }
    }

    case 'inventory-reorder-point': {
      const dailyDemand = n('daily_demand')
      const demandSD = n('demand_variability')
      const leadTime = n('lead_time_days')
      const leadTimeSD = n('lead_time_variability')
      const serviceLevel = parseFloat(inputs['service_level'] as string || '95')

      // Z-scores for service levels
      const zScores: Record<number, number> = { 90: 1.28, 95: 1.645, 99: 2.33 }
      const z = zScores[serviceLevel] ?? 1.645

      const avgLeadTimeDemand = dailyDemand * leadTime
      const safetyStockVariance = (leadTime * demandSD ** 2) + (dailyDemand ** 2 * leadTimeSD ** 2)
      const safetyStock = Math.ceil(z * Math.sqrt(safetyStockVariance))
      const reorderPoint = Math.ceil(avgLeadTimeDemand + safetyStock)
      const daysOfSafetyStock = dailyDemand > 0 ? safetyStock / dailyDemand : 0

      return { reorder_point: reorderPoint, safety_stock: safetyStock, avg_lead_time_demand: avgLeadTimeDemand, days_of_safety_stock: daysOfSafetyStock }
    }

    case 'cash-flow-runway': {
      const cashBalance = n('cash_balance')
      const monthlyRevenue = n('monthly_revenue')
      const monthlyExpenses = n('monthly_expenses')
      const monthlyCogs = n('monthly_cogs')
      const growthRate = pct('revenue_growth_rate')

      const currentBurn = monthlyExpenses + monthlyCogs - monthlyRevenue
      let runway = 0
      let cash = cashBalance
      let revenue = monthlyRevenue

      if (currentBurn <= 0) {
        runway = 999 // Profitable
      } else {
        for (let month = 0; month < 120; month++) {
          const expenses = monthlyExpenses + monthlyCogs
          const burn = expenses - revenue
          cash -= burn
          if (cash <= 0) { runway = month + 1; break }
          revenue *= (1 + growthRate)
          runway = month + 2
        }
      }

      // Find break-even month
      let breakevenMonth = 0
      revenue = monthlyRevenue
      for (let month = 1; month <= 60; month++) {
        if (revenue >= monthlyExpenses + monthlyCogs) { breakevenMonth = month; break }
        revenue *= (1 + growthRate)
      }

      let revenueAtZero = monthlyRevenue
      for (let i = 0; i < runway && i < 60; i++) revenueAtZero *= (1 + growthRate)

      return { current_burn: Math.max(0, currentBurn), runway_months: Math.min(runway, 999), breakeven_month: breakevenMonth, zero_date_revenue: revenueAtZero }
    }

    case 'subscription-ltv': {
      const monthlyPrice = n('monthly_price')
      const churnRate = pct('monthly_churn_rate')
      const cogsPct = pct('cogs_percent')
      const refundRate = pct('refund_rate')
      const cac = n('cac')

      const avgLifespan = churnRate > 0 ? 1 / churnRate : 120
      const netMonthlyRevenue = monthlyPrice * (1 - refundRate)
      const grossLtv = netMonthlyRevenue * (1 - cogsPct) * avgLifespan
      const netLtv = grossLtv - cac
      const ltvCacRatio = cac > 0 ? grossLtv / cac : 0

      return { avg_customer_lifespan: avgLifespan, gross_ltv: grossLtv, net_ltv: netLtv, ltv_cac_ratio: ltvCacRatio }
    }

    case 'amazon-fba-calculator': {
      const sellingPrice = n('selling_price')
      const productCost = n('product_cost')
      const inboundShipping = n('inbound_shipping')
      const referralFeeRate = pct('referral_fee_percent')
      const fulfillmentFee = n('fulfillment_fee')
      const monthlyStorage = n('monthly_storage')
      const prepCost = n('prep_cost')
      const ppcPerUnit = n('ppc_spend_per_unit')

      const referralFee = sellingPrice * referralFeeRate
      const totalAmazonFees = referralFee + fulfillmentFee + monthlyStorage
      const totalCost = productCost + inboundShipping + totalAmazonFees + prepCost + ppcPerUnit
      const netProfit = sellingPrice - totalCost
      const netMargin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0
      const roi = productCost > 0 ? (netProfit / productCost) * 100 : 0

      return { net_profit: netProfit, net_margin: netMargin, total_amazon_fees: totalAmazonFees, roi }
    }

    case 'pricing-strategy': {
      const cogs = n('cogs')
      const shippingCost = n('shipping_cost')
      const platformFeePct = pct('platform_fee_percent')
      const paymentProcPct = pct('payment_processing_percent')
      const targetMargin = pct('target_gross_margin')
      const overhead = n('overhead_per_unit')

      const fixedCostPerUnit = cogs + shippingCost + overhead
      // Price needed so that (price - variable_fee*price - fixed_cost) / price = target_margin
      // price * (1 - platformFeePct - paymentProcPct) - fixedCostPerUnit = price * targetMargin
      // price * (1 - platformFeePct - paymentProcPct - targetMargin) = fixedCostPerUnit
      const divisor = 1 - platformFeePct - paymentProcPct - targetMargin
      const targetPrice = divisor > 0 ? fixedCostPerUnit / divisor : 0
      const minDivisor = 1 - platformFeePct - paymentProcPct
      const minimumPrice = minDivisor > 0 ? fixedCostPerUnit / minDivisor : 0
      const totalCostPerUnit = fixedCostPerUnit
      const markupMultiplier = totalCostPerUnit > 0 ? targetPrice / totalCostPerUnit : 0

      return { minimum_price: minimumPrice, target_price: targetPrice, total_cost_per_unit: totalCostPerUnit, markup_multiplier: markupMultiplier }
    }

    case 'refund-rate-impact': {
      const monthlyRevenue = n('monthly_revenue')
      const refundRate = pct('refund_rate')
      const cogsPct = pct('cogs_percent')
      const returnShipping = n('return_shipping_cost')
      const restockingRate = pct('restocking_rate')
      const aov = n('avg_order_value')

      const refundedOrders = aov > 0 ? (monthlyRevenue * refundRate) / aov : 0
      const refundedRevenue = monthlyRevenue * refundRate
      const lostCogs = refundedRevenue * cogsPct * (1 - restockingRate)
      const totalShipping = refundedOrders * returnShipping
      const totalRefundCost = refundedRevenue + lostCogs + totalShipping
      const netRevenue = monthlyRevenue - refundedRevenue
      const refundsAsPctRevenue = monthlyRevenue > 0 ? (totalRefundCost / monthlyRevenue) * 100 : 0
      const value1PctReduction = (monthlyRevenue * 0.01) / aov * aov

      return { net_revenue: netRevenue, total_refund_cost: totalRefundCost, refunds_as_pct_revenue: refundsAsPctRevenue, value_of_1pct_reduction: value1PctReduction }
    }

    case 'bundle-pricing-optimizer': {
      const p1Price = n('product1_price')
      const p1Cogs = n('product1_cogs')
      const p2Price = n('product2_price')
      const p2Cogs = n('product2_cogs')
      const discountRate = pct('bundle_discount_percent')
      const platformFees = pct('platform_fees')

      const combinedPrice = p1Price + p2Price
      const bundlePrice = combinedPrice * (1 - discountRate)
      const bundleCogs = p1Cogs + p2Cogs
      const bundleRevenue = bundlePrice * (1 - platformFees)
      const bundleMargin = bundlePrice > 0 ? ((bundleRevenue - bundleCogs) / bundlePrice) * 100 : 0
      const indivRevenue1 = p1Price * (1 - platformFees)
      const indivRevenue2 = p2Price * (1 - platformFees)
      const indivMargin = combinedPrice > 0 ? (((indivRevenue1 - p1Cogs) + (indivRevenue2 - p2Cogs)) / combinedPrice) * 100 : 0
      const marginDelta = bundleMargin - indivMargin

      return { bundle_price: bundlePrice, bundle_margin: bundleMargin, individual_margin: indivMargin, margin_delta: marginDelta }
    }

    case 'influencer-roi-calculator': {
      const influencerFee = n('influencer_fee')
      const followers = n('followers')
      const engagementRate = pct('engagement_rate')
      const storyReachPct = pct('story_reach_percent')
      const conversionRate = pct('conversion_rate')
      const aov = n('avg_order_value')
      const grossMarginPct = pct('gross_margin_percent')
      const productCost = n('product_cost')

      const estimatedReach = followers * storyReachPct
      const engagedUsers = followers * engagementRate
      const totalAudience = Math.max(estimatedReach, engagedUsers)
      const estimatedOrders = totalAudience * conversionRate
      const estimatedRevenue = estimatedOrders * aov
      const grossProfit = estimatedRevenue * grossMarginPct
      const netProfit = grossProfit - influencerFee - productCost
      const totalCampaignCost = influencerFee + productCost
      const campaignRoas = totalCampaignCost > 0 ? estimatedRevenue / totalCampaignCost : 0

      return { estimated_orders: estimatedOrders, estimated_revenue: estimatedRevenue, net_profit: netProfit, campaign_roas: campaignRoas }
    }

    case 'chargeback-impact': {
      const transactions = n('monthly_transactions')
      const aov = n('avg_order_value')
      const chargebackRate = pct('chargeback_rate')
      const disputeFee = n('dispute_fee')
      const cogsPct = pct('cogs_percent')
      const winRate = pct('win_rate')

      const monthlyChargebacks = transactions * chargebackRate
      const lostRevenue = monthlyChargebacks * aov * (1 - winRate)
      const lostProduct = monthlyChargebacks * aov * cogsPct * (1 - winRate)
      const totalFees = monthlyChargebacks * disputeFee
      const totalMonthlyLoss = lostRevenue + lostProduct + totalFees
      const costPerChargeback = monthlyChargebacks > 0 ? totalMonthlyLoss / monthlyChargebacks : 0

      return { monthly_chargebacks: monthlyChargebacks, total_monthly_loss: totalMonthlyLoss, cost_per_chargeback: costPerChargeback, annual_impact: totalMonthlyLoss * 12 }
    }

    case 'shipping-cost-optimizer': {
      const weightOz = n('package_weight_oz')
      const length = n('length_in')
      const width = n('width_in')
      const height = n('height_in')
      const aov = n('avg_order_value')

      const weightLb = weightOz / 16
      const dimWeightLb = (length * width * height) / 139
      const billableWeightLb = Math.max(weightLb, dimWeightLb)

      // Rough USPS Ground Advantage estimate
      const uspsBase = billableWeightLb <= 1 ? 5.50 : billableWeightLb <= 2 ? 6.80 : billableWeightLb <= 3 ? 8.10 : 9.50 + (billableWeightLb - 3) * 0.80
      const shippingAsPctAov = aov > 0 ? (uspsBase / aov) * 100 : 0

      return { dim_weight_lb: dimWeightLb, billable_weight_lb: billableWeightLb, estimated_cost_usps: uspsBase, shipping_as_pct_aov: shippingAsPctAov }
    }

    default:
      return {}
  }
}

export function explain(slug: string, _inputs: Record<string, number | string>, results: CalcResult): string {
  const fmt = (n: number, type = 'currency') => {
    if (type === 'currency') return '$' + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (type === 'percent') return n.toFixed(1) + '%'
    if (type === 'number') return Math.ceil(n).toLocaleString()
    return String(n)
  }

  switch (slug) {
    case 'true-landed-cost':
      return `Your true landed cost is ${fmt(results.landed_cost)}, giving you a ${fmt(results.gross_margin, 'percent')} gross margin at your current selling price. ${results.gross_margin < 30 ? 'Your margin is tight — consider negotiating COGS or raising your price.' : results.gross_margin > 60 ? 'Strong margin. You have room to invest in growth or absorb price increases.' : 'Healthy margin. Keep monitoring as fees and shipping rates fluctuate.'}`

    case 'shopify-profit-margin':
      return `After all Shopify fees and ad spend, you keep ${fmt(results.net_profit)} (${fmt(results.net_margin, 'percent')} net margin). ${results.net_margin < 10 ? 'This is thin. Focus on reducing ad spend CAC or cutting app costs.' : 'Solid net margin for e-commerce.'}`

    case 'break-even-units':
      return `You need to sell ${fmt(results.break_even_units, 'number')} units per month to break even, generating ${fmt(results.break_even_revenue)} in revenue. ${results.contribution_margin < 10 ? 'Low contribution margin — consider raising your price.' : 'Every unit beyond break-even contributes ' + fmt(results.contribution_margin) + ' to profit.'}`

    case 'roas-calculator':
      return `Your current ROAS is ${results.roas.toFixed(2)}x. Your break-even ROAS is ${results.break_even_roas.toFixed(2)}x. ${results.roas > results.break_even_roas ? 'Your ads are profitable — you\'re above break-even.' : 'Your ads are currently unprofitable. Scale back or optimize targeting.'}`

    case 'customer-acquisition-cost':
      return `Your blended CAC is ${fmt(results.blended_cac)}. With a 12-month LTV of ${fmt(results.ltv_12mo)}, your LTV:CAC ratio is ${results.ltv_cac_ratio.toFixed(1)}x. ${results.ltv_cac_ratio >= 3 ? 'Healthy ratio — consider investing more in acquisition.' : results.ltv_cac_ratio >= 1 ? 'Borderline. Focus on increasing repeat purchase rate.' : 'Below 1:1 — you\'re losing money on each customer. Reduce CAC urgently.'}`

    default:
      return 'Review the numbers above to understand your business performance. Adjust inputs to model different scenarios.'
  }
}
