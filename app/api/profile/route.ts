import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, Database } from '@/lib/supabase'
import { z } from 'zod'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'

// Database row types
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type UrlRow = Database['public']['Tables']['urls']['Row']

// Validation schema for updating profile
const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional().nullable(),
  email: z.string().email('Invalid email address').optional(),
})

// GET /api/profile - Get current user profile
async function handleGet(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication (require 'read' scope)
    const auth = await authenticateWithScope(request, 'read')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', auth.user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Profile not found' 
        }, 
        { status: 404 }
      )
    }

    const profileData = profile as ProfileRow

    // Get user statistics
    const [urlsResponse, clicksResponse] = await Promise.all([
      supabase
        .from('urls')
        .select('id, clicks, is_active, created_at')
        .eq('user_id', auth.user.id),
      supabase
        .from('urls')
        .select('clicks')
        .eq('user_id', auth.user.id)
    ])

    const urls = (urlsResponse.data || []) as UrlRow[]
    const totalUrls = urls.length
    const activeUrls = urls.filter(url => url.is_active).length
    const totalClicks = ((clicksResponse.data || []) as UrlRow[]).reduce((total, url) => total + url.clicks, 0)
    
    // URLs created this month
    const thisMonth = urls.filter(url => {
      const created = new Date(url.created_at)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        },
        statistics: {
          total_urls: totalUrls,
          active_urls: activeUrls,
          total_clicks: totalClicks,
          urls_this_month: thisMonth,
          average_clicks: totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0
        }
      }
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
async function handlePut(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = updateProfileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed', 
          errors: validation.error.flatten().fieldErrors 
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

    // Update the profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updatedProfile, error } = await (supabase as any)
      .from('profiles')
      .update({
        full_name: validatedData.full_name,
        email: validatedData.email,
        updated_at: new Date().toISOString()
      })
      .eq('id', auth.user.id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update profile' 
        }, 
        { status: 500 }
      )
    }

    const profileData = updatedProfile as ProfileRow
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      }
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// DELETE /api/profile - Delete user account and all associated data
async function handleDelete(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication (require 'write' scope)
    const auth = await authenticateWithScope(request, 'write')
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Delete all user's URLs (this will cascade delete clicks due to foreign key)
    const { error: urlsError } = await supabase
      .from('urls')
      .delete()
      .eq('user_id', auth.user.id)

    if (urlsError) {
      console.error('Error deleting URLs:', urlsError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete user URLs' 
        }, 
        { status: 500 }
      )
    }

    // Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', auth.user.id)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete profile' 
        }, 
        { status: 500 }
      )
    }

    // Note: We don't delete the auth user here as that would require admin privileges
    // The frontend should handle auth user deletion through Supabase Auth

    return NextResponse.json({
      success: true,
      message: 'Account data deleted successfully. Please delete your authentication account separately.'
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, 'read', handleGet)
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, 'write', handlePut)
}

export async function DELETE(request: NextRequest) {
  return withRateLimit(request, 'write', handleDelete)
}