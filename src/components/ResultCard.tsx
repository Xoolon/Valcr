import { ExoClickAd } from './ExoClickAd'
import { Calculator } from '@/calculators'
import { CalcResult } from '@/calculators/engine'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

interface ResultCardProps {
  calculator: Calculator
  results: CalcResult
  explanation: string
}

export function ResultCard({ calculator, results, explanation }: ResultCardProps) {
  const highlights = calculator.outputs.filter((o) => o.highlight)
  const details = calculator.outputs.filter((o) => !o.highlight)

  return (
    <div className="space-y-4">
      {/* Primary results */}
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
                    <p className={clsx('font-display font-700 text-lg tabular-nums', value < 0 ? 'text-coral' : 'text-ink-100')}>
                      {formatValue(value, output.type)}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* What this means */}
      {explanation && (
        <div className="card p-5 border-ink-700/50">
          <p className="text-xs label mb-2">What this means</p>
          <p className="text-sm text-ink-200 leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Ad — below results, non-intrusive */}
      <ExoClickAd className="py-2" />
    </div>
  )
}

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) return <TrendingUp className="w-5 h-5 text-acid mb-1" />
  if (value < 0) return <TrendingDown className="w-5 h-5 text-coral mb-1" />
  return <Minus className="w-5 h-5 text-ink-400 mb-1" />
}

export function formatValue(value: number, type: string): string {
  if (!isFinite(value)) return '—'
  switch (type) {
    case 'currency':
      return (value < 0 ? '-$' : '$') + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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