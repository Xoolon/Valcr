// src/components/BenchmarkBadge.tsx
// Drop-in replacement / enhancement for any existing BenchmarkBadge in valcr-frontend.
// Shows organic or anchor benchmark data with transparent source attribution.
// Used on all 20 calculator pages — Pro users only.

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Info, ExternalLink, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface BenchmarkResult {
  available: boolean
  user_percentile?: number
  user_vs_median?: string
  sample_count?: number
  p25?: number; p50?: number; p75?: number
  user_value?: number
  is_anchor?: boolean
  source_name?: string
  source_url?: string
  anchor_note?: string
  segment_key?: string
}

interface BenchmarkBadgeProps {
  calculatorSlug: string
  outputs: Record<string, number>
  inputs: Record<string, number | string>
  /** Which output key to show in the primary badge (first highlighted output) */
  primaryMetricKey?: string
  /** Accent colour matching the calculator */
  accentColor?: string
}

function PercentileBar({ value }: { value: number }) {
  const position = Math.max(2, Math.min(98, value))
  const color = value >= 75 ? '#C8FF57' : value >= 50 ? '#57C8FF' : value >= 25 ? '#FFB457' : '#FF6B57'
  return (
    <div className="mt-3 mb-1">
      <div className="relative h-2 bg-ink-800 rounded-full overflow-visible">
        <div className="h-2 rounded-full opacity-20" style={{ width: `${position}%`, backgroundColor: color }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-ink-950 shadow"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)', backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-ink-700 mt-1">
        <span>Bottom 25%</span><span>Median</span><span>Top 25%</span>
      </div>
    </div>
  )
}

function QuartileLabel({ pct }: { pct: number }) {
  if (pct >= 75) return <span className="text-acid text-xs font-mono">Top 25% ↑</span>
  if (pct >= 50) return <span className="text-sky-400 text-xs font-mono">Above median</span>
  if (pct >= 25) return <span className="text-amber-400 text-xs font-mono">Below median</span>
  return <span className="text-red-400 text-xs font-mono">Bottom 25% ↓</span>
}

function TrendIcon({ vsMedian }: { vsMedian: string }) {
  if (vsMedian === 'above median') return <TrendingUp className="w-4 h-4 text-acid" />
  if (vsMedian === 'below median') return <TrendingDown className="w-4 h-4 text-red-400" />
  return <Minus className="w-4 h-4 text-sky-400" />
}

export function BenchmarkBadge({
  calculatorSlug,
  outputs,
  inputs,
  primaryMetricKey,
  accentColor = '#C8FF57',
}: BenchmarkBadgeProps) {
  const { token } = useAuthStore()
  const [results, setResults] = useState<Record<string, BenchmarkResult>>({})
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [sourceOpen, setSourceOpen] = useState(false)

  useEffect(() => {
    if (!token || Object.keys(outputs).length === 0) return
    setLoading(true)
    fetch(`${API}/benchmarks/lookup-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        calculator_slug: calculatorSlug,
        input_snapshot: inputs,
        outputs,
      }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.results) setResults(d.results) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [calculatorSlug, JSON.stringify(outputs), token])

  const available = Object.values(results).filter((v): v is BenchmarkResult => !!v?.available)
  if (loading) {
    return (
      <div className="card p-4 animate-pulse space-y-2">
        <div className="h-3 bg-ink-800 rounded w-20" />
        <div className="h-5 bg-ink-800 rounded w-40" />
        <div className="h-2 bg-ink-800 rounded w-full" />
      </div>
    )
  }
  if (available.length === 0) return null

// Determine which metric to show as primary
let primaryKey = primaryMetricKey
if (!primaryKey || !results[primaryKey]?.available) {
    // Fall back to first available metric
    const availableKeys = Object.keys(results).filter(k => results[k]?.available)
    primaryKey = availableKeys[0]
}
const primary = primaryKey ? results[primaryKey] : null
if (!primary) return null

  const isAnchor = primary.is_anchor
  const pct = primary.user_percentile ?? 50
  const vsMedian = primary.user_vs_median ?? 'at median'

  return (
    <div className="rounded-xl border transition-all"
      style={{ background: `${accentColor}08`, borderColor: `${accentColor}25` }}>

      {/* ── Primary benchmark line ─────────────────────────────────────── */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendIcon vsMedian={vsMedian} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
              {isAnchor ? 'Industry Benchmark' : 'Live Benchmark'}
            </span>
          </div>
          <QuartileLabel pct={pct} />
        </div>

        <p className="text-ink-100 text-sm mt-2">
          You're in the <strong style={{ color: accentColor }}>{pct}th percentile</strong>{' '}
          for operators in your segment — <span className="text-ink-300">{vsMedian}</span>.{' '}
          {primary.sample_count && primary.sample_count > 0 && (
            <span className="text-ink-500">
              ({primary.sample_count.toLocaleString()} {isAnchor ? 'operators surveyed' : 'real calculations'})
            </span>
          )}
        </p>

        <PercentileBar value={pct} />

        {/* Quartile markers */}
        {(primary.p25 != null || primary.p75 != null) && (
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-ink-900 rounded-lg p-2">
              <p className="text-[10px] text-ink-600 font-mono uppercase mb-0.5">Bottom 25%</p>
              <p className="text-xs font-mono text-ink-400">{primary.p25?.toFixed(1) ?? '—'}</p>
            </div>
            <div className="bg-ink-900 rounded-lg p-2">
              <p className="text-[10px] text-ink-600 font-mono uppercase mb-0.5">Median</p>
              <p className="text-xs font-mono text-ink-200">{primary.p50?.toFixed(1) ?? '—'}</p>
            </div>
            <div className="bg-ink-900 rounded-lg p-2">
              <p className="text-[10px] text-ink-600 font-mono uppercase mb-0.5">Top 25%</p>
              <p className="text-xs font-mono" style={{ color: accentColor }}>
                {primary.p75?.toFixed(1) ?? '—'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Anchor source attribution ──────────────────────────────────── */}
      {isAnchor && (
        <div className="px-5 pb-4 border-t border-ink-800/50 pt-3">
          <button
            onClick={() => setSourceOpen(!sourceOpen)}
            className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-ink-300 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            Industry benchmark source
            {sourceOpen ? ' ▲' : ' ▼'}
          </button>
          {sourceOpen && (
            <div className="mt-2 text-xs text-ink-500 space-y-1">
              <p className="leading-relaxed">{primary.anchor_note}</p>
              {primary.source_name && (
                <p className="flex items-center gap-1">
                  Source:{' '}
                  {primary.source_url ? (
                    <a href={primary.source_url} target="_blank" rel="noopener noreferrer"
                      className="text-acid hover:underline flex items-center gap-1">
                      {primary.source_name} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : primary.source_name}
                </p>
              )}
              <p className="text-ink-700 text-[11px] italic">
                Valcr benchmarks auto-upgrade to live operator data once your segment reaches 30 calculations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── More metrics toggle (when multiple outputs have benchmarks) ─── */}
      {available.length > 1 && (
        <div className="px-5 pb-4 border-t border-ink-800/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 transition-colors pt-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {expanded ? 'Show less' : `See ${available.length - 1} more metric${available.length - 1 > 1 ? 's' : ''}`}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {Object.entries(results)
                .filter(([k, v]) => k !== primaryKey && v?.available)
                .map(([metricKey, bm]) => {
                  if (!bm?.available) return null
                  const mpct = bm.user_percentile ?? 50
                  return (
                    <div key={metricKey} className="flex items-center justify-between py-2 border-t border-ink-800/30">
                      <span className="text-xs text-ink-500 font-mono">
                        {metricKey.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-ink-300">{mpct}th pct</span>
                        <QuartileLabel pct={mpct} />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* ── Upgrade prompt for segment clarity ─────────────────────────── */}
      {primary.segment_key && (
        <div className="px-5 pb-4 text-[11px] text-ink-700 font-mono">
          Segment: {primary.segment_key}
        </div>
      )}
    </div>
  )
}

// ── Inline micro badge (for dashboard saved calculations listing) ────────────
export function BenchmarkMicrobadge({ percentile }: { percentile: number }) {
  const color = percentile >= 75 ? '#C8FF57' : percentile >= 50 ? '#57C8FF' : percentile >= 25 ? '#FFB457' : '#FF6B57'
  const label = percentile >= 75 ? 'Top 25%' : percentile >= 50 ? 'Above median' : percentile >= 25 ? 'Below median' : 'Bottom 25%'
  return (
    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
      {label}
    </span>
  )
}

// ── Pro gate wrapper (shows upgrade prompt if not Pro) ──────────────────────
export function BenchmarkGate({
  isPro, children,
}: { isPro: boolean; children: React.ReactNode }) {
  if (isPro) return <>{children}</>
  return (
    <div className="card p-5 border-acid/20 bg-acid/5">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-acid" />
        <span className="text-acid text-xs font-bold uppercase tracking-widest">Pro Feature</span>
      </div>
      <p className="text-ink-300 text-sm mb-3">
        See how your numbers compare to other operators in your segment — both industry benchmarks
        and live data from Valcr users.
      </p>
      <Link to="/pricing" className="btn-primary text-xs py-1.5 px-4">
        Unlock benchmarks — $9/mo
      </Link>
    </div>
  )
}
