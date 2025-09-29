import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, Database } from '@/lib/supabase'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'

// Database row types
type UrlRow = Database['public']['Tables']['urls']['Row']

// GET /api/urls - Get all URLs for authenticated user
async function handleGet(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication (require 'read' scope)
    const auth = await authenticateWithScope(request, 'read')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100) // Max 100 per page
    const offset = (page - 1) * limit

    // Get URLs with pagination
    const { data: urls, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch URLs' 
        }, 
        { status: 500 }
      )
    }

    const typedUrls = (urls || []) as UrlRow[]
    const baseUrl = request.nextUrl.origin

    // Get total count for pagination
    const { count } = await supabase
      .from('urls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', auth.user.id)

    return NextResponse.json({
      success: true,
      data: typedUrls.map(url => ({
        id: url.id,
        original_url: url.original_url,
        short_code: url.short_code,
        short_url: `${baseUrl}/${url.short_code}`,
        title: url.title,
        description: url.description,
        clicks: url.clicks,
        created_at: url.created_at,
        updated_at: url.updated_at,
        is_active: url.is_active
      })),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// Apply rate limiting middleware
export async function GET(request: NextRequest) {
  return withRateLimit(request, 'read', handleGet)
}