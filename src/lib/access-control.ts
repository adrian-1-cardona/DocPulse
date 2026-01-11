import { User, UserRole, AccessRule, DocumentAccess } from '../types'

/**
 * Role-Based Access Control (RBAC) utilities
 */

const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  admin: new Set([
    'document:read',
    'document:write',
    'document:delete',
    'document:share',
    'document:export',
    'user:read',
    'user:write',
    'user:delete',
    'workspace:read',
    'workspace:write',
    'audit:read',
    'report:generate',
    'integration:manage'
  ]),
  editor: new Set([
    'document:read',
    'document:write',
    'document:share',
    'document:export',
    'user:read',
    'workspace:read',
    'report:generate'
  ]),
  viewer: new Set([
    'document:read',
    'document:export',
    'workspace:read',
    'report:generate'
  ])
}

/**
 * Check if user has permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role]
  return userPermissions.has(permission)
}

/**
 * Check if user can perform action on document
 */
export function canAccessDocument(
  user: User | null,
  documentAccess: DocumentAccess | null,
  action: 'read' | 'write' | 'delete' | 'share'
): boolean {
  if (!user) return false
  
  // Admins can do everything
  if (user.role === 'admin') return true
  
  // Check specific access
  if (documentAccess) {
    if (documentAccess.role === 'owner' || documentAccess.role === 'editor') {
      return true // Owners and editors can read/write
    }
    if (documentAccess.role === 'viewer' && (action === 'read')) {
      return true // Viewers can only read
    }
  }
  
  // Editors can generally write
  if (user.role === 'editor' && action !== 'delete') return true
  
  return false
}

/**
 * Get user's effective role for a resource
 */
export function getEffectiveRole(
  userRole: UserRole,
  documentAccess?: DocumentAccess
): UserRole | 'document_owner' | 'document_editor' | 'document_viewer' {
  if (userRole === 'admin') return 'admin'
  
  if (documentAccess) {
    switch (documentAccess.role) {
      case 'owner':
        return 'document_owner'
      case 'editor':
        return 'document_editor'
      case 'viewer':
        return 'document_viewer'
    }
  }
  
  return userRole
}

/**
 * Mask sensitive data based on user role
 */
export function maskSensitiveData(data: any, userRole: UserRole): any {
  if (userRole === 'admin') return data
  
  const masked = { ...data }
  
  if (userRole !== 'viewer') {
    // Editors see most data
    return masked
  }
  
  // Viewers see limited data
  delete masked.metadata
  return masked
}

/**
 * Evaluate access rules
 */
export function evaluateAccessRules(
  user: User,
  resource: string,
  action: string,
  rules: AccessRule[]
): boolean {
  // Admin bypass
  if (user.role === 'admin') return true
  
  // Check rules
  const applicableRules = rules.filter(
    rule => rule.resource === resource && rule.action === action
  )
  
  if (applicableRules.length === 0) {
    // Default deny if no rules
    return false
  }
  
  // Allow if any rule matches
  return applicableRules.some(rule => rule.allowedRoles.includes(user.role))
}

/**
 * Get readable permission name
 */
export function getPermissionLabel(permission: string): string {
  const labels: Record<string, string> = {
    'document:read': 'View Documents',
    'document:write': 'Edit Documents',
    'document:delete': 'Delete Documents',
    'document:share': 'Share Documents',
    'document:export': 'Export Documents',
    'user:read': 'View Users',
    'user:write': 'Manage Users',
    'user:delete': 'Remove Users',
    'workspace:read': 'View Workspace',
    'workspace:write': 'Manage Workspace',
    'audit:read': 'View Audit Logs',
    'report:generate': 'Generate Reports',
    'integration:manage': 'Manage Integrations'
  }
  return labels[permission] || permission
}

/**
 * Create default access policy for new document
 */
export function createDefaultDocumentAccess(
  documentId: string,
  userId: string,
  grantedBy: string
): DocumentAccess {
  return {
    documentId,
    userId,
    role: 'owner',
    grantedAt: new Date().toISOString(),
    grantedBy
  }
}

/**
 * Validate role hierarchy
 */
export function isRoleHigherOrEqual(role1: UserRole, role2: UserRole): boolean {
  const hierarchy = { admin: 3, editor: 2, viewer: 1 }
  return hierarchy[role1] >= hierarchy[role2]
}
