import QRCode from 'qrcode';
import { QRCodeOptions } from './validation';

/**
 * Generate QR code with customization options
 */
export async function generateQRCode(
  data: string, 
  options: QRCodeOptions
): Promise<{ content: string | Buffer; contentType: string; filename?: string }> {
  const {
    size,
    format,
    errorCorrectionLevel,
    margin,
    foregroundColor,
    backgroundColor,
    download,
    filename
  } = options

  const qrOptions = {
    width: size,
    margin,
    errorCorrectionLevel,
    color: {
      dark: foregroundColor,
      light: backgroundColor
    }
  }

  try {
    switch (format) {
      case 'svg':
        const svgString = await QRCode.toString(data, { 
          ...qrOptions, 
          type: 'svg' as const 
        })
        return {
          content: svgString,
          contentType: 'image/svg+xml',
          filename: download ? (filename || `qr-code.svg`) : undefined
        }

      case 'dataurl':
        const dataUrl = await QRCode.toDataURL(data, qrOptions)
        return {
          content: dataUrl,
          contentType: 'text/plain',
          filename: download ? (filename || `qr-code.txt`) : undefined
        }

      case 'png':
      default:
        const pngBuffer = await QRCode.toBuffer(data, qrOptions)
        return {
          content: pngBuffer,
          contentType: 'image/png',
          filename: download ? (filename || `qr-code.png`) : undefined
        }
    }
  } catch (error) {
    console.error('QR Code generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Validate that a URL/short code exists and is accessible
 */
export async function validateShortCode(shortCode: string): Promise<{
  exists: boolean
  isActive: boolean
  originalUrl?: string
  title?: string
}> {
  try {
    // Import here to avoid circular dependencies
    const { createServerClient } = await import('./supabase')
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('urls')
      .select('original_url, title, is_active')
      .eq('short_code', shortCode)
      .single()

    if (error || !data) {
      return {
        exists: false,
        isActive: false
      }
    }

    // Type assertion since we know the structure
    const urlData = data as {
      original_url: string
      title: string | null
      is_active: boolean
    }

    return {
      exists: true,
      isActive: urlData.is_active,
      originalUrl: urlData.original_url,
      title: urlData.title || undefined
    }
  } catch (error) {
    console.error('Short code validation error:', error)
    return {
      exists: false,
      isActive: false
    }
  }
}

/**
 * Build full URL from short code
 */
export function buildFullUrl(shortCode: string, baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://url.gameup.dev')
  return `${origin}/${shortCode}`
}

/**
 * Generate QR code for short URL with validation
 */
export async function generateQRCodeForShortUrl(
  shortCode: string,
  options: QRCodeOptions,
  baseUrl?: string,
  requireActive: boolean = false
): Promise<{
  success: boolean
  qrCode?: { content: string | Buffer; contentType: string; filename?: string }
  error?: string
  urlInfo?: { originalUrl: string; title?: string }
}> {
  try {
    // Validate the short code exists
    const validation = await validateShortCode(shortCode)
    
    if (!validation.exists) {
      return {
        success: false,
        error: 'Short URL not found'
      }
    }

    if (requireActive && !validation.isActive) {
      return {
        success: false,
        error: 'Short URL is currently inactive'
      }
    }

    // Generate QR code for the full URL
    const fullUrl = buildFullUrl(shortCode, baseUrl)
    const qrCode = await generateQRCode(fullUrl, options)

    return {
      success: true,
      qrCode,
      urlInfo: {
        originalUrl: validation.originalUrl!,
        title: validation.title
      }
    }
  } catch (error) {
    console.error('QR Code generation error:', error)
    return {
      success: false,
      error: 'Failed to generate QR code'
    }
  }
}

/**
 * Get default QR code options with smart defaults
 */
export function getDefaultQRCodeOptions(overrides?: Partial<QRCodeOptions>): QRCodeOptions {
  return {
    size: 256,
    format: 'png' as const,
    errorCorrectionLevel: 'M' as const,
    margin: 4,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    download: false,
    ...overrides
  }
}

/**
 * Validate that a URL ID exists and is accessible by user
 */
export async function validateUrlId(urlId: string, userId: string): Promise<{
  exists: boolean
  isActive: boolean
  shortCode?: string
  originalUrl?: string
  title?: string
}> {
  try {
    // Import here to avoid circular dependencies
    const { createServerClient } = await import('./supabase')
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('urls')
      .select('short_code, original_url, title, is_active')
      .eq('id', urlId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return {
        exists: false,
        isActive: false
      }
    }

    // Type assertion since we know the structure
    const urlData = data as {
      short_code: string
      original_url: string
      title: string | null
      is_active: boolean
    }

    return {
      exists: true,
      isActive: urlData.is_active,
      shortCode: urlData.short_code,
      originalUrl: urlData.original_url,
      title: urlData.title || undefined
    }
  } catch (error) {
    console.error('URL ID validation error:', error)
    return {
      exists: false,
      isActive: false
    }
  }
}

/**
 * Generate QR code for URL by ID with validation and user ownership check
 */
export async function generateQRCodeForUrlId(
  urlId: string,
  userId: string,
  options: QRCodeOptions,
  baseUrl?: string
): Promise<{
  success: boolean
  qrCode?: { content: string | Buffer; contentType: string; filename?: string }
  error?: string
  urlInfo?: { shortCode: string; originalUrl: string; title?: string }
}> {
  try {
    // Validate the URL ID exists and user owns it
    const validation = await validateUrlId(urlId, userId)
    
    if (!validation.exists) {
      return {
        success: false,
        error: 'URL not found or access denied'
      }
    }

    // For ID-based access, we allow both active and inactive URLs since user owns them
    // Generate QR code for the full URL using the short code
    const fullUrl = buildFullUrl(validation.shortCode!, baseUrl)
    const qrCode = await generateQRCode(fullUrl, options)

    return {
      success: true,
      qrCode,
      urlInfo: {
        shortCode: validation.shortCode!,
        originalUrl: validation.originalUrl!,
        title: validation.title
      }
    }
  } catch (error) {
    console.error('QR Code generation error (by ID):', error)
    return {
      success: false,
      error: 'Failed to generate QR code'
    }
  }
}