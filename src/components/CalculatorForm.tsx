import { useState, useEffect, useRef } from 'react'
import { Calculator, CalculatorField } from '@/calculators'
import { calculate, explain, CalcResult } from '@/calculators/engine'
import { ResultCard, formatValue } from './ResultCard'
import { BenchmarkBadge, BenchmarkGate } from './BenchmarkBadge'
import { Info } from 'lucide-react'
import { useTelemetry } from '@/hooks/useTelemetry'
import { useAuthStore, hasAccess } from '@/store'
import clsx from 'clsx'

interface CalculatorFormProps {
  calculator: Calculator
}

export function CalculatorForm({ calculator }: CalculatorFormProps) {
  const { user } = useAuthStore()
  const [values, setValues] = useState<Record<string, number | string>>(() =>
    Object.fromEntries(calculator.fields.map((f) => [f.key, f.default]))
  )
  const [results, setResults] = useState<CalcResult>(() =>
    calculate(calculator.slug, Object.fromEntries(calculator.fields.map((f) => [f.key, f.default])))
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { onFieldFocus, onFieldBlur, onFieldChange, onCalculationRun } = useTelemetry(calculator.slug)

  useEffect(() => {
    const defaults = Object.fromEntries(calculator.fields.map((f) => [f.key, f.default]))
    setValues(defaults)
    setResults(calculate(calculator.slug, defaults))
  }, [calculator.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (key: string, value: string | number) => {
    const nextValues = { ...values, [key]: value }
    setValues(nextValues)
    onFieldChange(key, value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const nextResults = calculate(calculator.slug, nextValues)
      setResults(nextResults)
      onCalculationRun(nextValues as Record<string, number>, nextResults as Record<string, unknown>)
    }, 150)
  }

  const explanation = explain(calculator.slug, values, results)

  // Highlighted output keys for benchmarking
  const highlightedOutputs = calculator.outputs
    .filter(o => o.highlight)
    .map(o => o.key)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="font-display font-700 text-ink-50 text-base">Inputs</h2>
          <span className="text-xs font-mono text-ink-600">— adjust to model scenarios</span>
        </div>
        {calculator.fields.map((field) => (
          <FieldInput
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={(v) => handleChange(field.key, v)}
            onFocus={() => onFieldFocus(field.key)}
            onBlur={() => onFieldBlur(field.key)}
          />
        ))}
      </div>

      {/* Outputs + Benchmarks */}
      <div className="space-y-4">
        <ResultCard calculator={calculator} results={results} explanation={explanation} />
        <BenchmarkGate isPro={hasAccess(user, 'pro')}>
          <BenchmarkBadge
            calculatorSlug={calculator.slug}
            outputs={results as Record<string, number>}
            inputs={values}
            primaryMetricKey={calculator.outputs.find(o => o.highlight)?.key}
            accentColor={calculator.color}
          />
        </BenchmarkGate>
      </div>
    </div>
  )
}

interface FieldInputProps {
  field: CalculatorField
  value: number | string
  onChange: (value: number | string) => void
  onFocus?: () => void
  onBlur?: () => void
}

function FieldInput({ field, value, onChange, onFocus, onBlur }: FieldInputProps) {
  if (field.type === 'select') {
    return (
      <div>
        <label className="label">
          {field.label}
          {field.description && <span className="ml-2 text-ink-600 font-400 normal-case tracking-normal">— {field.description}</span>}
        </label>
        <select value={value as string} onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus} onBlur={onBlur} className="input-field">
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      <label className="label">
        {field.label}
        {field.description && (
          <span className="group relative ml-1.5 inline-flex items-center">
            <Info className="w-3 h-3 text-ink-600 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-ink-800 border border-ink-700 text-ink-200 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
              {field.description}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        {field.prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 text-sm font-mono pointer-events-none">{field.prefix}</span>
        )}
        <input
          type="number"
          value={value as number}
          onChange={(e) => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
          onFocus={onFocus}
          onBlur={onBlur}
          min={field.min}
          max={field.max}
          step={field.step ?? (field.type === 'percent' ? 0.1 : 1)}
          className={clsx('input-field tabular-nums', field.prefix && 'pl-8', field.suffix && 'pr-12')}
        />
        {field.suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 text-sm font-mono pointer-events-none">{field.suffix}</span>
        )}
      </div>
    </div>
  )
}