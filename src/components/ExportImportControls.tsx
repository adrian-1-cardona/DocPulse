'use client'

import { Download, Upload } from 'lucide-react'
import { DocumentScore } from '../types'
import { exportWorkspace, importWorkspace } from '../lib/ingestion'

interface ExportImportControlsProps {
  documents: DocumentScore[]
  onImport: (documents: DocumentScore[]) => void
}

export function ExportImportControls({ documents, onImport }: ExportImportControlsProps) {
  const handleExport = () => {
    const jsonString = exportWorkspace(documents)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-pulse-workspace-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
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
        onClick={handleExport}
        className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        title="Export workspace as JSON"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Export</span>
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
