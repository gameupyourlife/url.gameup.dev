import { NextRequest } from 'next/server'
import { authenticateRequest, createSuccessResponse, createErrorResponse, handleAPIError, withRateLimit } from '@/lib/api-auth'
import {
    deleteApiKey,
    updateApiKey,
    getApiKeyUsageStats,
    type ApiKeyScope
} from '@/lib/api-keys'
import { z } from 'zod'

// Validation schema for updating API key
const updateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  scopes: z.array(z.enum(['read', 'write', 'admin'])).optional()
})

// GET /api/api-keys/[id] - Get API key usage statistics
async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await authenticateRequest(request)
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    const result = await getApiKeyUsageStats(auth.user.id, id)
    
    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to fetch usage statistics', 500)
    }

    return createSuccessResponse(result.data)

  } catch (error) {
    return handleAPIError(error, 'Get API key usage')
  }
}

// PUT /api/api-keys/[id] - Update API key
async function handlePut(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await authenticateRequest(request)
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Only session users can update API keys
    if (auth.authType !== 'session') {
      return createErrorResponse('API key modification requires session authentication', 403)
    }

    const body = await request.json()
    
    // Validate input
    const validation = updateApiKeySchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        validation.error.flatten().fieldErrors as Record<string, string>
      )
    }

    const validatedData = validation.data

    const result = await updateApiKey(auth.user.id, id, {
      name: validatedData.name,
      scopes: validatedData.scopes as ApiKeyScope[]
    })

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to update API key', 400)
    }

    return createSuccessResponse(result.data, 'API key updated successfully')

  } catch (error) {
    return handleAPIError(error, 'Update API key')
  }
}

// DELETE /api/api-keys/[id] - Delete API key
async function handleDelete(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await authenticateRequest(request)
    
    if (auth.error || !auth.user) {
      return auth.error
    }

    // Only session users can delete API keys
    if (auth.authType !== 'session') {
      return createErrorResponse('API key deletion requires session authentication', 403)
    }

    const result = await deleteApiKey(id, auth.user.id)

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to delete API key', 400)
    }

    return createSuccessResponse(null, 'API key deleted successfully')

  } catch (error) {
    return handleAPIError(error, 'Delete API key')
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'apiKeys', handleGet, context)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'apiKeys', handlePut, context)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, 'apiKeys', handleDelete, context)
}