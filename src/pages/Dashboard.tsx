import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2, ExternalLink, Clock, Lock, Shield,
  Download, Share2, GitCompare, Plus, X, Edit2, Check
} from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore, useCalcStore, hasAccess } from '@/store'
import { getCalculator } from '@/calculators'
import { formatValue } from '@/components/ResultCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export function DashboardPage() {
  const { user, token, isAuthenticated } = useAuthStore()
  const { recentSlugs, fetchRecentCalculators } = useCalcStore()
  const isAdmin = user?.isAdmin === true
  const isPro = hasAccess(user, 'pro')

  const [savedCalcs, setSavedCalcs] = useState<any[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [comparison, setComparison] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [msg, setMsg] = useState('')

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentCalculators()
      if (isPro) fetchSaved()
    }
  }, [isAuthenticated, isPro])

  const fetchSaved = async () => {
    setLoadingSaved(true)
    try {
      const r = await fetch(`${API}/calculations/`, { headers: h })
      if (r.ok) setSavedCalcs(await r.json())
    } finally {
      setLoadingSaved(false)
    }
  }

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const deleteCalc = async (id: string) => {
    await fetch(`${API}/calculations/${id}`, { method: 'DELETE', headers: h })
    setSavedCalcs(p => p.filter(c => c.id !== id))
    setCompareIds(p => p.filter(i => i !== id))
  }

  const shareCalc = async (id: string) => {
    const r = await fetch(`${API}/calculations/${id}/share`, { method: 'POST', headers: h })
    if (r.ok) {
      const d = await r.json()
      navigator.clipboard.writeText(d.share_url)
      flash('Share link copied to clipboard!')
    }
  }

  const exportPDF = async (id: string, label: string) => {
    const r = await fetch(`${API}/calculations/${id}/export/pdf`, { headers: h })
    if (r.ok) {
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `valcr-${label.replace(/\s+/g, '-').toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const saveLabel = async (id: string) => {
    await fetch(`${API}/calculations/${id}`, {
      method: 'PATCH', headers: h,
      body: JSON.stringify({ label: editLabel }),
    })
    setSavedCalcs(p => p.map(c => c.id === id ? { ...c, label: editLabel } : c))
    setEditingId(null)
    flash('Label updated')
  }

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 5) { flash('Maximum 5 scenarios'); return prev }
      return [...prev, id]
    })
    setComparison(null)
  }

  const runComparison = async () => {
    if (compareIds.length < 2) { flash('Select at least 2 calculations'); return }
    const r = await fetch(`${API}/calculations/compare`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ calc_ids: compareIds }),
    })
    if (r.ok) setComparison(await r.json())
  }

  const recentCalcs = recentSlugs.map(getCalculator).filter(Boolean)

  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="card p-12 text-center max-w-sm">
          <Lock className="w-8 h-8 text-ink-600 mx-auto mb-4" />
          <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Sign in required</h2>
          <p className="text-ink-400 text-sm mb-6">Log in to access your dashboard.</p>
          <Link to="/login" className="btn-primary">Log in</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead title="Dashboard | Valcr" description="Your saved calculations." noIndex />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {msg && (
            <div className="mb-4 px-4 py-2.5 bg-acid/10 border border-acid/30 text-acid text-sm rounded-xl">
              {msg}
            </div>
          )}

          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-ink-600 text-sm font-mono mb-1">Signed in as</p>
              <h1 className="font-display font-800 text-3xl text-ink-50">
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
                <span className="text-sm font-display font-700 text-acid capitalize">{user?.accountTier}</span>
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
                <Link to="/admin" className="btn-primary text-xs py-1.5 px-3">Admin Dashboard</Link>
                <Link to="/profile" className="btn-secondary text-xs py-1.5 px-3">Profile & Embed Keys</Link>
                <Link to="/admin?tab=reports" className="btn-secondary text-xs py-1.5 px-3">Generate Reports</Link>
              </div>
            </div>
          )}

          {/* Recently used */}
          {recentCalcs.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-3.5 h-3.5 text-ink-600" />
                <h2 className="font-display font-700 text-ink-200 text-xs uppercase tracking-widest">
                  Recently used
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentCalcs.map((c) => c && (
                  <Link key={c.slug} to={`/calculators/${c.slug}`}
                    className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-700 hover:border-ink-600 rounded-xl px-3 py-2 text-xs font-500 text-ink-200 hover:text-ink-50 transition-all">
                    <span>{c.icon}</span>{c.shortName}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Saved Calculations */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-700 text-lg text-ink-50">
                Saved Calculations
                <span className="ml-2 text-xs font-mono text-ink-600">({savedCalcs.length})</span>
              </h2>
              {compareIds.length >= 2 && (
                <button onClick={runComparison} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5" />Compare {compareIds.length}
                </button>
              )}
            </div>

            {!isPro ? (
              <div className="card p-6 text-center border-dashed border-ink-700">
                <p className="text-ink-300 mb-1.5 font-display font-700">Pro feature</p>
                <p className="text-ink-400 text-sm mb-4">
                  Upgrade to Pro to save calculations, compare scenarios, and export PDFs.
                </p>
                <Link to="/pricing" className="btn-primary">Upgrade to Pro — $9/mo</Link>
              </div>
            ) : loadingSaved ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-ink-900 rounded-xl animate-pulse" />)}
              </div>
            ) : savedCalcs.length === 0 ? (
              <div className="card p-6 text-center border-dashed border-ink-700">
                <p className="text-ink-400 text-sm">
                  No saved calculations yet.{' '}
                  <Link to="/calculators" className="text-acid hover:underline">Try a calculator</Link>
                  {' '}and save your results using the Save button.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedCalcs.map((calc) => {
                  const meta = getCalculator(calc.calculator_slug)
                  const primaryOutput = meta?.outputs.find(o => o.highlight)
                  const primaryValue = primaryOutput ? calc.output_data[primaryOutput.key] : undefined
                  const isSelected = compareIds.includes(calc.id)

                  return (
                    <div key={calc.id}
                      className={`card p-4 flex items-center gap-3 transition-all ${isSelected ? 'border-acid/40 bg-acid/5' : ''}`}>
                      <div className="text-xl shrink-0">{meta?.icon || '📊'}</div>
                      <div className="flex-1 min-w-0">
                        {editingId === calc.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              className="input-field text-sm py-1 flex-1"
                              value={editLabel}
                              onChange={e => setEditLabel(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && saveLabel(calc.id)}
                              autoFocus
                            />
                            <button onClick={() => saveLabel(calc.id)} className="text-acid"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="text-ink-500"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="font-display font-700 text-ink-50 text-sm truncate">
                              {calc.label || meta?.shortName}
                            </p>
                            <button onClick={() => { setEditingId(calc.id); setEditLabel(calc.label || '') }}
                              className="text-ink-700 hover:text-ink-400 shrink-0">
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-ink-600 font-mono mt-0.5">
                          {new Date(calc.created_at).toLocaleDateString()}
                          {calc.is_public && <span className="ml-2 text-acid">• Shared</span>}
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
                        <button onClick={() => toggleCompare(calc.id)}
                          className={`p-1.5 transition-colors ${isSelected ? 'text-acid' : 'text-ink-600 hover:text-acid'}`}
                          title="Compare">
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => shareCalc(calc.id)}
                          className="p-1.5 text-ink-600 hover:text-sky-400 transition-colors" title="Share">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => exportPDF(calc.id, calc.label || calc.calculator_slug)}
                          className="p-1.5 text-ink-600 hover:text-ink-200 transition-colors" title="Export PDF">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <Link to={`/calculators/${calc.calculator_slug}`}
                          className="p-1.5 text-ink-600 hover:text-ink-200 transition-colors" title="Open calculator">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => deleteCalc(calc.id)}
                          className="p-1.5 text-ink-600 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Scenario comparison panel */}
          {comparison && (
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-700 text-lg text-ink-50 flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-acid" />Scenario Comparison
                </h2>
                <button onClick={() => { setComparison(null); setCompareIds([]) }}
                  className="text-ink-500 hover:text-ink-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-800">
                      <th className="text-left p-3 text-xs font-mono text-ink-600 uppercase">Metric</th>
                      {comparison.scenarios.map((s: any) => (
                        <th key={s.id} className="text-right p-3 text-xs font-mono text-ink-400 uppercase">
                          {s.label || s.calculator_slug}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.common_output_keys.map((key: string) => {
                      const values = comparison.scenarios.map((s: any) =>
                        parseFloat(s.output_data[key] || 0)
                      )
                      const max = Math.max(...values)
                      return (
                        <tr key={key} className="border-b border-ink-800/50">
                          <td className="p-3 text-ink-400 text-xs">{key.replace(/_/g, ' ')}</td>
                          {comparison.scenarios.map((s: any) => {
                            const v = parseFloat(s.output_data[key] || 0)
                            const isBest = v === max && max !== 0
                            return (
                              <td key={s.id}
                                className={`p-3 text-right font-mono text-sm tabular-nums ${isBest ? 'text-acid font-700' : 'text-ink-200'}`}>
                                {v.toLocaleString()}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  )
}