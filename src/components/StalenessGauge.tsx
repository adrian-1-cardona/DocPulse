'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn, getScoreColor, getScoreRiskLevel } from '../lib/utils'

interface StalenessGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StalenessGauge({ score, size = 'md', className }: StalenessGaugeProps) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ]

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24', 
    lg: 'h-32 w-32'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const getScoreColorFill = (score: number): string => {
    if (score >= 80) return '#dc2626' // red-600
    if (score >= 60) return '#d97706' // yellow-600  
    if (score >= 40) return '#2563eb' // blue-600
    return '#16a34a' // green-600
  }

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={450}
              innerRadius="60%"
              outerRadius="90%"
              dataKey="value"
              stroke="none"
            >
              <Cell fill={getScoreColorFill(score)} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', getScoreColor(score), textSizeClasses[size])}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      <div className={cn('mt-1 text-center', textSizeClasses[size])}>
        <div className="font-medium text-gray-900">Staleness Score</div>
        <div className={cn('text-xs', getScoreColor(score))}>
          {getScoreRiskLevel(score)}
        </div>
      </div>
    </div>
  )
}