'use client'

import { Clock, MessageSquare, GitCommit, User } from 'lucide-react'
import { DocumentScore } from '../types'
import { cn, getScoreBadgeColor, getScoreRiskLevel, formatScore } from '../lib/utils'

interface SearchResultRowProps {
  document: DocumentScore
  onClick?: (document: DocumentScore) => void
  className?: string
}

export function SearchResultRow({ document, onClick, className }: SearchResultRowProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(document)
    }
  }

  return (
    <div 
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {document.title}
            </h3>
            <div className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
              getScoreBadgeColor(document.overallScore)
            )}>
              {formatScore(document.overallScore)} - {getScoreRiskLevel(document.overallScore)}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {document.path}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{document.owner}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Updated {document.lastUpdated}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{document.slackQuestions} questions</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitCommit className="h-4 w-4" />
              <span>{document.codeChanges} changes</span>
            </div>
          </div>

          {document.reasons.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="text-xs font-medium text-gray-700 mb-1">
                Why this score?
              </div>
              <ul className="space-y-1">
                {document.reasons.slice(0, 2).map((reason, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>{reason}</span>
                  </li>
                ))}
                {document.reasons.length > 2 && (
                  <li className="text-xs text-gray-500 italic">
                    +{document.reasons.length - 2} more reason{document.reasons.length - 2 > 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="ml-4 text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatScore(document.overallScore)}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Staleness Score
          </div>
        </div>
      </div>
    </div>
  )
}