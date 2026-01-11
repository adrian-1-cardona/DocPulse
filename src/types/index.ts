export interface DocumentScore {
  id: string
  title: string
  path: string
  overallScore: number
  stabilityScore: number
  codeAlignmentScore: number
  infoDemandScore: number
  ownershipScore: number
  lastUpdated: string
  owner: string
  category: 'runbook' | 'architecture' | 'glossary' | 'api-docs' | 'guide'
  reasons: string[]
  recommendations: string[]
  slackQuestions: number
  codeChanges: number
}

export interface TeamHealthSummary {
  teamName: string
  totalDocs: number
  averageScore: number
  highRiskDocs: number
  mediumRiskDocs: number
  lowRiskDocs: number
  excellentDocs: number
}

export interface ScoreBreakdown {
  stability: {
    score: number
    weight: 0.4
    description: string
    factors: string[]
  }
  codeAlignment: {
    score: number
    weight: 0.3
    description: string
    factors: string[]
  }
  infoDemand: {
    score: number
    weight: 0.2
    description: string
    factors: string[]
  }
  ownership: {
    score: number
    weight: 0.1
    description: string
    factors: string[]
  }
}

// Upload & Ingestion Types
export interface DocumentSignal {
  type: 'MISSING_OWNER' | 'STALE_LAST_REVIEW' | 'UNREVIEWED_DOC' | 'HIGH_CHANGE_PRESSURE' | 'LOW_CONFIDENCE_METADATA'
  severity: 1 | 2 | 3 | 4 | 5
  evidence: string
}

export interface DocumentMetadata {
  title: string
  team: string
  system: string
  docType: 'Runbook' | 'API' | 'Design' | 'Onboarding' | 'RFC' | 'Playbook'
  criticality: 1 | 2 | 3 | 4 | 5
  owner?: string
  lastReviewedAt?: string
  views30d?: number
  releasesSinceReview?: number
  sourceFile?: string
  uploadedAt?: string
}

export interface DocumentIngestionRequest {
  file: File
  metadata: DocumentMetadata
}

export interface ExtractedFileMetadata {
  fileName: string
  fileSize: number
  lastModified: string
  lastModifiedDate: Date
}

export interface IngestedDocument extends DocumentScore {
  metadata: DocumentMetadata
  signals: DocumentSignal[]
  recentlyAdded: boolean
  addedAt: string
}
