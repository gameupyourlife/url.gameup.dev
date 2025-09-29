import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, Database } from '@/lib/supabase'
import { updateUrlSchema, formatValidationErrors } from '@/lib/validation'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'

// Database row types
type UrlRow = Database['public']['Tables']['urls']['Row']

// GET /api/urls/[id] - Get specific URL
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

    // Get the URL
    const { data: urlData, error } = await supabase
      .from('urls')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (error || !urlData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL not found' 
        }, 
        { status: 404 }
      )
    }

    const typedUrlData = urlData as UrlRow
    const baseUrl = request.nextUrl.origin

    return NextResponse.json({
      success: true,
      data: {
        id: typedUrlData.id,
        original_url: typedUrlData.original_url,
        short_code: typedUrlData.short_code,
        short_url: `${baseUrl}/${typedUrlData.short_code}`,
        title: typedUrlData.title,
        description: typedUrlData.description,
        clicks: typedUrlData.clicks,
        created_at: typedUrlData.created_at,
        updated_at: typedUrlData.updated_at,
        is_active: typedUrlData.is_active
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

// PUT /api/urls/[id] - Update URL
async function handlePut(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate input
    const validation = updateUrlSchema.safeParse(body)
    if (!validation.success) {
      const errors = formatValidationErrors(validation.error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          errors 
        }, 
        { status: 400 }
      )
    }

    const validatedData = validation.data
    const supabase = await createServerClient()

    // Check authentication (require 'write' scope)
    const auth = await authenticateWithScope(request, 'write')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Verify URL ownership
    const { data: existingUrl, error: ownershipError } = await supabase
      .from('urls')
      .select('id')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (ownershipError || !existingUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL not found' 
        }, 
        { status: 404 }
      )
    }

    // Update the URL (only title, description, and is_active can be updated)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updatedData, error } = await (supabase as any)
      .from('urls')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .select('*')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update URL' 
        }, 
        { status: 500 }
      )
    }

    const updatedUrl = updatedData as UrlRow
    const baseUrl = request.nextUrl.origin

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUrl.id,
        original_url: updatedUrl.original_url,
        short_code: updatedUrl.short_code,
        short_url: `${baseUrl}/${updatedUrl.short_code}`,
        title: updatedUrl.title,
        description: updatedUrl.description,
        clicks: updatedUrl.clicks,
        created_at: updatedUrl.created_at,
        updated_at: updatedUrl.updated_at,
        is_active: updatedUrl.is_active
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

// DELETE /api/urls/[id] - Delete URL
async function handleDelete(
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

    // Delete the URL (only if owned by user)
    const { error } = await supabase
      .from('urls')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete URL' 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'URL deleted successfully'
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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'read', handleGet, context)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'write', handlePut, context)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'write', handleDelete, context)
}