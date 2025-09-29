import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getUrlAnalytics } from '@/lib/analytics-service'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'

// GET /api/analytics/[id] - Get analytics for specific URL
async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // Check authentication (require 'read' scope)
    const auth = await authenticateWithScope(request, 'read')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Verify URL ownership
    const { data: urlOwnership, error: ownershipError } = await supabase
      .from('urls')
      .select('id')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (ownershipError || !urlOwnership) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL not found or access denied' 
        }, 
        { status: 404 }
      )
    }

    // Get analytics for the specific URL
    const analytics = await getUrlAnalytics(id, auth.user.id)

    if (!analytics) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Analytics data not found' 
        }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('URL Analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch URL analytics data' 
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'analytics', handleGet, context)
}