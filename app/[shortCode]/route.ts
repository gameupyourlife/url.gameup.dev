import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { isReservedPath } from '@/lib/validation';
import { extractAnalyticsDataWithCountry, formatAnalyticsForLogging, logAnalytics, saveClickAnalyticsAsync } from '@/lib/analytics';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params

    // Exclude reserved paths from being processed as short codes
    if (!shortCode || shortCode.length < 3 || isReservedPath(shortCode)) {
      return NextResponse.redirect(new URL('/', request.url), 307)
    }

    const supabase = await createServerClient()
    
    // Extract comprehensive analytics data with country lookup
    const analytics = await extractAnalyticsDataWithCountry(request, shortCode)
    
    // Log initial click attempt
    logAnalytics('click', {
      action: 'click_attempt',
      ...formatAnalyticsForLogging(analytics)
    })

    // Find the URL by short code
    const { data: urlData, error } = await supabase
      .from('urls')
      .select('id, original_url, clicks, title, user_id, created_at')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single()

    if (error || !urlData) {
      logAnalytics('notFound', {
        action: 'url_not_found',
        shortCode,
        error: error?.message || 'URL not found',
        ...formatAnalyticsForLogging(analytics)
      })
      return NextResponse.redirect(new URL('/not-found', request.url), 307)
    }

    // Type the data properly
    const { original_url, id: urlId, clicks, title, user_id, created_at } = urlData as {
      id: string
      original_url: string
      clicks: number
      title: string | null
      user_id: string | null
      created_at: string
    }

    // Enhanced analytics with URL data
    const enhancedAnalytics = {
      ...analytics,
      urlData: {
        id: urlId,
        originalUrl: original_url,
        title,
        currentClicks: clicks,
        userId: user_id,
        urlCreatedAt: created_at,
        urlAge: Math.floor((new Date().getTime() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)) // days
      }
    }

    // Log successful redirect
    logAnalytics('click', {
      action: 'successful_redirect',
      ...formatAnalyticsForLogging(enhancedAnalytics)
    })
    
    // Save analytics to database (async, non-blocking)
    saveClickAnalyticsAsync(enhancedAnalytics, urlId)
    
    // Log that click count would be incremented (will work after database migration)
    console.log('📈 Click count would be incremented to:', clicks + 1)
    
    // Also log detailed analytics for comprehensive tracking
    console.log('📊 DETAILED ANALYTICS:', JSON.stringify(enhancedAnalytics, null, 2))

    console.log(`🔄 Redirecting ${shortCode} to ${original_url}`)

    // Redirect to the original URL with 302 (temporary redirect)
    return NextResponse.redirect(original_url, 302)
  } catch (error) {
    const shortCodeFromParams = await params.then(p => p.shortCode).catch(() => 'unknown')
    
    logAnalytics('error', {
      action: 'redirect_error',
      shortCode: shortCodeFromParams,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'direct'
    })
    
    return NextResponse.redirect(new URL('/not-found', request.url), 307)
  }
}