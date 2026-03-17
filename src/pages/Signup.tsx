import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Eye, EyeOff } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro — $9/mo', teams: 'Teams — $29/mo',
  'embed-starter': 'Starter Embed — $49/mo',
  'embed-business': 'Business Embed — $99/mo',
  'embed-agency': 'Agency Embed — $249/mo',
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export function SignupPage() {
  const [params] = useSearchParams()
  const plan = params.get('plan') || 'free'
  const isPaid = plan !== 'free'
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true); setError('')
      try {
        const res = await fetch(`${API}/auth/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'google', access_token: tokenResponse.access_token }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Google sign-in failed')
        setUser({
          id: data.user_id, email: data.email || '',
          firstName: data.first_name || '', lastName: '',
          accountTier: data.tier, emailVerified: true,isAdmin: data.is_admin === true,
        }, data.access_token)
        navigate(isPaid ? '/pricing' : '/dashboard')
      } catch (err: any) {
        setError(err.message)
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => { setError('Google sign-in failed. Please try again.'); setGoogleLoading(false) },
  })

  const handleSubmit = async () => {
    if (!form.email || !form.firstName || !form.password) { setError('Please fill in all required fields.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email, password: form.password,
          first_name: form.firstName, last_name: form.lastName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')

      setUser({
        id: data.user_id, email: form.email,
        firstName: data.first_name || form.firstName, lastName: form.lastName,
        accountTier: 'free', emailVerified: false,isAdmin: data.is_admin === true,
      }, data.access_token)

      if (isPaid) {
        const payRes = await fetch(`${API}/payments/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.access_token}` },
          body: JSON.stringify({ plan }),
        })
        const payData = await payRes.json()
        if (payRes.ok && payData.authorization_url) {
          window.location.href = payData.authorization_url
          return
        }
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Sign Up | Valcr" description="Create your free Valcr account." noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center">
                <span className="font-display font-800 text-ink-950 text-base">V</span>
              </div>
              <span className="font-display font-700 text-ink-50 text-lg">valcr</span>
            </Link>
            <h1 className="font-display font-800 text-3xl text-ink-50 mb-2">Create your account</h1>
            {isPaid ? (
              <div className="inline-flex items-center gap-1.5 bg-acid/10 border border-acid/20 rounded-full px-3 py-1 mt-1">
                <Check className="w-3 h-3 text-acid" />
                <span className="text-xs font-mono text-acid">{PLAN_LABELS[plan]}</span>
              </div>
            ) : (
              <p className="text-ink-400 text-sm">Free forever. No credit card required.</p>
            )}
          </div>

          {/* Google OAuth */}
          <div className="mb-5">
            <button
              onClick={() => { setError(''); googleLogin() }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-ink-900 border border-ink-700 hover:border-ink-500 text-ink-200 rounded-xl px-4 py-3 text-sm font-600 transition-all disabled:opacity-60"
            >
              {googleLoading
                ? <span className="w-4 h-4 border-2 border-ink-500 border-t-acid rounded-full animate-spin" />
                : <GoogleIcon />}
              {googleLoading ? 'Signing in…' : 'Sign up with Google'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ink-800" />
            <span className="text-xs text-ink-600 font-mono">or email</span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>

          <div className="card p-7 space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First name *</label>
                <input type="text" value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
                  placeholder="Jane" className="input-field" autoComplete="given-name" />
              </div>
              <div>
                <label className="label">Last name</label>
                <input type="text" value={form.lastName} onChange={(e) => set('lastName', e.target.value)}
                  placeholder="Smith" className="input-field" autoComplete="family-name" />
              </div>
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                placeholder="you@example.com" className="input-field" autoComplete="email" />
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Create a password" className="input-field pr-11"
                  autoComplete="new-password" onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-ink-600 mt-1.5">Minimum 8 characters</p>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Creating account…' : isPaid ? 'Create account & pay' : 'Create free account'}
            </button>
            <p className="text-center text-xs text-ink-600">
              By signing up you agree to our{' '}
              <Link to="/terms" className="text-ink-400 hover:text-acid">Terms</Link>{' '}and{' '}
              <Link to="/privacy" className="text-ink-400 hover:text-acid">Privacy Policy</Link>.
            </p>
          </div>
          <p className="text-center text-sm text-ink-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-acid hover:underline font-600">Log in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
