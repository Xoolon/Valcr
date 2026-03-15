import { useState, useEffect, useRef } from 'react'
import { Calculator, CalculatorField } from '@/calculators'
import { calculate, explain, CalcResult } from '@/calculators/engine'
import { ResultCard } from './ResultCard'
import { Info } from 'lucide-react'
import clsx from 'clsx'

interface CalculatorFormProps {
  calculator: Calculator
}

export function CalculatorForm({ calculator }: CalculatorFormProps) {
  const [values, setValues] = useState<Record<string, number | string>>(() =>
    Object.fromEntries(calculator.fields.map((f) => [f.key, f.default]))
  )
  const [results, setResults] = useState<CalcResult>(() =>
    calculate(calculator.slug, Object.fromEntries(calculator.fields.map((f) => [f.key, f.default])))
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset when calculator changes (navigating between calculators)
  useEffect(() => {
    const defaults = Object.fromEntries(calculator.fields.map((f) => [f.key, f.default]))
    setValues(defaults)
    setResults(calculate(calculator.slug, defaults))
  }, [calculator.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (key: string, value: string | number) => {
    const nextValues = { ...values, [key]: value }
    setValues(nextValues)
    // Debounce recalculation 150ms so rapid typing doesn't hammer
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setResults(calculate(calculator.slug, nextValues))
    }, 150)
  }

  const explanation = explain(calculator.slug, values, results)

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
          />
        ))}
      </div>

      {/* Outputs */}
      <div className="space-y-4">
        <ResultCard
          calculator={calculator}
          results={results}
          explanation={explanation}
        />
      </div>
    </div>
  )
}

interface FieldInputProps {
  field: CalculatorField
  value: number | string
  onChange: (value: number | string) => void
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  if (field.type === 'select') {
    return (
      <div>
        <label className="label">{field.label}</label>
        {field.description && (
          <p className="text-xs text-ink-600 mb-1.5 -mt-1">{field.description}</p>
        )}
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="input-field appearance-none cursor-pointer"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-ink-800">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const numValue = typeof value === 'string' ? value : String(value)

  return (
    <div>
      <label className="label flex items-center gap-1.5">
        {field.label}
        {field.description && (
          <span className="group relative inline-flex">
            <Info className="w-3 h-3 text-ink-600 cursor-help" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-ink-800 border border-ink-700 text-ink-200 text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-left normal-case tracking-normal font-body font-400">
              {field.description}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        {field.prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 text-sm font-mono pointer-events-none select-none">
            {field.prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={numValue}
          min={field.min}
          max={field.max}
          step={field.step ?? (field.type === 'currency' ? 0.01 : field.type === 'percent' ? 0.1 : 1)}
          onChange={(e) => onChange(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
          className={clsx(
            'input-field',
            field.prefix && 'pl-7',
            field.suffix && 'pr-10'
          )}
        />
        {field.suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 text-sm font-mono pointer-events-none select-none">
            {field.suffix}
          </span>
        )}
      </div>
    </div>
  )
}
