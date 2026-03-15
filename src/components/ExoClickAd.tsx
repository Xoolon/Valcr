/**
 * ExoClickAd — responsive banner ad component.
 *
 * HOW TO ACTIVATE:
 * 1. Go to exoclick.com → sign up as Publisher
 * 2. Add your site (valcr.site)
 * 3. Create two Ad Zones:
 *    - Zone A: Display Banner, size 728x90 (leaderboard) → copy the Zone ID
 *    - Zone B: Display Banner, size 320x50 (mobile banner) → copy the Zone ID
 * 4. Replace DESKTOP_ZONE_ID and MOBILE_ZONE_ID below with your real IDs
 * The placeholder boxes disappear automatically once real IDs are set.
 */

import { useEffect, useRef } from 'react'

// ── Replace these two values with your real ExoClick Zone IDs ────────────────
const DESKTOP_ZONE_ID = 'YOUR_DESKTOP_ZONE_ID'  // 728×90
const MOBILE_ZONE_ID  = 'YOUR_MOBILE_ZONE_ID'   // 320×50
// ─────────────────────────────────────────────────────────────────────────────

const IS_PLACEHOLDER = DESKTOP_ZONE_ID === 'YOUR_DESKTOP_ZONE_ID'

function AdSlot({ zoneId, width, height }: { zoneId: string; width: number; height: number }) {
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

    return () => {
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [zoneId])

  return (
    <div
      ref={ref}
      style={{ width, height, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      aria-label="Advertisement"
    />
  )
}

export function ExoClickAd({ className = '' }: { className?: string }) {
  if (IS_PLACEHOLDER) {
    return (
      <div className={`w-full flex justify-center ${className}`}>
        {/* Mobile placeholder */}
        <div className="flex sm:hidden w-[320px] h-[50px] bg-ink-900/50 border border-dashed border-ink-800 rounded-lg items-center justify-center">
          <span className="text-[10px] text-ink-700 font-mono tracking-wider">AD SPACE · 320×50</span>
        </div>
        {/* Desktop placeholder */}
        <div className="hidden sm:flex w-full max-w-[728px] h-[90px] bg-ink-900/50 border border-dashed border-ink-800 rounded-lg items-center justify-center">
          <span className="text-xs text-ink-700 font-mono tracking-wider">AD SPACE · 728×90</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="flex sm:hidden">
        <AdSlot zoneId={MOBILE_ZONE_ID} width={320} height={50} />
      </div>
      <div className="hidden sm:flex">
        <AdSlot zoneId={DESKTOP_ZONE_ID} width={728} height={90} />
      </div>
    </div>
  )
}