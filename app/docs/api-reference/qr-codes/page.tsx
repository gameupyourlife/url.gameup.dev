import { NextPage } from 'next'
import { QrCode, Download, Palette, Shield } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { ApiEndpoint } from '@/components/docs/api-endpoint'

const QRCodesPage: NextPage = () => {
  return (
    <DocsPage
      title="QR Codes API"
      description="Generate customizable QR codes for your shortened URLs with extensive customization options and multiple output formats."
      icon={<QrCode className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Generate a basic QR code",
            description: "Create a QR code for any URL without authentication.",
            code: `curl "https://url.gameup.dev/api/qr?url=https://example.com"`
          },
          {
            title: "Customize your QR code",
            description: "Add colors, sizes, and format options.",
            code: `curl "https://url.gameup.dev/api/qr?url=https://example.com&size=200&color=ff0000&format=svg"`
          },
          {
            title: "Use with shortened URLs",
            description: "Generate QR codes for your existing short URLs with authentication."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="QR Code Features"
        description="Comprehensive QR code generation with advanced customization"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="Multiple Formats"
            description="Generate QR codes in various formats for different use cases"
            icon={<Download className="h-6 w-6 text-rose-600" />}
            features={[
              "PNG images",
              "SVG vectors",
              "Base64 data URLs",
              "Custom dimensions"
            ]}
          />
          <OverviewCard
            title="Full Customization"
            description="Customize appearance to match your brand"
            icon={<Palette className="h-6 w-6 text-pink-600" />}
            features={[
              "Custom colors",
              "Error correction levels",
              "Size options",
              "Margin controls"
            ]}
          />
          <OverviewCard
            title="Access Control"
            description="Public and authenticated endpoints for different needs"
            icon={<Shield className="h-6 w-6 text-rose-600" />}
            features={[
              "Public QR generation",
              "Authenticated endpoints",
              "Short URL integration",
              "Bulk generation"
            ]}
          />
          <OverviewCard
            title="High Performance"
            description="Optimized generation with caching and CDN delivery"
            icon={<QrCode className="h-6 w-6 text-pink-600" />}
            features={[
              "Fast generation",
              "CDN cached results",
              "Multiple sizes",
              "Batch processing"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Endpoints */}
      <DocsSection
        title="QR Code Endpoints"
        description="Generate and customize QR codes with powerful API endpoints"
      >
        {/* Public QR Code Generation */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/qr"
          title="Generate QR Code (Public)"
          description="Generate a QR code for any URL without authentication. Perfect for public tools and integrations."
          authRequired={false}
          parameters={[
            {
              name: "url",
              type: "string",
              required: true,
              description: "The URL to encode in the QR code",
              example: "https://example.com"
            },
            {
              name: "size",
              type: "number",
              description: "Size in pixels (50-2000)",
              default: "200",
              example: "300"
            },
            {
              name: "format",
              type: "string",
              description: "Output format",
              enum: ["png", "svg", "dataurl"],
              default: "png",
              example: "svg"
            },
            {
              name: "color",
              type: "string",
              description: "Foreground color (hex without #)",
              default: "000000",
              example: "ff0000"
            },
            {
              name: "bgcolor",
              type: "string",
              description: "Background color (hex without #)",
              default: "ffffff",
              example: "f0f0f0"
            },
            {
              name: "margin",
              type: "number",
              description: "Margin size in modules",
              default: "4",
              example: "2"
            },
            {
              name: "errorlevel",
              type: "string",
              description: "Error correction level",
              enum: ["L", "M", "Q", "H"],
              default: "M",
              example: "H"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "QR code generated successfully",
              example: "Binary image data (PNG) or SVG markup or base64 data URL depending on format"
            },
            {
              status: 400,
              description: "Invalid parameters",
              example: `{
  "error": "Invalid URL",
  "message": "The provided URL is not valid"
}`
            }
          ]}
          examples={[
            {
              title: "Basic QR Code",
              request: `curl "https://url.gameup.dev/api/qr?url=https://example.com"`,
              response: "[Binary PNG image data]",
              language: "curl"
            },
            {
              title: "Custom SVG QR Code",
              request: `curl "https://url.gameup.dev/api/qr?url=https://example.com&size=300&format=svg&color=0066cc"`,
              response: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <!-- SVG QR code markup -->
</svg>`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "info",
              content: "This endpoint does not require authentication and can be used publicly. Rate limits apply based on IP address."
            }
          ]}
        />

        {/* QR Code for Short URLs */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/urls/{id}/qr"
          title="Get QR Code for Short URL"
          description="Generate a QR code for an existing shortened URL with full customization options."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the shortened URL",
              example: "clm123abc"
            },
            {
              name: "size",
              type: "number",
              description: "Size in pixels (50-2000)",
              default: "200",
              example: "400"
            },
            {
              name: "format",
              type: "string",
              description: "Output format",
              enum: ["png", "svg", "dataurl"],
              default: "png",
              example: "svg"
            },
            {
              name: "color",
              type: "string",
              description: "Foreground color (hex without #)",
              default: "000000",
              example: "333333"
            },
            {
              name: "bgcolor",
              type: "string",
              description: "Background color (hex without #)",
              default: "ffffff",
              example: "f8f9fa"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "QR code for short URL generated successfully",
              example: "Binary image data or SVG markup depending on format"
            },
            {
              status: 404,
              description: "Short URL not found",
              example: `{
  "error": "URL not found",
  "message": "No URL found with the provided ID"
}`
            }
          ]}
          examples={[
            {
              title: "Get QR Code for Short URL",
              request: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://url.gameup.dev/api/urls/abc123/qr?size=300&format=png"`,
              response: "[Binary PNG image data]",
              language: "curl"
            }
          ]}
        />

        {/* Bulk QR Code Generation */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/qr/bulk"
          title="Bulk QR Code Generation"
          description="Generate multiple QR codes in a single request for batch processing."
          requestBody={{
            description: "Array of QR code generation requests",
            example: `{
  "requests": [
    {
      "url": "https://example.com/page1",
      "size": 200,
      "format": "png",
      "filename": "qr1"
    },
    {
      "url": "https://example.com/page2", 
      "size": 300,
      "format": "svg",
      "filename": "qr2"
    }
  ],
  "options": {
    "color": "000000",
    "bgcolor": "ffffff",
    "errorlevel": "M"
  }
}`
          }}
          responses={[
            {
              status: 200,
              description: "Bulk QR codes generated successfully",
              example: `{
  "success": true,
  "results": [
    {
      "filename": "qr1",
      "url": "https://example.com/page1",
      "qrCode": "data:image/png;base64,iVBOR...",
      "size": 200,
      "format": "png"
    },
    {
      "filename": "qr2", 
      "url": "https://example.com/page2",
      "qrCode": "<svg xmlns='http://www.w3.org/2000/svg'...",
      "size": 300,
      "format": "svg"
    }
  ],
  "count": 2
}`
            },
            {
              status: 400,
              description: "Invalid bulk request",
              example: `{
  "error": "Invalid request",
  "message": "Maximum 50 QR codes per request"
}`
            }
          ]}
          examples={[
            {
              title: "Generate Multiple QR Codes",
              request: `curl -X POST https://url.gameup.dev/api/qr/bulk \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "requests": [
      {"url": "https://example.com/1", "filename": "qr1"},
      {"url": "https://example.com/2", "filename": "qr2"}
    ]
  }'`,
              response: `{
  "success": true,
  "results": [...],
  "count": 2
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "warning",
              content: "Bulk requests are limited to 50 QR codes per request to ensure optimal performance."
            }
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}

export default QRCodesPage