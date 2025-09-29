import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, createServerClient, Database } from '@/lib/supabase'
import { z } from 'zod'
import { authenticateWithScope } from '@/lib/api-auth'

// Database row types
type ProfileRow = Database['public']['Tables']['profiles']['Row']

// Validation schema for creating profile
const createProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  email: z.string().email('Invalid email address'),
  fullName: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = createProfileSchema.safeParse(body)
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

    const { userId, email, fullName } = validation.data

    // Use service role client to bypass RLS
    const supabase = createServiceClient()

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (existingProfile) {
      return NextResponse.json({ 
        success: true,
        message: 'Profile already exists',
        data: existingProfile
      })
    }

    // Create the profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create profile' 
        },
        { status: 500 }
      )
    }

    const profileData = data as ProfileRow
    return NextResponse.json({ 
      success: true,
      message: 'Profile created successfully', 
      data: {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
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

// GET method to retrieve current user profile
export async function GET(request: NextRequest) {
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
    return NextResponse.json({
      success: true,
      data: {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
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