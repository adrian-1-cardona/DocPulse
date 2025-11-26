'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { DocumentScore, ScoreBreakdown } from '../types'
import { StalenessGauge } from './StalenessGauge'
import { FactorBreakdownCard } from './FactorBreakdownCard'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { cn, getScoreRiskLevel } from '../lib/utils'

interface DocumentHealthDrawerProps {
  document: DocumentScore | null
  breakdown: ScoreBreakdown | null
  isOpen: boolean
  onClose: () => void
}

export function DocumentHealthDrawer({ 
  document, 
  breakdown, 
  isOpen, 
  onClose 
}: DocumentHealthDrawerProps) {
  if (!document || !breakdown) return null

  const priority = document.overallScore >= 80 ? 'high' : 
                  document.overallScore >= 60 ? 'medium' : 'low'

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Dialog.Title className="text-xl font-semibold text-gray-900 mb-1">
                  {document.title}
                </Dialog.Title>
                <p className="text-sm text-gray-600">
                  {document.path}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Owner: {document.owner}</span>
                  <span>Category: {document.category}</span>
                  <span>Updated: {document.lastUpdated}</span>
                </div>
              </div>
              <Dialog.Close className="ml-4 text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </Dialog.Close>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Score Overview */}
            <div className="text-center">
              <StalenessGauge score={document.overallScore} size="lg" />
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Documentation Risk Assessment
                </h2>
                <p className="text-gray-600 mt-1">
                  This document has a <span className="font-semibold">
                    {getScoreRiskLevel(document.overallScore).toLowerCase()}
                  </span> staleness score of {Math.round(document.overallScore)}
                </p>
              </div>
            </div>

            {/* Main Reasons */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Why this score?
              </h3>
              <ul className="space-y-2">
                {document.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <RecommendedActionsCard 
              recommendations={document.recommendations}
              priority={priority}
            />

            {/* Score Breakdown */}
            <FactorBreakdownCard breakdown={breakdown} />

            {/* Additional Context */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {document.slackQuestions}
                </div>
                <div className="text-sm text-blue-800">
                  Slack questions (30 days)
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {document.codeChanges}
                </div>
                <div className="text-sm text-purple-800">
                  Related code changes
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Edit Document
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                  View History
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                  Assign Owner
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}