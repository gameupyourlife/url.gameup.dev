import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'

// POST /api/urls/[id]/toggle - Toggle URL active status
async function handlePost(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // Check authentication (require 'write' scope)
    const auth = await authenticateWithScope(request, 'write')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Get current URL to toggle status
    const { data: currentUrl, error: fetchError } = await supabase
      .from('urls')
      .select('is_active')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (fetchError || !currentUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL not found' 
        }, 
        { status: 404 }
      )
    }

    const typedCurrentUrl = currentUrl as { is_active: boolean }

    // Toggle the active status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('urls')
      .update({ is_active: !typedCurrentUrl.is_active })
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .select('id, is_active')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update URL status' 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        is_active: data.is_active
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

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'write', handlePost, context)
}