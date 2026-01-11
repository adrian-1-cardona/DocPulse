'use client'

import { Upload, FileText } from 'lucide-react'
import { useState } from 'react'
import { DocumentScore } from '../types'
import { importWorkspace, exportWorkspaceToPDF } from '../lib/ingestion'

interface ExportImportControlsProps {
  documents: DocumentScore[]
  onImport: (documents: DocumentScore[]) => void
}

export function ExportImportControls({ documents, onImport }: ExportImportControlsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false)

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true)
      await exportWorkspaceToPDF(documents)
    } catch (error) {
      alert(`✗ PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExportingPDF(false)
    }
  }

  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string
            const imported = importWorkspace(jsonString)
            onImport(imported)
            alert(`✓ Imported ${imported.length} documents`)
          } catch (error) {
            alert(`✗ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleExportPDF}
        disabled={isExportingPDF}
        className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export workspace as PDF with detailed analysis"
      >
        <FileText className="h-3.5 w-3.5" />
        <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
      </button>
      <button
        onClick={handleImportClick}
        className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        title="Import workspace from JSON"
      >
        <Upload className="h-3.5 w-3.5" />
        <span>Import</span>
      </button>
    </div>
  )
}
