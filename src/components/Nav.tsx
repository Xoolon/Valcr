import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Calculator, Zap } from 'lucide-react'
import { useAuthStore } from '@/store'
import clsx from 'clsx'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const links = [
    { href: '/calculators', label: 'Calculators' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/embed', label: 'Embed' },
  ]

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-ink-950/90 backdrop-blur-xl border-b border-ink-800/80 shadow-[0_1px_0_0_rgba(112,112,160,0.08)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-acid rounded-lg flex items-center justify-center shadow-acid/40 shadow-sm group-hover:shadow-acid transition-shadow">
            <span className="font-display font-800 text-ink-950 text-sm leading-none">V</span>
          </div>
          <span className="font-display font-700 text-ink-50 text-lg tracking-tight">
            valcr
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={clsx(
                'px-4 py-2 rounded-lg font-body font-500 text-sm transition-all duration-150',
                location.pathname.startsWith(link.href)
                  ? 'text-acid bg-acid/10'
                  : 'text-ink-200 hover:text-ink-50 hover:bg-ink-800'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-ghost text-sm">
                {user?.firstName || 'Dashboard'}
              </Link>
              <button onClick={logout} className="btn-secondary text-sm py-2 px-4">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                <Zap className="w-3.5 h-3.5" />
                Get Pro
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-ink-200 hover:text-ink-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ink-900/95 backdrop-blur-xl border-b border-ink-800">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-ink-200 hover:text-ink-50 hover:bg-ink-800 font-500 transition-all"
              >
                <Calculator className="w-4 h-4 opacity-60" />
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-ink-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <button onClick={logout} className="btn-secondary text-sm">Log out</button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm text-center">Log in</Link>
                  <Link to="/signup" className="btn-primary text-sm justify-center">
                    <Zap className="w-3.5 h-3.5" /> Get Pro
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
