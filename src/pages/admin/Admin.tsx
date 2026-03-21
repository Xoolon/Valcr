import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, DollarSign, TrendingUp, Activity, Shield,
  BarChart2, ArrowUpRight, ArrowDownRight, Lock,
  Search, RefreshCw, CheckCircle, XCircle, ChevronLeft,
  ChevronRight, Eye, MessageSquare, Calculator, Globe,
  Clock, Trash2, AlertCircle, Mail, Megaphone,   // ← Added Megaphone
} from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// ─────────────────────────────────────────────────────────────────────────────
// ReportsTab (already in your code – keep as is)
// ─────────────────────────────────────────────────────────────────────────────

const CALCULATOR_OPTIONS = [
  { value: 'shopify-profit-margin', label: 'Shopify Profit Margin' },
  { value: 'true-landed-cost', label: 'True Landed Cost' },
  { value: 'roas-calculator', label: 'ROAS Calculator' },
  { value: 'customer-acquisition-cost', label: 'Customer Acquisition Cost' },
  { value: 'amazon-fba-calculator', label: 'Amazon FBA Calculator' },
  { value: 'break-even-units', label: 'Break-Even Units' },
  { value: 'cash-flow-runway', label: 'Cash Flow Runway' },
  { value: 'subscription-ltv', label: 'Subscription LTV' },
  { value: 'inventory-reorder-point', label: 'Inventory Reorder Point' },
  { value: 'pricing-strategy', label: 'Pricing Strategy' },
]

function ReportsTab({ token }: { token: string }) {
  const [selectedCalc, setSelectedCalc] = useState('shopify-profit-margin')
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [report, setReport] = useState<any>(null)
  const [loadingReport, setLoadingReport] = useState(false)

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const loadUsers = async () => {
    setLoadingUsers(true)
    const res = await fetch(`${API}/benchmarks/admin/calculator-users/${selectedCalc}?limit=20`, { headers: h })
    if (res.ok) { const d = await res.json(); setUsers(d.users || []) }
    setLoadingUsers(false)
  }

  const generateReport = async (user: any) => {
    setSelectedUser(user)
    setLoadingReport(true)
    setReport(null)
    const res = await fetch(`${API}/benchmarks/admin/generate-report`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ user_id: user.id, calculator_slug: selectedCalc }),
    })
    if (res.ok) { const d = await res.json(); setReport(d) }
    else { const d = await res.json(); alert(d.detail || 'Failed') }
    setLoadingReport(false)
  }

  const copyReportAsText = () => {
    if (!report) return
    const lines = [
      `Valcr Benchmark Report — ${report.user.first_name}`,
      `Calculator: ${report.calculator_slug}`,
      `Segment: ${report.segment_key}`,
      `Date: ${new Date(report.calculation_date).toLocaleDateString()}`,
      '',
      '── Your Results vs Industry ──',
      '',
      ...report.report_summary.map((s: any) =>
        `${s.label}: ${s.user_value?.toFixed(2)} (${s.percentile}th percentile)\n${s.insight}\n${s.action}\nIndustry median: ${s.p50?.toFixed(2)}`
      ),
      '',
      '── What This Means ──',
      report.report_summary.filter((s: any) => s.percentile <= 40).length > 0
        ? `You have ${report.report_summary.filter((s: any) => s.percentile <= 40).length} metrics below median. Valcr Pro can track these monthly.`
        : 'Your metrics are competitive. Valcr Pro helps you stay ahead.',
    ]
    navigator.clipboard.writeText(lines.join('\n'))
    alert('Report copied to clipboard — paste into email or PDF tool')
  }

  const PCT_COLOR = (p: number) => p >= 75 ? '#C8FF57' : p >= 40 ? '#57C8FF' : '#FF6B57'
  const PCT_LABEL = (p: number) => p >= 75 ? 'Top 25%' : p >= 50 ? 'Above median' : p >= 25 ? 'Below median' : 'Bottom 25%'

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="font-display font-700 text-ink-50 mb-2">Manual Benchmark Reports</h2>
        <p className="text-ink-400 text-sm mb-5">
          Find users who ran a calculator, generate their benchmark report, and use it for manual outreach.
          This is your tool for validating the Pro pricing before the UI is fully live.
        </p>

        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="label">Calculator</label>
            <select value={selectedCalc} onChange={e => setSelectedCalc(e.target.value)} className="input-field">
              {CALCULATOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={loadUsers} disabled={loadingUsers} className="btn-primary">
              {loadingUsers ? 'Loading…' : 'Find users'}
            </button>
          </div>
        </div>

        {users.length > 0 && (
          <div>
            <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">
              {users.length} users ran this calculator
            </p>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between card p-3">
                  <div>
                    <p className="text-sm font-600 text-ink-100">{u.email}</p>
                    <p className="text-xs text-ink-600 font-mono mt-0.5">
                      {u.run_count}x runs · Last: {u.last_used ? new Date(u.last_used).toLocaleDateString() : 'unknown'}
                      {u.segment_key && ` · ${u.segment_key}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-500 capitalize">{u.account_tier}</span>
                    <button onClick={() => generateReport(u)} className="btn-secondary text-xs py-1.5 px-3">
                      Generate report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loadingReport && (
        <div className="card p-8 text-center">
          <div className="w-6 h-6 border-2 border-ink-700 border-t-acid rounded-full animate-spin mx-auto mb-3" />
          <p className="text-ink-400 text-sm">Generating report for {selectedUser?.email}…</p>
        </div>
      )}

      {report && !loadingReport && (
        <div className="card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-800 text-xl text-ink-50">
                Report: {report.user.first_name || report.user.email}
              </h3>
              <p className="text-ink-400 text-xs mt-1 font-mono">
                {report.calculator_slug} · {report.segment_key} · {new Date(report.calculation_date).toLocaleDateString()}
              </p>
            </div>
            <button onClick={copyReportAsText} className="btn-primary text-xs">
              Copy as text
            </button>
          </div>

          {report.report_summary.length === 0 ? (
            <div className="card p-4 border-dashed border-ink-700">
              <p className="text-ink-400 text-sm text-center">
                No published benchmarks yet for this calculator/segment.
                Run <code className="text-acid font-mono">python run_benchmarks.py</code> after collecting 30+ events.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {report.report_summary.map((s: any) => (
                <div key={s.metric} className="border border-ink-800 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-display font-700 text-ink-50 text-sm">{s.label}</p>
                    <span className="text-xs font-600 px-2 py-0.5 rounded-full"
                      style={{ color: PCT_COLOR(s.percentile), background: `${PCT_COLOR(s.percentile)}18`, border: `1px solid ${PCT_COLOR(s.percentile)}30` }}>
                      {PCT_LABEL(s.percentile)} ({s.percentile}th pct)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                    <div className="bg-ink-900 rounded-lg p-2">
                      <p className="text-[10px] text-ink-600 font-mono mb-1">YOUR VALUE</p>
                      <p className="font-display font-700 text-ink-50 text-sm">{s.user_value?.toFixed(2)}</p>
                    </div>
                    <div className="bg-ink-900 rounded-lg p-2">
                      <p className="text-[10px] text-ink-600 font-mono mb-1">MEDIAN</p>
                      <p className="font-display font-700 text-ink-400 text-sm">{s.p50?.toFixed(2)}</p>
                    </div>
                    <div className="bg-ink-900 rounded-lg p-2">
                      <p className="text-[10px] text-ink-600 font-mono mb-1">TOP 25%</p>
                      <p className="font-display font-700 text-acid text-sm">{s.p75?.toFixed(2)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-ink-200 mb-1">{s.insight}</p>
                  <p className="text-xs text-ink-500">{s.action}</p>
                  <p className="text-[10px] text-ink-700 font-mono mt-2">Based on {s.sample_size} similar businesses</p>
                </div>
              ))}
            </div>
          )}

          {/* Outreach script */}
          <div className="mt-6 p-4 bg-acid/5 border border-acid/20 rounded-xl">
            <p className="text-xs font-mono text-acid uppercase tracking-widest mb-2">Outreach Script</p>
            <p className="text-sm text-ink-200 leading-relaxed">
              "Hi {report.user.first_name || 'there'}, I noticed you've been using our{' '}
              {report.calculator_slug.replace(/-/g, ' ')} calculator. I pulled your numbers and compared them
              to {report.report_summary[0]?.sample_size || 'similar'} businesses in your segment.
              {report.report_summary.filter((s: any) => s.percentile <= 40).length > 0
                ? ` Your ${report.report_summary.filter((s: any) => s.percentile <= 40).map((s: any) => s.label.toLowerCase()).join(' and ')} ${report.report_summary.filter((s: any) => s.percentile <= 40).length === 1 ? 'is' : 'are'} below median — I can show you what the top 25% are doing differently.`
                : ` You're performing well — in the top quartile for most metrics.`
              } Would a monthly benchmark report be useful to you? I'm testing Pro at $12/month."
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: PromotionsTab – send mass notifications and emails
// ─────────────────────────────────────────────────────────────────────────────

function PromotionsTab({ token }: { token: string }) {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
  const [form, setForm] = useState({
    title: '', body: '', cta_label: 'Try it now',
    cta_url: 'https://valcr.site/calculators',
    target: 'all', send_email: true, send_notification: true,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState('')

  const send = async () => {
    if (!form.title || !form.body) { setErr('Title and body are required'); return }
    setLoading(true); setErr(''); setResult(null)
    const r = await fetch(`${API}/admin/promotions/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (r.ok) setResult(await r.json())
    else { const d = await r.json(); setErr(d.detail || 'Failed') }
  }

  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target?.value ?? e }))

  return (
    <div className="max-w-xl space-y-5">
      <div className="card p-5">
        <h2 className="font-display font-700 text-ink-50 mb-5">Send Promotion</h2>
        {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
        {result && (
          <div className="mb-4 p-3 bg-acid/10 border border-acid/20 rounded-xl text-sm text-acid">
            ✓ Sent to {result.users_targeted} users —{' '}
            {result.notifications_sent} notifications, {result.emails_sent} emails
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input-field" value={form.title} onChange={f('title')}
              placeholder="🎉 New benchmark data is live!" />
          </div>
          <div>
            <label className="label">Body</label>
            <textarea className="input-field min-h-[80px] resize-none" value={form.body}
              onChange={f('body')}
              placeholder="We've added benchmark data for 3 new calculator segments. See how your margins compare." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">CTA label</label>
              <input className="input-field" value={form.cta_label} onChange={f('cta_label')} />
            </div>
            <div>
              <label className="label">CTA URL</label>
              <input className="input-field" value={form.cta_url} onChange={f('cta_url')} />
            </div>
          </div>
          <div>
            <label className="label">Target audience</label>
            <select className="input-field" value={form.target} onChange={f('target')}>
              <option value="all">All users</option>
              <option value="free">Free users only</option>
              <option value="pro">Pro/paid users only</option>
              <option value="email_only">Email only (no notification)</option>
            </select>
          </div>
          <div className="flex gap-6">
            {[['send_notification', 'In-app notification'], ['send_email', 'Email (marketing opt-ins)']].map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, [k]: !p[k as keyof typeof p] }))}
                  className={`w-9 h-5 rounded-full transition-colors relative ${form[k as keyof typeof form] ? 'bg-acid' : 'bg-ink-700'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form[k as keyof typeof form] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-ink-300">{label}</span>
              </label>
            ))}
          </div>
        </div>
        <button onClick={send} disabled={loading} className="btn-primary mt-5 w-full justify-center">
          {loading ? 'Sending…' : `Send to ${form.target === 'all' ? 'all users' : form.target + ' users'}`}
        </button>
      </div>

      {/* Ad poster preview */}
      <div className="card p-5">
        <h2 className="font-display font-700 text-ink-50 mb-3">Internal Ad Poster Preview</h2>
        <p className="text-ink-400 text-xs mb-4">This is how the promotion looks as an in-app ad banner.</p>
        <div className="bg-ink-900 border border-acid/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-acid rounded-lg flex items-center justify-center shrink-0">
            <span className="font-display font-800 text-ink-950 text-sm">V</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-700 text-ink-50 text-sm">{form.title || 'Promotion title'}</p>
            <p className="text-ink-400 text-xs mt-0.5 line-clamp-1">{form.body || 'Promotion body text'}</p>
          </div>
          <a href={form.cta_url} className="btn-primary text-xs py-1.5 px-3 shrink-0">{form.cta_label}</a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminPage (keep all existing tabs, add 'promotions' to TABS)
// ─────────────────────────────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  free: 'text-ink-400 bg-ink-800 border-ink-700',
  pro: 'text-acid bg-acid/10 border-acid/30',
  teams: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  'embed-starter': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  'embed-business': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'embed-agency': 'text-pink-400 bg-pink-400/10 border-pink-400/30',
}

const TICKET_STATUS_COLORS: Record<string, string> = {
  open: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  resolved: 'text-acid bg-acid/10 border-acid/30',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-ink-400',
  normal: 'text-ink-200',
  high: 'text-red-400',
}

const pct = (a: number, b: number) => (b === 0 ? 0 : ((a - b) / b) * 100)

function KpiCard({ label, value, sub, delta, icon }: {
  label: string; value: string; sub: string; delta?: number; icon: React.ReactNode
}) {
  const up = delta === undefined || delta >= 0
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest">{label}</p>
        <span className="text-ink-600">{icon}</span>
      </div>
      <p className="font-display font-800 text-2xl text-ink-50 mb-1">{value}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-xs text-ink-500">{sub}</p>
        {delta !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-mono ${up ? 'text-acid' : 'text-red-400'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}

type Tab = 'overview' | 'analytics' | 'users' | 'support' | 'promotions'  // ← Added 'promotions'

export function AdminPage() {
  const { token, user } = useAuthStore()
  const [tab, setTab] = useState<Tab>('overview')

  // ── Overview ─────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // ── Analytics ────────────────────────────────────────────────────────────
  const [visits, setVisits] = useState<any>(null)
  const [topCalcs, setTopCalcs] = useState<any[]>([])
  const [topPages, setTopPages] = useState<any[]>([])
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  // ── Users ─────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<any[]>([])
  const [userTotal, setUserTotal] = useState(0)
  const [userPage, setUserPage] = useState(1)
  const [userPages, setUserPages] = useState(1)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [changingTier, setChangingTier] = useState<string | null>(null)

  // ── Support ───────────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<any[]>([])
  const [ticketTotal, setTicketTotal] = useState(0)
  const [ticketPage, setTicketPage] = useState(1)
  const [ticketPages, setTicketPages] = useState(1)
  const [ticketStatus, setTicketStatus] = useState('')
  const [ticketSearch, setTicketSearch] = useState('')
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [adminReply, setAdminReply] = useState('')
  const [savingTicket, setSavingTicket] = useState(false)
  const [grantUser, setGrantUser] = useState<{ id: string; email: string } | null>(null)

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetchStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const r = await fetch(`${API}/admin/stats`, { headers: h })
      if (r.ok) setStats(await r.json())
    } finally { setLoadingStats(false) }
  }, [token])

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true)
    try {
      const [vr, cr, pr] = await Promise.all([
        fetch(`${API}/analytics/visits`, { headers: h }),
        fetch(`${API}/analytics/top-calculators`, { headers: h }),
        fetch(`${API}/analytics/top-pages`, { headers: h }),
      ])
      if (vr.ok) setVisits(await vr.json())
      if (cr.ok) setTopCalcs(await cr.json())
      if (pr.ok) setTopPages(await pr.json())
    } finally { setLoadingAnalytics(false) }
  }, [token])

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const p = new URLSearchParams({
        page: String(userPage), per_page: '20',
        ...(search && { search }),
        ...(tierFilter && { tier: tierFilter }),
      })
      const r = await fetch(`${API}/admin/users?${p}`, { headers: h })
      if (r.ok) {
        const d = await r.json()
        setUsers(d.users); setUserTotal(d.total); setUserPages(d.pages)
      }
    } finally { setLoadingUsers(false) }
  }, [token, userPage, search, tierFilter])

  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true)
    try {
      const p = new URLSearchParams({
        page: String(ticketPage), per_page: '20',
        ...(ticketStatus && { status: ticketStatus }),
        ...(ticketSearch && { search: ticketSearch }),
      })
      const r = await fetch(`${API}/analytics/support/tickets?${p}`, { headers: h })
      if (r.ok) {
        const d = await r.json()
        setTickets(d.tickets); setTicketTotal(d.total); setTicketPages(d.pages)
      }
    } finally { setLoadingTickets(false) }
  }, [token, ticketPage, ticketStatus, ticketSearch])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { if (tab === 'analytics') fetchAnalytics() }, [tab, fetchAnalytics])
  useEffect(() => { if (tab === 'users') fetchUsers() }, [tab, fetchUsers])
  useEffect(() => { if (tab === 'support') fetchTickets() }, [tab, fetchTickets])

  const openTicket = (t: any) => {
    setSelected(t)
    setAdminNotes(t.admin_notes || '')
    setAdminReply(t.admin_reply || '')
  }

  const saveTicket = async (status?: string) => {
    if (!selected) return
    setSavingTicket(true)
    try {
      await fetch(`${API}/analytics/support/tickets/${selected.id}`, {
        method: 'PATCH', headers: h,
        body: JSON.stringify({
          ...(status && { status }),
          admin_notes: adminNotes,
          admin_reply: adminReply,
        }),
      })
      fetchTickets()
      setSelected((prev: any) => ({ ...prev, status: status || prev.status, admin_notes: adminNotes, admin_reply: adminReply }))
    } finally { setSavingTicket(false) }
  }

  const deleteTicket = async (id: string) => {
    if (!confirm('Delete this ticket permanently?')) return
    await fetch(`${API}/analytics/support/tickets/${id}`, { method: 'DELETE', headers: h })
    setSelected(null)
    fetchTickets()
  }

  const toggleUserActive = async (id: string) => {
    await fetch(`${API}/admin/users/${id}/toggle-active`, { method: 'PATCH', headers: h })
    fetchUsers()
  }

  const setUserTier = async (id: string, tier: string) => {
    setChangingTier(id)
    await fetch(`${API}/admin/users/${id}/set-tier?tier=${tier}`, { method: 'PATCH', headers: h })
    fetchUsers()
    setChangingTier(null)
  }

  // ── Auth guard ────────────────────────────────────────────────────────────
  if (!user?.isAdmin) {
    return (
      <div className="pt-28 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="card p-12 text-center max-w-sm">
          <Lock className="w-8 h-8 text-ink-600 mx-auto mb-4" />
          <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Admin access required</h2>
          <p className="text-ink-400 text-sm mb-6">You do not have permission to view this page.</p>
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    )
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'Overview',  icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Traffic',   icon: <Eye className="w-4 h-4" /> },
    { id: 'users',     label: 'Users',     icon: <Users className="w-4 h-4" /> },
    { id: 'support',   label: 'Support',   icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'promotions', label: 'Promotions', icon: <Megaphone className="w-4 h-4" /> },  // ← New tab
  ]

  return (
    <>
      <SEOHead title="Admin | Valcr" description="Admin dashboard." noIndex />
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-acid" />
                <span className="text-xs font-mono text-acid uppercase tracking-widest">Admin</span>
              </div>
              <h1 className="font-display font-800 text-3xl text-ink-50">Valcr Dashboard</h1>
            </div>
            <button
              onClick={() => { fetchStats(); if (tab === 'analytics') fetchAnalytics(); if (tab === 'users') fetchUsers(); if (tab === 'support') fetchTickets() }}
              className="btn-ghost text-sm gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-8 border-b border-ink-800 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-display font-600 border-b-2 transition-all -mb-px whitespace-nowrap ${
                  tab === t.id
                    ? 'border-acid text-acid'
                    : 'border-transparent text-ink-500 hover:text-ink-200 hover:border-ink-600'
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'overview' && (
            // ... your existing overview content ...
            <div className="space-y-8">
              {/* Keep existing overview JSX – same as your current code */}
              {loadingStats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="card p-5 animate-pulse h-28 bg-ink-800/30" />
                  ))}
                </div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Users" value={stats.total_users.toLocaleString()}
                      sub={`+${stats.users_this_month} this month`}
                      delta={pct(stats.users_this_month, stats.users_last_month)}
                      icon={<Users className="w-4 h-4" />} />
                    <KpiCard label="MRR" value={`$${stats.mrr.toLocaleString()}`}
                      sub={`${stats.active_subscriptions} active subs`}
                      icon={<DollarSign className="w-4 h-4" />} />
                    <KpiCard label="Paying Users" value={stats.active_subscriptions.toLocaleString()}
                      sub={`${stats.past_due_subscriptions} past due`}
                      icon={<TrendingUp className="w-4 h-4" />} />
                    <KpiCard label="Free Users" value={(stats.free_users || 0).toLocaleString()}
                      sub={`${stats.total_users > 0 ? Math.round(((stats.free_users || 0) / stats.total_users) * 100) : 0}% of total`}
                      icon={<Activity className="w-4 h-4" />} />
                  </div>

                  <div className="card p-6">
                    <h2 className="font-display font-700 text-ink-50 mb-5">Users by Plan</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                      {['free','pro','teams','embed-starter','embed-business','embed-agency'].map((plan) => (
                        <div key={plan} className="text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-mono border mb-2 ${PLAN_COLORS[plan]}`}>
                            {plan}
                          </span>
                          <p className="font-display font-800 text-xl text-ink-50">
                            {(stats.tier_counts?.[plan] || 0).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="card p-5">
                      <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-2">Email Verified</p>
                      <p className="font-display font-800 text-2xl text-ink-50">
                        {stats.total_users > 0
                          ? Math.round((stats.email_verified_count / stats.total_users) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-ink-500 mt-1">{stats.email_verified_count} of {stats.total_users}</p>
                    </div>
                    <div className="card p-5">
                      <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-2">Google OAuth</p>
                      <p className="font-display font-800 text-2xl text-ink-50">{stats.oauth_users || 0}</p>
                      <p className="text-xs text-ink-500 mt-1">signed in with Google</p>
                    </div>
                    <div className="card p-5">
                      <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-2">Past Due</p>
                      <p className={`font-display font-800 text-2xl ${stats.past_due_subscriptions > 0 ? 'text-red-400' : 'text-acid'}`}>
                        {stats.past_due_subscriptions}
                      </p>
                      <p className="text-xs text-ink-500 mt-1">failed renewals</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="card p-8 text-center text-ink-400">Failed to load stats.</div>
              )}
            </div>
          )}

          {tab === 'analytics' && (
            // ... your existing analytics content ...
            <div className="space-y-8">
              {loadingAnalytics ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-28" />)}
                </div>
              ) : (
                <>
                  {visits && (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard label="Today" value={visits.today.views.toLocaleString()}
                          sub={`${visits.today.visitors} unique`}
                          icon={<Eye className="w-4 h-4" />} />
                        <KpiCard label="This Week" value={visits.this_week.views.toLocaleString()}
                          sub={`${visits.this_week.visitors} unique`}
                          icon={<Globe className="w-4 h-4" />} />
                        <KpiCard label="This Month" value={visits.this_month.views.toLocaleString()}
                          sub={`${visits.this_month.visitors} unique`}
                          delta={pct(visits.this_month.views, visits.last_month.views)}
                          icon={<TrendingUp className="w-4 h-4" />} />
                        <KpiCard label="Last Month" value={visits.last_month.views.toLocaleString()}
                          sub="page views"
                          icon={<Clock className="w-4 h-4" />} />
                      </div>

                      {visits.daily_breakdown?.length > 0 && (
                        <div className="card p-6">
                          <h2 className="font-display font-700 text-ink-50 mb-5">Daily Traffic — Last 30 Days</h2>
                          <div className="flex items-end gap-px h-32">
                            {(() => {
                              const max = Math.max(...visits.daily_breakdown.map((d: any) => d.views), 1)
                              return visits.daily_breakdown.map((d: any, i: number) => (
                                <div key={i} className="flex-1 group relative">
                                  <div
                                    className="w-full bg-acid/40 hover:bg-acid rounded-sm transition-colors cursor-default"
                                    style={{ height: `${Math.max((d.views / max) * 128, 3)}px` }}
                                  />
                                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-ink-800 border border-ink-700 rounded px-2 py-1 text-xs font-mono text-ink-100 whitespace-nowrap z-10 pointer-events-none">
                                    {d.date}<br />{d.views}v · {d.visitors}u
                                  </div>
                                </div>
                              ))
                            })()}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Calculator className="w-4 h-4 text-acid" />
                        <h2 className="font-display font-700 text-ink-50">Top Calculators (30d)</h2>
                      </div>
                      {topCalcs.length === 0 ? (
                        <p className="text-ink-500 text-sm">No data yet — traffic will appear after deploy.</p>
                      ) : topCalcs.map((c, i) => {
                        const max = topCalcs[0]?.views || 1
                        return (
                          <div key={c.slug} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-mono text-ink-300">{i + 1}. {c.slug}</span>
                              <span className="text-xs font-mono text-acid">{c.views.toLocaleString()}</span>
                            </div>
                            <div className="h-1 bg-ink-800 rounded-full">
                              <div className="h-1 bg-acid/60 rounded-full" style={{ width: `${(c.views / max) * 100}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="card p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Globe className="w-4 h-4 text-acid" />
                        <h2 className="font-display font-700 text-ink-50">Top Pages (30d)</h2>
                      </div>
                      {topPages.length === 0 ? (
                        <p className="text-ink-500 text-sm">No data yet.</p>
                      ) : topPages.slice(0, 10).map((p, i) => {
                        const max = topPages[0]?.views || 1
                        return (
                          <div key={p.path} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-mono text-ink-300 truncate pr-2">{i + 1}. {p.path}</span>
                              <span className="text-xs font-mono text-sky-400 shrink-0">{p.views.toLocaleString()}</span>
                            </div>
                            <div className="h-1 bg-ink-800 rounded-full">
                              <div className="h-1 bg-sky-400/50 rounded-full" style={{ width: `${(p.views / max) * 100}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'users' && (
            // ... your existing users content ...
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
                  <input type="text" placeholder="Search by email or name..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setUserPage(1) }}
                    className="input-field pl-9 text-sm" />
                </div>
                <select value={tierFilter}
                  onChange={(e) => { setTierFilter(e.target.value); setUserPage(1) }}
                  className="input-field text-sm sm:w-44">
                  <option value="">All plans</option>
                  {['free','pro','teams','embed-starter','embed-business','embed-agency'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-ink-600 font-mono">{userTotal.toLocaleString()} users</p>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-800">
                        {['User','Plan','Sub status','Joined','Last login','Actions'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-mono text-ink-600 uppercase tracking-widest">
                            {h}
                          </th>
                        ))}
                       </tr>
                    </thead>
                    <tbody>
                      {loadingUsers
                        ? [...Array(8)].map((_, i) => (
                            <tr key={i} className="border-b border-ink-800/50">
                              <td colSpan={6} className="px-4 py-3">
                                <div className="h-4 bg-ink-800 rounded animate-pulse w-2/3" />
                              </td>
                            </tr>
                          ))
                        : users.map((u) => (
                            <tr key={u.id} className="border-b border-ink-800/50 hover:bg-ink-800/20 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-display font-600 text-ink-100 text-sm">
                                  {u.first_name} {u.last_name}
                                </p>
                                <p className="text-xs text-ink-500 font-mono">{u.email}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {u.email_verified
                                    ? <CheckCircle className="w-3 h-3 text-acid" />
                                    : <XCircle className="w-3 h-3 text-red-400" />}
                                  <span className="text-xs text-ink-600">
                                    {u.email_verified ? 'verified' : 'unverified'}
                                  </span>
                                  {u.oauth_provider && (
                                    <span className="text-xs font-mono text-ink-600">· {u.oauth_provider}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={u.plan}
                                  onChange={(e) => setUserTier(u.id, e.target.value)}
                                  disabled={changingTier === u.id}
                                  className={`text-xs font-mono px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${PLAN_COLORS[u.plan]}`}
                                >
                                  {['free','pro','teams','embed-starter','embed-business','embed-agency'].map((p) => (
                                    <option key={p} value={p} className="bg-ink-900 text-ink-100">{p}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-mono ${
                                  u.subscription_status === 'active' ? 'text-acid' :
                                  u.subscription_status === 'past_due' ? 'text-red-400' :
                                  'text-ink-600'
                                }`}>
                                  {u.subscription_status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-ink-500 font-mono whitespace-nowrap">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-4 py-3 text-xs text-ink-500 font-mono whitespace-nowrap">
                                {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setGrantUser({ id: u.id, email: u.email })}
                                    className="text-xs px-2 py-1 rounded border border-acid/30 text-acid hover:bg-acid/10 transition-colors"
                                  >
                                    Grant access
                                  </button>
                                  <button
                                    onClick={() => toggleUserActive(u.id)}
                                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                                      u.is_active
                                        ? 'border-red-400/30 text-red-400 hover:bg-red-400/10'
                                        : 'border-acid/30 text-acid hover:bg-acid/10'
                                    }`}
                                  >
                                    {u.is_active ? 'Disable' : 'Enable'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {userPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-ink-600 font-mono">Page {userPage} of {userPages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage === 1} className="btn-ghost py-1.5 px-3 disabled:opacity-40">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setUserPage((p) => Math.min(userPages, p + 1))}
                      disabled={userPage === userPages} className="btn-ghost py-1.5 px-3 disabled:opacity-40">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'support' && (
            // ... your existing support content ...
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-600 pointer-events-none" />
                  <input type="text" placeholder="Search tickets..."
                    value={ticketSearch}
                    onChange={(e) => { setTicketSearch(e.target.value); setTicketPage(1) }}
                    className="input-field pl-9 text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['','open','in_progress','resolved'].map((s) => (
                    <button key={s}
                      onClick={() => { setTicketStatus(s); setTicketPage(1) }}
                      className={`text-xs font-mono px-3 py-2 rounded-full border transition-all ${
                        ticketStatus === s
                          ? 'bg-acid/10 border-acid/30 text-acid'
                          : 'bg-ink-900 border-ink-700 text-ink-400 hover:border-ink-500'
                      }`}>
                      {s === '' ? 'All' : s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-ink-600 font-mono self-center">{ticketTotal} tickets</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2 space-y-2">
                  {loadingTickets
                    ? [...Array(5)].map((_, i) => <div key={i} className="card p-4 animate-pulse h-24" />)
                    : tickets.length === 0
                      ? (
                        <div className="card p-8 text-center text-ink-500">
                          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-ink-700" />
                          <p className="text-sm">No tickets found.</p>
                        </div>
                      )
                      : tickets.map((t) => (
                          <button key={t.id}
                            onClick={() => openTicket(t)}
                            className={`card p-4 text-left w-full hover:border-ink-600 transition-all ${
                              selected?.id === t.id ? 'border-acid/40 bg-acid/5' : ''
                            }`}>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="font-display font-700 text-ink-100 text-sm leading-snug line-clamp-1">
                                {t.subject}
                              </p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {t.priority === 'high' && <AlertCircle className="w-3 h-3 text-red-400" />}
                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full border ${TICKET_STATUS_COLORS[t.status] || ''}`}>
                                  {t.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-ink-500">{t.name} · {t.email}</p>
                            <p className="text-xs text-ink-700 font-mono mt-1">
                              {new Date(t.created_at).toLocaleDateString()}
                            </p>
                          </button>
                        ))
                  }

                  {ticketPages > 1 && (
                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => setTicketPage((p) => Math.max(1, p - 1))}
                        disabled={ticketPage === 1} className="btn-ghost py-1.5 px-3 disabled:opacity-40">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setTicketPage((p) => Math.min(ticketPages, p + 1))}
                        disabled={ticketPage === ticketPages} className="btn-ghost py-1.5 px-3 disabled:opacity-40">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-3">
                  {selected ? (
                    <div className="card p-6 space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display font-700 text-ink-50 text-lg leading-snug mb-1">
                            {selected.subject}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-ink-500 font-mono">{selected.name}</span>
                            <a href={`mailto:${selected.email}`}
                              className="flex items-center gap-1 text-xs text-acid hover:underline font-mono">
                              <Mail className="w-3 h-3" />{selected.email}
                            </a>
                            <span className="text-xs text-ink-700 font-mono">
                              {new Date(selected.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => deleteTicket(selected.id)}
                          className="p-1.5 text-ink-600 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <div>
                          <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-1.5">Status</p>
                          <div className="flex gap-2">
                            {['open','in_progress','resolved'].map((s) => (
                              <button key={s}
                                onClick={() => saveTicket(s)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                  selected.status === s
                                    ? (TICKET_STATUS_COLORS[s] || '')
                                    : 'border-ink-700 text-ink-500 hover:border-ink-500'
                                }`}>
                                {s.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-1.5">Priority</p>
                          <div className="flex gap-2">
                            {['low','normal','high'].map((p) => (
                              <button key={p}
                                onClick={async () => {
                                  await fetch(`${API}/analytics/support/tickets/${selected.id}`, {
                                    method: 'PATCH', headers: h,
                                    body: JSON.stringify({ priority: p }),
                                  })
                                  setSelected((prev: any) => ({ ...prev, priority: p }))
                                  fetchTickets()
                                }}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                  selected.priority === p
                                    ? `${PRIORITY_COLORS[p]} border-current bg-current/10`
                                    : 'border-ink-700 text-ink-500 hover:border-ink-500'
                                }`}>
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-2">User message</p>
                        <div className="bg-ink-800/50 rounded-xl p-4">
                          <p className="text-sm text-ink-200 leading-relaxed whitespace-pre-wrap">
                            {selected.message}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-2">
                          Reply to user
                          <span className="text-ink-700 normal-case ml-2">(saved here — copy to email manually)</span>
                        </p>
                        <textarea
                          value={adminReply}
                          onChange={(e) => setAdminReply(e.target.value)}
                          rows={4}
                          placeholder={`Hi ${selected.name},\n\nThank you for reaching out...`}
                          className="input-field text-sm resize-none w-full"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-2">
                          Internal notes <span className="text-ink-700 normal-case">(not visible to user)</span>
                        </p>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={2}
                          placeholder="Internal notes about this ticket..."
                          className="input-field text-sm resize-none w-full"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => saveTicket()}
                          disabled={savingTicket}
                          className="btn-primary text-sm disabled:opacity-60"
                        >
                          {savingTicket ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => saveTicket('resolved')}
                          disabled={savingTicket}
                          className="btn-secondary text-sm disabled:opacity-60"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark resolved
                        </button>
                        <a
                          href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}&body=${encodeURIComponent(adminReply)}`}
                          className="btn-ghost text-sm ml-auto"
                        >
                          <Mail className="w-4 h-4" />
                          Open in email
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="card p-12 text-center text-ink-600 border-dashed h-full flex flex-col items-center justify-center">
                      <MessageSquare className="w-10 h-10 mb-4 text-ink-700" />
                      <p>Select a ticket to view and respond</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'promotions' && (
            <PromotionsTab token={token!} />
          )}

        </div>
      </div>
      {grantUser && (
        <GrantAccessModal
          user={grantUser}
          token={token!}
          onClose={() => setGrantUser(null)}
          onSuccess={() => { setGrantUser(null); fetchUsers() }}
        />
      )}
    </>
  )
}

// GrantAccessModal (keep as is – same as your current code)
function GrantAccessModal({
  user,
  token,
  onClose,
  onSuccess,
}: {
  user: { id: string; email: string }
  token: string
  onClose: () => void
  onSuccess: () => void
}) {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
  const [tier, setTier] = useState('pro')
  const [lifetime, setLifetime] = useState(true)
  const [reason, setReason] = useState('Early access — beta tester')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const grant = async () => {
    setLoading(true)
    setErr('')
    const r = await fetch(`${API}/admin/users/${user.id}/grant-access`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, lifetime, reason }),
    })
    setLoading(false)
    if (r.ok) { onSuccess(); onClose() }
    else { const d = await r.json(); setErr(d.detail || 'Failed') }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card p-6 w-full max-w-md">
        <h3 className="font-display font-700 text-ink-50 text-lg mb-1">Grant Access</h3>
        <p className="text-ink-400 text-sm mb-5">{user.email}</p>
        {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
        <div className="space-y-4">
          <div>
            <label className="label">Plan tier</label>
            <select value={tier} onChange={e => setTier(e.target.value)} className="input-field">
              <option value="pro">Pro ($9/mo)</option>
              <option value="teams">Teams ($29/mo)</option>
              <option value="embed-starter">Embed Starter ($49/mo)</option>
              <option value="embed-business">Embed Business ($99/mo)</option>
              <option value="embed-agency">Embed Agency ($249/mo)</option>
            </select>
          </div>
          <div>
            <label className="label">Reason</label>
            <input className="input-field" value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setLifetime(!lifetime)}
              className={`w-10 h-6 rounded-full transition-colors relative ${lifetime ? 'bg-acid' : 'bg-ink-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${lifetime ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-ink-200">Lifetime access (10 years)</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={grant} disabled={loading} className="btn-primary flex-1">
            {loading ? 'Granting…' : `Grant ${lifetime ? 'Lifetime' : 'Free'} ${tier}`}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}