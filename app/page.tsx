'use client'

import { useState } from 'react'
import { Search, FileText, Users, TrendingUp, Clock } from 'lucide-react'
import { StalenessGauge } from '../src/components/StalenessGauge'
import { FactorBreakdownCard } from '../src/components/FactorBreakdownCard'
import { RecommendedActionsCard } from '../src/components/RecommendedActionsCard'
import { TeamHealthDashboard } from '../src/components/TeamHealthDashboard'
import { SearchResultRow } from '../src/components/SearchResultRow'
import { DocumentHealthDrawer } from '../src/components/DocumentHealthDrawer'
import { QueueManagement } from '../src/components/QueueManagement'
import { mockDocuments, mockTeamHealth, mockScoreBreakdown, mockWaitingList } from '../src/data/mock'
import { DocumentScore } from '../src/types'

export default function Home() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentScore | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'proposal' | 'dashboard'>('proposal')

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.path.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const overallStats = {
    totalDocs: mockDocuments.length,
    averageScore: Math.round(mockDocuments.reduce((acc, doc) => acc + doc.overallScore, 0) / mockDocuments.length),
    highRiskDocs: mockDocuments.filter(doc => doc.overallScore >= 80).length,
    pendingRequests: mockWaitingList.length,
    urgentItems: mockWaitingList.filter(item => item.priority === 'urgent').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Staleness Score v2
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('proposal')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'proposal'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Proposal
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </div>
      </header>

      {activeTab === 'proposal' ? (
        // Proposal Content
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <div className="text-xs text-gray-500 mb-2">📄 INTERNAL PROPOSAL</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Staleness Score v2 — A Robust, Accurate, and Explainable Documentation Health Signal
              </h1>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Author:</strong> Engineering Productivity Team<br/>
                  <strong>Date:</strong> November 26, 2025<br/>
                  <strong>Status:</strong> Proposal (Draft)
                </div>
                <div>
                  <strong>Audience:</strong> Eng Productivity, Docs Infra,<br/>
                  Knowledge Base Owners, DX, Search Team
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Documentation freshness is critical to product velocity, onboarding, and reducing avoidable confusion. 
                Our current MVP Staleness Score provides a simple directional indicator but suffers from several known 
                limitations: misleading recency assumptions, noisy signals, gaming risk, difficulty mapping code → docs, 
                and ambiguous Slack references.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                This proposal introduces <strong>Staleness Score v2</strong>, a calibrated, multi-signal, explainable, 
                and noise-resistant model designed to accurately measure documentation staleness while avoiding false 
                incentives or negative team culture.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">The revised scoring model:</h3>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>✓ Reduces noise & false positives</li>
                  <li>✓ Eliminates perverse incentives</li>
                  <li>✓ Detects true content risk rather than update recency</li>
                  <li>✓ Is fully explainable with breakdowns</li>
                  <li>✓ Scales automatically and is privacy-safe</li>
                  <li>✓ Is friendly to teams and maintainers</li>
                </ul>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Primary Goals</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Provide a reliable, interpretable signal for documentation risk</li>
                    <li>• Reduce time spent on stale, inaccurate, or misleading docs</li>
                    <li>• Help teams prioritize doc maintenance with real impact</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secondary Goals</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Improve trust in internal documentation</li>
                    <li>• Improve onboarding quality and reduce "tribal knowledge"</li>
                    <li>• Guide search ranking away from risky docs</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Staleness Score v2 — Model Overview</h2>
              <p className="text-gray-700 mb-4">
                Staleness Score v2 solves the above issues through a four-component scoring model:
              </p>
              
              <div className="bg-gray-100 rounded-lg p-6 mb-6 font-mono text-sm">
                <div className="font-semibold mb-2">Final Formula</div>
                <div className="text-gray-800">
                  Staleness Score = 100 – (<br/>
                  &nbsp;&nbsp;0.4 * StabilityScore +<br/>
                  &nbsp;&nbsp;0.3 * CodeAlignmentScore +<br/>
                  &nbsp;&nbsp;0.2 * InfoDemandScore +<br/>
                  &nbsp;&nbsp;0.1 * OwnershipConfidenceScore<br/>
                  ) * 100
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. The Tech Stack</h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-3">Frontend (Stripe-style dashboard + doc UI)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-purple-800 mb-2">Core Choices</div>
                    <ul className="space-y-1 text-purple-700">
                      <li>• Framework: Next.js (React, App Router)</li>
                      <li>• Language: TypeScript</li>
                      <li>• Styling: Tailwind CSS + component library</li>
                      <li>• Charts: Recharts</li>
                      <li>• State: React Query / Server Components</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-purple-800 mb-2">Key UI Components</div>
                    <ul className="space-y-1 text-purple-700 text-xs">
                      <li>• DocumentHealthDrawer</li>
                      <li>• StalenessGauge (RadialBar)</li>
                      <li>• FactorBreakdownCard</li>
                      <li>• RecommendedActionsCard</li>
                      <li>• TeamHealthDashboard</li>
                      <li>• SearchResultRow with staleness pill</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dashboard Content
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{overallStats.totalDocs}</div>
                  <div className="text-sm text-gray-600">Total Documents</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{overallStats.averageScore}</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{overallStats.highRiskDocs}</div>
                  <div className="text-sm text-gray-600">High Risk Docs</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{overallStats.pendingRequests}</div>
                  <div className="text-sm text-gray-600">Pending Requests</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <TeamHealthDashboard teams={mockTeamHealth} />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <StalenessGauge score={mockDocuments[0].overallScore} size="lg" />
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">Featured Document</h3>
                  <p className="text-sm text-gray-600 mt-1">{mockDocuments[0].title}</p>
                </div>
              </div>
              <RecommendedActionsCard 
                recommendations={mockDocuments[0].recommendations.slice(0, 2)}
                priority="high"
              />
            </div>
          </div>

          {/* Queue Management Section */}
          <div className="mb-8">
            <QueueManagement items={mockWaitingList} />
          </div>

          {/* Search & Results */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Documentation Health Results ({filteredDocuments.length})
                </h3>
                {filteredDocuments.map((doc) => (
                  <SearchResultRow
                    key={doc.id}
                    document={doc}
                    onClick={setSelectedDocument}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown for featured document */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FactorBreakdownCard breakdown={mockScoreBreakdown} />
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Success Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Leading Indicators</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reduction in Slack confusion clusters</li>
                    <li>• Increase in doc update quality</li>
                    <li>• Faster onboarding cycle times</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Lagging Indicators</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Higher internal search satisfaction</li>
                    <li>• Reduction in doc-linked incident reviews</li>
                    <li>• Improved knowledge retention across teams</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Health Drawer */}
      <DocumentHealthDrawer
        document={selectedDocument}
        breakdown={mockScoreBreakdown}
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  )
}
