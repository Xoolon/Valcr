import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true); setError('')
    try {
      await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      // Always show success — never reveal if email exists
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Forgot Password | Valcr" description="" noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center">
                <span className="font-display font-800 text-ink-950 text-base">V</span>
              </div>
            </Link>
            <h1 className="font-display font-800 text-3xl text-ink-50 mb-2">Reset your password</h1>
            <p className="text-ink-400 text-sm">Enter your email and we'll send a reset link.</p>
          </div>

          {sent ? (
            <div className="card p-8 text-center">
              <Mail className="w-10 h-10 text-acid mx-auto mb-4" />
              <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Check your email</h2>
              <p className="text-ink-400 text-sm mb-6">
                If <strong className="text-ink-200">{email}</strong> is registered, you'll receive a reset link within a few minutes.
              </p>
              <p className="text-ink-500 text-xs">Didn't get it? Check your spam folder, or{' '}
                <button onClick={() => setSent(false)} className="text-acid hover:underline">try again</button>.
              </p>
            </div>
          ) : (
            <div className="card p-7 space-y-5">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
              <div>
                <label className="label">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} autoFocus />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </div>
          )}

          <p className="text-center text-sm text-ink-400 mt-5">
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-ink-400 hover:text-acid transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
