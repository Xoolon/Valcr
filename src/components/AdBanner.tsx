/**
 * AdBanner — responsive ad component supporting ExoClick and Google AdSense.
 *
 * ── TO SWITCH FROM EXOCLICK TO ADSENSE ──────────────────────────────────────
 * 1. Set AD_NETWORK = 'adsense' below
 * 2. Set ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXXX' (from AdSense dashboard)
 * 3. Set slot IDs for each zone (ADSENSE_SLOT_LEADERBOARD, ADSENSE_SLOT_MOBILE)
 * 4. Add this to index.html <head>:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX" crossorigin="anonymous"></script>
 *
 * ── EXOCLICK SETUP ───────────────────────────────────────────────────────────
 * 1. Sign up at exoclick.com → Publishers → Zones → Create Zone
 * 2. Create two Display Banner zones: 728×90 and 320×50
 * 3. Set EXOCLICK_DESKTOP_ZONE and EXOCLICK_MOBILE_ZONE below
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'

// ── NETWORK SWITCH — change to 'adsense' once approved ───────────────────────
const AD_NETWORK: 'exoclick' | 'adsense' | 'placeholder' = 'adsense'

// ── ExoClick Zone IDs ─────────────────────────────────────────────────────────
const EXOCLICK_DESKTOP_ZONE = 'YOUR_DESKTOP_ZONE_ID'   // 728×90
const EXOCLICK_MOBILE_ZONE  = 'YOUR_MOBILE_ZONE_ID'    // 320×50

// ── AdSense Config ────────────────────────────────────────────────────────────
const ADSENSE_CLIENT           = 'ca-pub-9505934511045266'
const ADSENSE_SLOT_LEADERBOARD = '8626295205'   // Desktop leaderboard (728×90 auto)
const ADSENSE_SLOT_MOBILE      = '8626295205'   // Mobile banner (same slot, AdSense handles responsive)

// ─────────────────────────────────────────────────────────────────────────────

interface AdBannerProps {
  className?: string
}

// ── ExoClick slot ─────────────────────────────────────────────────────────────
function ExoClickSlot({ zoneId, width, height }: { zoneId: string; width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const ins = document.createElement('ins')
    ins.className = 'eas6a97888e'
    ins.setAttribute('data-zoneid', zoneId)
    ref.current.appendChild(ins)
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = '//a.magsrv.com/ad-provider.js'
    ref.current.appendChild(script)
    return () => { if (ref.current) ref.current.innerHTML = '' }
  }, [zoneId])
  return (
    <div
      ref={ref}
      style={{ width, height, overflow: 'hidden' }}
      aria-label="Advertisement"
    />
  )
}

// ── AdSense slot ──────────────────────────────────────────────────────────────
function AdSenseSlot() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div ref={ref} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT_LEADERBOARD}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ── Placeholder (dev / no network set) ───────────────────────────────────────
function PlaceholderSlot({ label, width, height }: { label: string; width: number; height: number }) {
  return (
    <div
      style={{ width, height }}
      className="bg-ink-900/40 border border-dashed border-ink-800 rounded-lg flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="text-[10px] text-ink-700 font-mono tracking-wider">{label}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div className={`w-full flex justify-center items-center py-2 ${className}`}>
      {/* Single responsive AdSense unit — works on both desktop and mobile */}
      <div className="w-full max-w-7xl mx-auto">
        {AD_NETWORK === 'placeholder' && <PlaceholderSlot label="AD · 728×90 · Leaderboard" width={728} height={90} />}
        {AD_NETWORK === 'exoclick'    && <ExoClickSlot zoneId={EXOCLICK_MOBILE_ZONE} width={320} height={50} />}
        {AD_NETWORK === 'adsense'     && <AdSenseSlot />}
      </div>
    </div>
  )
}