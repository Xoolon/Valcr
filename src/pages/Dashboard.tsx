import { Link } from 'react-router-dom'
import { Trash2, ExternalLink, Clock, Lock, Shield } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore, useCalcStore } from '@/store'
import { getCalculator } from '@/calculators'
import { formatValue } from '@/components/ResultCard'
import { AdBanner } from '@/components/AdBanner'

export function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { savedCalculations, recentSlugs, deleteCalculation } = useCalcStore()

  const isAdmin = user?.isAdmin === true

  if (!isAuthenticated) {
    return (
      <div className="pt-16 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="card p-8 text-center max-w-sm w-full">
          <Lock className="w-8 h-8 text-ink-600 mx-auto mb-4" />
          <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Sign in required</h2>
          <p className="text-ink-400 text-sm mb-6">Log in to access your saved calculations.</p>
          <Link to="/login" className="btn-primary">Log in</Link>
        </div>
      </div>
    )
  }

  const recentCalcs = recentSlugs.map(getCalculator).filter(Boolean)

  // Admin sees their actual tier label OR "Admin" badge
  const planLabel = isAdmin ? 'Admin' : user?.accountTier

  return (
    <>
      <SEOHead title="Dashboard | Valcr" description="Your saved calculations." noIndex />

      <div className="pt-16 sm:pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-ink-600 text-xs font-mono mb-0.5">Signed in as</p>
              <h1 className="font-display font-800 text-2xl sm:text-3xl text-ink-50">
                {user?.firstName}'s Dashboard
              </h1>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-ink-600 mb-0.5">Plan</p>
              {isAdmin ? (
                <span className="flex items-center gap-1 text-sm font-display font-700 text-acid">
                  <Shield className="w-3.5 h-3.5" />Admin
                </span>
              ) : (
                <span className="text-sm font-display font-700 text-acid capitalize">{planLabel}</span>
              )}
            </div>
          </div>

          {/* Admin quick links */}
          {isAdmin && (
            <div className="mb-6 card p-4 border-acid/20 bg-acid/5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-acid" />
                <p className="text-xs font-mono text-acid uppercase tracking-widest">Admin Controls</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/admin" className="btn-primary text-xs py-1.5 px-3">
                  Admin Dashboard
                </Link>
                <Link to="/admin?tab=users" className="btn-secondary text-xs py-1.5 px-3">
                  Manage Users
                </Link>
                <Link to="/admin?tab=support" className="btn-secondary text-xs py-1.5 px-3">
                  Support Tickets
                </Link>
                <Link to="/admin?tab=analytics" className="btn-secondary text-xs py-1.5 px-3">
                  Traffic
                </Link>
              </div>
            </div>
          )}

          {/* Recently used */}
          {recentCalcs.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-3.5 h-3.5 text-ink-600" />
                <h2 className="font-display font-700 text-ink-200 text-xs uppercase tracking-widest">
                  Recently used
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentCalcs.map((c) => c && (
                  <Link
                    key={c.slug}
                    to={`/calculators/${c.slug}`}
                    className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-700 hover:border-ink-600 rounded-xl px-3 py-2 text-xs font-500 text-ink-200 hover:text-ink-50 transition-all"
                  >
                    <span>{c.icon}</span>
                    {c.shortName}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Saved calculations */}
          <section>
            <h2 className="font-display font-700 text-lg text-ink-50 mb-3">
              Saved Calculations
              <span className="ml-2 text-xs font-mono text-ink-600">
                ({savedCalculations.length})
              </span>
            </h2>

            {/* Admin bypasses paywall — always sees the saved section */}
            {!isAdmin && user?.accountTier === 'free' ? (
              <div className="card p-6 text-center border-dashed border-ink-700">
                <p className="text-ink-300 mb-1.5 font-display font-700">Pro feature</p>
                <p className="text-ink-400 text-sm mb-4">
                  Upgrade to Pro to save calculations, compare scenarios, and export PDFs.
                </p>
                <Link to="/pricing" className="btn-primary">Upgrade to Pro — $9/mo</Link>
              </div>
            ) : savedCalculations.length === 0 ? (
              <div className="card p-6 text-center border-dashed border-ink-700">
                <p className="text-ink-400 text-sm">
                  No saved calculations yet.{' '}
                  <Link to="/calculators" className="text-acid hover:underline">Try a calculator</Link>
                  {' '}and save your results.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedCalculations.map((calc) => {
                  const meta = getCalculator(calc.calculatorSlug)
                  if (!meta) return null
                  const primaryOutput = meta.outputs.find((o) => o.highlight)
                  const primaryValue = primaryOutput ? calc.outputData[primaryOutput.key] : undefined

                  return (
                    <div key={calc.id} className="card p-4 flex items-center gap-3">
                      <div className="text-xl shrink-0">{meta.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-700 text-ink-50 text-sm">
                          {calc.label || meta.shortName}
                        </p>
                        <p className="text-xs text-ink-600 font-mono mt-0.5">
                          {new Date(calc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {primaryValue !== undefined && primaryOutput && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-ink-600 mb-0.5">{primaryOutput.label}</p>
                          <p className="font-display font-700 text-acid tabular-nums text-sm">
                            {formatValue(primaryValue, primaryOutput.type)}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          to={`/calculators/${calc.calculatorSlug}`}
                          className="p-1.5 text-ink-600 hover:text-ink-200 transition-colors"
                          title="Open calculator"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => deleteCalculation(calc.id)}
                          className="p-1.5 text-ink-600 hover:text-coral transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <AdBanner className="mt-10 pt-6 border-t border-ink-800/40" />

        </div>
      </div>
    </>
  )
}