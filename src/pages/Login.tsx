import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'
import { TurnstileWidget } from '@/components/TurnstileWidget'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

async function exchangeOAuthToken(accessToken: string, setUser: any, navigate: any, setError: any) {
  const res = await fetch(`${API}/auth/oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', access_token: accessToken }),
  })
  const data = await res.json()
  if (!res.ok) { setError(data.detail || 'Google login failed'); return }
  setUser(
    {
      id: data.user_id, email: data.email, firstName: data.first_name,
      lastName: data.last_name, accountTier: data.account_tier,
      emailVerified: true, isAdmin: data.is_admin === true,
    },
    data.access_token
  )
  navigate('/dashboard')
}

export function LoginPage() {
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [showUnverifiedBanner, setShowUnverifiedBanner] = useState(false)
  const [resendSent, setResendSent] = useState(false)
  const [currentToken, setCurrentToken] = useState('')

  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      setGoogleLoading(true)
      await exchangeOAuthToken(res.access_token, setUser, navigate, setError)
      setGoogleLoading(false)
    },
    onError: () => { setError('Google login failed. Try again.'); setGoogleLoading(false) },
  })

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in both fields.'); return }
    setLoading(true); setError('')

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstile_token: turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')

      const user = {
        id: data.user_id, email: data.email, firstName: data.first_name,
        lastName: data.last_name, accountTier: data.account_tier,
        emailVerified: data.email_verified, isAdmin: data.is_admin === true,
      }
      setUser(user, data.access_token)
      setCurrentToken(data.access_token)

      // If email not verified, show banner instead of navigating away
      if (!data.email_verified) {
        setShowUnverifiedBanner(true)
        setLoading(false)
        return
      }

      navigate('/dashboard')
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
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      setResendSent(true)
    } catch {}
  }

  return (
    <>
      <SEOHead title="Log In | Valcr" description="Log in to your Valcr account." noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/"><div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center mx-auto mb-6"><span className="font-display font-800 text-ink-950">V</span></div></Link>
            <h1 className="font-display font-800 text-3xl text-ink-50 mb-2">Welcome back</h1>
            <p className="text-ink-400 text-sm">Sign in to your account</p>
          </div>

          {/* Email unverified banner */}
          {showUnverifiedBanner && (
            <div className="mb-5 card p-4 border-amber-400/20 bg-amber-400/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-600 text-ink-100 mb-1">Verify your email to continue</p>
                  <p className="text-xs text-ink-400 mb-3">
                    We sent a verification link to <span className="text-ink-200">{email}</span>.
                    Click it to unlock your dashboard and all Pro features.
                  </p>
                  {resendSent ? (
                    <div className="flex items-center gap-1.5 text-xs text-acid">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verification email resent. Check your inbox.
                    </div>
                  ) : (
                    <button onClick={resendVerification} className="text-xs text-acid hover:text-acid/80 transition-colors underline">
                      Resend verification email
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="card p-7 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Google */}
            <button
              onClick={() => { setGoogleLoading(true); googleLogin() }}
              disabled={googleLoading}
              className="btn-secondary w-full justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'Connecting…' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-ink-800" />
              <span className="text-ink-600 text-xs">or</span>
              <div className="flex-1 h-px bg-ink-800" />
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-acid hover:text-acid/80 transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-11"
                  placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Turnstile */}
            <TurnstileWidget onVerify={setTurnstileToken} />

            <button onClick={handleLogin} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>

          <p className="text-center text-ink-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-acid hover:text-acid/80 transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </>
  )
}