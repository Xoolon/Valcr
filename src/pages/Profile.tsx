import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User, CreditCard, Key, Lock, Clock, AlertTriangle,
  Copy, Trash2, Plus, RefreshCw, Shield,
} from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active:         { label: 'Active',       color: 'text-acid bg-acid/10 border-acid/20' },
  'non-renewing': { label: 'Cancelling',   color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  cancelled:      { label: 'Cancelled',    color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  past_due:       { label: 'Payment due',  color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  none:           { label: 'Free',         color: 'text-ink-400 bg-ink-800 border-ink-700' },
}

export function ProfilePage() {
  const { user, token, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'account' | 'subscription' | 'embeds'>('account')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [marketing, setMarketing] = useState(true)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [newEmbedName, setNewEmbedName] = useState('')
  const [newEmbedSlugs, setNewEmbedSlugs] = useState('')
  const [newEmbedDomains, setNewEmbedDomains] = useState('')
  const [creatingEmbed, setCreatingEmbed] = useState(false)

  const h = { Authorization: `Bearer ${token}` }

  const fetchProfile = async () => {
    if (!token) return
    const r = await fetch(`${API}/profile/`, { headers: h })
    if (r.ok) {
      const d = await r.json()
      setProfile(d); setFirstName(d.first_name); setLastName(d.last_name)
      setMarketing(d.marketing_emails ?? true)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProfile() }, [token])

  const flash = (m: string, e = false) => {
    if (e) setErr(m); else setMsg(m)
    setTimeout(() => { setMsg(''); setErr('') }, 4000)
  }

  const saveProfile = async () => {
    const r = await fetch(`${API}/profile/`, {
      method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, marketing_emails: marketing }),
    })
    if (r.ok) flash('Profile updated'); else flash('Update failed', true)
  }

  const changePassword = async () => {
    if (newPwd.length < 8) { flash('Password must be 8+ characters', true); return }
    const r = await fetch(`${API}/profile/change-password`, {
      method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPwd, new_password: newPwd }),
    })
    if (r.ok) { flash('Password changed'); setCurrentPwd(''); setNewPwd('') }
    else { const d = await r.json(); flash(d.detail || 'Failed', true) }
  }

  const cancelSub = async () => {
    const r = await fetch(`${API}/payments/cancel`, { method: 'POST', headers: h })
    if (r.ok) { flash('Subscription cancelled'); fetchProfile(); setCancelConfirm(false) }
    else flash('Could not cancel. Contact support@valcr.site', true)
  }

  const createEmbedKey = async () => {
    if (!newEmbedName.trim()) { flash('Enter a name', true); return }
    setCreatingEmbed(true)
    const r = await fetch(`${API}/profile/embed-keys`, {
      method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newEmbedName,
        calculator_slugs: newEmbedSlugs.split(',').map(s => s.trim()).filter(Boolean),
        allowed_domains: newEmbedDomains.split(',').map(s => s.trim()).filter(Boolean),
      }),
    })
    setCreatingEmbed(false)
    if (r.ok) { flash('Embed key created'); setNewEmbedName(''); setNewEmbedSlugs(''); setNewEmbedDomains(''); fetchProfile() }
    else { const d = await r.json(); flash(d.detail || 'Failed', true) }
  }

  const deleteEmbedKey = async (key: string) => {
    await fetch(`${API}/profile/embed-keys/${key}`, { method: 'DELETE', headers: h })
    fetchProfile()
  }

  const copy = (text: string) => { navigator.clipboard.writeText(text); flash('Copied') }

  if (!isAuthenticated) {
    return (
      <div className="pt-16 pb-20 px-4 flex items-center justify-center min-h-screen">
        <div className="card p-8 text-center max-w-sm w-full">
          <Lock className="w-8 h-8 text-ink-600 mx-auto mb-4" />
          <p className="text-ink-400 text-sm mb-4">Sign in to view your profile.</p>
          <Link to="/login" className="btn-primary">Log in</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead title="Profile | Valcr" description="Manage your account" noIndex />
      <div className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display font-800 text-3xl text-ink-50">Account Settings</h1>
            <p className="text-ink-400 text-sm mt-1">{user?.email}</p>
          </div>

          {(msg || err) && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-500 ${err ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-acid/10 border border-acid/30 text-acid'}`}>
              {msg || err}
            </div>
          )}

          <div className="flex gap-1 mb-8 bg-ink-900 border border-ink-800 rounded-xl p-1 w-fit flex-wrap">
            {[
              { id: 'account', label: 'Account', icon: <User className="w-3.5 h-3.5" /> },
              { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-3.5 h-3.5" /> },
              { id: 'embeds', label: 'Embed Keys', icon: <Key className="w-3.5 h-3.5" /> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-600 transition-all ${tab === t.id ? 'bg-ink-800 text-ink-50' : 'text-ink-500 hover:text-ink-200'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20"><RefreshCw className="w-6 h-6 text-ink-600 animate-spin mx-auto" /></div>
          ) : (
            <>
              {tab === 'account' && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="font-display font-700 text-ink-50 mb-5">Personal Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div><label className="label">First name</label><input className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                      <div><label className="label">Last name</label><input className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
                    </div>
                    <div className="mb-5"><label className="label">Email</label><input className="input-field opacity-60" value={user?.email} disabled /></div>
                    <div className="flex items-center gap-3 mb-5">
                      <div onClick={() => setMarketing(!marketing)}
                        className={`w-10 h-6 rounded-full cursor-pointer transition-colors relative ${marketing ? 'bg-acid' : 'bg-ink-700'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${marketing ? 'translate-x-5' : 'translate-x-1'}`} />
                      </div>
                      <label className="text-sm text-ink-200">Receive product updates and promotional emails</label>
                    </div>
                    <button onClick={saveProfile} className="btn-primary">Save changes</button>
                  </div>

                  {!profile?.oauth_provider && (
                    <div className="card p-6">
                      <h2 className="font-display font-700 text-ink-50 mb-5">Change Password</h2>
                      <div className="space-y-4 mb-5">
                        <div><label className="label">Current password</label><input type="password" className="input-field" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} /></div>
                        <div><label className="label">New password</label><input type="password" className="input-field" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
                      </div>
                      <button onClick={changePassword} className="btn-secondary">Update password</button>
                    </div>
                  )}
                </div>
              )}

              {tab === 'subscription' && profile && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="font-display font-700 text-ink-50 mb-5">Current Plan</h2>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-display font-800 text-2xl text-ink-50 capitalize">{profile.account_tier}</p>
                        {profile.subscription.trial_active && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            <p className="text-xs text-sky-400">Trial ends {new Date(profile.subscription.trial_ends_at).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-600 px-2.5 py-1 rounded-full border ${(STATUS_BADGE[profile.subscription.status] || STATUS_BADGE.none).color}`}>
                        {(STATUS_BADGE[profile.subscription.status] || STATUS_BADGE.none).label}
                      </span>
                    </div>
                    {profile.subscription.card_last4 && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-ink-400">
                        <CreditCard className="w-4 h-4" />{profile.subscription.card_brand} ending {profile.subscription.card_last4}
                      </div>
                    )}
                    <div className="flex gap-3 flex-wrap">
                      <Link to="/pricing" className="btn-secondary text-sm">
                        {profile.account_tier === 'free' ? 'Upgrade plan' : 'Change plan'}
                      </Link>
                      {profile.subscription.status === 'active' && profile.subscription.subscription_code && (
                        <button onClick={() => setCancelConfirm(true)} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                          Cancel auto-renewal
                        </button>
                      )}
                    </div>
                    {cancelConfirm && (
                      <div className="mt-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-ink-200">Cancel auto-renewal? You keep access until the end of your billing period. No refund.</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={cancelSub} className="text-sm text-red-400 font-600 hover:text-red-300">Yes, cancel</button>
                          <button onClick={() => setCancelConfirm(false)} className="text-sm text-ink-400 hover:text-ink-200">Keep it</button>
                        </div>
                      </div>
                    )}
                  </div>
                  {profile.account_tier === 'free' && (
                    <div className="card p-6 border-acid/20 bg-acid/5">
                      <p className="font-display font-700 text-ink-50 mb-2">Upgrade to Pro</p>
                      <p className="text-ink-400 text-sm mb-4">Save calculations, compare scenarios, export PDFs. $9/month.</p>
                      <Link to="/pricing" className="btn-primary text-sm">View plans</Link>
                    </div>
                  )}
                </div>
              )}

              {tab === 'embeds' && profile && (
                <div className="space-y-4">
                  {profile.embed_keys.map((e: any) => (
                    <div key={e.id} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-display font-700 text-ink-50 text-sm">{e.name}</p>
                          <p className="text-xs text-ink-600 font-mono mt-0.5">{e.plan_tier}</p>
                        </div>
                        <button onClick={() => deleteEmbedKey(e.embed_key)} className="text-ink-600 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 bg-ink-950 border border-ink-800 rounded-lg px-3 py-2 mb-3">
                        <code className="text-xs text-acid font-mono flex-1 truncate">{e.embed_key}</code>
                        <button onClick={() => copy(e.embed_key)}><Copy className="w-3.5 h-3.5 text-ink-600 hover:text-ink-200" /></button>
                      </div>
                      <details className="text-xs">
                        <summary className="text-ink-500 cursor-pointer hover:text-ink-300 mb-2">Show embed code</summary>
                        <div className="bg-ink-950 border border-ink-800 rounded-lg p-3">
                          <code className="text-ink-300 font-mono text-xs whitespace-pre-wrap block">
                            {`<script src="https://valcr.site/widget.js"></script>\n<div data-valcr-embed="${e.embed_key}"${e.calculator_slugs[0] ? ` data-calc="${e.calculator_slugs[0]}"` : ''}></div>`}
                          </code>
                          <button onClick={() => copy(`<script src="https://valcr.site/widget.js"></script>\n<div data-valcr-embed="${e.embed_key}"${e.calculator_slugs[0] ? ` data-calc="${e.calculator_slugs[0]}"` : ''}></div>`)}
                            className="mt-2 text-xs text-acid flex items-center gap-1"><Copy className="w-3 h-3" />Copy snippet</button>
                        </div>
                      </details>
                    </div>
                  ))}

                  {(user?.isAdmin || ['embed-starter','embed-business','embed-agency'].includes(user?.accountTier || '')) ? (
                    <div className="card p-6">
                      <h2 className="font-display font-700 text-ink-50 mb-5 flex items-center gap-2">
                        <Plus className="w-4 h-4" />New Embed Key
                      </h2>
                      <div className="space-y-4">
                        <div><label className="label">Name</label><input className="input-field" placeholder="e.g. My Blog" value={newEmbedName} onChange={e => setNewEmbedName(e.target.value)} /></div>
                        <div><label className="label">Calculator slugs (comma-separated)</label><input className="input-field font-mono text-sm" placeholder="shopify-profit-margin, roas-calculator" value={newEmbedSlugs} onChange={e => setNewEmbedSlugs(e.target.value)} /></div>
                        <div><label className="label">Allowed domains (optional)</label><input className="input-field font-mono text-sm" placeholder="myblog.com, example.com" value={newEmbedDomains} onChange={e => setNewEmbedDomains(e.target.value)} /></div>
                        <button onClick={createEmbedKey} disabled={creatingEmbed} className="btn-primary">
                          {creatingEmbed ? 'Creating…' : 'Create embed key'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card p-6 border-dashed border-ink-700 text-center">
                      <Key className="w-8 h-8 text-ink-700 mx-auto mb-3" />
                      <p className="font-display font-700 text-ink-200 mb-2">Embed plan required</p>
                      <p className="text-ink-500 text-sm mb-4">All embed plans include a 7-day free trial.</p>
                      <Link to="/pricing" className="btn-primary text-sm">View embed plans</Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}