'use client'

import { CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react'
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
  const priorityConfig = {
    high: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'High Priority Actions'
    },
    medium: {
      icon: Clock,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Recommended Actions'
    },
    low: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Suggested Improvements'
    }
  }

  const config = priorityConfig[priority]
  const Icon = config.icon

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon className={cn('h-5 w-5', config.iconColor)} />
        <h3 className="text-lg font-semibold text-gray-900">
          {config.title}
        </h3>
      </div>

      {recommendations.length === 0 ? (
        <div className={cn('rounded-lg p-4', config.bgColor, config.borderColor, 'border')}>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">
              No immediate actions required. Keep up the great work!
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={cn(
                'rounded-full p-1 mt-0.5',
                config.bgColor,
                config.borderColor,
                'border'
              )}>
                <div className={cn('w-2 h-2 rounded-full', config.iconColor.replace('text-', 'bg-'))} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {recommendation}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              <span>Contact your team lead or documentation owner for implementation guidance</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}