import { FileValidationConfig, FileValidationResult } from '../types'

export const DEFAULT_VALIDATION_CONFIG: FileValidationConfig = {
  maxFileSizeBytes: 50 * 1024 * 1024, // 50MB
  allowedMimeTypes: [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ],
  allowedExtensions: ['.pdf', '.txt', '.md', '.doc', '.docx'],
  scanForMalware: true,
  requireVirusSignature: false
}

/**
 * Validate uploaded file against security policies
 */
export async function validateFile(
  file: File,
  config: FileValidationConfig = DEFAULT_VALIDATION_CONFIG
): Promise<FileValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  // Check file size
  if (file.size > config.maxFileSizeBytes) {
    errors.push(
      `File size exceeds maximum of ${Math.round(config.maxFileSizeBytes / 1024 / 1024)}MB`
    )
  }

  // Check mime type
  if (!config.allowedMimeTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" is not allowed`)
  }

  // Check extension
  const fileName = file.name.toLowerCase()
  const ext = fileName.substring(fileName.lastIndexOf('.'))
  if (!config.allowedExtensions.includes(ext)) {
    errors.push(`File extension "${ext}" is not allowed`)
  }

  // Check for suspicious patterns in filename
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    errors.push('File name contains suspicious characters')
  }

  // Validate file content
  const contentValidation = await validateFileContent(file)
  if (!contentValidation.isValid) {
    errors.push(...contentValidation.errors)
  }
  if (contentValidation.warnings.length > 0) {
    warnings.push(...contentValidation.warnings)
  }

  // Simulate malware scan (in production, use real antivirus API)
  if (config.scanForMalware) {
    const scanResult = await simulateMalwareScan(file)
    if (!scanResult.safe) {
      errors.push('File failed security scan - potential threat detected')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metadata: {
      detectedMimeType: file.type || 'unknown',
      estimatedSize: file.size,
      scanResults: {
        fileValidation: contentValidation,
        malwareScan: config.scanForMalware ? await simulateMalwareScan(file) : undefined
      }
    }
  }
}

/**
 * Validate file content to prevent injection attacks
 */
async function validateFileContent(file: File): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const content = await file.text()
    
    // Check for suspicious content patterns
    const suspiciousPatterns = [
      /<script[^>]*>/gi, // Script tags
      /javascript:/gi, // JavaScript protocol
      /on\w+\s*=/gi, // Event handlers
      /eval\(/gi, // Eval functions
      /<iframe/gi, // IFrames
      /<embed/gi, // Embed tags
      /onerror=/gi // Error handlers
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        warnings.push('File contains potentially executable code patterns')
        break
      }
    }

    // Check file size is reasonable for content
    if (content.length === 0 && file.size > 0) {
      warnings.push('File appears to be binary or compressed')
    }

  } catch (error) {
    // Likely binary file
    if (!(error instanceof Error) || !error.message.includes('not valid')) {
      warnings.push('Could not validate file content (may be binary)')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Simulate malware scanning (replace with real API in production)
 * Examples: ClamAV API, VirusTotal, AWS Macie, etc.
 */
async function simulateMalwareScan(file: File): Promise<{ safe: boolean; threats: string[] }> {
  // In production, integrate with actual antivirus service
  // This is just a simulation
  
  // Simulate scan delay
  await new Promise(resolve => setTimeout(resolve, 100))

  // Simulate detection of obviously bad patterns
  const fileName = file.name.toLowerCase()
  const badFileNames = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.zip']
  
  const isSuspicious = badFileNames.some(ext => fileName.endsWith(ext))

  return {
    safe: !isSuspicious,
    threats: isSuspicious ? [`Detected potentially dangerous file type`] : []
  }
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/\.\./g, '') // Remove ..
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '_') // Replace invalid characters
    .substring(0, 255) // Limit length
}

/**
 * Generate safe document ID from file
 */
export function generateDocumentIdFromFile(file: File): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const fileHash = hashString(file.name)
  return `doc-${timestamp}-${fileHash}-${random}`
}

/**
 * Simple hash function for filename
 */
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 6)
}

/**
 * Check if file should be quarantined for further review
 */
export function shouldQuarantineFile(validation: FileValidationResult): boolean {
  return (
    validation.errors.length > 0 ||
    validation.warnings.some(w => w.includes('executable'))
  )
}
