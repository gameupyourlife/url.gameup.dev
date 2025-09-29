import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { qrCodeOptionsSchema, formatValidationErrors } from '@/lib/validation'
import { generateQRCode, getDefaultQRCodeOptions } from '@/lib/qr-code-service'
import { withRateLimit, authenticateWithScope } from '@/lib/api-auth'

// Schema for custom URL QR code generation
const customUrlQRSchema = z.object({
  url: z.string().url('Must be a valid URL').max(2048, 'URL too long'),
  options: qrCodeOptionsSchema.optional()
})

// POST /api/qr-code/generate - Generate QR code for any URL (authenticated users only)
async function handlePost(request: NextRequest) {
  try {
    // Check authentication (require 'read' scope)
    const auth = await authenticateWithScope(request, 'read')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    const body = await request.json()
    
    // Validate request body
    const validation = customUrlQRSchema.safeParse(body)
    if (!validation.success) {
      const errors = formatValidationErrors(validation.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          errors
        },
        { status: 400 }
      )
    }

    const { url, options = {} } = validation.data

    // Merge with default options
    const qrOptions = getDefaultQRCodeOptions(options)

    // Generate QR code
    try {
      const qrCode = await generateQRCode(url, qrOptions)

      // Handle download vs display
      if (qrOptions.download && qrCode.filename) {
        // Return as downloadable attachment
        const headers = new Headers({
          'Content-Type': qrCode.contentType,
          'Content-Disposition': `attachment; filename="${qrCode.filename}"`
        })

        return new NextResponse(qrCode.content as BodyInit, { headers })
      }

      // Return as API response
      if (qrCode.contentType.startsWith('image/')) {
        // Return binary image data
        const headers = new Headers({
          'Content-Type': qrCode.contentType,
          'Cache-Control': 'private, max-age=0' // Don't cache custom QR codes
        })
        
        return new NextResponse(qrCode.content as BodyInit, { headers })
      }

      // Return JSON response for SVG/DataURL formats
      return NextResponse.json({
        success: true,
        data: {
          qrCode: qrCode.content,
          format: qrOptions.format,
          url: url,
          options: qrOptions
        }
      })

    } catch (qrError) {
      console.error('QR Code generation error:', qrError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate QR code'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Custom QR Code API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'qrCode', handlePost)
}