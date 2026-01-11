import { DocumentScore, SearchQuery, SearchResult, SearchFilter } from '../types'

/**
 * Advanced search engine for documents
 */
export class DocumentSearchEngine {
  /**
   * Execute search with filters and text query
   */
  static search(documents: DocumentScore[], query: SearchQuery): SearchResult {
    const startTime = performance.now()
    let results = [...documents]

    // 1. Apply text search
    if (query.text && query.text.trim()) {
      results = this.textSearch(results, query.text)
    }

    // 2. Apply filters
    if (query.filters && query.filters.length > 0) {
      results = this.applyFilters(results, query.filters)
    }

    // 3. Generate facets for filtering UI
    const facets = this.generateFacets(results)

    // 4. Sort results
    if (query.sortBy) {
      results = this.sort(results, query.sortBy, query.sortOrder || 'desc')
    }

    // 5. Paginate
    const offset = query.offset || 0
    const limit = query.limit || 50
    const paginatedResults = results.slice(offset, offset + limit)

    const executionTimeMs = performance.now() - startTime

    return {
      documents: paginatedResults,
      totalCount: results.length,
      executionTimeMs,
      facets
    }
  }

  /**
   * Full-text search across document fields
   */
  private static textSearch(documents: DocumentScore[], text: string): DocumentScore[] {
    const searchText = text.toLowerCase()
    const searchTerms = searchText.split(/\s+/).filter(t => t.length > 0)

    return documents.filter(doc => {
      // Search in searchable fields
      const searchableFields = [
        doc.title,
        doc.path,
        doc.owner,
        doc.category,
        ...doc.reasons,
        ...doc.recommendations
      ]
        .join(' ')
        .toLowerCase()

      // Match if all search terms are found
      return searchTerms.every(term => searchableFields.includes(term))
    })
  }

  /**
   * Apply filters to documents
   */
  private static applyFilters(documents: DocumentScore[], filters: SearchFilter[]): DocumentScore[] {
    return documents.filter(doc => {
      return filters.every(filter => this.evaluateFilter(doc, filter))
    })
  }

  /**
   * Evaluate a single filter
   */
  private static evaluateFilter(doc: DocumentScore, filter: SearchFilter): boolean {
    const value = this.getDocumentFieldValue(doc, filter.field)

    switch (filter.operator) {
      case 'equals':
        return value === filter.value

      case 'contains':
        return String(value).toLowerCase().includes(String(filter.value).toLowerCase())

      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())

      case 'in':
        return Array.isArray(filter.value) && filter.value.includes(value)

      case 'range':
        if (typeof value !== 'number' || !filter.value.min || !filter.value.max) return false
        return value >= filter.value.min && value <= filter.value.max

      case 'exists':
        return filter.value ? value !== null && value !== undefined : value === null || value === undefined

      default:
        return true
    }
  }

  /**
   * Get field value from document
   */
  private static getDocumentFieldValue(doc: DocumentScore, field: string): any {
    const fieldMap: Record<string, any> = {
      'title': doc.title,
      'owner': doc.owner,
      'team': (doc as any).metadata?.team,
      'system': (doc as any).metadata?.system,
      'docType': (doc as any).metadata?.docType,
      'criticality': (doc as any).metadata?.criticality,
      'status': doc.overallScore < 50 ? 'high_risk' : 'acceptable'
    }
    return fieldMap[field] || null
  }

  /**
   * Generate facets for the UI
   */
  private static generateFacets(documents: DocumentScore[]): Record<string, Record<string, number>> {
    const facets: Record<string, Record<string, number>> = {
      team: {},
      docType: {},
      criticality: {},
      status: {},
      category: {}
    }

    documents.forEach(doc => {
      const team = (doc as any).metadata?.team || 'Unknown'
      const docType = (doc as any).metadata?.docType || 'Other'
      const criticality = (doc as any).metadata?.criticality || 0
      const status = doc.overallScore < 50 ? 'high_risk' : 'acceptable'
      const category = doc.category

      facets.team[team] = (facets.team[team] || 0) + 1
      facets.docType[docType] = (facets.docType[docType] || 0) + 1
      facets.criticality[criticality.toString()] = (facets.criticality[criticality.toString()] || 0) + 1
      facets.status[status] = (facets.status[status] || 0) + 1
      facets.category[category] = (facets.category[category] || 0) + 1
    })

    return facets
  }

  /**
   * Sort documents
   */
  private static sort(
    documents: DocumentScore[],
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): DocumentScore[] {
    const sorted = [...documents].sort((a, b) => {
      let aVal: any = a.title
      let bVal: any = b.title

      switch (sortBy) {
        case 'overallScore':
          aVal = a.overallScore
          bVal = b.overallScore
          break
        case 'lastUpdated':
          aVal = new Date(a.lastUpdated).getTime()
          bVal = new Date(b.lastUpdated).getTime()
          break
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'relevance':
        default:
          // Relevance is determined by search ranking, maintain order
          return 0
      }

      if (sortOrder === 'desc') {
        return typeof aVal === 'number' ? bVal - aVal : String(bVal).localeCompare(String(aVal))
      } else {
        return typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal))
      }
    })

    return sorted
  }

  /**
   * Build human-readable search query description
   */
  static getQueryDescription(query: SearchQuery): string {
    let description = ''

    if (query.text) {
      description += `Search: "${query.text}"`
    }

    if (query.filters && query.filters.length > 0) {
      const filterStrings = query.filters.map(f => {
        const operator = f.operator === 'equals' ? '=' : f.operator
        return `${f.field} ${operator} ${f.value}`
      })
      description += (description ? ' | ' : '') + 'Filters: ' + filterStrings.join(', ')
    }

    return description || 'All documents'
  }
}
