// src/pages/Calculator.tsx — SECTION TO ADD
// ============================================================
// This shows EXACTLY where ValcrScore slots into the calculator page.
// Do not replace your whole Calculator.tsx — just find the output section
// and add the ValcrScore component in the right position.
//
// Layout order AFTER calculation output is shown:
//   1. Calculator results (your existing output cards)
//   2. Context/explanation text (your existing description)
//   3. ValcrScore ← ADD HERE (below explanation, above benchmarks)
//   4. BenchmarkGate → BenchmarkBadge (Pro benchmarks, existing)
//   5. Related calculators (existing)
//
// WHY THIS ORDER:
//   - Output first: the user got what they came for
//   - Explanation: they understand what the number means
//   - ValcrScore: they see how this fits their overall health (the hook)
//   - Benchmark: Pro users see detailed comparison (the retention value)
//
// The score is the bridge between "I ran a calculation" and "I need Pro."
// ============================================================

// ── Add this import to Calculator.tsx ─────────────────────────────────────
// import { ValcrScore } from '@/components/ValcrScore'
// import { BenchmarkBadge, BenchmarkGate } from '@/components/BenchmarkBadge'

// ── Add this in your JSX, AFTER the output cards and explanation ───────────

/*
{hasOutput && (
  <div className="mt-8 space-y-4">

    {/* ── Valcr Score — shows for all registered users ── *\/}
    <div>
      <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">
        Your Business Health
      </p>
      <ValcrScore />
    </div>

    {/* ── Benchmark comparison — Pro only ── *\/}
    <div>
      <p className="text-xs font-mono text-ink-600 uppercase tracking-widest mb-3">
        How You Compare
      </p>
      <BenchmarkGate isPro={isPro}>
        <BenchmarkBadge
          calculatorSlug={calc.slug}
          outputs={outputs}
          inputs={inputs}
          primaryMetricKey={calc.primaryOutput}
        />
      </BenchmarkGate>
    </div>

  </div>
)}
*/

// ── The positioning explained simply ──────────────────────────────────────
//
// FREE USER sees:
//   [Output: 24.3% net margin]
//   [Explanation: "This means for every $100 in revenue..."]
//   [Valcr Score: 58 — C+ — Above median fundamentals]
//   [Lock icon: "See breakdown + per-metric benchmarks → Pro $9/mo"]
//
// PRO USER sees:
//   [Output: 24.3% net margin]
//   [Explanation: "This means for every $100 in revenue..."]
//   [Valcr Score: 58 — full breakdown with 5 metrics]
//   [Benchmark badge: "Your net margin is in the 62nd percentile"]
//
// The free experience creates desire. The pro experience satisfies it.
// Nothing is hidden that shouldn't be. Nothing is revealed that devalues Pro.
