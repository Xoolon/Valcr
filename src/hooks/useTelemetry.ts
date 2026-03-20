import { useRef, useCallback, useEffect } from 'react'
import { telemetryClient } from '@/api/telemetry'

export function useTelemetry(calculatorSlug: string) {
  const fieldFocusTime = useRef<Record<string, number>>({})
  const fieldChangeCounts = useRef<Record<string, number>>({})
  const outputViewStart = useRef<number | null>(null)
  const hasEmittedOpen = useRef(false)

  // Emit calculator_opened once per mount
  useEffect(() => {
    if (!hasEmittedOpen.current) {
      hasEmittedOpen.current = true
      telemetryClient.emit({
        event_type: 'calculator_opened',
        calculator_slug: calculatorSlug,
      })
    }
    return () => {
      // Emit output_viewed on unmount if output was being viewed
      if (outputViewStart.current) {
        telemetryClient.emit({
          event_type: 'output_viewed',
          calculator_slug: calculatorSlug,
          output_view_duration_ms: Date.now() - outputViewStart.current,
        })
        outputViewStart.current = null
      }
    }
  }, [calculatorSlug])

  const onFieldFocus = useCallback((fieldName: string) => {
    fieldFocusTime.current[fieldName] = Date.now()
  }, [])

  const onFieldBlur = useCallback((fieldName: string) => {
    // Clear focus time on blur — onFieldChange captures the duration
    delete fieldFocusTime.current[fieldName]
  }, [])

  const onFieldChange = useCallback((fieldName: string, value: number | string) => {
    const focusStart = fieldFocusTime.current[fieldName]
    const timeOnField = focusStart ? Date.now() - focusStart : undefined
    fieldChangeCounts.current[fieldName] = (fieldChangeCounts.current[fieldName] || 0) + 1

    telemetryClient.emit({
      event_type: 'field_changed',
      calculator_slug: calculatorSlug,
      field_name: fieldName,
      field_value: typeof value === 'number' ? value : parseFloat(value) || undefined,
      time_on_field_ms: timeOnField,
      change_count_in_session: fieldChangeCounts.current[fieldName],
    })
  }, [calculatorSlug])

  const onCalculationRun = useCallback((
    inputs: Record<string, number | string>,
    output: Record<string, unknown>,
  ) => {
    outputViewStart.current = Date.now()
    telemetryClient.emit({
      event_type: 'calculation_run',
      calculator_slug: calculatorSlug,
      input_snapshot: inputs as Record<string, number>,
      output_snapshot: output,
    })
  }, [calculatorSlug])

  return { onFieldFocus, onFieldBlur, onFieldChange, onCalculationRun }
}