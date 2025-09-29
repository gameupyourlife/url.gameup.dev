import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, Database } from '@/lib/supabase'
import {
    createUrlSchema,
    generateSafeShortCode,
    formatValidationErrors
} from '@/lib/validation'
import { authenticateWithScope, withRateLimit } from '@/lib/api-auth'
import { z } from 'zod'

// Database row types
type UrlRow = Database['public']['Tables']['urls']['Row']

async function handlePost(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    
    // Validate input with Zod
    const validation = createUrlSchema.safeParse(body)
    
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

    // Check authentication (allow both session and API key with 'write' scope)
    const auth = await authenticateWithScope(request, 'write')
    
    if (auth.error) {
      return auth.error
    }
    
    const userId = auth.user?.id || null

    // Generate short code if not provided
    let shortCode = validatedData.short_code
    if (!shortCode) {
      shortCode = generateSafeShortCode()
      
      // Ensure generated code is not already in use
      let attempts = 0
      while (attempts < 10) {
        const { data: existing } = await supabase
          .from('urls')
          .select('id')
          .eq('short_code', shortCode)
          .single()
        
        if (!existing) break
        
        shortCode = generateSafeShortCode()
        attempts++
      }
      
      if (attempts >= 10) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Unable to generate unique short code. Please try again.' 
          }, 
          { status: 500 }
        )
      }
    } else {
      // Check if custom short code is already taken
      const { data: existing } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', shortCode)
        .single()
      
      if (existing) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This short code is already taken. Please choose a different one.' 
          }, 
          { status: 409 }
        )
      }
    }

    // Create the URL record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('urls')
      .insert({
        original_url: validatedData.original_url,
        short_code: shortCode,
        user_id: userId,
        title: validatedData.title || null,
        description: validatedData.description || null,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create shortened URL' 
        }, 
        { status: 500 }
      )
    }

    // Return success response
    const urlData = data as UrlRow
    const baseUrl = request.nextUrl.origin
    return NextResponse.json({
      success: true,
      data: {
        id: urlData.id,
        original_url: urlData.original_url,
        short_code: urlData.short_code,
        short_url: `${baseUrl}/${urlData.short_code}`,
        title: urlData.title,
        description: urlData.description,
        clicks: urlData.clicks,
        created_at: urlData.created_at,
        is_active: urlData.is_active,
        user_id: urlData.user_id
      }
    })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      const errors = formatValidationErrors(error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          errors 
        }, 
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}

// GET method to retrieve URL information by short code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shortCode = searchParams.get('code')
    
    if (!shortCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Short code is required' 
        }, 
        { status: 400 }
      )
    }

    const supabase = await createServerClient()
    
    // Find the URL by short code
    const { data: urlData, error } = await supabase
      .from('urls')
      .select('id, original_url, short_code, title, description, clicks, created_at, updated_at, is_active, user_id')
      .eq('short_code', shortCode)
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
        is_active: typedUrlData.is_active,
        user_id: typedUrlData.user_id
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
export async function POST(request: NextRequest) {
  return withRateLimit(request, 'shorten', handlePost)
}