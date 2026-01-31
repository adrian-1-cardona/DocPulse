'use client'

import { useState } from 'react'
import { Search, FileText, ArrowUpRight, AlertCircle } from 'lucide-react'
import { StalenessGauge } from '../src/components/StalenessGauge'
import { FactorBreakdownCard } from '../src/components/FactorBreakdownCard'
import { RecommendedActionsCard } from '../src/components/RecommendedActionsCard'
import { TeamHealthDashboard } from '../src/components/TeamHealthDashboard'
import { SearchResultRow } from '../src/components/SearchResultRow'
import { DocumentHealthDrawer } from '../src/components/DocumentHealthDrawer'
import { ExportImportControls } from '../src/components'
import { mockDocuments, mockTeamHealth, mockScoreBreakdown } from '../src/data/mock'
import { DocumentScore } from '../src/types'

export default function Home() {
  const [documents, setDocuments] = useState<DocumentScore[]>(mockDocuments)
  const [selectedDocument, setSelectedDocument] = useState<DocumentScore | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.path.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleImportWorkspace = (imported: DocumentScore[]) => {
    try {
      setDocuments(imported)
      setToast({
        message: `Imported ${imported.length} documents`,
        type: 'success'
      })
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      setToast({
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      })
      setTimeout(() => setToast(null), 3000)
    }
  }

  const overallStats = {
    totalDocs: documents.length,
    averageScore: documents.length > 0 ? Math.round(documents.reduce((acc, doc) => acc + doc.overallScore, 0) / documents.length) : 0,
    highRiskDocs: documents.filter(doc => doc.overallScore >= 80).length,
    healthyDocs: documents.filter(doc => doc.overallScore < 40).length
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-zinc-900">DocPulse</span>
            </div>
            <ExportImportControls documents={documents} onImport={handleImportWorkspace} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Documents</div>
            <div className="text-2xl font-semibold text-zinc-900">{overallStats.totalDocs}</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Healthy</div>
            <div className="text-2xl font-semibold text-emerald-600">{overallStats.healthyDocs}</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Avg Score</div>
            <div className="text-2xl font-semibold text-zinc-900">{overallStats.averageScore}</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
              <span>High Risk</span>
              {overallStats.highRiskDocs > 0 && <AlertCircle className="h-3 w-3 text-red-500" />}
            </div>
            <div className="text-2xl font-semibold text-red-600">{overallStats.highRiskDocs}</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <TeamHealthDashboard teams={mockTeamHealth} />
          </div>
          <div className="space-y-6">
            {documents.length > 0 && (
              <div className="bg-white border border-zinc-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-zinc-900">Top Priority</h3>
                  <button 
                    onClick={() => setSelectedDocument(documents[0])}
                    className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex justify-center mb-4">
                  <StalenessGauge score={documents[0].overallScore} size="lg" />
                </div>
                <p className="text-sm text-zinc-600 text-center">{documents[0].title}</p>
              </div>
            )}
            <RecommendedActionsCard 
              recommendations={documents.length > 0 ? documents[0].recommendations.slice(0, 2) : []}
              priority="high"
            />
          </div>
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="bg-white border border-zinc-200 rounded-lg">
            <div className="p-4 border-b border-zinc-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-zinc-900">All Documents</h2>
                <span className="text-xs text-zinc-500">{filteredDocuments.length} results</span>
              </div>
              {filteredDocuments.length > 0 ? (
                <div className="space-y-2">
                  {filteredDocuments.map((doc) => (
                    <SearchResultRow
                      key={doc.id}
                      document={doc}
                      onClick={setSelectedDocument}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-zinc-500">No documents found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FactorBreakdownCard breakdown={mockScoreBreakdown} />
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-900 mb-5">Quick Tips</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-medium text-zinc-700 uppercase tracking-wide mb-2">Best Practices</h4>
                <ul className="space-y-1.5">
                  <li className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full mt-2 shrink-0"></span>
                    Keep documentation synchronized with code
                  </li>
                  <li className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full mt-2 shrink-0"></span>
                    Assign clear ownership
                  </li>
                  <li className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full mt-2 shrink-0"></span>
                    Include working examples
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-zinc-700 uppercase tracking-wide mb-2">Maintenance</h4>
                <ul className="space-y-1.5">
                  <li className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full mt-2 shrink-0"></span>
                    Schedule regular review cycles
                  </li>
                  <li className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full mt-2 shrink-0"></span>
                    Update when code changes
                  </li>
                  <li className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full mt-2 shrink-0"></span>
                    Respond to questions promptly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DocumentHealthDrawer
        document={selectedDocument}
        breakdown={mockScoreBreakdown}
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
