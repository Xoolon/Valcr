import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Calculator, Zap, Shield, User } from 'lucide-react'
import { useAuthStore, hasAccess } from '@/store'
import { NotificationBell } from '@/components/NotificationBell'
import clsx from 'clsx'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => { setOpen(false) }, [location])

  const isAdmin = user?.isAdmin === true
  const showGetPro = !isAuthenticated || (!isAdmin && !hasAccess(user, 'pro'))

  const links = [
    { href: '/calculators', label: 'Calculators' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/embed', label: 'Embed' },
    { href: '/reports', label: 'Benchmarks' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-ink-950/90 backdrop-blur-xl border-b border-ink-800/80' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-acid rounded-lg flex items-center justify-center">
            <span className="font-display font-800 text-ink-950 text-sm leading-none">V</span>
          </div>
          <span className="font-display font-700 text-ink-50 text-lg tracking-tight">valcr</span>
          {isAdmin && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-acid bg-acid/10 border border-acid/20 rounded-full px-2 py-0.5 ml-1">
              <Shield className="w-3 h-3" />admin
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.href} to={link.href} className={clsx(
              'px-4 py-2 rounded-lg font-body font-500 text-sm transition-all duration-150',
              link.href === '/admin'
                ? location.pathname === '/admin' ? 'text-acid bg-acid/10' : 'text-acid/70 hover:text-acid hover:bg-acid/10'
                : location.pathname.startsWith(link.href) ? 'text-acid bg-acid/10' : 'text-ink-200 hover:text-ink-50 hover:bg-ink-800'
            )}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link to="/profile" className="p-2 text-ink-400 hover:text-ink-100 transition-colors" title="Profile">
                <User className="w-5 h-5" />
              </Link>
              <Link to="/dashboard" className="btn-ghost text-sm">{user?.firstName || 'Dashboard'}</Link>
              {showGetPro && (
                <Link to="/pricing" className="btn-primary text-sm py-2 px-4">
                  <Zap className="w-3.5 h-3.5" />Get Pro
                </Link>
              )}
              <button onClick={logout} className="btn-secondary text-sm py-2 px-4">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                <Zap className="w-3.5 h-3.5" />Get Pro
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-ink-200 hover:text-ink-50" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-ink-900/95 backdrop-blur-xl border-b border-ink-800">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} to={link.href}
                className={clsx('flex items-center gap-2 px-4 py-3 rounded-xl font-500 transition-all',
                  link.href === '/admin' ? 'text-acid hover:bg-acid/10' : 'text-ink-200 hover:text-ink-50 hover:bg-ink-800')}>
                {link.href === '/admin' ? <Shield className="w-4 h-4" /> : <Calculator className="w-4 h-4 opacity-60" />}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to="/profile" className="flex items-center gap-2 px-4 py-3 rounded-xl text-ink-200 hover:text-ink-50 hover:bg-ink-800 font-500 transition-all">
                <User className="w-4 h-4 opacity-60" />Profile
              </Link>
            )}
            <div className="mt-3 pt-3 border-t border-ink-800 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {showGetPro && (
                    <Link to="/pricing" className="btn-primary text-sm justify-center">
                      <Zap className="w-3.5 h-3.5" />Get Pro
                    </Link>
                  )}
                  <button onClick={logout} className="btn-secondary text-sm">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm text-center">Log in</Link>
                  <Link to="/signup" className="btn-primary text-sm justify-center">
                    <Zap className="w-3.5 h-3.5" />Get Pro
                  </Link>
                  <Link to="/reports" className="text-ink-400 hover:text-ink-200 text-sm text-center py-2 transition-colors">
                    Benchmarks
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