'use client'

import { ScoreBreakdown } from '../types'
import { cn, getScoreColor } from '../lib/utils'

interface FactorBreakdownCardProps {
  breakdown: ScoreBreakdown
  className?: string
}

export function FactorBreakdownCard({ breakdown, className }: FactorBreakdownCardProps) {
  const factors = [
    {
      name: 'Stability Score',
      score: breakdown.stability.score,
      weight: breakdown.stability.weight,
      description: breakdown.stability.description,
      factors: breakdown.stability.factors
    },
    {
      name: 'Code Alignment',
      score: breakdown.codeAlignment.score,
      weight: breakdown.codeAlignment.weight,
      description: breakdown.codeAlignment.description,
      factors: breakdown.codeAlignment.factors
    },
    {
      name: 'Info Demand',
      score: breakdown.infoDemand.score,
      weight: breakdown.infoDemand.weight,
      description: breakdown.infoDemand.description,
      factors: breakdown.infoDemand.factors
    },
    {
      name: 'Ownership',
      score: breakdown.ownership.score,
      weight: breakdown.ownership.weight,
      description: breakdown.ownership.description,
      factors: breakdown.ownership.factors
    }
  ]

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Score Breakdown
      </h3>
      
      <div className="space-y-6">
        {factors.map((factor) => (
          <div key={factor.name} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{factor.name}</h4>
                <span className="text-sm text-gray-500">
                  (Weight: {Math.round(factor.weight * 100)}%)
                </span>
              </div>
              <div className={cn('text-lg font-bold', getScoreColor(factor.score))}>
                {Math.round(factor.score)}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {factor.description}
            </p>
            
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Contributing Factors:
              </div>
              <ul className="space-y-1">
                {factor.factors.map((item, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}