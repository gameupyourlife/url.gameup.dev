import { NextRequest } from 'next/server'
import { authenticateRequest, createSuccessResponse, createErrorResponse, handleAPIError } from '@/lib/api-auth'
import { revokeApiKey } from '@/lib/api-keys'

// POST /api/api-keys/[id]/revoke - Revoke API key (deactivate)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await authenticateRequest(request)
    
    if (auth.error || !auth.user) {
      return auth.error || createErrorResponse('Authentication failed', 401)
    }

    // Only session users can revoke API keys
    if (auth.authType !== 'session') {
      return createErrorResponse('API key revocation requires session authentication', 403)
    }

    const result = await revokeApiKey(id, auth.user.id)

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to revoke API key', 400)
    }

    return createSuccessResponse(null, 'API key revoked successfully')

  } catch (error) {
    return handleAPIError(error, 'Revoke API key')
  }
}