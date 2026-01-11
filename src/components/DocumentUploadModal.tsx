'use client'

import { useState, useRef } from 'react'
import { X, Upload, CheckCircle2 } from 'lucide-react'
import { DocumentIngestionRequest, DocumentMetadata, ExtractedFileMetadata } from '../types'
import { cn } from '../lib/utils'

interface DocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (documents: DocumentIngestionRequest[]) => void
}

const TEAMS = ['Platform', 'Backend', 'Frontend', 'DevOps', 'Data', 'Security', 'DX']
const SYSTEMS = ['Core API', 'Auth', 'Database', 'Cache', 'Search', 'Analytics', 'CI/CD']
const DOC_TYPES = ['Runbook', 'API', 'Design', 'Onboarding', 'RFC', 'Playbook'] as const
const CRITICALITIES = [1, 2, 3, 4, 5]

type Stage = 'files' | 'metadata' | 'confirm'

export function DocumentUploadModal({ isOpen, onClose, onSubmit }: DocumentUploadModalProps) {
  const [stage, setStage] = useState<Stage>('files')
  const [uploadedFiles, setUploadedFiles] = useState<ExtractedFileMetadata[]>([])
  const [metadataMap, setMetadataMap] = useState<Record<string, Partial<DocumentMetadata>>>({})
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      fileName: file.name,
      fileSize: file.size,
      lastModified: new Date(file.lastModified).toLocaleDateString(),
      lastModifiedDate: new Date(file.lastModified),
      _file: file
    }))

    setUploadedFiles(prev => [...prev, ...newFiles as any])

    // Initialize metadata for new files
    const newMetadata: Record<string, Partial<DocumentMetadata>> = {}
    newFiles.forEach((f: any) => {
      const titleFromFile = f.fileName.replace(/\.[^/.]+$/, '')
      newMetadata[f.fileName] = {
        title: titleFromFile,
        team: '',
        system: '',
        docType: undefined,
        criticality: 3,
        views30d: 0,
        releasesSinceReview: 0,
        sourceFile: f.fileName,
        uploadedAt: new Date().toISOString()
      }
    })

    setMetadataMap(prev => ({ ...prev, ...newMetadata }))
  }

  const updateMetadata = (fileName: string, field: keyof DocumentMetadata, value: any) => {
    setMetadataMap(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }))
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.fileName !== fileName))
    setMetadataMap(prev => {
      const newMap = { ...prev }
      delete newMap[fileName]
      return newMap
    })
  }

  const canProceedToMetadata = uploadedFiles.length > 0

  const canProceedToConfirm = uploadedFiles.every(file => {
    const meta = metadataMap[file.fileName]
    return (
      meta?.title &&
      meta?.team &&
      meta?.system &&
      meta?.docType &&
      meta?.criticality
    )
  })

  const handleSubmit = () => {
    const documents: DocumentIngestionRequest[] = uploadedFiles.map(file => {
      const fileObj = (file as any)._file as File
      return {
        file: fileObj,
        metadata: metadataMap[file.fileName] as DocumentMetadata
      }
    })
    onSubmit(documents)
    reset()
  }

  const reset = () => {
    setStage('files')
    setUploadedFiles([])
    setMetadataMap({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
            <p className="text-xs text-gray-500 mt-1">Stage {stage === 'files' ? '1' : stage === 'metadata' ? '2' : '3'} of 3</p>
          </div>
          <button
            onClick={reset}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {stage === 'files' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Drag files here or click to select
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports PDF, MD, TXT, DOCX (multiple files)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.md,.txt,.docx"
              />

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Files ({uploadedFiles.length})
                  </p>
                  {uploadedFiles.map(file => (
                    <div
                      key={file.fileName}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.fileSize / 1024).toFixed(1)} KB • Modified {file.lastModified}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(file.fileName)}
                        className="ml-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {stage === 'metadata' && (
            <div className="space-y-6">
              {uploadedFiles.map(file => {
                const meta = metadataMap[file.fileName] || {}
                return (
                  <div key={file.fileName} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-4">{file.fileName}</p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={meta.title || ''}
                          onChange={(e) => updateMetadata(file.fileName, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Document title"
                        />
                      </div>

                      {/* Team */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Team *
                        </label>
                        <select
                          value={meta.team || ''}
                          onChange={(e) => updateMetadata(file.fileName, 'team', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Select team</option>
                          {TEAMS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* System */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          System *
                        </label>
                        <select
                          value={meta.system || ''}
                          onChange={(e) => updateMetadata(file.fileName, 'system', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Select system</option>
                          {SYSTEMS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Doc Type */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Doc Type *
                        </label>
                        <select
                          value={meta.docType || ''}
                          onChange={(e) => updateMetadata(file.fileName, 'docType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Select type</option>
                          {DOC_TYPES.map(dt => (
                            <option key={dt} value={dt}>{dt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Criticality */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Criticality *
                        </label>
                        <select
                          value={meta.criticality || 3}
                          onChange={(e) => updateMetadata(file.fileName, 'criticality', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          {CRITICALITIES.map(c => (
                            <option key={c} value={c}>
                              {c} {c === 5 ? '(Critical)' : c === 1 ? '(Low)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Owner (optional) */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Owner (optional)
                        </label>
                        <input
                          type="text"
                          value={meta.owner || ''}
                          onChange={(e) => updateMetadata(file.fileName, 'owner', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g., john@company.com"
                        />
                      </div>

                      {/* Last Reviewed (optional) */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Last Reviewed (optional)
                        </label>
                        <input
                          type="date"
                          value={meta.lastReviewedAt || ''}
                          onChange={(e) => updateMetadata(file.fileName, 'lastReviewedAt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>

                      {/* Views (optional) */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Views (30d)
                        </label>
                        <input
                          type="number"
                          value={meta.views30d || 0}
                          onChange={(e) => updateMetadata(file.fileName, 'views30d', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              <p className="text-xs text-gray-500">* = Required field</p>
            </div>
          )}

          {stage === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Ready to add {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Files will be processed locally and added to your dashboard.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Documents to be ingested:</p>
                {uploadedFiles.map(file => {
                  const meta = metadataMap[file.fileName]
                  return (
                    <div key={file.fileName} className="text-xs bg-gray-50 p-3 rounded">
                      <p className="font-medium text-gray-900">{meta?.title}</p>
                      <p className="text-gray-600 mt-1">
                        {meta?.team} • {meta?.system} • {meta?.docType}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          <button
            onClick={() => {
              if (stage === 'metadata') setStage('files')
              else if (stage === 'confirm') setStage('metadata')
            }}
            disabled={stage === 'files'}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex space-x-3">
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>

            {stage === 'files' && (
              <button
                onClick={() => setStage('metadata')}
                disabled={!canProceedToMetadata}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            )}

            {stage === 'metadata' && (
              <button
                onClick={() => setStage('confirm')}
                disabled={!canProceedToConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review
              </button>
            )}

            {stage === 'confirm' && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Add to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
