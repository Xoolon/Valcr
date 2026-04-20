// src/components/ValcrScore.tsx
// ============================================================
// Valcr Score display component.
// Used BELOW calculator output results.
// Free users: see the number + grade + headline + locked breakdown tease.
// Pro users: see full breakdown with per-metric percentiles and insights.
//
// Positioning logic:
//   Calculator output → Explanation text → ValcrScore → BenchmarkGate (Pro benchmarks)
//
// The score and the benchmarks do NOT compete because they answer different questions:
//   ValcrScore    → "What is the overall health of my business?" (one number)
//   BenchmarkBadge → "How does THIS specific metric compare to others?" (detailed)
//
// A user who sees their score is 41 wants to know WHY. The answer is
// in the benchmarks. Score creates the need; benchmarks fulfill it.
// ============================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Lock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface ScoreComponent {
  metric: string
  label: string
  user_value: number
  percentile: number
  weight: number
  weighted_contribution: number
  insight: string
}

interface ScoreData {
  ready: boolean
  score?: number
  grade?: string
  headline?: string
  calculators_scored?: number
  calculators_needed?: number
  metrics_scored?: number
  metrics_total?: number
  components?: ScoreComponent[] | null
  components_available?: number
  message?: string
}

// ── Score ring visual ─────────────────────────────────────────────────────
function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference

  const ringColor =
    score >= 80 ? '#C8FF57' :
    score >= 65 ? '#57C8FF' :
    score >= 50 ? '#FFB457' :
    score >= 35 ? '#FF8A57' : '#FF6B57'

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        {/* Background ring */}
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke="#1a1a1a" strokeWidth="8" />
        {/* Score ring */}
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke={ringColor} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-800 text-2xl text-ink-50" style={{ color: ringColor }}>
          {score}
        </span>
        <span className="font-display font-700 text-sm text-ink-400">{grade}</span>
      </div>
    </div>
  )
}

// ── Not enough data state ─────────────────────────────────────────────────
function ScoreUnlockPrompt({ scored, needed }: { scored: number; needed: number }) {
  return (
    <div className="card p-5 border-ink-700 border-dashed">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-ink-800 flex items-center justify-center shrink-0">
          <span className="font-display font-800 text-ink-600 text-sm">VS</span>
        </div>
        <div>
          <p className="font-display font-700 text-ink-200 text-sm">Valcr Score</p>
          <p className="text-ink-500 text-xs mt-0.5">
            Run {needed - scored} more calculator{needed - scored > 1 ? 's' : ''} to unlock your score.
            {' '}({scored}/{needed} complete)
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Free user score (number only, locked breakdown) ───────────────────────
function FreeScoreCard({ score, grade, headline, componentsAvailable }: {
  score: number; grade: string; headline: string; componentsAvailable: number
}) {
  return (
    <div className="card p-5 border-ink-700">
      <div className="flex items-center gap-4">
        <ScoreRing score={score} grade={grade} />
        <div className="flex-1">
          <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-1">
            Valcr Score
          </p>
          <p className="font-display font-700 text-ink-100 text-sm leading-snug mb-3">
            {headline}
          </p>
          {/* Locked breakdown tease */}
          <div className="flex items-center gap-2 p-3 bg-ink-800/50 rounded-xl">
            <Lock className="w-3.5 h-3.5 text-ink-600 shrink-0" />
            <p className="text-xs text-ink-500">
              {componentsAvailable} metric breakdown available with{' '}
              <Link to="/pricing" className="text-acid hover:underline font-600">
                Pro — $9/mo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Pro score card (full breakdown) ──────────────────────────────────────
function ProScoreCard({ score, grade, headline, components }: {
  score: number; grade: string; headline: string; components: ScoreComponent[]
}) {
  const [expanded, setExpanded] = useState(false)

  const topDrivers = [...components].sort((a, b) => b.weighted_contribution - a.weighted_contribution)
  const preview = topDrivers.slice(0, 3)

  return (
    <div className="card p-5 border-acid/20 bg-acid/3">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <ScoreRing score={score} grade={grade} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-mono text-acid uppercase tracking-widest">Valcr Score</p>
            <span className="text-[10px] font-mono text-ink-600 bg-acid/10 px-1.5 py-0.5 rounded">PRO</span>
          </div>
          <p className="font-display font-700 text-ink-50 text-sm leading-snug">{headline}</p>
        </div>
      </div>

      {/* Top 3 metrics preview */}
      <div className="space-y-2 mb-3">
        {preview.map(comp => (
          <MetricRow key={comp.metric} comp={comp} />
        ))}
      </div>

      {/* Toggle more */}
      {components.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 transition-colors w-full justify-center py-2 border-t border-ink-800"
        >
          {expanded ? <><ChevronUp className="w-3 h-3"/>Show less</> : <><ChevronDown className="w-3 h-3"/>See all {components.length} metrics</>}
        </button>
      )}
      {expanded && (
        <div className="space-y-2 mt-2 pt-2 border-t border-ink-800">
          {topDrivers.slice(3).map(comp => (
            <MetricRow key={comp.metric} comp={comp} />
          ))}
        </div>
      )}
    </div>
  )
}

function MetricRow({ comp }: { comp: ScoreComponent }) {
  const pct = comp.percentile
  const color = pct >= 75 ? '#C8FF57' : pct >= 50 ? '#57C8FF' : pct >= 25 ? '#FFB457' : '#FF6B57'
  const Icon = pct >= 50 ? TrendingUp : pct >= 25 ? Minus : TrendingDown

  return (
    <div className="flex items-start gap-3">
      <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-display font-600 text-ink-200 truncate">{comp.label}</span>
          <span className="text-xs font-mono shrink-0" style={{ color }}>
            {pct}th pct
          </span>
        </div>
        <p className="text-[11px] text-ink-500 leading-snug mt-0.5">{comp.insight}</p>
      </div>
    </div>
  )
}


// ── Main export ────────────────────────────────────────────────────────────
export function ValcrScore() {
  const { token, user } = useAuthStore()
  const [data, setData] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(false)

const isPro = user?.accountTier && ['pro','teams','embed-starter','embed-business','embed-agency']
  .includes(user.accountTier)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`${API}/score/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  // Not logged in — show login nudge
  if (!token || !user) {
    return (
      <div className="card p-4 border-ink-700 border-dashed">
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

  if (loading) {
    return <div className="card p-5 animate-pulse h-20 bg-ink-800/30" />
  }

  if (!data) return null

  if (!data.ready) {
    return (
      <ScoreUnlockPrompt
        scored={data.calculators_scored || 0}
        needed={data.calculators_needed || 2}
      />
    )
  }

  if (isPro && data.components) {
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
      componentsAvailable={data.components_available || 0}
    />
  )
}
