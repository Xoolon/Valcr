import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2, ExternalLink, Clock, Lock, Shield,
  Download, Share2, GitCompare, Plus, X, Edit2, Check,
  Code2, Copy, Globe, ChevronDown, ChevronUp
} from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore, useCalcStore, hasAccess } from '@/store'
import { getCalculator, CALCULATORS } from '@/calculators'
import { formatValue } from '@/components/ResultCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Calculator options for embed selection - all e-commerce calculators
const EMBED_CALCULATORS = CALCULATORS.filter(c => c.category === 'ecommerce')

function EmbedKeysSection({ token }: { token: string }) {
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [selectedCalc, setSelectedCalc] = useState<string>('shopify-profit-margin')
  const [embedTheme, setEmbedTheme] = useState<'dark' | 'light' | 'auto'>('dark')
  const [form, setForm] = useState({
    name: '',
    allowed_domains: [''],
    allowed_calculators: [] as string[],
    theme_color: '#C8FF57',
    show_branding: true,
    lead_capture_enabled: false,
  })

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetchKeys = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/embeds`, { headers: h })
      if (res.ok) {
        const data = await res.json()
        setKeys(data.keys || [])
      }
    } catch (err) {
      console.error('Failed to fetch embed keys', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const createKey = async () => {
    if (!form.name || !form.allowed_domains[0]) {
      alert('Please enter a name and at least one domain')
      return
    }
    setCreating(true)
    try {
      const res = await fetch(`${API}/embeds`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify({
          name: form.name,
          allowed_domains: form.allowed_domains.filter(d => d.trim()),
          allowed_calculators: form.allowed_calculators,
          theme_color: form.theme_color,
          show_branding: form.show_branding,
          lead_capture_enabled: form.lead_capture_enabled,
        })
      })
      if (res.ok) {
        setShowForm(false)
        setForm({
          name: '',
          allowed_domains: [''],
          allowed_calculators: [],
          theme_color: '#C8FF57',
          show_branding: true,
          lead_capture_enabled: false,
        })
        fetchKeys()
      } else {
        const err = await res.json()
        alert(err.detail || 'Failed to create embed key')
      }
    } catch (err) {
      alert('Failed to create embed key')
    } finally {
      setCreating(false)
    }
  }

  const deleteKey = async (keyId: string) => {
    if (!confirm('Delete this embed key? It will stop working immediately.')) return
    try {
      await fetch(`${API}/embeds/${keyId}`, { method: 'DELETE', headers: h })
      fetchKeys()
    } catch (err) {
      alert('Failed to delete key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getEmbedCodeWithOptions = (embedKey: string, calculatorSlug: string, theme: string, leadCapture: boolean, branding: boolean) => {
    return `<script src="https://cdn.valcr.site/widget.js"
  data-calc="${calculatorSlug}"
  data-theme="${theme}"
  data-lead-capture="${leadCapture}"
  data-brand="${!branding}"
  data-embed-key="${embedKey}">
</script>`
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-acid" />
          <h2 className="font-display font-700 text-lg text-ink-50">Embed Keys</h2>
          <span className="text-xs font-mono text-ink-600">({keys.length})</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />New Key
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-4 space-y-4">
          <h3 className="font-display font-700 text-ink-50 text-sm">Create new embed key</h3>
          <div>
            <label className="label">Key name</label>
            <input
              className="input-field text-sm"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="My Website"
            />
          </div>
          <div>
            <label className="label">Allowed domains</label>
            {form.allowed_domains.map((domain, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="input-field text-sm flex-1"
                  value={domain}
                  onChange={e => {
                    const newDomains = [...form.allowed_domains]
                    newDomains[i] = e.target.value
                    setForm({ ...form, allowed_domains: newDomains })
                  }}
                  placeholder="mystore.com"
                />
                {i === form.allowed_domains.length - 1 && (
                  <button
                    onClick={() => setForm({ ...form, allowed_domains: [...form.allowed_domains, ''] })}
                    className="btn-secondary text-sm px-3"
                  >
                    +
                  </button>
                )}
                {form.allowed_domains.length > 1 && (
                  <button
                    onClick={() => {
                      const newDomains = form.allowed_domains.filter((_, idx) => idx !== i)
                      setForm({ ...form, allowed_domains: newDomains })
                    }}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <p className="text-xs text-ink-600 mt-1">Add domains like: yoursite.com, www.yoursite.com</p>
          </div>
          <div>
            <label className="label">Allowed calculators (leave empty for all)</label>
            <select
              multiple
              className="input-field text-sm min-h-[100px]"
              value={form.allowed_calculators}
              onChange={e => {
                const values = Array.from(e.target.selectedOptions, option => option.value)
                setForm({ ...form, allowed_calculators: values })
              }}
            >
              {EMBED_CALCULATORS.map(calc => (
                <option key={calc.slug} value={calc.slug}>{calc.name}</option>
              ))}
            </select>
            <p className="text-xs text-ink-600 mt-1">Hold Ctrl/Cmd to select multiple calculators</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Theme color</label>
              <input
                type="color"
                className="input-field h-10"
                value={form.theme_color}
                onChange={e => setForm({ ...form, theme_color: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Branding</label>
              <select
                className="input-field text-sm"
                value={form.show_branding ? 'true' : 'false'}
                onChange={e => setForm({ ...form, show_branding: e.target.value === 'true' })}
              >
                <option value="true">Show Valcr branding</option>
                <option value="false">Hide branding (white-label)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, lead_capture_enabled: !form.lead_capture_enabled })}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.lead_capture_enabled ? 'bg-acid' : 'bg-ink-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.lead_capture_enabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm text-ink-200">Enable lead capture (collect visitor emails)</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={createKey} disabled={creating} className="btn-primary text-sm">
              {creating ? 'Creating...' : 'Generate Key'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-6 h-6 border-2 border-ink-700 border-t-acid rounded-full animate-spin mx-auto" />
        </div>
      ) : keys.length === 0 ? (
        <div className="card p-8 text-center border-dashed border-ink-700">
          <Code2 className="w-10 h-10 text-ink-600 mx-auto mb-3" />
          <p className="text-ink-400 text-sm mb-1">No embed keys yet</p>
          <p className="text-ink-500 text-xs">Create your first key to start embedding calculators on your site.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map(key => {
            const isExpanded = expandedKey === key.id
            return (
              <div key={key.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-display font-700 text-ink-100 text-sm">{key.name}</p>
                      <button
                        onClick={() => setExpandedKey(isExpanded ? null : key.id)}
                        className="text-ink-500 hover:text-ink-300"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs font-mono text-acid bg-acid/10 px-2 py-0.5 rounded">
                        {key.embed_key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.embed_key)}
                        className="text-ink-600 hover:text-acid transition-colors"
                      >
                        {copiedKey === key.embed_key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="text-ink-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>{key.allowed_domains?.join(', ') || 'No domains'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                  </div>
                  {key.total_loads > 0 && <span>📊 {key.total_loads} loads</span>}
                  {key.total_leads > 0 && <span>📧 {key.total_leads} leads</span>}
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    {/* Calculator selector */}
                    <div>
                      <label className="label text-xs">Select calculator to embed</label>
                      <select
                        className="input-field text-sm"
                        value={selectedCalc}
                        onChange={e => setSelectedCalc(e.target.value)}
                      >
                        {EMBED_CALCULATORS.map(calc => (
                          <option key={calc.slug} value={calc.slug}>{calc.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Theme selector */}
                    <div>
                      <label className="label text-xs">Theme</label>
                      <select
                        className="input-field text-sm"
                        value={embedTheme}
                        onChange={e => setEmbedTheme(e.target.value as any)}
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto (match system)</option>
                      </select>
                    </div>

                    {/* Embed code */}
                    <div className="bg-ink-800/50 rounded-lg p-3">
                      <p className="text-xs text-ink-600 mb-2">Embed code (copy and paste):</p>
                      <pre className="text-xs font-mono text-ink-300 overflow-x-auto whitespace-pre-wrap">
                        {getEmbedCodeWithOptions(
                          key.embed_key,
                          selectedCalc,
                          embedTheme,
                          key.lead_capture_enabled,
                          key.show_branding
                        )}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(getEmbedCodeWithOptions(
                          key.embed_key,
                          selectedCalc,
                          embedTheme,
                          key.lead_capture_enabled,
                          key.show_branding
                        ))}
                        className="mt-2 text-xs text-acid hover:underline"
                      >
                        {copiedKey === getEmbedCodeWithOptions(key.embed_key, selectedCalc, embedTheme, key.lead_capture_enabled, key.show_branding) ? '✓ Copied!' : 'Copy code'}
                      </button>
                    </div>

                    {/* Telemetry info */}
                    <div className="bg-ink-800/30 rounded-lg p-3">
                      <p className="text-xs font-mono text-acid uppercase tracking-widest mb-2">What we track</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-ink-400">
                        <div>✓ Calculator loads</div>
                        <div>✓ Calculations performed</div>
                        <div>✓ Field interactions</div>
                        <div>✓ Lead captures (if enabled)</div>
                        <div>✓ Domain verification</div>
                        <div>✓ Time on calculator</div>
                      </div>
                      <p className="text-xs text-ink-600 mt-2">
                        All telemetry data is collected. You can view usage stats in your dashboard.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function DashboardPage() {
  const { user, token, isAuthenticated } = useAuthStore()
  const { recentSlugs, fetchRecentCalculators } = useCalcStore()
  const isAdmin = user?.isAdmin === true
  const isPro = hasAccess(user, 'pro')
  const isEmbed = user?.accountTier?.startsWith('embed') || false

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

          {/* Embed Keys section - only shown to users with embed plans */}
          {isEmbed && token && (
            <EmbedKeysSection token={token} />
          )}

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