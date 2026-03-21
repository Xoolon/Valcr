import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Mail, CheckCircle } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

async function exchangeOAuthToken(accessToken: string, setUser: any, navigate: any, setError: any, redirect: string) {
  const res = await fetch(`${API}/auth/oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', access_token: accessToken }),
  })
  const data = await res.json()
  if (!res.ok) { setError(data.detail || 'Google sign-in failed'); return }
  setUser({
    id: data.user_id, email: data.email, firstName: data.first_name,
    lastName: data.last_name, accountTier: data.account_tier,
    emailVerified: true, isAdmin: data.is_admin === true,
  }, data.access_token)
  navigate(redirect)
}

export function SignupPage() {
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  // After signup — show verification notice instead of navigating
  const [signedUpEmail, setSignedUpEmail] = useState('')
  const [resendSent, setResendSent] = useState(false)
  const [resendToken, setResendToken] = useState('')

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      setGoogleLoading(true)
      await exchangeOAuthToken(res.access_token, setUser, navigate, setError, redirect)
      setGoogleLoading(false)
    },
    onError: () => { setError('Google sign-in failed.'); setGoogleLoading(false) },
  })

  const handleSubmit = async () => {
    if (!firstName || !email || !password) { setError('Please fill in all required fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')

      // Store user in state (they're logged in but unverified)
      setUser({
        id: data.user_id, email, firstName: data.first_name,
        lastName: data.last_name, accountTier: data.account_tier,
        emailVerified: false, isAdmin: data.is_admin === true,
      }, data.access_token)
      setResendToken(data.access_token)

      // Show verification notice — don't navigate to dashboard
      setSignedUpEmail(email)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    try {
      await fetch(`${API}/auth/resend-verification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendToken}` },
      })
      setResendSent(true)
    } catch {}
  }

  // ── Verification sent screen ──────────────────────────────────────────────
  if (signedUpEmail) {
    return (
      <>
        <SEOHead title="Verify Your Email | Valcr" description="" noIndex />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <Link to="/"><div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center mx-auto mb-6"><span className="font-display font-800 text-ink-950">V</span></div></Link>
            </div>
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-sky-400/10 border border-sky-400/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-sky-400" />
              </div>
              <h1 className="font-display font-800 text-ink-50 text-xl mb-2">Check your email</h1>
              <p className="text-ink-400 text-sm mb-1">
                We sent a verification link to
              </p>
              <p className="text-ink-100 font-600 text-sm mb-5">{signedUpEmail}</p>
              <p className="text-ink-500 text-xs mb-6 leading-relaxed">
                Click the link in the email to verify your account and unlock your dashboard.
                You can still browse calculators without verifying.
              </p>

              {resendSent ? (
                <div className="flex items-center justify-center gap-2 text-sm text-acid mb-4">
                  <CheckCircle className="w-4 h-4" />
                  Verification email resent
                </div>
              ) : (
                <button onClick={resendVerification} className="text-xs text-acid hover:text-acid/80 transition-colors mb-4 block mx-auto">
                  Resend verification email
                </button>
              )}

              <div className="flex gap-2">
                <Link to="/calculators" className="btn-secondary text-sm flex-1 justify-center">
                  Browse calculators
                </Link>
                <Link to="/dashboard" className="btn-ghost text-sm flex-1 justify-center">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  return (
    <>
      <SEOHead title="Sign Up | Valcr" description="Create your free Valcr account." noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/"><div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center mx-auto mb-6"><span className="font-display font-800 text-ink-950">V</span></div></Link>
            <h1 className="font-display font-800 text-3xl text-ink-50 mb-2">Create your account</h1>
            <p className="text-ink-400 text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Google */}
          <button
            onClick={() => { setGoogleLoading(true); googleLogin() }}
            disabled={googleLoading}
            className="btn-secondary w-full justify-center gap-3 mb-5"
          >
            {googleLoading ? <span className="w-4 h-4 border-2 border-ink-500 border-t-acid rounded-full animate-spin" /> : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ink-800" />
            <span className="text-xs text-ink-600">or email</span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>

          <div className="card p-7 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First name</label>
                <input className="input-field" placeholder="Alex" value={firstName}
                  onChange={e => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input-field" placeholder="Smith" value={lastName}
                  onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-11"
                  placeholder="8+ characters" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
            <p className="text-xs text-ink-600 text-center">
              By signing up you agree to our{' '}
              <Link to="/terms" className="text-acid hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-acid hover:underline">Privacy Policy</Link>
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