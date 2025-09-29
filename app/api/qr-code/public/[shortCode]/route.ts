import { NextRequest, NextResponse } from 'next/server'
import { qrCodeOptionsSchema, formatValidationErrors } from '@/lib/validation'
import { generateQRCodeForShortUrl } from '@/lib/qr-code-service'
import { withRateLimit } from '@/lib/api-auth'

// GET /api/qr-code/public/[shortCode] - Generate QR code for public URLs (no auth required)
async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params
    const { searchParams } = new URL(request.url)

    // Parse query parameters for QR code options (with more restrictive defaults for public use)
    const rawOptions = {
      size: Math.min(512, searchParams.get('size') ? parseInt(searchParams.get('size')!) : 256), // Max 512px for public
      format: searchParams.get('format') || 'png',
      errorCorrectionLevel: searchParams.get('errorCorrectionLevel') || 'M',
      margin: Math.min(10, searchParams.get('margin') ? parseInt(searchParams.get('margin')!) : 4), // Max margin 10
      foregroundColor: searchParams.get('foregroundColor') || '#000000',
      backgroundColor: searchParams.get('backgroundColor') || '#FFFFFF',
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

    // For public endpoint, only allow active URLs
    const result = await generateQRCodeForShortUrl(
      shortCode, 
      options,
      request.nextUrl.origin,
      true // requireActive = true for public endpoint
    )

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: result.error === 'Short URL not found' ? 404 : 400 }
      )
    }

    const { qrCode, urlInfo } = result

    // Handle download vs display
    if (options.download && qrCode!.filename) {
      // Return as downloadable attachment
      const headers = new Headers({
        'Content-Type': qrCode!.contentType,
        'Content-Disposition': `attachment; filename="${qrCode!.filename}"`,
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
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
        shortCode,
        fullUrl: `${request.nextUrl.origin}/${shortCode}`,
        urlInfo: {
          title: urlInfo?.title
          // Don't expose original URL in public endpoint for privacy
        }
      }
    })

  } catch (error) {
    console.error('Public QR Code API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate QR code'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ shortCode: string }> }) {
  return withRateLimit(request, 'public', handleGet, context)
}