import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    Link2,
    BarChart3,
    User,
    Key,
    Settings
} from 'lucide-react'

const ApiReferencePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/docs" className="hover:text-primary transition-colors">
            Documentation
          </Link>
          <span className="mx-2">/</span>
          <span>API Reference</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">API Reference</h1>
          <p className="text-xl text-muted-foreground">
            Complete reference for all API endpoints with request/response examples
          </p>
        </div>

        <Tabs defaultValue="url-management" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="url-management" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              URLs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Auth
            </TabsTrigger>
          </TabsList>

          {/* URL Management */}
          <TabsContent value="url-management">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">URL Management</h2>
                <p className="text-muted-foreground mb-6">
                  Create, update, and manage your shortened URLs
                </p>
              </div>

              {/* Create Short URL */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">POST</Badge>
                        /api/shorten
                      </CardTitle>
                      <CardDescription>Create a new shortened URL</CardDescription>
                    </div>
                    <Badge variant="outline">write</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "originalUrl": "https://example.com/very/long/url",
  "customCode": "my-custom-code",    // Optional
  "expiresAt": "2024-12-31T23:59:59.000Z"  // Optional
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "success": true,
  "data": {
    "id": "uuid",
    "shortCode": "abc123",
    "shortUrl": "https://url.gameup.dev/abc123",
    "originalUrl": "https://example.com/very/long/url",
    "title": "Example Page",
    "clicks": 0,
    "isActive": true,
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "userId": "user-uuid"
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer gup_your_api_key_here" \\
  -d '{
    "originalUrl": "https://example.com/very/long/url"
  }'`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* List URLs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                        /api/urls
                      </CardTitle>
                      <CardDescription>Get all URLs for authenticated user</CardDescription>
                    </div>
                    <Badge variant="outline">read</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Query Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">page</code>
                        <span className="text-sm text-muted-foreground">Page number (default: 1)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm">limit</code>
                        <span className="text-sm text-muted-foreground">Items per page (default: 10, max: 100)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X GET "https://url.gameup.dev/api/urls?page=1&limit=10" \\
  -H "Authorization: Bearer gup_your_api_key_here"`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Update URL */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                        /api/urls/{"{id}"}
                      </CardTitle>
                      <CardDescription>Update an existing URL</CardDescription>
                    </div>
                    <Badge variant="outline">write</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "originalUrl": "https://example.com/updated-url",
  "customCode": "new-custom-code",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delete URL */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">DELETE</Badge>
                        /api/urls/{"{id}"}
                      </CardTitle>
                      <CardDescription>Delete a URL permanently</CardDescription>
                    </div>
                    <Badge variant="outline">write</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X DELETE https://url.gameup.dev/api/urls/your-url-id \\
  -H "Authorization: Bearer gup_your_api_key_here"`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                <p className="text-muted-foreground mb-6">
                  Access detailed analytics and insights for your URLs
                </p>
              </div>

              {/* Overall Analytics */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                        /api/analytics
                      </CardTitle>
                      <CardDescription>Get comprehensive analytics for all URLs</CardDescription>
                    </div>
                    <Badge variant="outline">read</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "success": true,
  "data": {
    "totalUrls": 15,
    "totalClicks": 1250,
    "activeUrls": 12,
    "clicksToday": 45,
    "clicksThisWeek": 320,
    "clicksThisMonth": 890,
    "topUrls": [...],
    "clickTrends": [...],
    "geographicData": [...],
    "deviceData": [...],
    "referrerData": [...]
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* URL-specific Analytics */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                        /api/analytics/{"{id}"}
                      </CardTitle>
                      <CardDescription>Get analytics for a specific URL</CardDescription>
                    </div>
                    <Badge variant="outline">read</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X GET https://url.gameup.dev/api/analytics/your-url-id \\
  -H "Authorization: Bearer gup_your_api_key_here"`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <p className="text-muted-foreground mb-6">
                  Manage user profiles and account settings
                </p>
              </div>

              {/* Get Profile */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                        /api/profile
                      </CardTitle>
                      <CardDescription>Get current user profile and statistics</CardDescription>
                    </div>
                    <Badge variant="outline">read</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "statistics": {
      "total_urls": 15,
      "active_urls": 12,
      "total_clicks": 1250,
      "urls_this_month": 5,
      "average_clicks": 83
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Update Profile */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                        /api/profile
                      </CardTitle>
                      <CardDescription>Update user profile information</CardDescription>
                    </div>
                    <Badge variant="outline">write</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "full_name": "Jane Doe",
  "email": "jane@example.com"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api-keys">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">API Key Management</h2>
                <p className="text-muted-foreground mb-6">
                  Create and manage API keys for programmatic access
                </p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> API key management endpoints require session authentication for security reasons.
                  </p>
                </div>
              </div>

              {/* Create API Key */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">POST</Badge>
                    /api/api-keys
                  </CardTitle>
                  <CardDescription>Create a new API key</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "name": "My Integration Key",
  "scopes": ["read", "write"],
  "expiresAt": "2024-12-31T23:59:59.000Z"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "id": "uuid",
    "name": "My Integration Key",
    "key": "gup_1234567890abcdef...",
    "keyPrefix": "gup_123456...",
    "scopes": ["read", "write"],
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "lastUsedAt": null,
    "usageCount": 0,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* List API Keys */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                    /api/api-keys
                  </CardTitle>
                  <CardDescription>Get all your API keys</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Returns a list of all API keys for the authenticated user with usage statistics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Authentication */}
          <TabsContent value="auth">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                <p className="text-muted-foreground mb-6">
                  Learn about API authentication and security
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>API Key Scopes</CardTitle>
                  <CardDescription>
                    API keys have different scopes that control access permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <code className="font-semibold">read</code>
                        <p className="text-sm text-muted-foreground">View URLs, analytics, and profile data</p>
                      </div>
                      <Badge variant="outline">Safe</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <code className="font-semibold">write</code>
                        <p className="text-sm text-muted-foreground">Create, update, and delete URLs; update profile</p>
                      </div>
                      <Badge variant="outline">Caution</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <code className="font-semibold">admin</code>
                        <p className="text-sm text-muted-foreground">Full access to all operations (future use)</p>
                      </div>
                      <Badge variant="destructive">Dangerous</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Store API keys securely - never expose them in client-side code</li>
                    <li>• Use environment variables for key storage</li>
                    <li>• Rotate keys regularly</li>
                    <li>• Use appropriate scopes - grant minimum permissions needed</li>
                    <li>• Monitor usage and revoke compromised keys immediately</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <Button variant="ghost" asChild>
            <Link href="/docs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/examples">
              View Examples
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ApiReferencePage