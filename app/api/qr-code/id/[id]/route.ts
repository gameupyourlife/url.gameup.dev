import { NextRequest, NextResponse } from 'next/server'
import { qrCodeOptionsSchema, formatValidationErrors } from '@/lib/validation'
import { generateQRCodeForUrlId } from '@/lib/qr-code-service'
import { withRateLimit, authenticateWithScope } from '@/lib/api-auth'

// GET /api/qr-code/id/[id] - Generate QR code for a URL by ID (authenticated)
async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)

    // Check authentication (require 'read' scope) - ID-based access always requires auth
    const auth = await authenticateWithScope(request, 'read')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Parse query parameters for QR code options
    const rawOptions = {
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined,
      format: searchParams.get('format') || undefined,
      errorCorrectionLevel: searchParams.get('errorCorrectionLevel') || undefined,
      margin: searchParams.get('margin') ? parseInt(searchParams.get('margin')!) : undefined,
      foregroundColor: searchParams.get('foregroundColor') || undefined,
      backgroundColor: searchParams.get('backgroundColor') || undefined,
      download: searchParams.get('download') === 'true',
      filename: searchParams.get('filename') || undefined
    }

    // Remove undefined values
    const cleanOptions = Object.fromEntries(
      Object.entries(rawOptions).filter(([, value]) => value !== undefined)
    )

    // Validate options
    const validation = qrCodeOptionsSchema.safeParse(cleanOptions)
    if (!validation.success) {
      const errors = formatValidationErrors(validation.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid QR code options',
          errors
        },
        { status: 400 }
      )
    }

    const options = validation.data

    // Generate QR code using URL ID
    const result = await generateQRCodeForUrlId(
      id,
      auth.user.id,
      options,
      request.nextUrl.origin
    )

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: result.error === 'URL not found or access denied' ? 404 : 400 }
      )
    }

    const { qrCode, urlInfo } = result

    // Handle download vs display
    if (options.download && qrCode!.filename) {
      // Return as downloadable attachment
      const headers = new Headers({
        'Content-Type': qrCode!.contentType,
        'Content-Disposition': `attachment; filename="${qrCode!.filename}"`
      })

      return new NextResponse(qrCode!.content as BodyInit, { headers })
    }

    // Return as API response
    if (qrCode!.contentType.startsWith('image/')) {
      // Return binary image data
      const headers = new Headers({
        'Content-Type': qrCode!.contentType,
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      })
      
      return new NextResponse(qrCode!.content as BodyInit, { headers })
    }

    // Return JSON response for SVG/DataURL formats
    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCode!.content,
        format: options.format,
        urlId: id,
        shortCode: urlInfo?.shortCode,
        fullUrl: `${request.nextUrl.origin}/${urlInfo?.shortCode}`,
        urlInfo: urlInfo ? {
          originalUrl: urlInfo.originalUrl,
          title: urlInfo.title
        } : undefined
      }
    })

  } catch (error) {
    console.error('QR Code API error (by ID):', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate QR code'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'qrCode', handleGet, context)
}