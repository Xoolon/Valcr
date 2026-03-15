import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!password || !confirm) { setError('Please fill in both fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError("Passwords don't match."); return }
    if (!token) { setError('Invalid reset link.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Reset failed')
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead title="Reset Password | Valcr" description="" noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/"><div className="w-10 h-10 bg-acid rounded-xl flex items-center justify-center mx-auto mb-6"><span className="font-display font-800 text-ink-950">V</span></div></Link>
            <h1 className="font-display font-800 text-3xl text-ink-50 mb-2">Set new password</h1>
          </div>

          {done ? (
            <div className="card p-8 text-center">
              <CheckCircle className="w-10 h-10 text-acid mx-auto mb-4" />
              <h2 className="font-display font-700 text-ink-50 text-xl mb-2">Password updated!</h2>
              <p className="text-ink-400 text-sm">Redirecting you to login…</p>
            </div>
          ) : (
            <div className="card p-7 space-y-5">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
              {['New password', 'Confirm password'].map((label, i) => (
                <div key={label}>
                  <label className="label">{label}</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'}
                      value={i === 0 ? password : confirm}
                      onChange={(e) => i === 0 ? setPassword(e.target.value) : setConfirm(e.target.value)}
                      placeholder="••••••••" className="input-field pr-11"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
                    {i === 0 && (
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
