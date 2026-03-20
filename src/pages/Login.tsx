import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

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

async function exchangeOAuthToken(accessToken: string, setUser: any) {
  const res = await fetch(`${API}/auth/oauth`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', access_token: accessToken }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Google sign-in failed')
  setUser({
    id: data.user_id,
    email: data.email || '',
    firstName: data.first_name || '',
    lastName: '',
    accountTier: data.tier,
    emailVerified: true,
    isAdmin: data.is_admin === true,
  }, data.access_token)
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useAuthStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      setError('')
      try {
        await exchangeOAuthToken(tokenResponse.access_token, setUser)
        navigate(redirect)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setError('Google sign-in was cancelled or failed. Please try again.')
      setGoogleLoading(false)
    },
  })

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      setUser({
        id: data.user_id,
        email,
        firstName: data.first_name || '',
        lastName: '',
        accountTier: data.tier,
        emailVerified: data.email_verified,
        isAdmin: data.is_admin === true,
      }, data.access_token)
      navigate(redirect)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Log In | Valcr" description="Log in to your Valcr account." noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center">
                <span className="font-display font-800 text-ink-950 text-base">V</span>
              </div>
              <span className="font-display font-700 text-ink-50 text-lg">valcr</span>
            </Link>
            <h1 className="font-display font-800 text-3xl text-ink-50 mb-2">Welcome back</h1>
            <p className="text-ink-400 text-sm">Log in to access your saved calculations.</p>
          </div>

          <div className="mb-5">
            <button
              onClick={() => { setError(''); googleLogin() }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-ink-900 border border-ink-700 hover:border-ink-500 text-ink-200 rounded-xl px-4 py-3 text-sm font-600 transition-all disabled:opacity-60"
            >
              {googleLoading
                ? <span className="w-4 h-4 border-2 border-ink-500 border-t-acid rounded-full animate-spin" />
                : <GoogleIcon />}
              {googleLoading ? 'Signing in…' : 'Continue with Google'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ink-800" />
            <span className="text-xs text-ink-600 font-mono">or email</span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>

          <div className="card p-7 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field" autoComplete="email"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-ink-400 hover:text-acid transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
                  className="input-field pr-11" autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </div>

          <p className="text-center text-sm text-ink-400 mt-5">
            No account?{' '}
            <Link to="/signup" className="text-acid hover:underline font-600">Sign up free</Link>
          </p>
        </div>
      </div>
    </>
  )
}