/**
 * API Key Management Utilities
 * Handles creation, validation, and management of API keys
 */

import { randomBytes, createHash } from 'crypto'
import { createServerClient, Database } from '@/lib/supabase'

// Database row types
type ApiKeyRow = Database['public']['Tables']['api_keys']['Row']
type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert']

export interface ApiKeyData {
  id: string
  user_id: string
  name: string
  key_prefix: string
  scopes: string[]
  is_active: boolean
  last_used_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface ApiKeyWithToken extends ApiKeyData {
  token: string // Only returned when creating a new key
}

export type ApiKeyScope = 'read' | 'write' | 'admin'

export interface CreateApiKeyRequest {
  name: string
  scopes?: ApiKeyScope[]
  expires_at?: string | null
}

export interface ApiKeyValidationResult {
  isValid: boolean
  userId?: string
  keyId?: string
  scopes?: ApiKeyScope[]
  error?: string
}

/**
 * Generate a new API key
 * Format: gup_[8-char-prefix]_[32-char-random]
 */
export function generateApiKey(): { token: string; hash: string; prefix: string } {
  // Generate random bytes for the key
  const randomPart = randomBytes(24).toString('base64url') // 32 chars when base64url encoded
  
  // Create prefix (first 8 chars for identification)
  const prefix = randomPart.substring(0, 8)
  
  // Create full token with our prefix
  const token = `gup_${prefix}_${randomPart}`
  
  // Hash the token for storage
  const hash = createHash('sha256').update(token).digest('hex')
  
  return { token, hash, prefix: `gup_${prefix}` }
}

/**
 * Hash an API key for comparison
 */
export function hashApiKey(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(token: string): boolean {
  // Expected format: gup_[8chars]_[32chars]
  const pattern = /^gup_[A-Za-z0-9_-]{8}_[A-Za-z0-9_-]{32}$/
  return pattern.test(token)
}

/**
 * Extract prefix from API key
 */
export function extractKeyPrefix(token: string): string | null {
  if (!isValidApiKeyFormat(token)) return null
  
  const parts = token.split('_')
  if (parts.length !== 3) return null
  
  return `${parts[0]}_${parts[1]}`
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(
  userId: string,
  request: CreateApiKeyRequest
): Promise<{ success: boolean; data?: ApiKeyWithToken; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    // Validate scopes
    const validScopes: ApiKeyScope[] = ['read', 'write', 'admin']
    const scopes = request.scopes || ['read', 'write']
    
    for (const scope of scopes) {
      if (!validScopes.includes(scope)) {
        return { success: false, error: `Invalid scope: ${scope}` }
      }
    }
    
    // Check if user already has too many keys (limit to 10)
    const { count } = await supabase
      .from('api_keys')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true)
    
    if ((count || 0) >= 10) {
      return { 
        success: false, 
        error: 'Maximum number of API keys reached (10). Please delete some keys first.' 
      }
    }
    
    // Generate API key
    const { token, hash, prefix } = generateApiKey()
    
    // Validate expiration date if provided
    let expiresAt = request.expires_at
    if (expiresAt) {
      const expDate = new Date(expiresAt)
      const now = new Date()
      
      if (expDate <= now) {
        return { success: false, error: 'Expiration date must be in the future' }
      }
      
      // Max 1 year expiration
      const maxExpiration = new Date()
      maxExpiration.setFullYear(maxExpiration.getFullYear() + 1)
      
      if (expDate > maxExpiration) {
        return { success: false, error: 'Expiration date cannot be more than 1 year from now' }
      }
    }
    
    // Insert into database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('api_keys')
      .insert({
        user_id: userId,
        name: request.name,
        key_hash: hash,
        key_prefix: prefix,
        scopes,
        expires_at: expiresAt
      })
      .select('*')
      .single()
    
    if (error) {
      console.error('Error creating API key:', error)
      return { success: false, error: 'Failed to create API key' }
    }
    
    const apiKeyData = data as ApiKeyRow
    
    return {
      success: true,
      data: {
        id: apiKeyData.id,
        user_id: apiKeyData.user_id,
        name: apiKeyData.name,
        key_prefix: apiKeyData.key_prefix,
        scopes: apiKeyData.scopes as ApiKeyScope[],
        is_active: apiKeyData.is_active,
        last_used_at: apiKeyData.last_used_at,
        expires_at: apiKeyData.expires_at,
        created_at: apiKeyData.created_at,
        updated_at: apiKeyData.updated_at,
        token // Only returned when creating
      }
    }
  } catch (error) {
    console.error('Error in createApiKey:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Validate an API key and return user info
 */
export async function validateApiKey(token: string): Promise<ApiKeyValidationResult> {
  try {
    // Basic format validation
    if (!isValidApiKeyFormat(token)) {
      return { isValid: false, error: 'Invalid API key format' }
    }
    
    const supabase = await createServerClient()
    const hash = hashApiKey(token)
    
    // Look up API key
    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', hash)
      .eq('is_active', true)
      .single()
    
    if (error || !apiKey) {
      return { isValid: false, error: 'Invalid API key' }
    }
    
    const typedApiKey = apiKey as ApiKeyRow
    
    // Check expiration
    if (typedApiKey.expires_at) {
      const expDate = new Date(typedApiKey.expires_at)
      if (expDate <= new Date()) {
        return { isValid: false, error: 'API key has expired' }
      }
    }
    
    // Update last used timestamp (async, don't wait)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(supabase as any).rpc('update_api_key_last_used', { key_hash_param: hash }).catch(console.error)
    
    return {
      isValid: true,
      userId: typedApiKey.user_id,
      keyId: typedApiKey.id,
      scopes: typedApiKey.scopes as ApiKeyScope[]
    }
  } catch (error) {
    console.error('Error validating API key:', error)
    return { isValid: false, error: 'Validation error' }
  }
}

/**
 * Get all API keys for a user (without the actual tokens)
 */
export async function getUserApiKeys(userId: string): Promise<{
  success: boolean
  data?: ApiKeyData[]
  error?: string
}> {
  try {
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching API keys:', error)
      return { success: false, error: 'Failed to fetch API keys' }
    }
    
    const apiKeys = (data as ApiKeyRow[]).map(key => ({
      id: key.id,
      user_id: key.user_id,
      name: key.name,
      key_prefix: key.key_prefix,
      scopes: key.scopes as ApiKeyScope[],
      is_active: key.is_active,
      last_used_at: key.last_used_at,
      expires_at: key.expires_at,
      created_at: key.created_at,
      updated_at: key.updated_at
    }))
    
    return { success: true, data: apiKeys }
  } catch (error) {
    console.error('Error in getUserApiKeys:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Revoke (deactivate) an API key
 */
export async function revokeApiKey(
  keyId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('api_keys')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', keyId)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error revoking API key:', error)
      return { success: false, error: 'Failed to revoke API key' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in revokeApiKey:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Delete an API key permanently
 */
export async function deleteApiKey(
  keyId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting API key:', error)
      return { success: false, error: 'Failed to delete API key' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in deleteApiKey:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Update API key details
 */
export async function updateApiKey(
  keyId: string,
  userId: string,
  updates: { name?: string; scopes?: ApiKeyScope[] }
): Promise<{ success: boolean; data?: ApiKeyData; error?: string }> {
  try {
    const supabase = await createServerClient()
    
    // Validate scopes if provided
    if (updates.scopes) {
      const validScopes: ApiKeyScope[] = ['read', 'write', 'admin']
      for (const scope of updates.scopes) {
        if (!validScopes.includes(scope)) {
          return { success: false, error: `Invalid scope: ${scope}` }
        }
      }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('api_keys')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', keyId)
      .eq('user_id', userId)
      .select('*')
      .single()
    
    if (error) {
      console.error('Error updating API key:', error)
      return { success: false, error: 'Failed to update API key' }
    }
    
    const apiKeyData = data as ApiKeyRow
    
    return {
      success: true,
      data: {
        id: apiKeyData.id,
        user_id: apiKeyData.user_id,
        name: apiKeyData.name,
        key_prefix: apiKeyData.key_prefix,
        scopes: apiKeyData.scopes as ApiKeyScope[],
        is_active: apiKeyData.is_active,
        last_used_at: apiKeyData.last_used_at,
        expires_at: apiKeyData.expires_at,
        created_at: apiKeyData.created_at,
        updated_at: apiKeyData.updated_at
      }
    }
  } catch (error) {
    console.error('Error in updateApiKey:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Log API key usage for analytics
 */
export async function logApiKeyUsage(
  keyId: string,
  endpoint: string,
  method: string,
  ipAddress?: string,
  userAgent?: string,
  responseStatus?: number
): Promise<void> {
  try {
    const supabase = await createServerClient()
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('api_key_usage')
      .insert({
        api_key_id: keyId,
        endpoint,
        method,
        ip_address: ipAddress,
        user_agent: userAgent,
        response_status: responseStatus
      })
  } catch (error) {
    // Don't throw errors for usage logging failures
    console.error('Failed to log API key usage:', error)
  }
}

/**
 * Check if an API key has a specific scope
 */
export function hasScope(scopes: ApiKeyScope[], requiredScope: ApiKeyScope): boolean {
  return scopes.includes(requiredScope) || scopes.includes('admin')
}

/**
 * Get API key usage statistics
 */
export async function getApiKeyUsageStats(
  userId: string,
  keyId?: string
): Promise<{
  success: boolean
  data?: {
    total_requests: number
    last_7_days: number
    last_30_days: number
    top_endpoints: { endpoint: string; count: number }[]
    status_codes: { status: number; count: number }[]
  }
  error?: string
}> {
  try {
    const supabase = await createServerClient()
    
    // Get API key IDs first if not filtering by specific key
    let apiKeyIds: string[] = []
    if (keyId) {
      apiKeyIds = [keyId]
    } else {
      const { data: keys } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', userId)
      apiKeyIds = (keys || []).map((k: any) => k.id)
    }
    
    const { data: usage, error } = await supabase
      .from('api_key_usage')
      .select('endpoint, response_status, created_at')
      .in('api_key_id', apiKeyIds)
    
    if (error) {
      console.error('Error fetching API key usage:', error)
      return { success: false, error: 'Failed to fetch usage statistics' }
    }
    
    // Type cast usage data
    const typedUsage = (usage || []) as {
      endpoint: string
      response_status: number | null
      created_at: string
    }[]
    
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const stats = {
      total_requests: typedUsage.length,
      last_7_days: typedUsage.filter(u => new Date(u.created_at) >= last7Days).length,
      last_30_days: typedUsage.filter(u => new Date(u.created_at) >= last30Days).length,
      top_endpoints: Object.entries(
        typedUsage.reduce((acc: Record<string, number>, u) => {
          acc[u.endpoint] = (acc[u.endpoint] || 0) + 1
          return acc
        }, {})
      )
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([endpoint, count]) => ({ endpoint, count: count as number })),
      status_codes: Object.entries(
        typedUsage
          .filter(u => u.response_status)
          .reduce((acc: Record<number, number>, u) => {
            const status = u.response_status!
            acc[status] = (acc[status] || 0) + 1
            return acc
          }, {})
      )
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .map(([status, count]) => ({ status: parseInt(status), count: count as number }))
    }
    
    return { success: true, data: stats }
  } catch (error) {
    console.error('Error in getApiKeyUsageStats:', error)
    return { success: false, error: 'Internal server error' }
  }
}