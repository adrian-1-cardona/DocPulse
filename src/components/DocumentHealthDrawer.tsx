'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, MessageSquare, GitCommit, Clock, User, Folder } from 'lucide-react'
import { DocumentScore, ScoreBreakdown } from '../types'
import { StalenessGauge } from './StalenessGauge'
import { FactorBreakdownCard } from './FactorBreakdownCard'
import { RecommendedActionsCard } from './RecommendedActionsCard'
import { getScoreRiskLevel } from '../lib/utils'

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
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <Dialog.Title className="text-base font-semibold text-zinc-900">
                  {document.title}
                </Dialog.Title>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  {document.path}
                </p>
              </div>
              <Dialog.Close className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{document.owner}</span>
              <span className="flex items-center gap-1"><Folder className="h-3 w-3" />{document.category}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{document.lastUpdated}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Score */}
            <div className="flex justify-center py-4">
              <StalenessGauge score={document.overallScore} size="lg" />
            </div>

            {/* Reasons */}
            <div className="bg-zinc-50 rounded-lg p-4">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">Why this score</h3>
              <ul className="space-y-2">
                {document.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-zinc-700 flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-zinc-200 text-zinc-600 text-xs flex items-center justify-center shrink-0 font-medium">
                      {index + 1}
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <RecommendedActionsCard recommendations={document.recommendations} priority={priority} />
            <FactorBreakdownCard breakdown={breakdown} />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs text-zinc-500">Slack Questions</span>
                </div>
                <div className="text-xl font-semibold text-zinc-900">{document.slackQuestions}</div>
                <div className="text-[10px] text-zinc-400">Last 30 days</div>
              </div>
              <div className="bg-zinc-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <GitCommit className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs text-zinc-500">Code Changes</span>
                </div>
                <div className="text-xl font-semibold text-zinc-900">{document.codeChanges}</div>
                <div className="text-[10px] text-zinc-400">Related commits</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-zinc-200">
              <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors">
                Edit Document
              </button>
              <button className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors">
                View History
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}