import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

const calculatorSlugs = [
  'true-landed-cost',
  'shopify-profit-margin',
  'break-even-units',
  'roas-calculator',
  'customer-acquisition-cost',
  'inventory-reorder-point',
  'cash-flow-runway',
  'subscription-ltv',
  'amazon-fba-calculator',
  'pricing-strategy',
  'refund-rate-impact',
  'bundle-pricing-optimizer',
  'influencer-roi-calculator',
  'chargeback-impact',
  'shipping-cost-optimizer',
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://valcr.site',
      dynamicRoutes: [
        '/',
        '/calculators',
        '/pricing',
        '/embed',
        '/blog',
        '/about',
        '/privacy',
        '/terms',
        ...calculatorSlugs.map((slug) => `/calculators/${slug}`),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})