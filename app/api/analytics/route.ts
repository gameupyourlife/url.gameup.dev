import { NextRequest, NextResponse } from 'next/server'
import { getOverallAnalytics } from '@/lib/analytics-service'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'

// GET /api/analytics - Get overall analytics for user
async function handleGet(request: NextRequest) {
  try {
    // Check authentication (require 'read' scope)
    const auth = await authenticateWithScope(request, 'read')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Get comprehensive analytics
    const analytics = await getOverallAnalytics(auth.user.id)

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data' 
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, 'analytics', handleGet)
}