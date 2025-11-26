'use client'

import { useState } from 'react'
import { Clock, User, Tag, Calendar, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { WaitingListItem } from '../types'

interface QuickActionsProps {
  selectedItem: WaitingListItem | null
  onAssign: (itemId: string, assignee: string) => void
  onPriorityChange: (itemId: string, priority: WaitingListItem['priority']) => void
  onStatusUpdate: (itemId: string, status: 'started' | 'completed' | 'blocked') => void
  className?: string
}

export function QuickActions({ 
  selectedItem, 
  onAssign, 
  onPriorityChange, 
  onStatusUpdate, 
  className 
}: QuickActionsProps) {
  const [assignee, setAssignee] = useState('')
  
  if (!selectedItem) {
    return (
      <div className={`bg-gray-50 rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No item selected</h3>
        <p className="text-sm text-gray-400">
          Click on any waiting list item to see quick actions
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const priorityColors = {
    urgent: 'text-red-600 bg-red-50 border-red-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      {/* Selected Item Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {selectedItem.title}
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Requested by {selectedItem.requestedBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(selectedItem.requestDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{selectedItem.estimatedHours} hours estimated</span>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Change Priority
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['urgent', 'high', 'medium', 'low'] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => onPriorityChange(selectedItem.id, priority)}
              className={`px-3 py-2 text-xs font-medium rounded border capitalize transition-colors ${
                selectedItem.priority === priority
                  ? priorityColors[priority]
                  : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign to Team Member
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder={selectedItem.assignee || 'Enter name...'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={() => {
              if (assignee.trim()) {
                onAssign(selectedItem.id, assignee.trim())
                setAssignee('')
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Assign
          </button>
        </div>
        {selectedItem.assignee && (
          <p className="mt-2 text-sm text-gray-600">
            Currently assigned to: <span className="font-medium">{selectedItem.assignee}</span>
          </p>
        )}
      </div>

      {/* Status Actions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Status Updates
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onStatusUpdate(selectedItem.id, 'started')}
            className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-4 w-4" />
              <span className="font-medium">Start Work</span>
            </div>
          </button>

          <button
            onClick={() => onStatusUpdate(selectedItem.id, 'completed')}
            className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Mark Complete</span>
            </div>
          </button>

          <button
            onClick={() => onStatusUpdate(selectedItem.id, 'blocked')}
            className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Mark Blocked</span>
            </div>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      {selectedItem.stalenessScore && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              High staleness score: {selectedItem.stalenessScore}
            </span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            This documentation issue may be affecting user productivity
          </p>
        </div>
      )}
    </div>
  )
}