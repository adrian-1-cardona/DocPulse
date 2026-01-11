import { DocumentScore, DocumentIngestionRequest, DocumentMetadata, DocumentSignal, IngestedDocument } from '../types'

/**
 * Generate signals for a document based on its metadata
 * These signals indicate potential staleness/risk factors
 */
export function generateDocumentSignals(metadata: DocumentMetadata, fileMetadata?: { lastModifiedDate: Date }): DocumentSignal[] {
  const signals: DocumentSignal[] = []
  const now = new Date()
  const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000

  // MISSING_OWNER
  if (!metadata.owner) {
    signals.push({
      type: 'MISSING_OWNER',
      severity: 3,
      evidence: 'No owner assigned — accountability unclear'
    })
  }

  // STALE_LAST_REVIEW
  if (metadata.lastReviewedAt) {
    const reviewDate = new Date(metadata.lastReviewedAt)
    const daysOld = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld > 180) {
      signals.push({
        type: 'STALE_LAST_REVIEW',
        severity: Math.max(1, Math.min(5, Math.floor(daysOld / 60))) as 1 | 2 | 3 | 4 | 5,
        evidence: `Last reviewed ${Math.floor(daysOld)} days ago`
      })
    }
  }

  // UNREVIEWED_DOC
  if (!metadata.lastReviewedAt) {
    signals.push({
      type: 'UNREVIEWED_DOC',
      severity: 4,
      evidence: 'No review date recorded — freshness unknown'
    })
  }

  // HIGH_CHANGE_PRESSURE
  if ((metadata.releasesSinceReview || 0) > 5) {
    signals.push({
      type: 'HIGH_CHANGE_PRESSURE',
      severity: Math.min(5, metadata.releasesSinceReview!) as 1 | 2 | 3 | 4 | 5,
      evidence: `${metadata.releasesSinceReview} releases since last review`
    })
  }

  // LOW_CONFIDENCE_METADATA
  const defaultedFields = [
    !metadata.owner,
    !metadata.lastReviewedAt,
    (metadata.views30d === 0 || metadata.views30d === undefined),
    (metadata.releasesSinceReview === 0 || metadata.releasesSinceReview === undefined)
  ].filter(Boolean).length

  if (defaultedFields >= 3) {
    signals.push({
      type: 'LOW_CONFIDENCE_METADATA',
      severity: 2,
      evidence: `${defaultedFields} fields with default/missing values — low confidence in scoring`
    })
  }

  return signals
}

/**
 * Compute staleness score based on Staleness Score v2 formula
 * Formula: 100 - (0.4*Stability + 0.3*CodeAlignment + 0.2*InfoDemand + 0.1*Ownership)
 */
export function computeStalenessScore(
  metadata: DocumentMetadata,
  signals: DocumentSignal[]
): {
  overallScore: number
  stabilityScore: number
  codeAlignmentScore: number
  infoDemandScore: number
  ownershipScore: number
} {
  // Base stability: age of last review
  let stabilityScore = 100
  if (metadata.lastReviewedAt) {
    const reviewDate = new Date(metadata.lastReviewedAt)
    const daysOld = (new Date().getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)
    stabilityScore = Math.max(0, 100 - daysOld * 0.5) // Decreases 0.5 points per day
  } else {
    stabilityScore = 30 // Unreviewed docs start very low
  }

  // Code alignment: based on releases since review
  let codeAlignmentScore = 100
  const releaseCount = metadata.releasesSinceReview || 0
  codeAlignmentScore = Math.max(0, 100 - releaseCount * 15) // Each release = -15 points

  // Info demand: based on views in last 30 days
  let infoDemandScore = 100
  const views = metadata.views30d || 0
  if (views > 0) {
    infoDemandScore = Math.min(100, views * 2) // High demand = higher score
  } else {
    infoDemandScore = 50 // No views = medium concern
  }

  // Ownership: based on owner presence
  let ownershipScore = metadata.owner ? 100 : 40

  // Apply signal penalties
  signals.forEach(signal => {
    const penalty = signal.severity * 5 // Each severity level = 5 points deduction
    switch (signal.type) {
      case 'MISSING_OWNER':
        ownershipScore = Math.max(0, ownershipScore - penalty)
        break
      case 'STALE_LAST_REVIEW':
      case 'UNREVIEWED_DOC':
        stabilityScore = Math.max(0, stabilityScore - penalty)
        break
      case 'HIGH_CHANGE_PRESSURE':
        codeAlignmentScore = Math.max(0, codeAlignmentScore - penalty)
        break
      case 'LOW_CONFIDENCE_METADATA':
        stabilityScore = Math.max(0, stabilityScore - penalty * 0.5)
        break
    }
  })

  // Normalize scores to 0-100
  stabilityScore = Math.max(0, Math.min(100, stabilityScore))
  codeAlignmentScore = Math.max(0, Math.min(100, codeAlignmentScore))
  infoDemandScore = Math.max(0, Math.min(100, infoDemandScore))
  ownershipScore = Math.max(0, Math.min(100, ownershipScore))

  // Compute overall score (lower is better — less stale)
  const overallScore = 100 - (
    0.4 * stabilityScore +
    0.3 * codeAlignmentScore +
    0.2 * infoDemandScore +
    0.1 * ownershipScore
  )

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    stabilityScore,
    codeAlignmentScore,
    infoDemandScore,
    ownershipScore
  }
}

/**
 * Convert an ingestion request into a full DocumentScore with signals
 */
export function ingestDocument(
  request: DocumentIngestionRequest,
  existingDocs: DocumentScore[] = []
): IngestedDocument {
  const { file, metadata } = request
  const signals = generateDocumentSignals(metadata, {
    lastModifiedDate: new Date(file.lastModified)
  })
  const scores = computeStalenessScore(metadata, signals)

  const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const now = new Date().toISOString()

  // Map criticality to risk level and generate reasons/recommendations
  const criticalityLevel = metadata.criticality
  const hasHighRisk = criticalityLevel >= 4 && scores.overallScore >= 60
  const hasOwner = !!metadata.owner
  const isReviewed = !!metadata.lastReviewedAt

  const reasons: string[] = []
  if (scores.overallScore >= 70) reasons.push('High staleness risk detected')
  if (!hasOwner) reasons.push('No owner assigned')
  if (!isReviewed) reasons.push('Never formally reviewed')
  if (signals.length > 0) reasons.push(`${signals.length} potential issue${signals.length !== 1 ? 's' : ''} identified`)

  const recommendations: string[] = []
  if (!hasOwner) recommendations.push('Assign a document owner for accountability')
  if (!isReviewed) recommendations.push('Schedule a comprehensive review session')
  if (scores.overallScore >= 70) recommendations.push('Consider prioritizing this doc for updates')
  if (metadata.releasesSinceReview && metadata.releasesSinceReview > 5) {
    recommendations.push(`Update to reflect ${metadata.releasesSinceReview} recent releases`)
  }

  return {
    id,
    title: metadata.title,
    path: metadata.sourceFile || file.name,
    ...scores,
    owner: metadata.owner || 'Unassigned',
    category: mapDocTypeToCategory(metadata.docType),
    lastUpdated: new Date(file.lastModified).toISOString().split('T')[0],
    reasons: reasons.length > 0 ? reasons : ['Document ingested successfully'],
    recommendations,
    slackQuestions: 0,
    codeChanges: metadata.releasesSinceReview || 0,
    metadata,
    signals,
    recentlyAdded: true,
    addedAt: now
  }
}

function mapDocTypeToCategory(docType: string): any {
  const map: Record<string, any> = {
    'Runbook': 'guide',
    'API': 'api-docs',
    'Design': 'architecture',
    'Onboarding': 'guide',
    'RFC': 'architecture',
    'Playbook': 'guide'
  }
  return map[docType] || 'guide'
}

/**
 * Export workspace (all documents) as JSON
 */
export function exportWorkspace(documents: DocumentScore[]): string {
  const workspace = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    documentCount: documents.length,
    documents: documents
  }
  return JSON.stringify(workspace, null, 2)
}

/**
 * Import workspace from JSON and validate
 */
export function importWorkspace(jsonString: string): DocumentScore[] {
  try {
    const workspace = JSON.parse(jsonString)
    if (!workspace.documents || !Array.isArray(workspace.documents)) {
      throw new Error('Invalid workspace format: missing documents array')
    }
    return workspace.documents as DocumentScore[]
  } catch (error) {
    throw new Error(`Failed to import workspace: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
