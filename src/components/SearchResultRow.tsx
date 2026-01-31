'use client'

import { Clock, MessageSquare, GitCommit, ChevronRight } from 'lucide-react'
import { DocumentScore } from '../types'
import { cn, getScoreRiskLevel, formatScore } from '../lib/utils'

interface SearchResultRowProps {
  document: DocumentScore
  onClick?: (document: DocumentScore) => void
  className?: string
}

export function SearchResultRow({ document, onClick, className }: SearchResultRowProps) {
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-amber-500'
    if (score >= 40) return 'bg-blue-500'
    return 'bg-emerald-500'
  }

  const getScoreStyle = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50'
    if (score >= 60) return 'text-amber-600 bg-amber-50'
    if (score >= 40) return 'text-blue-600 bg-blue-50'
    return 'text-emerald-600 bg-emerald-50'
  }

  return (
    <div 
      className={cn(
        'group flex items-center gap-4 p-3 -mx-2 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors',
        className
      )}
      onClick={() => onClick?.(document)}
    >
      <div className={cn('w-1.5 h-10 rounded-full shrink-0', getStatusColor(document.overallScore))} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-zinc-900 truncate">
            {document.title}
          </h3>
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', getScoreStyle(document.overallScore))}>
            {getScoreRiskLevel(document.overallScore)}
          </span>
        </div>
        <p className="text-xs text-zinc-500 truncate mb-1.5 font-mono">
          {document.path}
        </p>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {document.lastUpdated}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {document.slackQuestions}
          </span>
          <span className="flex items-center gap-1">
            <GitCommit className="h-3 w-3" />
            {document.codeChanges}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-lg font-semibold text-zinc-900">{formatScore(document.overallScore)}</div>
        <div className="text-[10px] text-zinc-400 uppercase tracking-wide">Score</div>
      </div>

      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </div>
  )
}