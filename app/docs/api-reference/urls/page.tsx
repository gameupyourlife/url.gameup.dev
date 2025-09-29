import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    Database,
    Plus,
    Edit,
    Trash2, Eye
} from 'lucide-react'

const URLManagementPage: NextPage = () => {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/docs" className="hover:text-primary transition-colors">
          Documentation
        </Link>
        <span className="mx-2">/</span>
        <Link href="/docs/api-reference" className="hover:text-primary transition-colors">
          API Reference
        </Link>
        <span className="mx-2">/</span>
        <span>URL Management</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">URL Management API</h1>
            <p className="text-muted-foreground text-lg">
              Create, retrieve, update, and delete shortened URLs programmatically
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            The URL Management API allows you to perform CRUD operations on your shortened URLs. 
            All endpoints require authentication via API key or session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Plus className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">Create URLs</div>
              <div className="text-sm text-muted-foreground">Generate short links</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">List URLs</div>
              <div className="text-sm text-muted-foreground">Get all your links</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Edit className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="font-semibold">Update URLs</div>
              <div className="text-sm text-muted-foreground">Modify existing links</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Trash2 className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="font-semibold">Delete URLs</div>
              <div className="text-sm text-muted-foreground">Remove old links</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="create">Create URL</TabsTrigger>
          <TabsTrigger value="list">List URLs</TabsTrigger>
          <TabsTrigger value="get">Get URL</TabsTrigger>
          <TabsTrigger value="update">Update URL</TabsTrigger>
          <TabsTrigger value="delete">Delete URL</TabsTrigger>
        </TabsList>

        {/* Create URL */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">POST</Badge>
                <code className="text-lg font-mono">/api/urls</code>
              </div>
              <CardDescription>
                Create a new shortened URL with optional custom alias and metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Request Body</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "url": "https://example.com/very-long-url",
  "shortCode": "my-link",        // Optional custom alias
  "title": "My Example Link",    // Optional title
  "description": "An example link", // Optional description
  "expiresAt": "2024-12-31T23:59:59Z" // Optional expiration
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": "url_123",
    "shortCode": "my-link",
    "url": "https://example.com/very-long-url",
    "title": "My Example Link",
    "description": "An example link",
    "shortUrl": "https://yourdomain.com/my-link",
    "clicks": 0,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Example Request</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`curl -X POST "https://yourdomain.com/api/urls" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/very-long-url",
    "shortCode": "my-link",
    "title": "My Example Link"
  }'`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List URLs */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">GET</Badge>
                <code className="text-lg font-mono">/api/urls</code>
              </div>
              <CardDescription>
                Retrieve a paginated list of your shortened URLs with optional filtering.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Query Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-24">page</code>
                    <span>Page number (default: 1)</span>
                  </div>
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-24">limit</code>
                    <span>Items per page (default: 20, max: 100)</span>
                  </div>
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-24">search</code>
                    <span>Search URLs by title, description, or original URL</span>
                  </div>
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-24">active</code>
                    <span>Filter by active status (true/false)</span>
                  </div>
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-24">sort</code>
                    <span>Sort by: created_at, updated_at, clicks (default: created_at)</span>
                  </div>
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-24">order</code>
                    <span>Sort order: asc, desc (default: desc)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "urls": [
      {
        "id": "url_123",
        "shortCode": "my-link",
        "url": "https://example.com/very-long-url",
        "title": "My Example Link",
        "shortUrl": "https://yourdomain.com/my-link",
        "clicks": 42,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Get URL */}
        <TabsContent value="get" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">GET</Badge>
                <code className="text-lg font-mono">/api/urls/{'{id}'}</code>
              </div>
              <CardDescription>
                Retrieve detailed information about a specific shortened URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Path Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <code className="bg-muted px-2 py-1 rounded min-w-16">id</code>
                    <span>The URL ID or short code</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": "url_123",
    "shortCode": "my-link",
    "url": "https://example.com/very-long-url",
    "title": "My Example Link",
    "description": "An example link",
    "shortUrl": "https://yourdomain.com/my-link",
    "clicks": 42,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z",
    "expiresAt": "2024-12-31T23:59:59Z",
    "analytics": {
      "totalClicks": 42,
      "uniqueClicks": 38,
      "last24Hours": 5,
      "last7Days": 23
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Update URL */}
        <TabsContent value="update" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-orange-100 text-orange-800">PUT</Badge>
                <code className="text-lg font-mono">/api/urls/{'{id}'}</code>
              </div>
              <CardDescription>
                Update an existing shortened URL&apos;s metadata and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Request Body</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "title": "Updated Title",        // Optional
  "description": "Updated desc",   // Optional
  "isActive": false,              // Optional
  "expiresAt": "2024-12-31T23:59:59Z" // Optional
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Toggle Active Status</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`POST /api/urls/{id}/toggle

// Response:
{
  "success": true,
  "data": {
    "id": "url_123",
    "isActive": false,
    "message": "URL deactivated successfully"
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delete URL */}
        <TabsContent value="delete" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">DELETE</Badge>
                <code className="text-lg font-mono">/api/urls/{'{id}'}</code>
              </div>
              <CardDescription>
                Permanently delete a shortened URL and all its associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300">Warning</h4>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      This action cannot be undone. The short URL will become inactive immediately 
                      and all click analytics data will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "message": "URL deleted successfully"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
          <CardDescription>
            Common error responses you may encounter when using the URL Management API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">HTTP Status Codes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-4">
                  <Badge variant="default" className="min-w-12">200</Badge>
                  <span>Success - Request completed successfully</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="default" className="min-w-12">201</Badge>
                  <span>Created - Resource created successfully</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="destructive" className="min-w-12">400</Badge>
                  <span>Bad Request - Invalid request data or parameters</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="destructive" className="min-w-12">401</Badge>
                  <span>Unauthorized - Invalid or missing API key</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="destructive" className="min-w-12">403</Badge>
                  <span>Forbidden - Insufficient permissions for this resource</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="destructive" className="min-w-12">404</Badge>
                  <span>Not Found - URL not found or doesn&apos;t belong to you</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="destructive" className="min-w-12">409</Badge>
                  <span>Conflict - Short code already exists</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="destructive" className="min-w-12">429</Badge>
                  <span>Rate Limit Exceeded - Too many requests</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/docs/api-reference">
            <ArrowLeft className="mr-2 h-4 w-4" />
            API Overview
          </Link>
        </Button>
        <Button asChild>
          <Link href="/docs/api-reference/analytics">
            Analytics API
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default URLManagementPage