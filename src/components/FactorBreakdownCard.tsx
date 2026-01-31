'use client'

import { ScoreBreakdown } from '../types'
import { cn } from '../lib/utils'

interface FactorBreakdownCardProps {
  breakdown: ScoreBreakdown
  className?: string
}

export function FactorBreakdownCard({ breakdown, className }: FactorBreakdownCardProps) {
  const factors = [
    { name: 'Stability', score: breakdown.stability.score, weight: breakdown.stability.weight, description: breakdown.stability.description },
    { name: 'Code Alignment', score: breakdown.codeAlignment.score, weight: breakdown.codeAlignment.weight, description: breakdown.codeAlignment.description },
    { name: 'Info Demand', score: breakdown.infoDemand.score, weight: breakdown.infoDemand.weight, description: breakdown.infoDemand.description },
    { name: 'Ownership', score: breakdown.ownership.score, weight: breakdown.ownership.weight, description: breakdown.ownership.description }
  ]

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-amber-500'
    if (score >= 40) return 'bg-blue-500'
    return 'bg-emerald-500'
  }

  const getScoreStyle = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-amber-600'
    if (score >= 40) return 'text-blue-600'
    return 'text-emerald-600'
  }

  return (
    <div className={cn('bg-white border border-zinc-200 rounded-lg', className)}>
      <div className="p-5 border-b border-zinc-100">
        <h3 className="text-sm font-medium text-zinc-900">Score Breakdown</h3>
      </div>
      
      <div className="p-5 space-y-5">
        {factors.map((factor) => (
          <div key={factor.name}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-zinc-900">{factor.name}</span>
                <span className="text-xs text-zinc-400 ml-2">{Math.round(factor.weight * 100)}%</span>
              </div>
              <span className={cn('text-sm font-semibold', getScoreStyle(factor.score))}>
                {Math.round(factor.score)}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-1.5">
              <div 
                className={cn('h-full rounded-full transition-all', getBarColor(factor.score))}
                style={{ width: `${factor.score}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}