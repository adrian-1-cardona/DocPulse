'use client'

import { Upload, Download } from 'lucide-react'
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
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
          } catch (error) {
            alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportPDF}
        disabled={isExportingPDF}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        {isExportingPDF ? 'Exporting...' : 'Export'}
      </button>
      <button
        onClick={handleImportClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
      >
        <Upload className="h-3.5 w-3.5" />
        Import
      </button>
    </div>
  )
}
