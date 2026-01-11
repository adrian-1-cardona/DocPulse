import { DocumentScore, DocumentMetrics, Report } from '../types'

/**
 * Analytics and reporting engine
 */
export class ReportingEngine {
  /**
   * Generate comprehensive metrics from documents
   */
  static generateMetrics(documents: DocumentScore[]): DocumentMetrics {
    const metrics: DocumentMetrics = {
      totalDocuments: documents.length,
      totalByDocType: {},
      totalByTeam: {},
      averageStalenessScore: 0,
      scoreDistribution: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        excellent: 0
      },
      documentsWithoutOwner: 0,
      documentsNeverReviewed: 0,
      signalBreakdown: {}
    }

    if (documents.length === 0) {
      return metrics
    }

    let totalScore = 0

    documents.forEach(doc => {
      // Count by doc type
      const docType = (doc as any).metadata?.docType || 'Other'
      metrics.totalByDocType[docType] = (metrics.totalByDocType[docType] || 0) + 1

      // Count by team
      const team = (doc as any).metadata?.team || 'Unknown'
      metrics.totalByTeam[team] = (metrics.totalByTeam[team] || 0) + 1

      // Accumulate score
      totalScore += doc.overallScore

      // Score distribution
      if (doc.overallScore >= 80) metrics.scoreDistribution.critical++
      else if (doc.overallScore >= 60) metrics.scoreDistribution.high++
      else if (doc.overallScore >= 40) metrics.scoreDistribution.medium++
      else if (doc.overallScore >= 20) metrics.scoreDistribution.low++
      else metrics.scoreDistribution.excellent++

      // Check for missing owner
      if (!doc.owner || doc.owner === 'Unassigned') {
        metrics.documentsWithoutOwner++
      }

      // Check for never reviewed
      const lastReviewedAt = (doc as any).metadata?.lastReviewedAt
      if (!lastReviewedAt) {
        metrics.documentsNeverReviewed++
      }

      // Count signals
      const signals = (doc as any).signals || []
      signals.forEach((signal: any) => {
        const key = signal.type
        metrics.signalBreakdown[key] = (metrics.signalBreakdown[key] || 0) + 1
      })
    })

    metrics.averageStalenessScore = Math.round(totalScore / documents.length)

    return metrics
  }

  /**
   * Generate team health metrics
   */
  static generateTeamMetrics(
    documents: DocumentScore[],
    teams: string[]
  ): Record<string, DocumentMetrics> {
    const teamMetrics: Record<string, DocumentMetrics> = {}

    teams.forEach(team => {
      const teamDocs = documents.filter(doc => (doc as any).metadata?.team === team)
      teamMetrics[team] = this.generateMetrics(teamDocs)
    })

    return teamMetrics
  }

  /**
   * Generate actionable recommendations
   */
  static generateRecommendations(metrics: DocumentMetrics): string[] {
    const recommendations: string[] = []

    // Based on score distribution
    if (metrics.scoreDistribution.critical > 0) {
      recommendations.push(
        `🔴 ${metrics.scoreDistribution.critical} document(s) in critical condition - require immediate attention`
      )
    }

    if (metrics.scoreDistribution.high > 0) {
      recommendations.push(
        `🟠 ${metrics.scoreDistribution.high} document(s) have high staleness - prioritize for review`
      )
    }

    // Based on ownership
    if (metrics.documentsWithoutOwner > 0) {
      const percent = Math.round((metrics.documentsWithoutOwner / metrics.totalDocuments) * 100)
      recommendations.push(
        `👤 ${percent}% of documents lack clear ownership - assign owners to enable accountability`
      )
    }

    // Based on review status
    if (metrics.documentsNeverReviewed > 0) {
      recommendations.push(
        `📋 ${metrics.documentsNeverReviewed} document(s) have never been formally reviewed - conduct initial reviews`
      )
    }

    // Based on signals
    const missingOwnerCount = metrics.signalBreakdown['MISSING_OWNER'] || 0
    if (missingOwnerCount > 0) {
      recommendations.push(
        `⚠️ Priority: Assign owners to ${missingOwnerCount} unowned document(s)`
      )
    }

    const staleReviewCount = metrics.signalBreakdown['STALE_LAST_REVIEW'] || 0
    if (staleReviewCount > 0) {
      recommendations.push(
        `📅 Schedule reviews for ${staleReviewCount} document(s) that haven't been reviewed in 180+ days`
      )
    }

    // If everything looks good
    if (recommendations.length === 0) {
      recommendations.push('✅ Documentation health is good - maintain current review schedule')
    }

    return recommendations
  }

  /**
   * Export metrics as CSV
   */
  static metricsToCSV(metrics: DocumentMetrics, teamName?: string): string {
    const lines: string[] = []

    const header = teamName ? `${teamName} - Documentation Metrics` : 'Documentation Metrics'
    lines.push(header)
    lines.push('')

    // Summary section
    lines.push('SUMMARY')
    lines.push(`Total Documents,${metrics.totalDocuments}`)
    lines.push(`Average Staleness Score,${metrics.averageStalenessScore}`)
    lines.push(`Documents Without Owner,${metrics.documentsWithoutOwner}`)
    lines.push(`Documents Never Reviewed,${metrics.documentsNeverReviewed}`)
    lines.push('')

    // Distribution section
    lines.push('SCORE DISTRIBUTION')
    lines.push(`Critical (80-100),${metrics.scoreDistribution.critical}`)
    lines.push(`High (60-79),${metrics.scoreDistribution.high}`)
    lines.push(`Medium (40-59),${metrics.scoreDistribution.medium}`)
    lines.push(`Low (20-39),${metrics.scoreDistribution.low}`)
    lines.push(`Excellent (0-19),${metrics.scoreDistribution.excellent}`)
    lines.push('')

    // By type
    lines.push('BY DOCUMENT TYPE')
    Object.entries(metrics.totalByDocType).forEach(([type, count]) => {
      lines.push(`${type},${count}`)
    })
    lines.push('')

    // By team
    lines.push('BY TEAM')
    Object.entries(metrics.totalByTeam).forEach(([team, count]) => {
      lines.push(`${team},${count}`)
    })
    lines.push('')

    // Signals
    if (Object.keys(metrics.signalBreakdown).length > 0) {
      lines.push('SIGNAL BREAKDOWN')
      Object.entries(metrics.signalBreakdown).forEach(([signal, count]) => {
        lines.push(`${signal},${count}`)
      })
    }

    return lines.join('\n')
  }

  /**
   * Export metrics as JSON
   */
  static metricsToJSON(metrics: DocumentMetrics): string {
    return JSON.stringify(metrics, null, 2)
  }

  /**
   * Generate report object
   */
  static generateReport(
    documents: DocumentScore[],
    userId: string,
    type: 'metrics' | 'compliance' | 'team_health' = 'metrics'
  ): Report {
    const metrics = this.generateMetrics(documents)
    const teamMetrics: Record<string, DocumentMetrics> = {}

    // Get unique teams
    const teams = [...new Set(
      documents.map(d => (d as any).metadata?.team || 'Unknown')
    )]

    teams.forEach(team => {
      const teamDocs = documents.filter(d => (d as any).metadata?.team === team)
      teamMetrics[team] = this.generateMetrics(teamDocs)
    })

    return {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${type.replace('_', ' ').toUpperCase()} Report - ${new Date().toLocaleDateString()}`,
      type,
      description: `Generated ${type} report for ${documents.length} documents`,
      generatedAt: new Date().toISOString(),
      generatedBy: userId,
      format: 'json',
      metrics,
      teamBreakdown: teamMetrics,
      recommendations: this.generateRecommendations(metrics)
    }
  }
}
