/**
 * API Authentication and utilities
 * Common functions for API route authentication and response handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { validateApiKey, hasScope, logApiKeyUsage, type ApiKeyScope } from '@/lib/api-keys'

export interface AuthenticatedUser {
  id: string
  email?: string
  user_metadata?: Record<string, any>
}

export interface ApiKeyAuth {
  userId: string
  keyId: string
  scopes: ApiKeyScope[]
}

export interface AuthResult {
  user: AuthenticatedUser | null
  apiKey: ApiKeyAuth | null
  error: NextResponse | null
  authType: 'session' | 'api_key' | null
}

export interface APIError {
  success: false
  error: string
  errors?: Record<string, string>
}

export interface APISuccess<T = any> {
  success: true
  data?: T
  message?: string
}

export type APIResponse<T = any> = APISuccess<T> | APIError

/**
 * Authenticate API request and return user if valid
 * Supports both session-based and API key authentication
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    // Check for API key first (Authorization: Bearer gup_...)
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer gup_')) {
      const token = authHeader.replace('Bearer ', '')
      const validation = await validateApiKey(token)
      
      if (validation.isValid && validation.userId && validation.keyId) {
        // Log API usage (async, don't wait)
        const endpoint = new URL(request.url).pathname
        const method = request.method
        const ip = getClientIP(request)
        const userAgent = request.headers.get('user-agent') || undefined
        
        logApiKeyUsage(validation.keyId, endpoint, method, ip, userAgent).catch(console.error)
        
        return {
          user: { id: validation.userId },
          apiKey: {
            userId: validation.userId,
            keyId: validation.keyId,
            scopes: validation.scopes || []
          },
          error: null,
          authType: 'api_key'
        }
      } else {
        return {
          user: null,
          apiKey: null,
          error: NextResponse.json(
            { 
              success: false, 
              error: validation.error || 'Invalid API key' 
            }, 
            { status: 401 }
          ),
          authType: null
        }
      }
    }
    
    // Fall back to session-based authentication
    const supabase = await createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return {
        user: null,
        apiKey: null,
        error: NextResponse.json(
          { 
            success: false, 
            error: 'Authentication required. Please provide a valid session token or API key.' 
          }, 
          { status: 401 }
        ),
        authType: null
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      },
      apiKey: null,
      error: null,
      authType: 'session'
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      user: null,
      apiKey: null,
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Authentication failed' 
        }, 
        { status: 500 }
      ),
      authType: null
    }
  }
}

/**
 * Authenticate API request with required scope
 */
export async function authenticateWithScope(
  request: NextRequest,
  requiredScope: ApiKeyScope
): Promise<AuthResult> {
  const auth = await authenticateRequest(request)
  
  // If using API key, check scope
  if (auth.apiKey && !hasScope(auth.apiKey.scopes, requiredScope)) {
    return {
      ...auth,
      error: NextResponse.json(
        { 
          success: false, 
          error: `Insufficient permissions. Required scope: ${requiredScope}` 
        }, 
        { status: 403 }
      )
    }
  }
  
  return auth
}

/**
 * Get client IP address from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown'
}

/**
 * Verify URL ownership by user
 */
export async function verifyUrlOwnership(
  urlId: string, 
  userId: string
): Promise<{ isOwner: boolean; error: NextResponse | null }> {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('urls')
      .select('id')
      .eq('id', urlId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return {
        isOwner: false,
        error: NextResponse.json(
          { 
            success: false, 
            error: 'URL not found or access denied' 
          }, 
          { status: 404 }
        )
      }
    }

    return {
      isOwner: true,
      error: null
    }
  } catch (error) {
    console.error('URL ownership verification error:', error)
    return {
      isOwner: false,
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Failed to verify URL ownership' 
        }, 
        { status: 500 }
      )
    }
  }
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data?: T, 
  message?: string, 
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  )
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string, 
  status: number = 400, 
  errors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      errors
    },
    { status }
  )
}

/**
 * Handle API errors consistently
 */
export function handleAPIError(error: unknown, operation: string): NextResponse {
  console.error(`${operation} API error:`, error)
  
  return NextResponse.json(
    { 
      success: false, 
      error: 'Internal server error' 
    }, 
    { status: 500 }
  )
}

/**
 * Validate pagination parameters
 */
export function validatePagination(searchParams: URLSearchParams): {
  page: number
  limit: number
  offset: number
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10'))) // Max 100 per page
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  }
}

/**
 * Rate limiting configuration per endpoint type
 */
export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  skipSuccessfulRequests?: boolean
  keyGenerator?: (request: NextRequest) => string
}

/**
 * Default rate limit configurations for different endpoint types
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Public endpoints (no auth required)
  public: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
  },
  // URL shortening - more restrictive
  shorten: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  // Data fetching - moderate limits
  read: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // Data modification - more restrictive
  write: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  // API key management - very restrictive
  apiKeys: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  // QR Code generation - moderate limits (can be resource intensive)
  qrCode: {
    maxRequests: 40,
    windowMs: 60 * 1000, // 1 minute
  },
  // Analytics queries
  analytics: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
  // Default fallback
  default: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  }
}

/**
 * Rate limiting helper (basic implementation)
 * In production, you'd want to use Redis or similar
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig
): RateLimitResult {
  const { maxRequests, windowMs } = config
  const now = Date.now()
  const record = requestCounts.get(identifier)

  if (!record || now > record.resetTime) {
    // First request or window expired
    const resetTime = now + windowMs
    requestCounts.set(identifier, { count: 1, resetTime })
    return { 
      allowed: true, 
      remaining: maxRequests - 1, 
      resetTime, 
      limit: maxRequests 
    }
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime, 
      limit: maxRequests 
    }
  }

  // Increment count
  record.count++
  requestCounts.set(identifier, record)
  
  return { 
    allowed: true, 
    remaining: maxRequests - record.count, 
    resetTime: record.resetTime,
    limit: maxRequests
  }
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    'X-RateLimit-Reset-Time': new Date(result.resetTime).toISOString()
  }
}

/**
 * Rate limiting middleware that can be applied to API routes
 */
export async function withRateLimit<T extends any[]>(
  request: NextRequest,
  rateLimitType: keyof typeof DEFAULT_RATE_LIMITS,
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse | null>,
  ...args: T
): Promise<NextResponse> {
  try {
    // Get rate limit configuration
    const config = DEFAULT_RATE_LIMITS[rateLimitType] || DEFAULT_RATE_LIMITS.default
    
    // Generate identifier (can be customized per config)
    const identifier = config.keyGenerator 
      ? config.keyGenerator(request) 
      : getClientIdentifier(request)
    
    // Check rate limit
    const result = checkRateLimit(identifier, config)
    const headers = createRateLimitHeaders(result)
    
    if (!result.allowed) {
      // Rate limit exceeded
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`
        },
        { 
          status: 429,
          headers: {
            ...headers,
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }
    
    // Execute the handler
    const response = await handler(request, ...args)
    
    // Handle null responses (shouldn't happen in normal cases)
    if (!response) {
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          message: 'Handler returned null response'
        },
        { status: 500 }
      )
    }
    
    // Add rate limit headers to successful responses
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
    
  } catch (error) {
    console.error('Rate limiting middleware error:', error)
    // If rate limiting fails, still allow the request but log the error
    const response = await handler(request, ...args)
    return response || NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Handler error'
      },
      { status: 500 }
    )
  }
}

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
  return getClientIP(request)
}