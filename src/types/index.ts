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