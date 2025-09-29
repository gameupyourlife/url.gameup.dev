import { NextPage } from 'next'
import { Key, Shield, RefreshCw, Trash2 } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { ApiEndpoint } from '@/components/docs/api-endpoint'

const ApiKeysPage: NextPage = () => {
  return (
    <DocsPage
      title="API Keys Management"
      description="Create, manage, and rotate API keys for secure access to your URL shortening service with comprehensive key management."
      icon={<Key className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Create your first API key",
            description: "Generate a new API key for your application.",
            code: `curl -X POST https://url.gameup.dev/api/keys \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My App Key"}'`
          },
          {
            title: "Use the API key",
            description: "Include the API key in your requests to authenticate.",
            code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/urls`
          },
          {
            title: "Manage your keys",
            description: "List, update, or revoke keys as needed for security."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="API Key Features"
        description="Comprehensive API key management for secure access control"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="Key Generation"
            description="Create API keys with custom names and permissions"
            icon={<Key className="h-6 w-6 text-rose-600" />}
            features={[
              "Named API keys",
              "Custom permissions",
              "Expiration dates",
              "Usage tracking"
            ]}
          />
          <OverviewCard
            title="Security Controls"
            description="Advanced security features for API key protection"
            icon={<Shield className="h-6 w-6 text-pink-600" />}
            features={[
              "Key rotation",
              "Access restrictions",
              "Rate limiting",
              "Activity monitoring"
            ]}
          />
          <OverviewCard
            title="Key Rotation"
            description="Rotate keys regularly for enhanced security"
            icon={<RefreshCw className="h-6 w-6 text-rose-600" />}
            features={[
              "Automated rotation",
              "Manual key updates",
              "Graceful transitions",
              "Backup keys"
            ]}
          />
          <OverviewCard
            title="Key Management"
            description="Full lifecycle management of your API keys"
            icon={<Trash2 className="h-6 w-6 text-pink-600" />}
            features={[
              "List all keys",
              "Update key details",
              "Revoke access",
              "Usage analytics"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Endpoints */}
      <DocsSection
        title="API Key Endpoints"
        description="Complete API key management functionality"
      >
        {/* Create API Key */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/keys"
          title="Create API Key"
          description="Generate a new API key with custom name and optional permissions."
          requestBody={{
            description: "API key creation details",
            example: `{
  "name": "My Application Key",
  "description": "API key for my web application",
  "permissions": ["urls:read", "urls:write", "analytics:read"],
  "expiresAt": "2024-12-31T23:59:59Z"
}`
          }}
          responses={[
            {
              status: 201,
              description: "API key created successfully",
              example: `{
  "success": true,
  "data": {
    "id": "key_123abc",
    "name": "My Application Key",
    "description": "API key for my web application",
    "apiKey": "sk_live_1234567890abcdef...",
    "permissions": ["urls:read", "urls:write", "analytics:read"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "lastUsedAt": null
  }
}`
            },
            {
              status: 400,
              description: "Invalid request data",
              example: `{
  "error": "Invalid permissions",
  "message": "One or more permissions are invalid"
}`
            }
          ]}
          examples={[
            {
              title: "Create Basic API Key",
              request: `curl -X POST https://url.gameup.dev/api/keys \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My App Key",
    "description": "API key for production use"
  }'`,
              response: `{
  "success": true,
  "data": {
    "id": "key_123abc",
    "apiKey": "sk_live_1234567890abcdef...",
    "name": "My App Key"
  }
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "warning",
              content: "Store the API key securely immediately after creation. It will not be shown again in full."
            }
          ]}
        />

        {/* List API Keys */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/keys"
          title="List API Keys"
          description="Retrieve all API keys associated with your account."
          parameters={[
            {
              name: "status",
              type: "string",
              description: "Filter by key status",
              enum: ["active", "inactive", "expired"],
              example: "active"
            },
            {
              name: "limit",
              type: "number",
              description: "Number of keys to return",
              default: "50",
              example: "25"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "API keys retrieved successfully",
              example: `{
  "success": true,
  "data": {
    "keys": [
      {
        "id": "key_123abc",
        "name": "My Application Key",
        "description": "API key for my web application",
        "keyPreview": "sk_live_1234...cdef",
        "permissions": ["urls:read", "urls:write"],
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "lastUsedAt": "2024-01-20T14:22:00.000Z",
        "usageCount": 1250
      }
    ],
    "total": 3
  }
}`
            }
          ]}
          examples={[
            {
              title: "List All Active Keys",
              request: `curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://url.gameup.dev/api/keys?status=active`,
              response: `{
  "success": true,
  "data": {
    "keys": [...],
    "total": 3
  }
}`,
              language: "curl"
            }
          ]}
        />

        {/* Update API Key */}
        <ApiEndpoint
          method="PUT"
          endpoint="/api/keys/{id}"
          title="Update API Key"
          description="Update an existing API key's name, description, or permissions."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the API key",
              example: "key_123abc"
            }
          ]}
          requestBody={{
            description: "Fields to update",
            example: `{
  "name": "Updated Key Name",
  "description": "Updated description",
  "permissions": ["urls:read", "analytics:read"],
  "isActive": false
}`
          }}
          responses={[
            {
              status: 200,
              description: "API key updated successfully",
              example: `{
  "success": true,
  "data": {
    "id": "key_123abc",
    "name": "Updated Key Name",
    "description": "Updated description",
    "keyPreview": "sk_live_1234...cdef",
    "permissions": ["urls:read", "analytics:read"],
    "isActive": false,
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}`
            }
          ]}
        />

        {/* Rotate API Key */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/keys/{id}/rotate"
          title="Rotate API Key"
          description="Generate a new API key value while preserving the key's metadata and permissions."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the API key to rotate",
              example: "key_123abc"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "API key rotated successfully",
              example: `{
  "success": true,
  "data": {
    "id": "key_123abc",
    "name": "My Application Key",
    "newApiKey": "sk_live_9876543210fedcba...",
    "oldKeyValidUntil": "2024-01-25T15:30:00.000Z",
    "rotatedAt": "2024-01-20T15:30:00.000Z"
  },
  "message": "API key rotated successfully. Old key will remain valid for 5 days."
}`
            }
          ]}
          examples={[
            {
              title: "Rotate API Key",
              request: `curl -X POST https://url.gameup.dev/api/keys/key_123abc/rotate \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
              response: `{
  "success": true,
  "data": {
    "newApiKey": "sk_live_9876543210fedcba...",
    "oldKeyValidUntil": "2024-01-25T15:30:00.000Z"
  }
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "info",
              content: "After rotation, the old key remains valid for 5 days to allow for graceful transition in your applications."
            }
          ]}
        />

        {/* Delete API Key */}
        <ApiEndpoint
          method="DELETE"
          endpoint="/api/keys/{id}"
          title="Delete API Key"
          description="Permanently revoke and delete an API key."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the API key to delete",
              example: "key_123abc"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "API key deleted successfully",
              example: `{
  "success": true,
  "message": "API key deleted successfully",
  "deletedId": "key_123abc"
}`
            },
            {
              status: 404,
              description: "API key not found",
              example: `{
  "error": "Key not found",
  "message": "No API key found with the provided ID"
}`
            }
          ]}
          notes={[
            {
              type: "warning",
              content: "This action cannot be undone. The API key will become invalid immediately and all applications using it will lose access."
            }
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}

export default ApiKeysPage