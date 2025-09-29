import { NextPage } from 'next'
import { BarChart3, MousePointer, Globe, Monitor, Users } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { ApiEndpoint } from '@/components/docs/api-endpoint'

const AnalyticsAPIPage: NextPage = () => {
  return (
    <DocsPage
      title="Analytics API"
      description="Access comprehensive click analytics and user behavior data for your shortened URLs with detailed insights and flexible filtering."
      icon={<BarChart3 className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Get your API key",
            description: "Create an API key from your dashboard to authenticate requests.",
            code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/analytics/summary`
          },
          {
            title: "Fetch analytics data",
            description: "Get comprehensive analytics for a specific short URL.",
            code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/analytics/abc123`
          },
          {
            title: "Analyze performance",
            description: "Use the returned data to understand user behavior and optimize your links."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="Analytics Features"
        description="Comprehensive analytics and reporting capabilities"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="Click Analytics"
            description="Track total clicks, unique visitors, and click patterns"
            icon={<MousePointer className="h-6 w-6 text-rose-600" />}
            features={[
              "Total & unique clicks",
              "Click timestamps",
              "Time-based filtering",
              "Click trends"
            ]}
          />
          <OverviewCard
            title="Geographic Data"
            description="Understand where your clicks are coming from"
            icon={<Globe className="h-6 w-6 text-pink-600" />}
            features={[
              "Country breakdown",
              "Regional insights",
              "City-level data",
              "Geographic trends"
            ]}
          />
          <OverviewCard
            title="Device Insights"
            description="Analyze user devices and browser preferences"
            icon={<Monitor className="h-6 w-6 text-rose-600" />}
            features={[
              "Device types",
              "Browser statistics",
              "Operating systems",
              "Screen resolutions"
            ]}
          />
          <OverviewCard
            title="Traffic Sources"
            description="Track referrers and traffic acquisition"
            icon={<Users className="h-6 w-6 text-pink-600" />}
            features={[
              "Referrer domains",
              "Social media sources",
              "Direct traffic",
              "Campaign tracking"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Endpoints */}
      <DocsSection
        title="Analytics Endpoints"
        description="Access detailed analytics data for your shortened URLs"
      >
        {/* Analytics Overview */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/analytics"
          title="Analytics Overview"
          description="Get comprehensive analytics overview for all your URLs with aggregated statistics and trends."
          parameters={[
            {
              name: "period",
              type: "string",
              description: "Time period for analytics",
              enum: ["7d", "30d", "90d", "1y"],
              default: "30d",
              example: "30d"
            },
            {
              name: "from",
              type: "string", 
              description: "Start date in ISO format (YYYY-MM-DD)",
              example: "2024-01-01"
            },
            {
              name: "to",
              type: "string",
              description: "End date in ISO format (YYYY-MM-DD)",
              example: "2024-01-31"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "Analytics data retrieved successfully",
              example: `{
  "success": true,
  "data": {
    "totalClicks": 15420,
    "totalUrls": 342,
    "activeUrls": 298,
    "period": {
      "from": "2024-01-01T00:00:00Z",
      "to": "2024-01-31T23:59:59Z"
    },
    "clicksByDay": [
      {
        "date": "2024-01-01",
        "mobile": 45,
        "desktop": 123,
        "tablet": 12,
        "total": 180
      }
    ],
    "topCountries": [
      {
        "country": "United States",
        "clicks": 5420
      }
    ],
    "topBrowsers": [
      {
        "browser": "Chrome",
        "clicks": 8920
      }
    ]
  }
}`
            }
          ]}
          examples={[
            {
              title: "Get 30-day Overview",
              request: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/analytics?period=30d`,
              response: `{
  "success": true,
  "data": {
    "totalClicks": 15420,
    "totalUrls": 342,
    "activeUrls": 298
  }
}`,
              language: "curl"
            }
          ]}
        />

        {/* URL-Specific Analytics */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/analytics/{id}"
          title="URL Analytics"
          description="Get detailed analytics for a specific shortened URL including click patterns and user behavior."
          parameters={[
            {
              name: "id",
              type: "string",
              required: true,
              description: "The unique identifier of the URL",
              example: "clm123abc"
            },
            {
              name: "period",
              type: "string",
              description: "Time period for analytics",
              enum: ["7d", "30d", "90d", "1y"],
              default: "30d",
              example: "7d"
            },
            {
              name: "from",
              type: "string",
              description: "Start date in ISO format (YYYY-MM-DD)",
              example: "2024-01-01"
            },
            {
              name: "to",
              type: "string",
              description: "End date in ISO format (YYYY-MM-DD)",
              example: "2024-01-31"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "URL-specific analytics retrieved successfully",
              example: `{
  "success": true,
  "data": {
    "urlId": "clm123abc",
    "shortCode": "abc123",
    "originalUrl": "https://example.com/long-url",
    "title": "Example Page",
    "totalClicks": 542,
    "uniqueClicks": 398,
    "clicksByDay": [
      {
        "date": "2024-01-20",
        "mobile": 15,
        "desktop": 42,
        "tablet": 3,
        "total": 60
      }
    ],
    "topCountries": [
      {
        "country": "United States",
        "clicks": 234
      }
    ],
    "recentClicks": [
      {
        "country": "United States",
        "browser": "Chrome",
        "device": "desktop",
        "clickedAt": "2024-01-20T15:30:45Z",
        "isBot": false
      }
    ]
  }
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
          examples={[
            {
              title: "Get URL Analytics",
              request: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/analytics/abc123`,
              response: `{
  "success": true,
  "data": {
    "totalClicks": 542,
    "uniqueClicks": 398,
    "clicksByDay": [...]
  }
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "info",
              content: "Analytics data is updated in real-time but may have a delay of up to 5 minutes for high-traffic URLs."
            }
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}

export default AnalyticsAPIPage