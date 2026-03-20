import { useState, useEffect } from 'react'
import { TrendingUp, Lock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore, hasAccess } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface BenchmarkData {
  available: boolean
  user_value?: number
  user_percentile?: number
  user_vs_median?: string
  p25?: number
  p50?: number
  p75?: number
  sample_count?: number
  segment_key?: string
}

interface BenchmarkPanelProps {
  calculatorSlug: string
  outputs: Record<string, number>     // the current calculated results
  inputs: Record<string, number | string>
  highlightedMetrics: string[]        // which output keys to benchmark
  formatValue: (v: number, type: string) => string
  outputMeta: { key: string; label: string; type: string }[]
}

export function BenchmarkPanel({
  calculatorSlug, outputs, inputs, highlightedMetrics, formatValue, outputMeta
}: BenchmarkPanelProps) {
  const { user, token } = useAuthStore()
  const isPro = hasAccess(user, 'pro')
  const [benchmarks, setBenchmarks] = useState<Record<string, BenchmarkData>>({})
  const [loading, setLoading] = useState(false)
  const [segmentKey, setSegmentKey] = useState('')

  useEffect(() => {
    if (!isPro || !token) return
    const metricsToFetch: Record<string, number> = {}
    for (const key of highlightedMetrics) {
      if (outputs[key] !== undefined) metricsToFetch[key] = outputs[key]
    }
    if (Object.keys(metricsToFetch).length === 0) return

    const fetchBenchmarks = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API}/benchmarks/lookup-bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            calculator_slug: calculatorSlug,
            input_snapshot: inputs,
            outputs: metricsToFetch,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.pro_required) return
          setBenchmarks(data.results || {})
          setSegmentKey(data.segment_key || '')
        }
      } finally {
        setLoading(false)
      }
    }

    // Debounce — only fetch after user stops changing inputs for 1s
    const t = setTimeout(fetchBenchmarks, 1000)
    return () => clearTimeout(t)
  }, [calculatorSlug, JSON.stringify(outputs), isPro, token])

  // Not logged in or free user — show upgrade prompt
  if (!user) return null
  if (!isPro) {
    return (
      <div className="card p-5 mt-4 border-dashed border-ink-700">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-acid/10 border border-acid/20 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-acid" />
          </div>
          <div>
            <p className="font-display font-700 text-ink-50 text-sm mb-1">
              See how you compare
            </p>
            <p className="text-ink-400 text-xs leading-relaxed mb-3">
              Pro users see their percentile rank vs similar businesses. Know if your margins are competitive.
            </p>
            <Link to="/pricing" className="btn-primary text-xs py-2 px-4">
              Upgrade to Pro — $9/mo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const availableKeys = highlightedMetrics.filter(k => benchmarks[k]?.available)
  const hasAny = availableKeys.length > 0

  if (loading && !hasAny) {
    return (
      <div className="card p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-acid" />
          <p className="text-xs font-mono text-acid uppercase tracking-widest">Benchmarks</p>
        </div>
        <div className="space-y-3">
          {highlightedMetrics.map(k => (
            <div key={k} className="h-8 bg-ink-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!hasAny) {
    return (
      <div className="card p-5 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-acid" />
          <p className="text-xs font-mono text-acid uppercase tracking-widest">Benchmarks</p>
        </div>
        <p className="text-ink-500 text-xs">
          Not enough data yet for your segment. Benchmarks appear once we have 30+ similar businesses.
          Check back after more users run this calculator.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-acid" />
          <p className="text-xs font-mono text-acid uppercase tracking-widest">Your Benchmarks</p>
        </div>
        {segmentKey && (
          <div className="flex items-center gap-1 text-[10px] text-ink-600 font-mono">
            <Users className="w-3 h-3" />
            {benchmarks[availableKeys[0]]?.sample_count || 0} similar businesses
          </div>
        )}
      </div>

      <div className="space-y-4">
        {availableKeys.map(metricKey => {
          const bm = benchmarks[metricKey]
          if (!bm?.available) return null
          const meta = outputMeta.find(o => o.key === metricKey)
          const label = meta?.label || metricKey.replace(/_/g, ' ')
          const pct = bm.user_percentile || 50

          // Colour coding
          const barColor = pct >= 75 ? '#C8FF57' : pct >= 40 ? '#57C8FF' : '#FF6B57'
          const textColor = pct >= 75 ? 'text-acid' : pct >= 40 ? 'text-sky-400' : 'text-red-400'
          const label_pct =
            pct >= 75 ? 'Top quartile' :
            pct >= 50 ? 'Above median' :
            pct >= 25 ? 'Below median' : 'Bottom quartile'

          return (
            <div key={metricKey}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-ink-400">{label}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-600 ${textColor}`}>{label_pct}</span>
                  <span className="text-xs font-mono text-ink-600">{pct}th pct</span>
                </div>
              </div>

              {/* Percentile bar */}
              <div className="relative h-2 bg-ink-800 rounded-full overflow-visible mb-1.5">
                {/* Quartile markers */}
                {[25, 50, 75].map(p => (
                  <div key={p} className="absolute top-0 bottom-0 w-px bg-ink-700"
                    style={{ left: `${p}%` }} />
                ))}
                {/* Filled bar */}
                <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
                {/* User position dot */}
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-ink-900 transition-all duration-700"
                  style={{ left: `calc(${Math.min(pct, 98)}% - 6px)`, background: barColor }} />
              </div>

              {/* Peer values */}
              <div className="flex items-center justify-between text-[10px] text-ink-600 font-mono">
                <span>P25: {meta ? formatValue(bm.p25 || 0, meta.type) : (bm.p25 || 0).toFixed(1)}</span>
                <span>Median: {meta ? formatValue(bm.p50 || 0, meta.type) : (bm.p50 || 0).toFixed(1)}</span>
                <span>P75: {meta ? formatValue(bm.p75 || 0, meta.type) : (bm.p75 || 0).toFixed(1)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {segmentKey && (
        <p className="text-[10px] text-ink-700 font-mono mt-4 pt-3 border-t border-ink-800">
          Segment: {segmentKey.replace(/_/g, ' ')}
        </p>
      )}
    </div>
  )
}