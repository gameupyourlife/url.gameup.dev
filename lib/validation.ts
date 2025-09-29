import { z } from 'zod'

// Reserved paths that cannot be used as short codes
export const RESERVED_PATHS = [
  // App routes
  'dashboard',
  'analytics',
  'auth',
  'login',
  'register',
  'signup',
  'signin',
  'logout',
  
  // API routes
  'api',
  
  // Next.js reserved paths
  '_next',
  '_vercel',
  
  // Common web paths
  'admin',
  'administrator',
  'root',
  'www',
  'mail',
  'email',
  'blog',
  'news',
  'help',
  'support',
  'contact',
  'about',
  'terms',
  'privacy',
  'policy',
  'legal',
  
  // File extensions and common files
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '.well-known',
  
  // HTTP status codes
  '404',
  '500',
  'not-found',
  'error',
  
  // Common short codes that might be confusing
  'url',
  'link',
  'redirect',
  'go',
  'r',
  'l',
  'short',
  
  // Social media
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'youtube',
  'tiktok',
  
  // Security
  'security',
  'ssl',
  'tls',
  'https',
  'http',
] as const

// Create a type for reserved paths
export type ReservedPath = typeof RESERVED_PATHS[number]

// Validation schema for URLs
export const urlValidationSchema = z.object({
  original_url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL')
    .refine(
      (url) => {
        try {
          const parsedUrl = new URL(url)
          return ['http:', 'https:'].includes(parsedUrl.protocol)
        } catch {
          return false
        }
      },
      'URL must use HTTP or HTTPS protocol'
    ),
  
  short_code: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must be no more than 20 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Short code can only contain letters, numbers, hyphens, and underscores'
    )
    .refine(
      (code) => !RESERVED_PATHS.includes(code.toLowerCase() as ReservedPath),
      {
        message: 'This is a reserved path and cannot be used as a short code',
      }
    )
    .refine(
      (code) => code.toLowerCase() !== code.toUpperCase(),
      'Short code must contain at least one letter or number'
    ),
    
  title: z
    .string()
    .max(100, 'Title must be no more than 100 characters')
    .optional()
    .or(z.literal('')),
    
  description: z
    .string()
    .max(200, 'Description must be no more than 200 characters')
    .optional()
    .or(z.literal('')),
})

// Schema for creating a URL (short_code is optional, will be generated if not provided)
export const createUrlSchema = urlValidationSchema.extend({
  short_code: urlValidationSchema.shape.short_code.optional(),
})

// Schema for updating a URL
export const updateUrlSchema = z.object({
  title: urlValidationSchema.shape.title,
  description: urlValidationSchema.shape.description,
  is_active: z.boolean().optional(),
})

// Type exports
export type UrlValidation = z.infer<typeof urlValidationSchema>
export type CreateUrlInput = z.infer<typeof createUrlSchema>
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>

// Helper function to check if a short code is reserved
export function isReservedPath(shortCode: string): boolean {
  return RESERVED_PATHS.includes(shortCode.toLowerCase() as ReservedPath)
}

// Helper function to generate a random short code that's not reserved
export function generateSafeShortCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  // Ensure at least one letter
  result += characters.charAt(Math.floor(Math.random() * 52)) // First 52 chars are letters
  
  // Fill the rest
  for (let i = 1; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  // Check if generated code is reserved, if so, try again
  if (isReservedPath(result)) {
    return generateSafeShortCode(length)
  }
  
  return result
}

// Validation error formatter
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })
  
  return errors
}

// QR Code generation schema
export const qrCodeOptionsSchema = z.object({
  // Size of the QR code (in pixels)
  size: z.number().int().min(100).max(2000).optional().default(256),
  
  // Format of the output (PNG, SVG, or DataURL)
  format: z.enum(['png', 'svg', 'dataurl']).optional().default('png'),
  
  // Error correction level
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('M'),
  
  // Margin around the QR code
  margin: z.number().int().min(0).max(20).optional().default(4),
  
  // Colors
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#000000'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#FFFFFF'),
  
  // Whether to download the QR code as attachment
  download: z.boolean().optional().default(false),
  
  // Custom filename (for download)
  filename: z.string().min(1).max(100).optional()
})

export type QRCodeOptions = z.infer<typeof qrCodeOptionsSchema>