import { NextPage } from 'next'
import { Link2, Zap, Globe, Shield } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { ApiEndpoint } from '@/components/docs/api-endpoint'

const ShortenPage: NextPage = () => {
  return (
    <DocsPage
      title="Shorten API"
      description="Quick and simple URL shortening with powerful features and comprehensive link management capabilities."
      icon={<Link2 className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Shorten a URL",
            description: "Create a short URL with a simple POST request.",
            code: `curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`
          },
          {
            title: "Custom alias",
            description: "Create a short URL with a custom alias.",
            code: `curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "alias": "my-link"}'`
          },
          {
            title: "Advanced options",
            description: "Set expiration, password protection, and more."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="Shortening Features"
        description="Comprehensive URL shortening with powerful customization options"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="Simple & Fast"
            description="Single endpoint for instant URL creation"
            icon={<Zap className="h-6 w-6 text-rose-600" />}
            features={[
              "Instant URL creation",
              "Auto-generated aliases",
              "Bulk operations",
              "High-speed processing"
            ]}
          />
          <OverviewCard
            title="Custom Aliases"
            description="Personalized short codes and branding"
            icon={<Globe className="h-6 w-6 text-pink-600" />}
            features={[
              "Custom short codes",
              "Brand-friendly URLs",
              "Vanity domains",
              "Alias validation"
            ]}
          />
          <OverviewCard
            title="Advanced Security"
            description="Password protection and access control"
            icon={<Shield className="h-6 w-6 text-rose-600" />}
            features={[
              "Password protection",
              "Expiration dates",
              "Access restrictions",
              "Malware scanning"
            ]}
          />
          <OverviewCard
            title="Smart Validation"
            description="Automatic URL and domain validation"
            icon={<Link2 className="h-6 w-6 text-pink-600" />}
            features={[
              "URL format validation",
              "Domain verification",
              "Duplicate detection",
              "Blacklist filtering"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Endpoints */}
      <DocsSection
        title="Shortening Endpoints"
        description="Create and manage shortened URLs with comprehensive customization options"
      >
        {/* Create Short URL */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/shorten"
          title="Create Short URL"
          description="Create a new shortened URL with optional customization including custom aliases, expiration dates, and password protection."
          requestBody={{
            description: "URL and optional configuration",
            example: `{
  "url": "https://example.com/very-long-url-that-needs-shortening",
  "alias": "my-custom-link",
  "title": "My Awesome Link",
  "description": "A description of this link",
  "tags": ["marketing", "campaign"],
  "expiresAt": "2024-12-31T23:59:59Z",
  "password": "secret123",
  "domain": "custom.domain.com",
  "utm": {
    "source": "newsletter",
    "medium": "email",
    "campaign": "product-launch"
  }
}`
          }}
          responses={[
            {
              status: 201,
              description: "Short URL created successfully",
              example: `{
  "success": true,
  "data": {
    "id": "url_123abc",
    "shortCode": "abc123",
    "shortUrl": "https://url.gameup.dev/abc123",
    "originalUrl": "https://example.com/very-long-url-that-needs-shortening",
    "title": "My Awesome Link",
    "description": "A description of this link",
    "tags": ["marketing", "campaign"],
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "password": true,
    "domain": "url.gameup.dev",
    "qrCode": "https://url.gameup.dev/qr/abc123.png",
    "createdAt": "2024-01-20T15:30:00.000Z",
    "updatedAt": "2024-01-20T15:30:00.000Z",
    "analytics": {
      "clicks": 0,
      "uniqueClicks": 0
    }
  },
  "message": "Short URL created successfully"
}`
            },
            {
              status: 400,
              description: "Invalid URL or configuration",
              example: `{
  "error": "Invalid URL",
  "message": "The provided URL is not valid or accessible"
}`
            },
            {
              status: 409,
              description: "Alias already exists",
              example: `{
  "error": "Alias taken",
  "message": "The alias 'my-custom-link' is already in use"
}`
            }
          ]}
          examples={[
            {
              title: "Basic URL Shortening",
              request: `curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com"
  }'`,
              response: `{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "https://url.gameup.dev/abc123",
    "originalUrl": "https://example.com"
  }
}`,
              language: "curl"
            },
            {
              title: "Custom Alias with Expiration",
              request: `curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/product",
    "alias": "summer-sale",
    "title": "Summer Sale 2024",
    "expiresAt": "2024-08-31T23:59:59Z"
  }'`,
              response: `{
  "success": true,
  "data": {
    "shortCode": "summer-sale",
    "shortUrl": "https://url.gameup.dev/summer-sale",
    "title": "Summer Sale 2024",
    "expiresAt": "2024-08-31T23:59:59.000Z"
  }
}`,
              language: "curl"
            },
            {
              title: "Password Protected Link",
              request: `curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/secret",
    "password": "mypassword123",
    "title": "Protected Resource"
  }'`,
              response: `{
  "success": true,
  "data": {
    "shortCode": "xyz789",
    "shortUrl": "https://url.gameup.dev/xyz789",
    "password": true,
    "title": "Protected Resource"
  }
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "info",
              content: "Anonymous users can create up to 10 URLs per day. Authenticated users have higher limits based on their plan."
            },
            {
              type: "warning",
              content: "Custom aliases are only available for authenticated users and must be unique."
            }
          ]}
        />

        {/* Bulk Shorten */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/shorten/bulk"
          title="Bulk Shorten URLs"
          description="Create multiple shortened URLs in a single request for efficient batch processing."
          requestBody={{
            description: "Array of URLs to shorten with optional configurations",
            example: `{
  "urls": [
    {
      "url": "https://example.com/page1",
      "alias": "page1",
      "title": "First Page"
    },
    {
      "url": "https://example.com/page2",
      "title": "Second Page",
      "tags": ["docs"]
    },
    {
      "url": "https://example.com/page3"
    }
  ],
  "defaultExpiration": "2024-12-31T23:59:59Z",
  "defaultTags": ["bulk", "import"]
}`
          }}
          responses={[
            {
              status: 201,
              description: "Bulk operation completed",
              example: `{
  "success": true,
  "data": {
    "total": 3,
    "successful": 2,
    "failed": 1,
    "results": [
      {
        "success": true,
        "data": {
          "shortCode": "page1",
          "shortUrl": "https://url.gameup.dev/page1",
          "originalUrl": "https://example.com/page1"
        }
      },
      {
        "success": true,
        "data": {
          "shortCode": "def456",
          "shortUrl": "https://url.gameup.dev/def456",
          "originalUrl": "https://example.com/page2"
        }
      },
      {
        "success": false,
        "error": "Invalid URL",
        "originalUrl": "invalid-url"
      }
    ]
  }
}`
            }
          ]}
          examples={[
            {
              title: "Bulk Create URLs",
              request: `curl -X POST https://url.gameup.dev/api/shorten/bulk \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      {"url": "https://example.com/1"},
      {"url": "https://example.com/2"}
    ]
  }'`,
              response: `{
  "success": true,
  "data": {
    "total": 2,
    "successful": 2,
    "results": [...]
  }
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "info",
              content: "Bulk operations are limited to 100 URLs per request. Failed URLs don't affect successful ones."
            }
          ]}
        />

        {/* Validate URL */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/shorten/validate"
          title="Validate URL"
          description="Check if a URL is valid and accessible before shortening, including malware and blacklist checks."
          requestBody={{
            description: "URL to validate",
            example: `{
  "url": "https://example.com/page-to-validate",
  "checkMalware": true,
  "checkBlacklist": true,
  "followRedirects": true
}`
          }}
          responses={[
            {
              status: 200,
              description: "URL validation result",
              example: `{
  "success": true,
  "data": {
    "url": "https://example.com/page-to-validate",
    "valid": true,
    "accessible": true,
    "statusCode": 200,
    "contentType": "text/html",
    "title": "Example Page Title",
    "description": "Page meta description",
    "favicon": "https://example.com/favicon.ico",
    "finalUrl": "https://example.com/page-to-validate",
    "redirects": 0,
    "security": {
      "malware": false,
      "phishing": false,
      "blacklisted": false,
      "ssl": true
    },
    "performance": {
      "responseTime": 250,
      "size": "45KB"
    }
  }
}`
            },
            {
              status: 400,
              description: "Invalid or unsafe URL",
              example: `{
  "success": false,
  "error": "URL validation failed",
  "data": {
    "valid": false,
    "accessible": false,
    "security": {
      "malware": true,
      "reason": "Detected malicious content"
    }
  }
}`
            }
          ]}
          examples={[
            {
              title: "Validate URL with Security Check",
              request: `curl -X POST https://url.gameup.dev/api/shorten/validate \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "checkMalware": true
  }'`,
              response: `{
  "success": true,
  "data": {
    "valid": true,
    "accessible": true,
    "security": {
      "malware": false,
      "ssl": true
    }
  }
}`,
              language: "curl"
            }
          ]}
        />

        {/* Check Alias Availability */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/shorten/alias/{alias}/available"
          title="Check Alias Availability"
          description="Check if a custom alias is available for use before creating a shortened URL."
          parameters={[
            {
              name: "alias",
              type: "string",
              description: "The custom alias to check",
              required: true,
              example: "my-custom-link"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "Alias availability checked",
              example: `{
  "success": true,
  "data": {
    "alias": "my-custom-link",
    "available": true,
    "suggestions": []
  }
}`
            },
            {
              status: 200,
              description: "Alias not available with suggestions",
              example: `{
  "success": true,
  "data": {
    "alias": "popular-link",
    "available": false,
    "suggestions": [
      "popular-link-1",
      "popular-link-2024",
      "my-popular-link"
    ]
  }
}`
            }
          ]}
          examples={[
            {
              title: "Check Alias Availability",
              request: `curl https://url.gameup.dev/api/shorten/alias/my-link/available`,
              response: `{
  "success": true,
  "data": {
    "alias": "my-link",
    "available": true
  }
}`,
              language: "curl"
            }
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}

export default ShortenPage