import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, DollarSign, TrendingUp, Activity,
  Shield, BarChart2, ArrowUpRight, ArrowDownRight,
  Lock, Search, RefreshCw, CheckCircle, XCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const PLAN_COLORS: Record<string, string> = {
  free: 'text-ink-400 bg-ink-800 border-ink-700',
  pro: 'text-acid bg-acid/10 border-acid/30',
  teams: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  'embed-starter': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  'embed-business': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'embed-agency': 'text-pink-400 bg-pink-400/10 border-pink-400/30',
}

const pct = (a: number, b: number) =>
  b === 0 ? 0 : ((a - b) / b) * 100

function KpiCard({ label, value, sub, delta, icon }: {
  label: string; value: string; sub: string; delta?: number; icon: React.ReactNode
}) {
  const positive = delta === undefined || delta >= 0
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
          <span className={`flex items-center gap-0.5 text-xs font-mono ${positive ? 'text-acid' : 'text-red-400'}`}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}

export function AdminPage() {
  const { user, isAuthenticated, token } = useAuthStore()
  const [tab, setTab] = useState<'overview' | 'users'>('overview')

  // Stats state
  const [stats, setStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  // Users state
  const [users, setUsers] = useState<any[]>([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersPage, setUsersPage] = useState(1)
  const [usersPages, setUsersPages] = useState(1)
  const [usersLoading, setUsersLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')

  const authHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  // ── Load stats ──
  const loadStats = useCallback(async () => {
    setStatsLoading(true); setStatsError('')
    try {
      const res = await fetch(`${API}/admin/stats`, { headers: authHeaders })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to load stats')
      setStats(await res.json())
    } catch (e: any) {
      setStatsError(e.message)
    } finally {
      setStatsLoading(false)
    }
  }, [token])

  // ── Load users ──
  const loadUsers = useCallback(async (page = 1) => {
    setUsersLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '20' })
      if (search) params.set('search', search)
      if (tierFilter) params.set('tier', tierFilter)
      const res = await fetch(`${API}/admin/users?${params}`, { headers: authHeaders })
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      setUsers(data.users)
      setUsersTotal(data.total)
      setUsersPage(data.page)
      setUsersPages(data.pages)
    } catch (e: any) {
      console.error(e.message)
    } finally {
      setUsersLoading(false)
    }
  }, [token, search, tierFilter])

  // ── Toggle user active ──
  const toggleActive = async (userId: string) => {
    await fetch(`${API}/admin/users/${userId}/toggle-active`, { method: 'PATCH', headers: authHeaders })
    loadUsers(usersPage)
  }

  // ── Set tier manually ──
  const setTier = async (userId: string, tier: string) => {
    await fetch(`${API}/admin/users/${userId}/set-tier?tier=${tier}`, { method: 'PATCH', headers: authHeaders })
    loadUsers(usersPage)
  }

  useEffect(() => { if (isAuthenticated && user?.isAdmin) loadStats() }, [loadStats, isAuthenticated])
  useEffect(() => { if (tab === 'users' && isAuthenticated && user?.isAdmin) loadUsers(1) }, [tab, loadUsers, isAuthenticated])

  // ── Access guards ──
  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="card p-12 text-center max-w-sm">
          <Lock className="w-8 h-8 text-ink-600 mx-auto mb-4" />
          <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Sign in required</h2>
          <Link to="/login" className="btn-primary mt-4 inline-flex">Log in</Link>
        </div>
      </div>
    )
  }

  // Check admin — uses is_admin from user object (set by backend JWT)
  const isAdmin = (user as any)?.isAdmin || import.meta.env.DEV
  if (!isAdmin) {
    return (
      <div className="pt-28 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="card p-12 text-center max-w-sm">
          <Shield className="w-8 h-8 text-ink-600 mx-auto mb-4" />
          <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Access denied</h2>
          <p className="text-ink-400 text-sm mb-4">This page is restricted to admins.</p>
          <Link to="/" className="btn-secondary">Go home</Link>
        </div>
      </div>
    )
  }

  const PLAN_PRICES: Record<string, number> = {
    pro: 9, teams: 29, 'embed-starter': 49, 'embed-business': 99, 'embed-agency': 249
  }

  return (
    <>
      <SEOHead title="Admin | Valcr" description="" noIndex />
      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-acid" />
                <span className="text-xs font-mono text-acid uppercase tracking-widest">Admin</span>
                {import.meta.env.DEV && (
                  <span className="text-xs font-mono bg-orange-400/10 border border-orange-400/30 text-orange-400 rounded-full px-2 py-0.5">
                    DEV MODE
                  </span>
                )}
              </div>
              <h1 className="font-display font-800 text-3xl text-ink-50">Dashboard</h1>
            </div>
            <button onClick={loadStats} className="btn-ghost flex items-center gap-2 text-sm">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-ink-900 border border-ink-800 rounded-xl p-1 w-fit">
            {(['overview', 'users'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-display font-600 transition-all capitalize ${
                  tab === t ? 'bg-acid text-ink-950' : 'text-ink-400 hover:text-ink-200'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {statsError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm">
                  {statsError} — make sure your account has <code>is_admin=true</code> in the database.
                </div>
              )}
              {statsLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card p-5 animate-pulse h-28 bg-ink-900" />
                  ))}
                </div>
              ) : stats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Users" value={stats.total_users.toLocaleString()}
                      sub={`+${stats.users_this_month} this month`}
                      delta={pct(stats.users_this_month, stats.users_last_month)}
                      icon={<Users className="w-4 h-4" />} />
                    <KpiCard label="MRR"
                      value={`$${stats.mrr.toLocaleString()}`}
                      sub={`${stats.active_subscriptions} active subs`}
                      icon={<DollarSign className="w-4 h-4" />} />
                    <KpiCard label="Paying Users"
                      value={stats.active_subscriptions.toLocaleString()}
                      sub={stats.past_due_subscriptions > 0 ? `${stats.past_due_subscriptions} past due` : 'all current'}
                      icon={<TrendingUp className="w-4 h-4" />} />
                    <KpiCard label="Email Verified"
                      value={`${Math.round((stats.email_verified_count / (stats.total_users || 1)) * 100)}%`}
                      sub={`${stats.oauth_users} via OAuth`}
                      icon={<Activity className="w-4 h-4" />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Plan breakdown */}
                    <div className="card p-6">
                      <h2 className="font-display font-700 text-ink-50 mb-5 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-acid" /> Plan Distribution
                      </h2>
                      <div className="space-y-3">
                        {[
                          { plan: 'Free', key: 'free', color: 'bg-ink-600' },
                          { plan: 'Pro', key: 'pro', color: 'bg-acid' },
                          { plan: 'Teams', key: 'teams', color: 'bg-sky-400' },
                          { plan: 'Embed Starter', key: 'embed-starter', color: 'bg-purple-400' },
                          { plan: 'Embed Business', key: 'embed-business', color: 'bg-orange-400' },
                          { plan: 'Embed Agency', key: 'embed-agency', color: 'bg-pink-400' },
                        ].map(({ plan, key, color }) => {
                          const count = stats.tier_counts?.[key] || 0
                          const pctVal = stats.total_users > 0 ? Math.round((count / stats.total_users) * 100) : 0
                          if (count === 0 && key !== 'free') return null
                          return (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-ink-300 font-500">{plan}</span>
                                <span className="text-ink-400 font-mono">{count} · {pctVal}%</span>
                              </div>
                              <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
                                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pctVal}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* MRR breakdown */}
                      <div className="mt-6 pt-5 border-t border-ink-800 space-y-2">
                        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">Revenue breakdown</p>
                        {Object.entries(PLAN_PRICES).map(([key, price]) => {
                          const count = stats.tier_counts?.[key] || 0
                          if (count === 0) return null
                          return (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-ink-400 capitalize">{key} × {count}</span>
                              <span className="text-ink-200 font-mono">${(count * price).toLocaleString()}</span>
                            </div>
                          )
                        })}
                        <div className="flex justify-between text-sm pt-2 border-t border-ink-800 font-700">
                          <span className="text-ink-200">Total MRR</span>
                          <span className="text-acid font-mono">${stats.mrr.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="card p-6 space-y-4">
                      <h2 className="font-display font-700 text-ink-50 mb-2">Account health</h2>
                      {[
                        { label: 'Email verified', value: stats.email_verified_count, total: stats.total_users, color: 'bg-acid' },
                        { label: 'OAuth signups', value: stats.oauth_users, total: stats.total_users, color: 'bg-sky-400' },
                        { label: 'Active subscriptions', value: stats.active_subscriptions, total: stats.total_users, color: 'bg-purple-400' },
                      ].map(({ label, value, total, color }) => {
                        const p = total > 0 ? Math.round((value / total) * 100) : 0
                        return (
                          <div key={label}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-ink-300">{label}</span>
                              <span className="text-ink-400 font-mono">{value} / {total}</span>
                            </div>
                            <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
                              <div className={`h-full ${color} rounded-full`} style={{ width: `${p}%` }} />
                            </div>
                          </div>
                        )
                      })}
                      {stats.past_due_subscriptions > 0 && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                          <p className="text-red-400 text-sm font-600">⚠ {stats.past_due_subscriptions} subscription(s) past due</p>
                          <p className="text-red-400/70 text-xs mt-0.5">Check Paystack dashboard for failed renewals</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-600" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by email or name…" className="input-field pl-9 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && loadUsers(1)} />
                </div>
                <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
                  className="input-field text-sm w-auto">
                  <option value="">All plans</option>
                  {['free','pro','teams','embed-starter','embed-business','embed-agency'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button onClick={() => loadUsers(1)} className="btn-secondary text-sm">Search</button>
              </div>

              <div className="card overflow-hidden">
                <div className="p-4 border-b border-ink-800 flex justify-between items-center">
                  <span className="text-sm text-ink-300 font-600">{usersTotal.toLocaleString()} users</span>
                  <button onClick={() => loadUsers(usersPage)} className="text-xs text-ink-500 hover:text-acid flex items-center gap-1 transition-colors">
                    <RefreshCw className="w-3 h-3" /> Reload
                  </button>
                </div>

                {usersLoading ? (
                  <div className="p-8 text-center text-ink-500 text-sm">Loading…</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-ink-800">
                          {['Name', 'Email', 'Plan', 'Verified', 'Provider', 'Status', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-mono text-ink-600 uppercase tracking-widest whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className={`border-b border-ink-800/50 hover:bg-ink-800/20 transition-colors ${!u.is_active ? 'opacity-50' : ''}`}>
                            <td className="px-4 py-3 font-500 text-ink-200 whitespace-nowrap">
                              {u.first_name} {u.last_name}
                            </td>
                            <td className="px-4 py-3 text-ink-400 font-mono text-xs">{u.email}</td>
                            <td className="px-4 py-3">
                              <select defaultValue={u.plan}
                                onChange={(e) => setTier(u.id, e.target.value)}
                                className={`text-xs font-mono border rounded-full px-2 py-0.5 bg-transparent cursor-pointer ${PLAN_COLORS[u.plan] ?? PLAN_COLORS.free}`}>
                                {['free','pro','teams','embed-starter','embed-business','embed-agency'].map(t => (
                                  <option key={t} value={t} className="bg-ink-900 text-ink-200">{t}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              {u.email_verified
                                ? <CheckCircle className="w-4 h-4 text-acid" />
                                : <XCircle className="w-4 h-4 text-ink-600" />}
                            </td>
                            <td className="px-4 py-3 text-ink-500 text-xs font-mono">{u.oauth_provider || '—'}</td>
                            <td className="px-4 py-3 text-ink-500 text-xs font-mono">{u.subscription_status}</td>
                            <td className="px-4 py-3 text-ink-500 font-mono text-xs whitespace-nowrap">
                              {u.created_at ? u.created_at.slice(0, 10) : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => toggleActive(u.id)}
                                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                                  u.is_active
                                    ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                    : 'border-acid/30 text-acid hover:bg-acid/10'
                                }`}>
                                {u.is_active ? 'Disable' : 'Enable'}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-500 text-sm">No users found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {usersPages > 1 && (
                  <div className="p-4 border-t border-ink-800 flex items-center justify-between">
                    <span className="text-xs text-ink-500 font-mono">Page {usersPage} of {usersPages}</span>
                    <div className="flex gap-2">
                      <button disabled={usersPage <= 1} onClick={() => loadUsers(usersPage - 1)}
                        className="btn-ghost p-1.5 disabled:opacity-30">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button disabled={usersPage >= usersPages} onClick={() => loadUsers(usersPage + 1)}
                        className="btn-ghost p-1.5 disabled:opacity-30">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
