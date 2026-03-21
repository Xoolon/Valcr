/**
 * Cloudflare Turnstile CAPTCHA widget.
 *
 * Setup:
 * 1. Go to dash.cloudflare.com → Turnstile → Add site
 * 2. Domain: valcr.site, Type: Managed (smart — invisible for real users)
 * 3. Add VITE_TURNSTILE_SITE_KEY to frontend .env
 *
 * Dev test key (always passes): 1x00000000000000000000AA
 * Dev test secret:              1x0000000000000000000000000000000AA
 */
import { useEffect, useRef } from 'react'

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onError?: () => void
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: object) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

export function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    const render = () => {
      if (!containerRef.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => onVerify(token),
        'error-callback': () => { onError?.(); },
        theme: 'dark',
        size: 'normal',
      })
    }

    if (window.turnstile) {
      render()
    } else {
      // Load the Turnstile script if not already loaded
      if (!document.querySelector('script[src*="turnstile"]')) {
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
      window.onTurnstileLoad = render
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current) } catch {}
      }
    }
  }, [])

  return <div ref={containerRef} className="mt-3" />
}