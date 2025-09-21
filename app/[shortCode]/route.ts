import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isReservedPath } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params

    // Exclude reserved paths from being processed as short codes
    if (!shortCode || shortCode.length < 3 || isReservedPath(shortCode)) {
      return NextResponse.redirect(new URL('/', request.url), 307)
    }

    const supabase = await createServerClient()

    // Find the URL by short code
    const { data: urlData, error } = await supabase
      .from('urls')
      .select('id, original_url, clicks')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single()

    if (error || !urlData) {
      console.log(`Short code not found: ${shortCode}`)
      return NextResponse.redirect(new URL('/not-found', request.url), 307)
    }

    // Type the data properly
    const { original_url } = urlData as {
      id: string
      original_url: string
      clicks: number
    }

    // TODO: Increment click count (temporarily disabled due to typing issues)
    console.log(`Redirecting ${shortCode} to ${original_url}`)

    // Redirect to the original URL with 302 (temporary redirect)
    return NextResponse.redirect(original_url, 302)
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.redirect(new URL('/not-found', request.url), 307)
  }
}