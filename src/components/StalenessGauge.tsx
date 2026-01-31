'use client'

import { cn, getScoreRiskLevel } from '../lib/utils'

interface StalenessGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StalenessGauge({ score, size = 'md', className }: StalenessGaugeProps) {
  const sizeConfig = {
    sm: { ring: 48, stroke: 4, text: 'text-sm', label: 'text-[10px]' },
    md: { ring: 64, stroke: 5, text: 'text-lg', label: 'text-xs' },
    lg: { ring: 88, stroke: 6, text: 'text-2xl', label: 'text-xs' }
  }

  const config = sizeConfig[size]
  const radius = (config.ring - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    if (score >= 40) return { stroke: '#3b82f6', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
    return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  }

  const colors = getColor(score)

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        <svg width={config.ring} height={config.ring} className="-rotate-90">
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={config.stroke}
          />
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold', colors.text, config.text)}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      <div className={cn('mt-2 px-2 py-0.5 rounded text-center', colors.bg, colors.border, 'border', config.label)}>
        <span className={cn('font-medium', colors.text)}>{getScoreRiskLevel(score)}</span>
      </div>
    </div>
  )
}