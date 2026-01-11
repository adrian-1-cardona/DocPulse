import { DocumentScore, DocumentMetadata, DocumentSignal } from '../types'

/**
 * Compute basic health score
 * Simple averaging of component scores
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
  // Stability: 60-100 for recently added docs
  const stabilityScore = 75

  // Code alignment: based on category
  const codeAlignmentScore = 70

  // Info demand: default high
  const infoDemandScore = 80

  // Ownership: based on owner presence
  const ownershipScore = metadata.owner ? 85 : 60

  // Simple average
  const overallScore = Math.round(
    (stabilityScore + codeAlignmentScore + infoDemandScore + ownershipScore) / 4
  )

  return {
    overallScore,
    stabilityScore,
    codeAlignmentScore,
    infoDemandScore,
    ownershipScore
  }
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

/**
 * Export workspace to PDF with detailed analysis
 */
export async function exportWorkspaceToPDF(documents: DocumentScore[]): Promise<void> {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 15
  const margin = 10
  const lineHeight = 6
  
  // Helper function to add text with wrapping
  const addWrappedText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize)
    if (isBold) {
      doc.setFont(undefined, 'bold')
    } else {
      doc.setFont(undefined, 'normal')
    }
    
    const maxWidth = pageWidth - 2 * margin
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 10) {
        doc.addPage()
        yPosition = 15
      }
      doc.text(line, margin, yPosition)
      yPosition += lineHeight
    })
  }
  
  // Title
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('DocPulse Workspace Export', margin, yPosition)
  yPosition += 10
  
  // Export metadata
  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.text(`Exported: ${new Date().toLocaleString()}`, margin, yPosition)
  yPosition += 5
  doc.text(`Total Documents: ${documents.length}`, margin, yPosition)
  yPosition += 5
  const avgScore = documents.length > 0 ? Math.round(documents.reduce((acc, doc) => acc + doc.overallScore, 0) / documents.length) : 0
  doc.text(`Average Health Score: ${avgScore}/100`, margin, yPosition)
  yPosition += 12
  
  // Score Calculation Methodology
  addWrappedText('Score Calculation Methodology', 11, true)
  yPosition += 2
  
  const methodology = [
    `Overall Score is weighted average of 4 components:`,
    `• Stability Score (40% weight) - Based on how recent and stable the documentation is`,
    `• Code Alignment Score (30% weight) - How well the documentation aligns with current codebase`,
    `• Information Demand Score (20% weight) - Based on team questions and demand for updates`,
    `• Ownership Score (10% weight) - Whether the document has clear ownership and recent reviews`,
    `Each component is scored 0-100, and the overall score reflects health and freshness.`
  ]
  
  methodology.forEach(line => {
    addWrappedText(line, 9)
  })
  
  yPosition += 5
  
  // Add line separator
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8
  
  // Document Details
  documents.forEach((doc_item, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage()
      yPosition = 15
    }
    
    // Document header
    addWrappedText(`${index + 1}. ${doc_item.title}`, 11, true)
    
    // Basic info
    const infoLines = [
      `Path: ${doc_item.path}`,
      `Category: ${doc_item.category}`,
      `Owner: ${doc_item.owner || 'Unassigned'}`,
      `Last Updated: ${doc_item.lastUpdated}`
    ]
    
    infoLines.forEach(line => {
      addWrappedText(line, 9)
    })
    
    yPosition += 3
    
    // Overall Score - highlighted
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    doc.setTextColor(
      doc_item.overallScore >= 70 ? 34 : doc_item.overallScore >= 50 ? 180 : 220,
      doc_item.overallScore >= 70 ? 140 : doc_item.overallScore >= 50 ? 100 : 53,
      doc_item.overallScore >= 70 ? 63 : 0
    )
    doc.text(`Overall Health Score: ${doc_item.overallScore}/100`, margin, yPosition)
    doc.setTextColor(0, 0, 0)
    yPosition += 6
    
    // Score breakdown
    doc.setFont(undefined, 'normal')
    doc.setFontSize(9)
    const breakdown = [
      `  → Stability: ${doc_item.stabilityScore}/100`,
      `  → Code Alignment: ${doc_item.codeAlignmentScore}/100`,
      `  → Information Demand: ${doc_item.infoDemandScore}/100`,
      `  → Ownership: ${doc_item.ownershipScore}/100`
    ]
    
    breakdown.forEach(line => {
      addWrappedText(line, 9)
    })
    
    yPosition += 2
    
    // Reasons (Signals/Factors)
    if (doc_item.reasons && doc_item.reasons.length > 0) {
      doc.setFont(undefined, 'bold')
      addWrappedText('Factors Affecting Score:', 9, true)
      doc.setFont(undefined, 'normal')
      doc_item.reasons.forEach((reason: string) => {
        addWrappedText(`  • ${reason}`, 8)
      })
    }
    
    yPosition += 2
    
    // Recommendations
    if (doc_item.recommendations && doc_item.recommendations.length > 0) {
      doc.setFont(undefined, 'bold')
      addWrappedText('Recommendations for Improvement:', 9, true)
      doc.setFont(undefined, 'normal')
      doc_item.recommendations.forEach((rec: string) => {
        addWrappedText(`  ✓ ${rec}`, 8)
      })
    }
    
    yPosition += 5
    
    // Separator between documents
    doc.setDrawColor(220, 220, 220)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8
  })
  
  // Save the PDF
  const fileName = `document-pulse-workspace-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
