import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { telemetryClient } from '@/api/telemetry'

const DISMISSED_KEY = 'valcr_consent_dismissed'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show if not yet dismissed and not opted out
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    const optedOut = document.cookie.includes('valcr_optout=1')
    if (!dismissed && !optedOut) {
      // Small delay so it doesn't flash on first render
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }

  const handleDecline = () => {
    telemetryClient.optOut()
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 card p-4 border-ink-700 shadow-2xl">
      <p className="text-xs text-ink-300 leading-relaxed mb-3">
        We use <strong className="text-ink-100">anonymous</strong> calculation data to build
        e-commerce benchmarks — no personal data is collected until you register.{' '}
        <Link to="/privacy" className="text-acid hover:underline">
          Learn more
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="flex-1 btn-primary text-xs py-2 justify-center"
        >
          Got it
        </button>
        <button
          onClick={handleDecline}
          className="flex-1 btn-secondary text-xs py-2 justify-center"
        >
          Opt out
        </button>
      </div>
    </div>
  )
}