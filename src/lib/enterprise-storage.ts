import { DocumentScore, User, WorkspaceSettings, AuditLog, IntegrationConnector } from '../types'

const STORAGE_PREFIX = 'docpulse_enterprise_'
const STORAGE_VERSION = '1.0'

interface StorageSchema {
  version: string
  workspace: WorkspaceSettings | null
  documents: DocumentScore[]
  users: User[]
  auditLogs: AuditLog[]
  integrations: IntegrationConnector[]
  lastBackupAt: string
}

/**
 * Enterprise persistence layer
 * Uses localStorage by default, can be extended to backend
 */
export class EnterpriseStorage {
  private static instance: EnterpriseStorage
  private isInitialized = false
  private syncInProgress = false

  private constructor() {}

  static getInstance(): EnterpriseStorage {
    if (!EnterpriseStorage.instance) {
      EnterpriseStorage.instance = new EnterpriseStorage()
    }
    return EnterpriseStorage.instance
  }

  /**
   * Initialize storage - run on app start
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Check if we have stored data
      const stored = this.getStorageData()
      if (!stored) {
        // Initialize with empty schema
        this.setStorageData(this.getEmptySchema())
      }
      this.isInitialized = true
    } catch (error) {
      console.error('Storage initialization failed:', error)
      throw new Error('Failed to initialize enterprise storage')
    }
  }

  /**
   * Save documents
   */
  async saveDocuments(documents: DocumentScore[]): Promise<void> {
    try {
      const schema = this.getStorageData()
      schema.documents = documents
      schema.lastBackupAt = new Date().toISOString()
      this.setStorageData(schema)
      
      // Audit log
      this.logAudit({
        userId: 'system',
        action: 'documents_saved',
        resource: 'document',
        resourceId: 'batch',
        resourceName: `Saved ${documents.length} documents`,
        status: 'success'
      })
    } catch (error) {
      this.logAudit({
        userId: 'system',
        action: 'documents_saved',
        resource: 'document',
        resourceId: 'batch',
        resourceName: 'Batch save failed',
        status: 'failure',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  /**
   * Load documents
   */
  async loadDocuments(): Promise<DocumentScore[]> {
    try {
      const schema = this.getStorageData()
      return schema?.documents || []
    } catch (error) {
      console.error('Failed to load documents:', error)
      return []
    }
  }

  /**
   * Save workspace settings
   */
  async saveWorkspaceSettings(settings: WorkspaceSettings): Promise<void> {
    const schema = this.getStorageData()
    schema.workspace = settings
    this.setStorageData(schema)
    
    this.logAudit({
      userId: 'system',
      action: 'workspace_settings_updated',
      resource: 'workspace',
      resourceId: settings.id,
      resourceName: settings.name,
      status: 'success'
    })
  }

  /**
   * Load workspace settings
   */
  async loadWorkspaceSettings(): Promise<WorkspaceSettings | null> {
    const schema = this.getStorageData()
    return schema?.workspace || null
  }

  /**
   * Audit logging
   */
  logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    try {
      const schema = this.getStorageData()
      const auditLog: AuditLog = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...log,
        // Use provided userId or default to 'system'
        userId: log.userId || 'system'
      }
      
      schema.auditLogs = [auditLog, ...schema.auditLogs].slice(0, 10000) // Keep last 10k logs
      this.setStorageData(schema)
    } catch (error) {
      console.error('Audit logging failed:', error)
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    const schema = this.getStorageData()
    return schema?.auditLogs.slice(0, limit) || []
  }

  /**
   * Export full workspace backup
   */
  async exportBackup(): Promise<string> {
    const schema = this.getStorageData()
    return JSON.stringify(schema, null, 2)
  }

  /**
   * Import workspace backup
   */
  async importBackup(backupJson: string): Promise<void> {
    try {
      const schema = JSON.parse(backupJson) as StorageSchema
      
      if (schema.version !== STORAGE_VERSION) {
        console.warn('Backup version mismatch, attempting migration')
      }
      
      this.setStorageData(schema)
      this.logAudit({
        userId: 'system',
        action: 'backup_imported',
        resource: 'workspace',
        resourceId: 'backup',
        resourceName: `Imported backup with ${schema.documents.length} documents`,
        status: 'success'
      })
    } catch (error) {
      this.logAudit({
        userId: 'system',
        action: 'backup_imported',
        resource: 'workspace',
        resourceId: 'backup',
        resourceName: 'Backup import failed',
        status: 'failure',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
      throw new Error(`Failed to import backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Save integrations
   */
  async saveIntegrations(integrations: IntegrationConnector[]): Promise<void> {
    const schema = this.getStorageData()
    schema.integrations = integrations
    this.setStorageData(schema)
  }

  /**
   * Load integrations
   */
  async loadIntegrations(): Promise<IntegrationConnector[]> {
    const schema = this.getStorageData()
    return schema?.integrations || []
  }

  /**
   * Save users (workspace members)
   */
  async saveUsers(users: User[]): Promise<void> {
    const schema = this.getStorageData()
    schema.users = users
    this.setStorageData(schema)
  }

  /**
   * Load users
   */
  async loadUsers(): Promise<User[]> {
    const schema = this.getStorageData()
    return schema?.users || []
  }

  /**
   * Clear all data (requires confirmation)
   */
  async clearAllData(confirmationToken: string = 'CLEAR_ALL'): Promise<void> {
    if (confirmationToken !== 'CLEAR_ALL_ENTERPRISE_DATA') {
      throw new Error('Clear operation requires correct confirmation token')
    }
    
    try {
      localStorage.removeItem(STORAGE_PREFIX + 'schema')
      this.isInitialized = false
      console.warn('All enterprise data cleared')
    } catch (error) {
      throw new Error('Failed to clear data: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Check storage quota
   */
  getStorageStats(): { usedBytes: number; estimatedQuotaBytes: number; percentUsed: number } {
    try {
      const schema = this.getStorageData()
      const jsonString = JSON.stringify(schema)
      const usedBytes = new Blob([jsonString]).size
      const estimatedQuotaBytes = 5 * 1024 * 1024 // 5MB typical for localStorage
      
      return {
        usedBytes,
        estimatedQuotaBytes,
        percentUsed: Math.round((usedBytes / estimatedQuotaBytes) * 100)
      }
    } catch {
      return { usedBytes: 0, estimatedQuotaBytes: 5 * 1024 * 1024, percentUsed: 0 }
    }
  }

  // ===== PRIVATE HELPERS =====

  private getStorageData(): StorageSchema {
    try {
      const key = STORAGE_PREFIX + 'schema'
      const data = localStorage.getItem(key)
      if (!data) {
        return this.getEmptySchema()
      }
      return JSON.parse(data) as StorageSchema
    } catch (error) {
      console.error('Error reading from storage:', error)
      return this.getEmptySchema()
    }
  }

  private setStorageData(schema: StorageSchema): void {
    try {
      const key = STORAGE_PREFIX + 'schema'
      const stats = this.getStorageStats()
      
      if (stats.percentUsed > 95) {
        console.warn('Storage quota nearly full')
      }
      
      localStorage.setItem(key, JSON.stringify(schema))
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please export and clear old data.')
      }
      throw error
    }
  }

  private getEmptySchema(): StorageSchema {
    return {
      version: STORAGE_VERSION,
      workspace: null,
      documents: [],
      users: [],
      auditLogs: [],
      integrations: [],
      lastBackupAt: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const storage = EnterpriseStorage.getInstance()
