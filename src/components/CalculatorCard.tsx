import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Calculator } from '@/calculators'
import clsx from 'clsx'

interface CalculatorCardProps {
  calculator: Calculator
  className?: string
  compact?: boolean
}

export function CalculatorCard({ calculator, className, compact = false }: CalculatorCardProps) {
  return (
    <Link
      to={`/calculators/${calculator.slug}`}
      className={clsx(
        'group card-hover block p-3 sm:p-5',
        'relative overflow-hidden',
        className
      )}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${calculator.color}, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-xl mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${calculator.color}18`, border: `1px solid ${calculator.color}30` }}
      >
        {calculator.icon}
      </div>

      {/* Name — always visible */}
      <h3 className="font-display font-700 text-ink-50 text-xs sm:text-sm leading-snug mb-1">
        {calculator.shortName}
      </h3>

      {/* Tagline — hidden on mobile to save space */}
      {!compact && (
        <p className="text-ink-400 text-xs leading-relaxed line-clamp-2 mb-2 hidden sm:block">
          {calculator.tagline}
        </p>
      )}

      {/* Arrow — always show on mobile as affordance */}
      <div className="flex items-center justify-end mt-1">
        <ArrowRight
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink-600 group-hover:text-acid group-hover:translate-x-0.5 transition-all duration-200"
        />
      </div>
    </Link>
  )
}