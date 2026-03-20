import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return }

    fetch(`${API}/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) { setStatus('success'); setMessage('Your email is verified. Welcome to Valcr!') }
        else { setStatus('error'); setMessage(data.detail || 'Verification failed.') }
      })
      .catch(() => { setStatus('error'); setMessage('Could not connect. Please try again.') })
  }, [])

  return (
    <>
      <SEOHead title="Verify Email | Valcr" description="Email verification" noIndex />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-sm w-full">
          {status === 'loading' && (
            <>
              <Loader className="w-10 h-10 text-acid mx-auto mb-4 animate-spin" />
              <p className="text-ink-300">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-10 h-10 text-acid mx-auto mb-4" />
              <h1 className="font-display font-800 text-xl text-ink-50 mb-2">Email verified!</h1>
              <p className="text-ink-400 text-sm mb-6">{message}</p>
              <Link to="/dashboard" className="btn-primary w-full justify-center">Go to Dashboard</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h1 className="font-display font-800 text-xl text-ink-50 mb-2">Verification failed</h1>
              <p className="text-ink-400 text-sm mb-6">{message}</p>
              <Link to="/login" className="btn-secondary w-full justify-center">Back to login</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}