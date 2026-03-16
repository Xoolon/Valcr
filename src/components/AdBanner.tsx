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
const AD_NETWORK: 'exoclick' | 'adsense' | 'placeholder' = 'placeholder'

// ── ExoClick Zone IDs ─────────────────────────────────────────────────────────
const EXOCLICK_DESKTOP_ZONE = 'YOUR_DESKTOP_ZONE_ID'   // 728×90
const EXOCLICK_MOBILE_ZONE  = 'YOUR_MOBILE_ZONE_ID'    // 320×50

// ── AdSense Config ────────────────────────────────────────────────────────────
const ADSENSE_CLIENT           = 'ca-pub-XXXXXXXXXXXXXXXXX'
const ADSENSE_SLOT_LEADERBOARD = 'XXXXXXXXXX'   // 728×90
const ADSENSE_SLOT_MOBILE      = 'XXXXXXXXXX'   // 320×50

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
function AdSenseSlot({ slot, width, height }: { slot: string; width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div ref={ref} style={{ width, height, overflow: 'hidden' }} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width, height }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="fixed"
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

      {/* Mobile: 320×50 */}
      <div className="flex sm:hidden">
        {AD_NETWORK === 'placeholder' && <PlaceholderSlot label="AD · 320×50" width={320} height={50} />}
        {AD_NETWORK === 'exoclick'    && <ExoClickSlot zoneId={EXOCLICK_MOBILE_ZONE} width={320} height={50} />}
        {AD_NETWORK === 'adsense'     && <AdSenseSlot slot={ADSENSE_SLOT_MOBILE} width={320} height={50} />}
      </div>

      {/* Desktop: 728×90 */}
      <div className="hidden sm:flex">
        {AD_NETWORK === 'placeholder' && <PlaceholderSlot label="AD · 728×90 · Leaderboard" width={728} height={90} />}
        {AD_NETWORK === 'exoclick'    && <ExoClickSlot zoneId={EXOCLICK_DESKTOP_ZONE} width={728} height={90} />}
        {AD_NETWORK === 'adsense'     && <AdSenseSlot slot={ADSENSE_SLOT_LEADERBOARD} width={728} height={90} />}
      </div>

    </div>
  )
}