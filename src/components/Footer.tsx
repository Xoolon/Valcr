import { Link } from 'react-router-dom'
import { CALCULATORS } from '@/calculators'

export function Footer() {
  const ecommerceCalcs = CALCULATORS.filter((c) => c.category === 'ecommerce').slice(0, 8)

  return (
    <footer className="border-t border-ink-800 mt-24 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-acid rounded-lg flex items-center justify-center">
                <span className="font-display font-800 text-ink-950 text-sm">V</span>
              </div>
              <span className="font-display font-700 text-ink-50 text-lg">valcr</span>
            </Link>
            <p className="text-ink-400 text-sm leading-relaxed">
              Deeply specialized calculators for e-commerce operators. Know your numbers.
            </p>
            <div className="mt-4 flex items-center gap-1">
              <span className="section-tag text-xs">Free to use</span>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <p className="label mb-4">E-Commerce</p>
            <ul className="space-y-2">
              {ecommerceCalcs.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/calculators/${c.slug}`}
                    className="text-sm text-ink-400 hover:text-ink-100 transition-colors"
                  >
                    {c.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <p className="label mb-4">Product</p>
            <ul className="space-y-2">
              {[
                { href: '/calculators', label: 'All Calculators' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/embed', label: 'Embed Widget' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-ink-400 hover:text-ink-100 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="label mb-4">Company</p>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About' },
                { href: '/blog', label: 'Blog' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-ink-400 hover:text-ink-100 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ink-400 text-sm">
            © {new Date().getFullYear()} Valcr. All rights reserved.
          </p>
          <p className="text-ink-400 text-xs font-mono">
            valcr.site — Built for operators, by operators.
          </p>
        </div>
      </div>
    </footer>
  )
}
