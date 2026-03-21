import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ExternalLink, Lock, Share2 } from 'lucide-react'
import { SEOHead } from '@/components/SEOHead'
import { formatValue } from '@/components/ResultCard'
import { getCalculator } from '@/calculators'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export function SharedCalculationPage() {
  const { token } = useParams<{ token: string }>()
  const [calc, setCalc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return }
    fetch(`${API}/calculations/shared/${token}`)
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(d => { setCalc(d); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ink-700 border-t-acid rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !calc) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-sm">
          <Lock className="w-10 h-10 text-ink-700 mx-auto mb-4" />
          <h1 className="font-display font-700 text-ink-50 text-xl mb-2">Link not found</h1>
          <p className="text-ink-400 text-sm mb-6">
            This calculation may have been deleted or the link has expired.
          </p>
          <Link to="/calculators" className="btn-primary">Browse calculators</Link>
        </div>
      </div>
    )
  }

  const meta = getCalculator(calc.calculator_slug)
  const highlights = meta?.outputs.filter(o => o.highlight) || []
  const details = meta?.outputs.filter(o => !o.highlight) || []

  return (
    <>
      <SEOHead
        title={`${calc.label || calc.calculator_slug} | Shared via Valcr`}
        description={`View this shared ${calc.calculator_slug} calculation on Valcr.`}
        noIndex
      />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4 text-ink-600" />
              <span className="text-xs font-mono text-ink-600">Shared calculation</span>
            </div>
            <h1 className="font-display font-800 text-2xl sm:text-3xl text-ink-50">
              {calc.label || meta?.name || calc.calculator_slug}
            </h1>
            {calc.created_at && (
              <p className="text-ink-500 text-xs font-mono mt-1">
                Saved {new Date(calc.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Results */}
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full" style={{ background: meta?.color || '#C8FF57' }} />
              <h2 className="font-display font-700 text-ink-50 text-base">Results</h2>
            </div>

            <div className="space-y-4">
              {highlights.map(output => {
                const value = calc.output_data?.[output.key]
                if (value === undefined) return null
                return (
                  <div key={output.key}>
                    <p className="label mb-1">{output.label}</p>
                    <span
                      className="font-display font-800 tabular-nums"
                      style={{ fontSize: '2rem', lineHeight: 1, color: value < 0 ? '#FF6B57' : (meta?.color || '#C8FF57') }}
                    >
                      {formatValue(value, output.type)}
                    </span>
                  </div>
                )
              })}
            </div>

            {details.length > 0 && (
              <>
                <div className="border-t border-ink-800 my-5" />
                <div className="grid grid-cols-2 gap-4">
                  {details.map(output => {
                    const value = calc.output_data?.[output.key]
                    if (value === undefined) return null
                    return (
                      <div key={output.key}>
                        <p className="text-xs font-display font-600 text-ink-600 uppercase tracking-widest mb-1">
                          {output.label}
                        </p>
                        <p className={`font-display font-700 text-lg tabular-nums ${value < 0 ? 'text-red-400' : 'text-ink-100'}`}>
                          {formatValue(value, output.type)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Inputs */}
          {calc.input_data && Object.keys(calc.input_data).length > 0 && (
            <div className="card p-6 mb-6">
              <h2 className="font-display font-700 text-ink-200 text-sm mb-4">Inputs used</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(calc.input_data).map(([k, v]) => {
                  const field = meta?.fields.find(f => f.key === k)
                  return (
                    <div key={k}>
                      <p className="text-xs text-ink-600 mb-0.5">{field?.label || k.replace(/_/g, ' ')}</p>
                      <p className="text-sm font-mono text-ink-200">
                        {field?.prefix}{String(v)}{field?.suffix}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="card p-5 border-dashed border-ink-700 text-center">
            <p className="text-ink-400 text-sm mb-3">
              Run this calculator with your own numbers
            </p>
            <Link
              to={`/calculators/${calc.calculator_slug}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open {meta?.shortName || 'Calculator'}
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}