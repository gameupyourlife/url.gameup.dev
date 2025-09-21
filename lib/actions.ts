'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import {
    createUrlSchema,
    updateUrlSchema,
    generateSafeShortCode,
    formatValidationErrors,
    type CreateUrlInput,
    type UpdateUrlInput
} from '@/lib/validation'

import { Database } from '@/lib/supabase'

// Database row types
type UrlRow = Database['public']['Tables']['urls']['Row']

// Response types for better type safety
export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string>
}

export async function createUrlAction(input: CreateUrlInput): Promise<ActionResult> {
  try {
    // Validate input with Zod
    const validation = createUrlSchema.safeParse(input)
    
    if (!validation.success) {
      const errors = formatValidationErrors(validation.error)
      return {
        success: false,
        error: Object.values(errors)[0] || 'Validation failed',
        errors: errors
      }
    }

    const validatedData = validation.data
    const supabase = await createServerClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        error: 'You must be signed in to create URLs'
      }
    }

    // Generate short code if not provided
    let shortCode = validatedData.short_code
    if (!shortCode) {
      shortCode = generateSafeShortCode()
      
      // Ensure generated code is not already in use
      let attempts = 0
      while (attempts < 10) {
        const { data: existingUrl } = await supabase
          .from('urls')
          .select('id')
          .eq('short_code', shortCode)
          .single()

        if (!existingUrl) break
        
        shortCode = generateSafeShortCode()
        attempts++
      }
      
      if (attempts >= 10) {
        return {
          success: false,
          error: 'Failed to generate unique short code. Please try again.'
        }
      }
    } else {
      // Check if custom short code already exists
      const { data: existingUrl } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', shortCode)
        .single()

      if (existingUrl) {
        return {
          success: false,
          error: 'Short code already exists. Please choose a different one.'
        }
      }
    }

    // Insert the URL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('urls')
      .insert({
        original_url: validatedData.original_url,
        short_code: shortCode,
        user_id: session.user.id,
        title: validatedData.title || null,
        description: validatedData.description || null,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to create shortened URL'
      }
    }

    // Revalidate the dashboard page to show the new URL
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/analytics')

    const urlData = data as UrlRow
    return {
      success: true,
      data: {
        id: urlData.id,
        original_url: urlData.original_url,
        short_code: urlData.short_code,
        title: urlData.title,
        description: urlData.description,
        clicks: urlData.clicks,
        created_at: urlData.created_at,
        is_active: urlData.is_active
      }
    }
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

export async function updateUrlAction(urlId: string, input: UpdateUrlInput): Promise<ActionResult> {
  try {
    // Validate input with Zod
    const validation = updateUrlSchema.safeParse(input)
    
    if (!validation.success) {
      const errors = formatValidationErrors(validation.error)
      return {
        success: false,
        error: Object.values(errors)[0] || 'Validation failed',
        errors: errors
      }
    }

    const validatedData = validation.data
    const supabase = await createServerClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        error: 'You must be signed in to update URLs'
      }
    }

    // Verify ownership
    const { data: existingUrl, error: fetchError } = await supabase
      .from('urls')
      .select('user_id')
      .eq('id', urlId)
      .single()

    if (fetchError || !existingUrl) {
      return {
        success: false,
        error: 'URL not found'
      }
    }

    const existingUrlData = existingUrl as { user_id: string | null }
    if (existingUrlData.user_id !== session.user.id) {
      return {
        success: false,
        error: 'You can only update your own URLs'
      }
    }

    // Update the URL - using type assertion to handle Supabase typing issues
    const updateData = {
      title: validatedData.title || null,
      description: validatedData.description || null,
      ...(validatedData.is_active !== undefined && { is_active: validatedData.is_active })
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('urls')
      .update(updateData)
      .eq('id', urlId)
      .select('*')
      .single()

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to update URL'
      }
    }

    // Revalidate pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/analytics')

    const updatedUrlData = data as UrlRow
    return {
      success: true,
      data: {
        id: updatedUrlData.id,
        original_url: updatedUrlData.original_url,
        short_code: updatedUrlData.short_code,
        title: updatedUrlData.title,
        description: updatedUrlData.description,
        clicks: updatedUrlData.clicks,
        created_at: updatedUrlData.created_at,
        updated_at: updatedUrlData.updated_at,
        is_active: updatedUrlData.is_active
      }
    }
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

export async function deleteUrlAction(urlId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        error: 'You must be signed in to delete URLs'
      }
    }

    // Verify ownership
    const { data: existingUrl, error: fetchError } = await supabase
      .from('urls')
      .select('user_id')
      .eq('id', urlId)
      .single()

    if (fetchError || !existingUrl) {
      return {
        success: false,
        error: 'URL not found'
      }
    }

    const existingUrlData = existingUrl as { user_id: string | null }
    if (existingUrlData.user_id !== session.user.id) {
      return {
        success: false,
        error: 'You can only delete your own URLs'
      }
    }

    // Delete the URL
    const { error } = await supabase
      .from('urls')
      .delete()
      .eq('id', urlId)

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to delete URL'
      }
    }

    // Revalidate pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/analytics')

    return {
      success: true
    }
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

export async function toggleUrlActiveAction(urlId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return {
        success: false,
        error: 'You must be signed in to update URLs'
      }
    }

    // Get current URL state and verify ownership
    const { data: existingUrl, error: fetchError } = await supabase
      .from('urls')
      .select('user_id, is_active')
      .eq('id', urlId)
      .single()

    if (fetchError || !existingUrl) {
      return {
        success: false,
        error: 'URL not found'
      }
    }

    const toggleUrlData = existingUrl as { user_id: string | null, is_active: boolean }
    if (toggleUrlData.user_id !== session.user.id) {
      return {
        success: false,
        error: 'You can only update your own URLs'
      }
    }

    // Toggle the active state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('urls')
      .update({ is_active: !toggleUrlData.is_active })
      .eq('id', urlId)
      .select('*')
      .single()

    if (error) {
      console.error('Database error:', error)
      return {
        success: false,
        error: 'Failed to update URL status'
      }
    }

    // Revalidate pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/analytics')

    const updatedUrl = data as { id: string, is_active: boolean }
    return {
      success: true,
      data: {
        id: updatedUrl.id,
        is_active: updatedUrl.is_active
      }
    }
  } catch (error) {
    console.error('Server action error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}