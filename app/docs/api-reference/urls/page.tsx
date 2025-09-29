import { NextPage } from 'next'
import { Link2, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { ApiEndpoint } from '@/components/docs/api-endpoint'

const URLManagementPage: NextPage = () => {
  return (
    <DocsPage
      title="URL Management API"
      description="Create, retrieve, update, and delete shortened URLs programmatically with full CRUD operations and advanced features."
      icon={<Link2 className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Get your API key",
            description: "Create an API key from your dashboard to authenticate requests.",
            code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/urls`
          },
          {
            title: "Create your first short URL",
            description: "Make a POST request to create a shortened URL.",
            code: `curl -X POST https://url.gameup.dev/api/urls \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`
          },
          {
            title: "Start shortening URLs",
            description: "Use the returned short URL in your applications and track analytics."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="Features"
        description="Comprehensive URL management with advanced features"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="Create URLs"
            description="Generate short links with custom aliases and metadata"
            icon={<Plus className="h-6 w-6 text-rose-600" />}
            features={[
              "Custom short codes",
              "Expiration dates", 
              "Title and description",
              "Bulk creation"
            ]}
          />
          <OverviewCard
            title="List & Filter"
            description="Retrieve and filter your shortened URLs"
            icon={<Eye className="h-6 w-6 text-pink-600" />}
            features={[
              "Pagination support",
              "Filter by status", 
              "Search by title",
              "Sort by date"
            ]}
          />
          <OverviewCard
            title="Update URLs"
            description="Modify existing URLs and their properties"
            icon={<Edit className="h-6 w-6 text-rose-600" />}
            features={[
              "Change destination URL",
              "Update metadata",
              "Toggle active status",
              "Extend expiration"
            ]}
          />
          <OverviewCard
            title="Analytics Ready"
            description="Built-in tracking for comprehensive analytics"
            icon={<Trash2 className="h-6 w-6 text-pink-600" />}
            features={[
              "Click tracking",
              "Geographic data",
              "Referrer information", 
              "Device insights"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Endpoints */}
      <DocsSection
        title="API Endpoints"
        description="Complete reference for all URL management endpoints"
      >
        {/* Create URL */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/urls"
          title="Create URL"
          description="Create a new shortened URL with optional custom alias and metadata."
          parameters={[
            {
              name: "url",
              type: "string",
              required: true,
              description: "The URL to shorten (must be valid HTTP/HTTPS)",
              example: "https://example.com/very-long-url"
            },
            {
              name: "shortCode",
              type: "string",
              description: "Custom alias for the shortened URL (optional)",
              example: "my-link"
            },
            {
              name: "title",
              type: "string", 
              description: "Optional title for the URL",
              example: "My Example Link"
            },
            {
              name: "description",
              type: "string",
              description: "Optional description",
              example: "An example link for testing"
            },
            {
              name: "expiresAt",
              type: "string",
              description: "ISO 8601 date when the URL should expire",
              example: "2024-12-31T23:59:59Z"
            }
          ]}
          requestBody={{
            description: "JSON payload with URL details",
            example: `{
  "url": "https://example.com/very-long-url",
  "shortCode": "my-link",
  "title": "My Example Link", 
  "description": "An example link",
  "expiresAt": "2024-12-31T23:59:59Z"
}`
          }}
          responses={[
            {
              status: 201,
              description: "URL created successfully",
              example: `{
  "id": "clm123abc",
  "shortUrl": "https://url.gameup.dev/my-link",
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "my-link",
  "title": "My Example Link",
  "description": "An example link", 
  "clicks": 0,
  "isActive": true,
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}`
            },
            {
              status: 400,
              description: "Invalid request data",
              example: `{
  "error": "Invalid URL format",
  "message": "The provided URL is not a valid HTTP/HTTPS URL"
}`
            }
          ]}
          examples={[
            {
              title: "Basic URL Creation",
              request: `curl -X POST https://url.gameup.dev/api/urls \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com"
  }'`,
              response: `{
  "id": "clm123abc",
  "shortUrl": "https://url.gameup.dev/abc123",
  "originalUrl": "https://example.com",
  "shortCode": "abc123",
  "clicks": 0,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}`,
              language: "curl"
            }
          ]}
        />

        {/* List URLs */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/urls"
          title="List URLs"
          description="Retrieve a paginated list of your shortened URLs with optional filtering."
          parameters={[
            {
              name: "page",
              type: "number",
              description: "Page number for pagination",
              default: "1",
              example: "1"
            },
            {
              name: "limit",
              type: "number", 
              description: "Number of URLs per page (max 100)",
              default: "20",
              example: "20"
            },
            {
              name: "search",
              type: "string",
              description: "Search term for title or URL",
              example: "example"
            },
            {
              name: "status",
              type: "string",
              description: "Filter by status",
              enum: ["active", "inactive", "expired"],
              example: "active"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "List of URLs retrieved successfully",
              example: `{
  "urls": [
    {
      "id": "clm123abc",
      "shortUrl": "https://url.gameup.dev/abc123",
      "originalUrl": "https://example.com",
      "title": "Example Site",
      "clicks": 42,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}`
            }
          ]}
          examples={[
            {
              title: "List All URLs",
              request: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/urls`,
              response: `{
  "urls": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}`,
              language: "curl"
            }
          ]}
        />

        {/* Get Single URL */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/urls/{id}"
          title="Get URL"
          description="Retrieve detailed information about a specific shortened URL."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the URL",
              example: "clm123abc"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "URL details retrieved successfully",
              example: `{
  "id": "clm123abc",
  "shortUrl": "https://url.gameup.dev/abc123",
  "originalUrl": "https://example.com",
  "shortCode": "abc123",
  "title": "Example Site",
  "description": "A test URL",
  "clicks": 42,
  "isActive": true,
  "expiresAt": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}`
            },
            {
              status: 404,
              description: "URL not found",
              example: `{
  "error": "URL not found",
  "message": "No URL found with the provided ID"
}`
            }
          ]}
        />

        {/* Update URL */}
        <ApiEndpoint
          method="PUT"
          endpoint="/api/urls/{id}"
          title="Update URL"
          description="Update an existing shortened URL's properties."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the URL to update",
              example: "clm123abc"
            }
          ]}
          requestBody={{
            description: "JSON payload with fields to update",
            example: `{
  "url": "https://updated-example.com",
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false
}`
          }}
          responses={[
            {
              status: 200,
              description: "URL updated successfully",
              example: `{
  "id": "clm123abc",
  "shortUrl": "https://url.gameup.dev/abc123",
  "originalUrl": "https://updated-example.com",
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false,
  "updatedAt": "2024-01-15T11:30:00.000Z"
}`
            }
          ]}
          notes={[
            {
              type: "info",
              content: "You can update multiple fields in a single request. Only provided fields will be updated."
            }
          ]}
        />

        {/* Delete URL */}
        <ApiEndpoint
          method="DELETE"
          endpoint="/api/urls/{id}"
          title="Delete URL"
          description="Permanently delete a shortened URL."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the URL to delete",
              example: "clm123abc"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "URL deleted successfully",
              example: `{
  "message": "URL deleted successfully",
  "deletedId": "clm123abc"
}`
            },
            {
              status: 404,
              description: "URL not found",
              example: `{
  "error": "URL not found",
  "message": "No URL found with the provided ID"
}`
            }
          ]}
          notes={[
            {
              type: "warning",
              content: "This action cannot be undone. The short URL will become inactive immediately and all click analytics data will be permanently deleted."
            }
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}

export default URLManagementPage