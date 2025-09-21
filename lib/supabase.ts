import { createBrowserClient as createSupabaseBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Import the Database type from Supabase CLI generated types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/database.types.ts
// Then uncomment the line below and comment out the manual Database type
// import { Database } from './database.types'

// Temporary manual Database type - replace with generated types
export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          original_url: string
          short_code: string
          user_id: string | null
          title: string | null
          description: string | null
          clicks: number
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          original_url: string
          short_code: string
          user_id?: string | null
          title?: string | null
          description?: string | null
          clicks?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          original_url?: string
          short_code?: string
          user_id?: string | null
          title?: string | null
          description?: string | null
          clicks?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// For client components
export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// For server components
export async function createServerClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// For server actions and API routes
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}