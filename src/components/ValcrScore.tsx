// src/components/ValcrScore.tsx
// Fixed version — correctly reads from the API which now queries
// calculation_events directly instead of session_profile aggregates.
//
// PLACEMENT in Calculator.tsx:
//   Output cards → Explanation → ValcrScore → BenchmarkBadge
//
// The component re-fetches the score after every calculator page load
// so it reflects the latest calculation without requiring a page refresh.

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'https://api.valcr.site/api/v1'

interface ScoreComponent {
  metric:                string
  calculator_slug:       string
  label:                 string
  user_value:            number
  percentile:            number
  weight:                number
  weighted_contribution: number
  insight:               string
}

interface ScoreData {
  ready:               boolean
  score?:              number
  grade?:              string
  headline?:           string
  calculators_scored?: number
  calculators_needed?: number
  calculators_used?:   string[]
  metrics_scored?:     number
  metrics_total?:      number
  components?:         ScoreComponent[] | null
  components_available?: number
  upgrade_prompt?:     string
  message?:            string
}

// ── Score ring SVG ─────────────────────────────────────────────────────────

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius       = 38
  const circumference = 2 * Math.PI * radius
  const offset       = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#C8FF57' :
    score >= 65 ? '#57C8FF' :
    score >= 50 ? '#FFB457' :
    score >= 35 ? '#FF8A57' : '#FF6B57'

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke="#1a1a1a" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-800 text-xl leading-none" style={{ color }}>
          {score}
        </span>
        <span className="font-display font-700 text-sm text-ink-400">{grade}</span>
      </div>
    </div>
  )
}

// ── Progress prompt (not enough calculators yet) ───────────────────────────

function ProgressPrompt({ scored, needed, used }: {
  scored: number; needed: number; used?: string[]
}) {
  const remaining = needed - scored

  return (
    <div className="card p-4 border-ink-800 border-dashed">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-ink-800 flex items-center justify-center shrink-0">
          <span className="font-display font-800 text-ink-600 text-xs">VS</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-700 text-ink-200 text-sm">Valcr Score</p>
          <p className="text-ink-500 text-xs mt-0.5">
            Run {remaining} more calculator{remaining !== 1 ? 's' : ''} to unlock your score
            {' '}({scored}/{needed} done)
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-1 bg-ink-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-acid rounded-full transition-all duration-500"
              style={{ width: `${(scored / needed) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Free user score card (number + grade only) ─────────────────────────────

function FreeScoreCard({ score, grade, headline, componentsAvailable, upgradePrompt }: {
  score: number
  grade: string
  headline: string
  componentsAvailable: number
  upgradePrompt?: string
}) {
  return (
    <div className="card p-4 border-ink-800">
      <div className="flex items-center gap-4">
        <ScoreRing score={score} grade={grade} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono text-ink-600 uppercase tracking-widest mb-1">
            Valcr Score
          </p>
          <p className="font-display font-700 text-ink-100 text-sm leading-snug mb-3">
            {headline}
          </p>
          <div className="flex items-center gap-2 p-2.5 bg-ink-800/50 rounded-xl">
            <Lock className="w-3.5 h-3.5 text-ink-600 shrink-0" />
            <p className="text-xs text-ink-500 leading-tight">
              {upgradePrompt || `${componentsAvailable} metric breakdown with`}{' '}
              {!upgradePrompt && (
                <Link to="/pricing" className="text-acid hover:underline font-600">
                  Pro — $9/mo
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Pro score card (full breakdown) ───────────────────────────────────────

function ProScoreCard({ score, grade, headline, components }: {
  score: number
  grade: string
  headline: string
  components: ScoreComponent[]
}) {
  const [expanded, setExpanded] = useState(false)

  const sorted  = [...components].sort((a, b) => b.weighted_contribution - a.weighted_contribution)
  const preview = sorted.slice(0, 3)

  return (
    <div className="card p-4 border-acid/20 bg-acid/3">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <ScoreRing score={score} grade={grade} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[10px] font-mono text-acid uppercase tracking-widest">Valcr Score</p>
            <span className="text-[9px] font-mono text-ink-600 bg-acid/10 px-1.5 py-0.5 rounded uppercase">PRO</span>
          </div>
          <p className="font-display font-700 text-ink-50 text-sm leading-snug">{headline}</p>
        </div>
      </div>

      {/* Top metrics */}
      <div className="space-y-2 mb-2">
        {preview.map(comp => <MetricRow key={comp.metric} comp={comp} />)}
      </div>

      {/* Show more */}
      {sorted.length > 3 && (
        <>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 transition-colors w-full justify-center py-2 border-t border-ink-800"
          >
            {expanded
              ? <><ChevronUp className="w-3 h-3" />Show less</>
              : <><ChevronDown className="w-3 h-3" />See all {sorted.length} metrics</>}
          </button>
          {expanded && (
            <div className="space-y-2 mt-2 pt-2 border-t border-ink-800">
              {sorted.slice(3).map(comp => <MetricRow key={comp.metric} comp={comp} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MetricRow({ comp }: { comp: ScoreComponent }) {
  const pct   = comp.percentile
  const color = pct >= 75 ? '#C8FF57' : pct >= 50 ? '#57C8FF' : pct >= 25 ? '#FFB457' : '#FF6B57'
  const Icon  = pct >= 50 ? TrendingUp : pct >= 25 ? Minus : TrendingDown

  return (
    <div className="flex items-start gap-3">
      <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-display font-600 text-ink-200 truncate">{comp.label}</span>
          <span className="text-xs font-mono shrink-0" style={{ color }}>{pct}th</span>
        </div>
        <p className="text-[11px] text-ink-500 leading-snug mt-0.5">{comp.insight}</p>
      </div>
    </div>
  )
}

// ── Login prompt (unauthenticated) ─────────────────────────────────────────

function LoginPrompt() {
  return (
    <div className="card p-4 border-ink-800 border-dashed">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center shrink-0">
          <span className="font-display font-800 text-ink-600 text-xs">VS</span>
        </div>
        <div>
          <p className="text-sm font-display font-700 text-ink-200">Valcr Score</p>
          <p className="text-xs text-ink-500 mt-0.5">
            <Link to="/signup" className="text-acid hover:underline">Create a free account</Link>
            {' '}to track your financial health score across calculators.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────

interface ValcrScoreProps {
  /** Pass the current calculator slug so the score refetches after a run */
  currentCalcSlug?: string
  /** Pass true after a calculation completes to trigger a refetch */
  triggerRefetch?: boolean
}

export function ValcrScore({ currentCalcSlug, triggerRefetch }: ValcrScoreProps) {
  const { token, user } = useAuthStore()
  const [data,    setData]    = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(false)

  const isPro = user?.accountTier && (
    ['pro', 'teams', 'embed-starter', 'embed-business', 'embed-agency', 'diane_pro', 'admin']
    .includes(user.accountTier)
  )

  const fetchScore = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`${API}/score/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setData(await res.json())
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [token])

  // Fetch on mount
  useEffect(() => { fetchScore() }, [fetchScore])

  // Refetch when a calculation completes (delay slightly so the event is persisted)
  useEffect(() => {
    if (!triggerRefetch) return
    const t = setTimeout(fetchScore, 1500)
    return () => clearTimeout(t)
  }, [triggerRefetch, fetchScore])

  // Not logged in
  if (!token || !user) return <LoginPrompt />

  // Loading skeleton
  if (loading && !data) {
    return <div className="card p-5 animate-pulse h-20 bg-ink-800/20 rounded-2xl" />
  }

  // Error state — silent fail (don't clutter the calculator page)
  if (error && !data) return null

  // No data from API
  if (!data) return null

  // Not enough calculators yet
  if (!data.ready) {
    return (
      <ProgressPrompt
        scored={data.calculators_scored ?? 0}
        needed={data.calculators_needed ?? MIN_CALCULATORS_DISPLAY}
        used={data.calculators_used}
      />
    )
  }

  // Score ready — Pro vs Free view
  if (isPro && data.components && data.components.length > 0) {
    return (
      <ProScoreCard
        score={data.score!}
        grade={data.grade!}
        headline={data.headline!}
        components={data.components}
      />
    )
  }

  return (
    <FreeScoreCard
      score={data.score!}
      grade={data.grade!}
      headline={data.headline!}
      componentsAvailable={data.components_available ?? 0}
      upgradePrompt={data.upgrade_prompt}
    />
  )
}

const MIN_CALCULATORS_DISPLAY = 2
