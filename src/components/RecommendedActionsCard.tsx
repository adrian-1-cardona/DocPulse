'use client'

import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

interface RecommendedActionsCardProps {
  recommendations: string[]
  priority?: 'high' | 'medium' | 'low'
  className?: string
}

export function RecommendedActionsCard({ 
  recommendations, 
  priority = 'medium', 
  className 
}: RecommendedActionsCardProps) {
  const config = {
    high: { icon: AlertCircle, label: 'High Priority', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
    medium: { icon: Clock, label: 'Recommended', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
    low: { icon: CheckCircle, label: 'Suggested', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' }
  }[priority]

  const Icon = config.icon

  return (
    <div className={cn('bg-white border border-zinc-200 rounded-lg', className)}>
      <div className="p-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', config.color)} />
          <h3 className="text-sm font-medium text-zinc-900">{config.label}</h3>
        </div>
      </div>

      <div className="p-4">
        {recommendations.length === 0 ? (
          <div className={cn('p-3 rounded-md border', config.bg, config.border)}>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-emerald-700">No actions needed</span>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-zinc-600">
                <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', config.dot)} />
                {rec}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}