import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Building2, Globe, Shield, Clock, Loader2 } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Plans that are eligible for a 7-day free trial (embed plans only)
const TRIAL_ELIGIBLE = new Set(['embed-starter', 'embed-business', 'embed-agency'])

const PLANS = [
  {
    name: 'Free', price: '$0', period: 'forever',
    tagline: 'Everything you need to get started.',
    icon: <Zap className="w-5 h-5" />, color: '#7070A0',
    plan: 'free',
    features: ['All 15+ calculators', 'Instant results', 'No account required', 'Mobile friendly'],
    cta: 'Browse Calculators', ctaHref: '/calculators', highlighted: false,
  },
  {
    name: 'Pro', price: '$9', period: '/month',
    tagline: 'For serious operators who need more.',
    icon: <Zap className="w-5 h-5" />, color: '#C8FF57',
    plan: 'pro',
    features: ['Everything in Free', 'Save unlimited calculations', 'PDF export', 'Shareable links', 'Scenario comparison', 'Priority support'],
    cta: 'Start Pro', ctaHref: '/signup?plan=pro', highlighted: true,
  },
  {
    name: 'Teams', price: '$29', period: '/month',
    tagline: 'For agencies and operations teams.',
    icon: <Building2 className="w-5 h-5" />, color: '#57C8FF',
    plan: 'teams',
    features: ['Everything in Pro', '5 team seats', 'Shared workspace', 'CSV bulk export', 'Priority support'],
    cta: 'Start Teams', ctaHref: '/signup?plan=teams', highlighted: false,
  },
]

const EMBED_PLANS = [
  { name: 'Starter Embed', price: '$49', period: '/month', plan: 'embed-starter',
    features: ['1 calculator', 'Branding removed', 'Custom accent color'] },
  { name: 'Business Embed', price: '$99', period: '/month', plan: 'embed-business',
    features: ['Up to 5 calculators', 'Full custom branding', 'Lead capture'] },
  { name: 'Agency Embed', price: '$249', period: '/month', plan: 'embed-agency',
    features: ['Unlimited calculators', 'Full white-label', 'Multi-client'] },
]

// Replace the existing PaystackLoadingOverlay component with this:
function PaystackLoadingOverlay({ plan, isTrial }: { plan: string; isTrial: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'rgba(10,10,15,0.93)', backdropFilter: 'blur(18px)' }}>
      <div className="w-16 h-16 bg-acid rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-acid/20">
        <span className="font-display font-800 text-ink-950 text-2xl">V</span>
      </div>
      <Loader2 className="w-6 h-6 text-acid animate-spin mb-5" />
      <p className="font-display font-700 text-ink-50 text-lg mb-1">Preparing secure checkout</p>
      <p className="text-ink-400 text-sm mb-5">Setting up your {plan} plan…</p>

      {isTrial && (
        <div className="max-w-xs text-center bg-sky-400/8 border border-sky-400/20 rounded-xl px-5 py-4">
          <p className="text-sky-400 text-xs font-600 uppercase tracking-widest mb-2">Free trial — how it works</p>
          <p className="text-ink-300 text-xs leading-relaxed">
            We'll charge <strong className="text-ink-100">$1.00</strong> to verify your card,
            then refund it immediately. Your free trial begins now.
            After 7 days, you'll be charged the plan amount automatically.
            Cancel any time before then — no charge.
          </p>
        </div>
      )}

      <p className="text-ink-600 text-xs mt-6 font-mono">Secured by Paystack · SSL encrypted</p>
    </div>
  )
}

export function PricingPage() {
  const { isAuthenticated, token, user } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.isAdmin === true
  const [error, setError] = useState<string | null>(null)           // ← Added
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)  // ← Added

  const handlePlanClick = async (plan: string, defaultHref: string) => {
    if (isAdmin) { navigate('/dashboard'); return }
    if (plan === 'free') { navigate('/calculators'); return }
    if (user?.accountTier === plan) { navigate('/dashboard'); return }
    if (!isAuthenticated) {
      navigate(`/signup?plan=${plan}`)
      return
    }

    setError(null)
    setCheckoutLoading(plan)

    try {
      const res = await fetch(`${API}/payments/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plan, with_trial: TRIAL_ELIGIBLE.has(plan) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Payment error')
      // Keep overlay showing while redirect happens
      window.location.href = data.authorization_url
    } catch (err: any) {
      setCheckoutLoading(null)
      setError(err.message || 'Could not start checkout. Please try again.')
    }
  }

  return (
    <>
      <SEOHead
        title="Pricing — Valcr Pro & Embed Plans"
        description="Free forever for basic use. Pro at $9/mo unlocks saved calculations, PDF export, and scenario comparison."
        canonicalPath="/pricing"
      />

      {/* Paystack loading overlay */}
      {checkoutLoading && (
  <PaystackLoadingOverlay
    plan={checkoutLoading}
    isTrial={TRIAL_ELIGIBLE.has(checkoutLoading)}
  />
)}

      <div className="pt-20 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          {isAdmin && (
            <div className="mb-10 card p-4 border-acid/30 bg-acid/5 flex items-center gap-3">
              <Shield className="w-5 h-5 text-acid shrink-0" />
              <p className="text-sm text-ink-200">
                Viewing as <span className="text-acid font-700">Admin</span> — all plans are unlocked.
              </p>
            </div>
          )}

          <div className="text-center mb-16">
            <span className="section-tag mb-4 inline-flex">Simple, honest pricing</span>
            <h1 className="font-display font-800 text-5xl text-ink-50 mb-4">
              Start free. Upgrade when it matters.
            </h1>
            <p className="text-ink-300 text-xl max-w-lg mx-auto">
              All calculators are free, forever. Pro unlocks the features serious operators need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {PLANS.map((plan) => {
              const isCurrentPlan = !isAdmin && user?.accountTier === plan.plan
              return (
                <div key={plan.name} className={`card p-7 relative overflow-hidden ${plan.highlighted ? 'border-acid/40 shadow-acid/20 shadow-lg' : ''}`}>
                  {plan.highlighted && <div className="absolute top-0 left-0 right-0 h-0.5 bg-acid" />}
                  {plan.highlighted && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-acid text-ink-950 text-xs font-display font-700 px-2 py-0.5 rounded-full">Most popular</span>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                    {plan.icon}
                  </div>
                  <h2 className="font-display font-700 text-ink-50 text-xl mb-1">{plan.name}</h2>
                  <p className="text-ink-400 text-sm mb-4">{plan.tagline}</p>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="font-display font-800 text-4xl" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-ink-400 text-sm mb-1.5">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-7">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.color }} />
                        <span className="text-ink-200">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {isAdmin ? (
                    <div className="w-full text-center py-3 rounded-lg bg-acid/10 border border-acid/30 text-acid text-sm font-700 flex items-center justify-center gap-2">
                      <Shield className="w-3.5 h-3.5" /> Unlocked — Admin
                    </div>
                  ) : isCurrentPlan ? (
                    <div className="w-full text-center py-3 rounded-lg bg-acid/10 border border-acid/30 text-acid text-sm font-700">
                      ✓ Current plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlanClick(plan.plan, plan.ctaHref)}
                      className={plan.highlighted ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="border-t border-ink-800 pt-16">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-sky-400" />
              <span className="section-tag">White-Label Embed</span>
            </div>
            <h2 className="font-display font-800 text-3xl text-ink-50 mb-2">Embed on your site</h2>
            <p className="text-ink-400 mb-3 max-w-xl">
              Add any Valcr calculator to your website with one line of code.
            </p>
            <div className="flex items-center gap-2 mb-10 text-sm text-sky-400">
              <Clock className="w-4 h-4 shrink-0" />
              <span>All embed plans include a <strong>7-day free trial</strong> — card required, auto-charged after trial. Cancel any time.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {EMBED_PLANS.map((plan) => {
                const isCurrentPlan = !isAdmin && user?.accountTier === plan.plan
                return (
                  <div key={plan.name} className="card p-6 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 text-xs font-mono text-sky-400 bg-sky-400/10 border border-sky-400/20 rounded-full px-2 py-0.5">
                        <Clock className="w-3 h-3" />7-day trial
                      </span>
                    </div>
                    <h3 className="font-display font-700 text-ink-50 mb-1 pr-24">{plan.name}</h3>
                    <div className="flex items-end gap-1 mb-4">
                      <span className="font-display font-800 text-3xl text-sky-400">{plan.price}</span>
                      <span className="text-ink-400 text-sm mb-1">{plan.period}</span>
                    </div>
                    <div className="bg-sky-400/5 border border-sky-400/15 rounded-lg px-3 py-2 mb-4">
                      <p className="text-xs text-sky-400 font-600">Free for 7 days</p>
                      <p className="text-xs text-ink-500 mt-0.5">Then {plan.price}/month — cancel before trial ends to pay nothing</p>
                    </div>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-400" />
                          <span className="text-ink-200">{f}</span>
                        </li>
                      ))}
                    </ul>
                    {isAdmin ? (
                      <div className="w-full text-center py-2.5 rounded-lg bg-acid/10 border border-acid/30 text-acid text-xs font-700 flex items-center justify-center gap-1.5">
                        <Shield className="w-3 h-3" /> Unlocked — Admin
                      </div>
                    ) : isCurrentPlan ? (
                      <div className="w-full text-center py-2.5 rounded-lg bg-sky-400/10 border border-sky-400/30 text-sky-400 text-sm font-700">
                        ✓ Current plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePlanClick(plan.plan, `/signup?plan=${plan.plan}`)}
                        className="btn-secondary w-full justify-center text-sm"
                      >
                        Start Free Trial
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-ink-600 text-center">
              Card details required to start trial. You will be charged after 7 days unless you cancel.
              Subscriptions renew automatically — cancel any time from your dashboard.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}