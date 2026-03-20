import { useState } from 'react'
import { Save, Check } from 'lucide-react'
import { Calculator } from '@/calculators'
import { CalcResult } from '@/calculators/engine'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useAuthStore, hasAccess } from '@/store'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

interface ResultCardProps {
  calculator: Calculator
  results: CalcResult
  explanation: string
}

export function ResultCard({ calculator, results, explanation }: ResultCardProps) {
  const { user, token } = useAuthStore()
  const isPro = hasAccess(user, 'pro')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const highlights = calculator.outputs.filter((o) => o.highlight)
  const details = calculator.outputs.filter((o) => !o.highlight)

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/calculations/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculator_slug: calculator.slug,
          input_data: {},      // CalculatorForm passes these via props in a full integration
          output_data: results,
          label: `${calculator.shortName} — ${new Date().toLocaleDateString()}`,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full" style={{ background: calculator.color }} />
          <h2 className="font-display font-700 text-ink-50 text-base">Results</h2>
          <span className="ml-auto text-xs font-mono text-ink-600">live calculation</span>
        </div>

        <div className="space-y-4">
          {highlights.map((output) => {
            const value = results[output.key]
            if (value === undefined) return null
            return (
              <div key={output.key}>
                <p className="label mb-1">{output.label}</p>
                <div className="flex items-end gap-2">
                  <span
                    className="font-display font-800 tabular-nums"
                    style={{ fontSize: '2rem', lineHeight: '1', color: value < 0 ? '#FF6B57' : calculator.color }}
                  >
                    {formatValue(value, output.type)}
                  </span>
                  {output.type === 'currency' && value !== 0 && <TrendIndicator value={value} />}
                </div>
                {output.description && <p className="text-xs text-ink-600 mt-1">{output.description}</p>}
              </div>
            )
          })}
        </div>

        {details.length > 0 && (
          <>
            <div className="border-t border-ink-800 my-5" />
            <div className="grid grid-cols-2 gap-4">
              {details.map((output) => {
                const value = results[output.key]
                if (value === undefined) return null
                return (
                  <div key={output.key}>
                    <p className="text-xs font-display font-600 text-ink-600 uppercase tracking-widest mb-1">
                      {output.label}
                    </p>
                    <p className={clsx('font-display font-700 text-lg tabular-nums', value < 0 ? 'text-red-400' : 'text-ink-100')}>
                      {formatValue(value, output.type)}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Save button */}
        <div className="mt-5 pt-4 border-t border-ink-800 flex items-center justify-between">
          {isPro ? (
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-2 text-xs font-600 transition-all px-3 py-2 rounded-lg ${
                saved
                  ? 'text-acid bg-acid/10 border border-acid/20'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800 border border-transparent'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save calculation'}
            </button>
          ) : (
            <Link to="/pricing" className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-acid transition-colors">
              <Save className="w-3.5 h-3.5" />
              <span>Save — <span className="text-acid">Pro</span></span>
            </Link>
          )}
        </div>
      </div>

      {explanation && (
        <div className="card p-5 border-ink-700/50">
          <p className="text-xs label mb-2">What this means</p>
          <p className="text-sm text-ink-200 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <TrendingUp className="w-5 h-5 text-acid mb-1" />
  if (value < 0) return <TrendingDown className="w-5 h-5 text-red-400 mb-1" />
  return <Minus className="w-5 h-5 text-ink-400 mb-1" />
}

export function formatValue(value: number, type: string): string {
  if (!isFinite(value)) return '—'
  switch (type) {
    case 'currency':
      return (value < 0 ? '-$' : '$') + Math.abs(value).toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
      })
    case 'percent':
      return value.toFixed(1) + '%'
    case 'multiplier':
      return value.toFixed(2) + 'x'
    case 'number':
      return Math.ceil(value).toLocaleString()
    default:
      return String(value)
  }
}