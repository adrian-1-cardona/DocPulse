'use client'

import { useState } from 'react'
import { Calendar, Filter, Search, Plus, BarChart3, Users } from 'lucide-react'
import { WaitingLists } from './WaitingLists'
import { QuickActions } from './QuickActions'
import { WaitingListItem } from '../types'

interface QueueManagementProps {
  items: WaitingListItem[]
  className?: string
}

export function QueueManagement({ items, className }: QueueManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'score'>('priority')
  const [selectedItem, setSelectedItem] = useState<WaitingListItem | null>(null)

  // Filter and sort logic
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      } else if (sortBy === 'date') {
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      } else if (sortBy === 'score') {
        return (b.stalenessScore || 0) - (a.stalenessScore || 0)
      }
      return 0
    })

  // Calculate analytics
  const analytics = {
    totalItems: items.length,
    averageWaitTime: Math.round(items.reduce((acc, item) => {
      const daysSinceRequest = Math.floor((Date.now() - new Date(item.requestDate).getTime()) / (1000 * 60 * 60 * 24))
      return acc + daysSinceRequest
    }, 0) / items.length),
    totalEstimatedHours: items.reduce((acc, item) => acc + item.estimatedHours, 0),
    assignedItems: items.filter(item => item.assignee).length
  }

  // Action handlers
  const handleAssign = (itemId: string, assignee: string) => {
    console.log(`Assigning ${itemId} to ${assignee}`)
    // In a real app, this would update the item
  }

  const handlePriorityChange = (itemId: string, priority: WaitingListItem['priority']) => {
    console.log(`Changing priority of ${itemId} to ${priority}`)
    // In a real app, this would update the item
  }

  const handleStatusUpdate = (itemId: string, status: string) => {
    console.log(`Updating status of ${itemId} to ${status}`)
    // In a real app, this would update the item
  }

  return (
    <div className={className}>
      {/* Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-700">{analytics.totalItems}</div>
              <div className="text-sm text-blue-600">Total Requests</div>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-700">{analytics.assignedItems}</div>
              <div className="text-sm text-green-600">Assigned</div>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-700">{analytics.totalEstimatedHours}h</div>
              <div className="text-sm text-purple-600">Est. Hours</div>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-700">{analytics.averageWaitTime}</div>
              <div className="text-sm text-orange-600">Avg Wait Days</div>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Priority Filter */}
            <select 
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              <option value="update">Updates</option>
              <option value="review">Reviews</option>
              <option value="migration">Migrations</option>
              <option value="new">New Docs</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'score')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="priority">Sort by Priority</option>
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </button>
        </div>

        {/* Active Filters */}
        {(selectedPriority !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {selectedPriority !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Priority: {selectedPriority}
                  <button 
                    onClick={() => setSelectedPriority('all')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >×</button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >×</button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredItems.length} of {items.length} requests
          </div>
          <WaitingLists 
            items={filteredItems} 
            selectedItem={selectedItem}
            onItemSelect={setSelectedItem}
          />
        </div>
        
        <div className="lg:col-span-1">
          <QuickActions
            selectedItem={selectedItem}
            onAssign={handleAssign}
            onPriorityChange={handlePriorityChange}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  )
}