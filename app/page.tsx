'use client'

import { useState } from 'react'
import { Search, FileText, TrendingUp, Clock, Upload } from 'lucide-react'
import { StalenessGauge } from '../src/components/StalenessGauge'
import { FactorBreakdownCard } from '../src/components/FactorBreakdownCard'
import { RecommendedActionsCard } from '../src/components/RecommendedActionsCard'
import { TeamHealthDashboard } from '../src/components/TeamHealthDashboard'
import { SearchResultRow } from '../src/components/SearchResultRow'
import { DocumentHealthDrawer } from '../src/components/DocumentHealthDrawer'
import { DocumentUploadModal, ExportImportControls, MVPBanner } from '../src/components'
import { mockDocuments, mockTeamHealth, mockScoreBreakdown } from '../src/data/mock'
import { DocumentScore, DocumentIngestionRequest } from '../src/types'

export default function Home() {
  const [documents, setDocuments] = useState<DocumentScore[]>(mockDocuments)
  const [selectedDocument, setSelectedDocument] = useState<DocumentScore | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.path.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUploadDocuments = (ingestionRequests: DocumentIngestionRequest[]) => {
    try {
      // Add documents with basic metadata
      const newDocs = ingestionRequests.map((req, idx) => ({
        id: `doc-${Date.now()}-${idx}`,
        title: req.metadata.title,
        path: `/docs/${req.metadata.docType.toLowerCase()}/${req.metadata.title.toLowerCase().replace(/\s+/g, '-')}`,
        owner: req.metadata.owner || 'Unassigned',
        category: req.metadata.docType.toLowerCase(),
        lastUpdated: new Date().toISOString().split('T')[0],
        overallScore: Math.floor(Math.random() * 30) + 60, // 60-90
        stabilityScore: 80,
        codeAlignmentScore: 75,
        infoDemandScore: 85,
        ownershipScore: 70,
        reasons: ['Recently added', 'Metadata provided'],
        recommendations: ['Review content for accuracy'],
        slackQuestions: 0,
        codeChanges: 0
      } as DocumentScore))
      const updated = [...documents, ...newDocs]
      setDocuments(updated)
      
      setToast({
        message: `✓ ${newDocs.length} document${newDocs.length !== 1 ? 's' : ''} added to dashboard`,
        type: 'success'
      })
      setTimeout(() => setToast(null), 4000)
    } catch (error) {
      setToast({
        message: `✗ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleImportWorkspace = (imported: DocumentScore[]) => {
    try {
      setDocuments(imported)
      setToast({
        message: `✓ Imported ${imported.length} documents from workspace`,
        type: 'success'
      })
      setTimeout(() => setToast(null), 4000)
    } catch (error) {
      setToast({
        message: `✗ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const overallStats = {
    totalDocs: documents.length,
    averageScore: documents.length > 0 ? Math.round(documents.reduce((acc, doc) => acc + doc.overallScore, 0) / documents.length) : 0,
    highRiskDocs: documents.filter(doc => doc.overallScore >= 80).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MVP Banner */}
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                DocPulse Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <ExportImportControls documents={documents} onImport={handleImportWorkspace} />
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
                <div className="text-sm text-gray-600">Average Health Score</div>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <TeamHealthDashboard teams={mockTeamHealth} />
          </div>
          <div className="space-y-6">
            {documents.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <StalenessGauge score={documents[0].overallScore} size="lg" />
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">Featured Document</h3>
                  <p className="text-sm text-gray-600 mt-1">{documents[0].title}</p>
                </div>
              </div>
            )}
            <RecommendedActionsCard 
              recommendations={documents.length > 0 ? documents[0].recommendations.slice(0, 2) : []}
              priority="high"
            />
          </div>
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
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <SearchResultRow
                    key={doc.id}
                    document={doc}
                    onClick={setSelectedDocument}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No documents found. Try uploading some!</p>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown for featured document */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FactorBreakdownCard breakdown={mockScoreBreakdown} />
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documentation Tips
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Keep documentation synchronized with code</li>
                  <li>✓ Assign clear ownership and maintenance windows</li>
                  <li>✓ Include working examples and use cases</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Maintenance Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Schedule regular review cycles</li>
                  <li>✓ Update when code changes occur</li>
                  <li>✓ Respond to team questions promptly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Health Drawer */}
      <DocumentHealthDrawer
        document={selectedDocument}
        breakdown={mockScoreBreakdown}
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadDocuments}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-40">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
