import { NextRequest } from 'next/server'
import { authenticateRequest, createSuccessResponse, createErrorResponse, handleAPIError, withRateLimit } from '@/lib/api-auth'
import {
    createApiKey,
    getUserApiKeys, type ApiKeyScope
} from '@/lib/api-keys'
import { z } from 'zod'

// Validation schema for creating API key
const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  scopes: z.array(z.enum(['read', 'write', 'admin'])).optional().default(['read', 'write']),
  expires_at: z.string().datetime().optional().nullable()
})

// GET /api/api-keys - Get all API keys for authenticated user
async function handleGet(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    const result = await getUserApiKeys(auth.user.id)
    
    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to fetch API keys', 500)
    }

    return createSuccessResponse(result.data)

  } catch (error) {
    return handleAPIError(error, 'Get API keys')
  }
}

// POST /api/api-keys - Create new API key
async function handlePost(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Only session users can create API keys (not API key users)
    if (auth.authType !== 'session') {
      return createErrorResponse('API key creation requires session authentication', 403)
    }

    const body = await request.json()
    
    // Validate input
    const validation = createApiKeySchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validation.error.flatten().fieldErrors as Record<string, string>
      )
    }

    const validatedData = validation.data

    // Create API key
    const result = await createApiKey(auth.user.id, {
      name: validatedData.name,
      scopes: validatedData.scopes as ApiKeyScope[],
      expires_at: validatedData.expires_at
    })

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to create API key', 400)
    }

    return createSuccessResponse(result.data, 'API key created successfully', 201)

  } catch (error) {
    return handleAPIError(error, 'Create API key')
  }
}

// Apply rate limiting middleware
export async function GET(request: NextRequest) {
  return withRateLimit(request, 'apiKeys', handleGet)
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'apiKeys', handlePost)
}