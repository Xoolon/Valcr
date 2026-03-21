/**
 * GDPR/CCPA compliant cookie consent banner.
 *
 * Legal requirement:
 * - EU/UK (GDPR): Must get consent before non-essential cookies
 * - California (CCPA): Must allow opt-out of sale/sharing of data
 * - The valcr_aid session cookie is "necessary" — no consent required
 * - Analytics and ad cookies ARE non-essential — require consent
 *
 * Our cookies:
 * - valcr_aid     : session tracking (necessary)
 * - valcr_optout  : user preference (necessary)
 * - Analytics      : pageview tracking (non-essential)
 * - Ad cookies     : ExoClick (non-essential)
 */
import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'
import { Link } from 'react-router-dom'

const CONSENT_KEY = 'valcr_cookie_consent'

type ConsentChoice = 'all' | 'necessary' | null

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      // Show after a short delay so it doesn't block first impression
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = (choice: ConsentChoice) => {
    localStorage.setItem(CONSENT_KEY, choice || 'necessary')
    if (choice === 'necessary') {
      // Set opt-out cookie for analytics
      document.cookie = 'valcr_optout=1; max-age=31536000; path=/; samesite=lax'
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-3 sm:p-4"
      role="dialog" aria-label="Cookie consent">
      <div className="max-w-4xl mx-auto card p-4 sm:p-5 border-ink-700 shadow-2xl">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-acid shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-600 text-ink-50 mb-1">We use cookies</p>
            <p className="text-xs text-ink-400 leading-relaxed">
              We use cookies to remember your session, track how calculators are used,
              and show relevant ads. Essential cookies keep the site working.{' '}
              <Link to="/privacy" className="text-acid hover:underline">Privacy Policy</Link>
            </p>

            {showDetails && (
              <div className="mt-3 space-y-2 text-xs text-ink-500">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-acid mt-1 shrink-0" />
                  <span><strong className="text-ink-300">Essential</strong> — valcr_aid session cookie, consent preference. Always active.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 mt-1 shrink-0" />
                  <span><strong className="text-ink-300">Analytics</strong> — anonymous page view counting. Helps us improve the product.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <span><strong className="text-ink-300">Advertising</strong> — Adsense ad network. Funds the free tier.</span>
                </div>
              </div>
            )}

            <button onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-ink-600 hover:text-ink-400 mt-2 transition-colors">
              {showDetails ? 'Hide details ↑' : 'Cookie details ↓'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button onClick={() => accept('all')}
            className="btn-primary text-xs py-2 px-4">
            Accept all
          </button>
          <button onClick={() => accept('necessary')}
            className="btn-secondary text-xs py-2 px-4">
            Essential only
          </button>
          <button onClick={() => accept('necessary')}
            className="text-xs text-ink-600 hover:text-ink-400 transition-colors ml-1">
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  )
}

/** Returns whether user has consented to analytics cookies */
export function hasAnalyticsConsent(): boolean {
  const stored = localStorage.getItem(CONSENT_KEY)
  return stored === 'all'
}