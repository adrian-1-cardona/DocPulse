'use client'

import { Clock, AlertTriangle, CheckCircle2, User, Calendar } from 'lucide-react'
import { cn, getScoreBadgeColor, getScoreRiskLevel } from '../lib/utils'

interface WaitingListItem {
  id: string
  title: string
  assignee?: string
  requestedBy: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  requestDate: string
  estimatedHours: number
  category: 'update' | 'review' | 'migration' | 'new'
  stalenessScore?: number
  description: string
}

interface WaitingListsProps {
  items: WaitingListItem[]
  selectedItem?: WaitingListItem | null
  onItemSelect?: (item: WaitingListItem) => void
  className?: string
}

const priorityConfig = {
  urgent: {
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle
  },
  high: {
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Clock
  },
  medium: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Clock
  },
  low: {
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle2
  }
}

const categoryConfig = {
  update: { label: 'Update', color: 'bg-blue-100 text-blue-800' },
  review: { label: 'Review', color: 'bg-purple-100 text-purple-800' },
  migration: { label: 'Migration', color: 'bg-indigo-100 text-indigo-800' },
  new: { label: 'New Doc', color: 'bg-green-100 text-green-800' }
}

export function WaitingLists({ items, selectedItem, onItemSelect, className }: WaitingListsProps) {
  // Group items by priority
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.priority]) {
      acc[item.priority] = []
    }
    acc[item.priority].push(item)
    return acc
  }, {} as Record<string, WaitingListItem[]>)

  const priorityOrder: Array<keyof typeof priorityConfig> = ['urgent', 'high', 'medium', 'low']

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Documentation Waiting Lists
          </h3>
          <p className="text-sm text-gray-600">
            Prioritized queue of documentation tasks ({items.length} items)
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          Add Request
        </button>
      </div>

      <div className="space-y-6">
        {priorityOrder.map((priority) => {
          const priorityItems = groupedItems[priority] || []
          if (priorityItems.length === 0) return null

          const config = priorityConfig[priority]
          const Icon = config.icon

          return (
            <div key={priority} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Icon className={cn('h-4 w-4', config.textColor)} />
                <h4 className={cn('font-medium capitalize', config.textColor)}>
                  {priority} Priority ({priorityItems.length})
                </h4>
              </div>

              <div className="space-y-2">
                {priorityItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemSelect?.(item)}
                    className={cn(
                      'border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer',
                      config.bgColor,
                      config.borderColor,
                      selectedItem?.id === item.id && 'ring-2 ring-blue-500 ring-offset-2'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={cn('w-2 h-2 rounded-full', config.color)} />
                          <h5 className="font-medium text-gray-900 truncate">
                            {item.title}
                          </h5>
                          <div className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                            categoryConfig[item.category].color
                          )}>
                            {categoryConfig[item.category].label}
                          </div>
                          {item.stalenessScore && (
                            <div className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                              getScoreBadgeColor(item.stalenessScore)
                            )}>
                              Score: {item.stalenessScore}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>Requested by {item.requestedBy}</span>
                          </div>
                          {item.assignee && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Assigned to {item.assignee}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(item.requestDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.estimatedHours}h estimated</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col space-y-2">
                        <button className="px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded border hover:bg-gray-50 transition-colors">
                          Assign
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              All caught up!
            </h4>
            <p className="text-gray-600">
              No pending documentation requests at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">
              {groupedItems.urgent?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Urgent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {groupedItems.high?.length || 0}
            </div>
            <div className="text-xs text-gray-500">High</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {groupedItems.medium?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Medium</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {groupedItems.low?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Low</div>
          </div>
        </div>
      </div>
    </div>
  )
}