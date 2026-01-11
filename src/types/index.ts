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

export interface WaitingListItem {
  id: string
  title: string
  assignee?: string
  requestedBy: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  requestDate: string
  estimatedHours: number
  category: 'update' | 'review' | 'migration' | 'new'
  stalenessScore?: number
  description: string
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

// ===== ENTERPRISE TYPES =====

// User & Authentication
export type UserRole = 'admin' | 'editor' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLogin?: string
}

export interface AuthContext {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

// Access Control & Permissions
export interface DocumentAccess {
  documentId: string
  userId: string
  role: 'owner' | 'editor' | 'viewer'
  grantedAt: string
  grantedBy: string
}

export interface AccessPolicy {
  id: string
  name: string
  description: string
  rules: AccessRule[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AccessRule {
  resource: 'document' | 'team' | 'workspace'
  action: 'read' | 'write' | 'delete' | 'share' | 'export'
  allowedRoles: UserRole[]
  conditions?: Record<string, any>
}

// Document Versioning & History
export interface DocumentVersion {
  id: string
  documentId: string
  versionNumber: number
  title: string
  content?: string
  metadata: DocumentMetadata
  createdBy: string
  createdAt: string
  changeDescription?: string
  isCurrentVersion: boolean
}

export interface DocumentChangeLog {
  id: string
  documentId: string
  action: 'created' | 'updated' | 'deleted' | 'restored' | 'shared' | 'ownership_changed'
  changedBy: string
  changedAt: string
  previousValue?: any
  newValue?: any
  reason?: string
}

// Audit & Compliance
export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: 'document' | 'user' | 'access' | 'workspace'
  resourceId: string
  resourceName: string
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failure'
  errorMessage?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface ComplianceReport {
  id: string
  name: string
  generatedAt: string
  generatedBy: string
  period: {
    start: string
    end: string
  }
  metrics: {
    totalDocuments: number
    averageStalenessScore: number
    documentsWithoutOwner: number
    accessViolations: number
    unauthorizedAccesses: number
    dataExportCount: number
  }
  findings: string[]
}

// File Upload Validation & Security
export interface FileValidationConfig {
  maxFileSizeBytes: number
  allowedMimeTypes: string[]
  allowedExtensions: string[]
  scanForMalware: boolean
  requireVirusSignature: boolean
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  metadata: {
    detectedMimeType: string
    estimatedSize: number
    scanResults?: Record<string, any>
  }
}

// Batch Operations
export interface BatchOperation {
  id: string
  type: 'bulk_update' | 'bulk_delete' | 'bulk_export' | 'bulk_import'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  itemCount: number
  processedCount: number
  failedCount: number
  startedAt: string
  completedAt?: string
  createdBy: string
  errors?: BatchOperationError[]
}

export interface BatchOperationError {
  itemId: string
  itemName: string
  error: string
}

// Advanced Search & Filtering
export interface SearchFilter {
  field: 'title' | 'owner' | 'team' | 'system' | 'docType' | 'criticality' | 'status'
  operator: 'equals' | 'contains' | 'startsWith' | 'in' | 'range' | 'exists'
  value: any
}

export interface SearchQuery {
  text?: string
  filters: SearchFilter[]
  sortBy?: 'relevance' | 'lastUpdated' | 'overallScore' | 'title'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface SearchResult {
  documents: DocumentScore[]
  totalCount: number
  executionTimeMs: number
  facets?: Record<string, Record<string, number>>
}

// Reporting & Analytics
export interface DocumentMetrics {
  totalDocuments: number
  totalByDocType: Record<string, number>
  totalByTeam: Record<string, number>
  averageStalenessScore: number
  scoreDistribution: {
    critical: number // 80-100
    high: number // 60-79
    medium: number // 40-59
    low: number // 20-39
    excellent: number // 0-19
  }
  documentsWithoutOwner: number
  documentsNeverReviewed: number
  signalBreakdown: Record<string, number>
}

export interface Report {
  id: string
  name: string
  type: 'metrics' | 'compliance' | 'team_health' | 'custom'
  description?: string
  generatedAt: string
  generatedBy: string
  format: 'pdf' | 'csv' | 'json'
  metrics: DocumentMetrics
  teamBreakdown?: Record<string, DocumentMetrics>
  recommendations: string[]
}

// Integration & API
export interface IntegrationConnector {
  id: string
  type: 'confluence' | 'notion' | 'github' | 'gdrive' | 'slack' | 'custom'
  name: string
  status: 'connected' | 'disconnected' | 'error'
  credentials?: Record<string, any> // encrypted in practice
  config: IntegrationConfig
  lastSyncAt?: string
  syncInterval?: number // minutes
  createdBy: string
  createdAt: string
}

export interface IntegrationConfig {
  enabled: boolean
  autoSync: boolean
  mappings: {
    sourceField: string
    targetField: string
  }[]
  filters?: Record<string, any>
}

export interface SyncJob {
  id: string
  connectorId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  itemsProcessed: number
  itemsFailed: number
  errors?: string[]
}

// Workspace & Settings
export interface WorkspaceSettings {
  id: string
  name: string
  logo?: string
  description?: string
  members: User[]
  defaultTeams: string[]
  defaultSystems: string[]
  securityPolicy: SecurityPolicy
  retentionPolicy: RetentionPolicy
  createdAt: string
  updatedAt: string
}

export interface SecurityPolicy {
  requireMFA: boolean
  sessionTimeout: number
  allowedDomains: string[]
  passwordMinLength: number
  passwordRequireSpecialChar: boolean
  dataEncryptionEnabled: boolean
}

export interface RetentionPolicy {
  deleteUnusedDocsAfterDays: number
  keepVersionsCount: number
  archiveOldDocsAfterDays: number
  auditLogRetentionDays: number
}

// Notifications & Alerts
export interface Notification {
  id: string
  userId: string
  type: 'document_update' | 'access_request' | 'ownership_change' | 'compliance_issue'
  title: string
  message: string
  link?: string
  readAt?: string
  createdAt: string
}

export interface AlertRule {
  id: string
  name: string
  enabled: boolean
  condition: {
    field: string
    operator: string
    value: any
  }
  action: 'notify' | 'report' | 'escalate'
  recipients: string[]
  createdBy: string
  createdAt: string
}
