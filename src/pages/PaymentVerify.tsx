import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { useAuthStore } from '@/store'

type State = 'verifying' | 'success' | 'error'

export function PaymentVerifyPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('trxref')
  const [state, setState] = useState<State>('verifying')
  const [plan, setPlan] = useState('')
  const [message, setMessage] = useState('')
  const { user, setUser, token } = useAuthStore()


  useEffect(() => {
    if (!reference) {
      setState('error')
      setMessage('No payment reference found. Please contact support if you were charged.')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/payments/verify?reference=${reference}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.detail || 'Verification failed')
        }

        // Update local user tier immediately so UI reflects new plan
        if (user && data.plan) {
          setUser({ ...user, accountTier: data.plan }, token!)
        }

        setPlan(data.plan)
        setState('success')
      } catch (err: any) {
        setState('error')
        setMessage(err.message || 'Payment verification failed')
      }
    }

    verify()
  }, [reference]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SEOHead title="Payment Verification | Valcr" description="" noIndex />

      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">

          {state === 'verifying' && (
            <div className="card p-12 text-center">
              <Loader className="w-10 h-10 text-acid mx-auto mb-5 animate-spin" />
              <h1 className="font-display font-800 text-2xl text-ink-50 mb-2">
                Confirming payment…
              </h1>
              <p className="text-ink-400 text-sm">This takes just a moment.</p>
            </div>
          )}

          {state === 'success' && (
            <div className="card p-12 text-center">
              <CheckCircle className="w-12 h-12 text-acid mx-auto mb-5" />
              <h1 className="font-display font-800 text-2xl text-ink-50 mb-2">
                You're on {plan.charAt(0).toUpperCase() + plan.slice(1)}!
              </h1>
              <p className="text-ink-300 text-sm mb-8 leading-relaxed">
                Your subscription is active. All {plan} features are now unlocked.
              </p>
              <div className="space-y-3">
                <Link to="/dashboard" className="btn-primary w-full justify-center">
                  Go to dashboard
                </Link>
                <Link to="/calculators" className="btn-secondary w-full justify-center">
                  Start calculating
                </Link>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="card p-12 text-center">
              <XCircle className="w-12 h-12 text-coral mx-auto mb-5" />
              <h1 className="font-display font-800 text-2xl text-ink-50 mb-2">
                Verification failed
              </h1>
              <p className="text-ink-400 text-sm mb-2 leading-relaxed">
                {message}
              </p>
              <p className="text-ink-500 text-xs mb-8">
                Reference: <code className="text-ink-400">{reference ?? 'none'}</code>
              </p>
              <div className="space-y-3">
                <Link to="/pricing" className="btn-primary w-full justify-center">
                  Try again
                </Link>
                <a href="mailto:support@valcr.site" className="btn-ghost w-full justify-center text-sm">
                  Contact support
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
