'use client'

import { NextPage } from 'next'
import Link from 'next/link'
import { ArrowLeft, BarChart3, MousePointer, Globe, Monitor, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/breadcrumbs'

const AnalyticsAPIPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analytics API</h1>
              <p className="text-muted-foreground text-lg">
                Access comprehensive click analytics and user behavior data
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analytics API Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access comprehensive analytics data including click tracking, geographic data,
              browser/device statistics, and referrer information for your shortened URLs.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <MousePointer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">Clicks</div>
                <div className="text-sm text-muted-foreground">Total & unique clicks</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold">Geography</div>
                <div className="text-sm text-muted-foreground">Countries & regions</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Monitor className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold">Devices</div>
                <div className="text-sm text-muted-foreground">Browser & device types</div>
              </div>
              <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <Users className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <div className="font-semibold">Referrers</div>
                <div className="text-sm text-muted-foreground">Traffic sources</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="url-analytics">URL Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Analytics */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-blue-100 text-blue-800">GET</Badge>
                  <code className="text-lg font-mono">/api/analytics</code>
                </div>
                <CardDescription>
                  Get comprehensive analytics overview for all your URLs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Query Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">period</code>
                      <span>Time period: 7d, 30d, 90d, 1y (default: 30d)</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">from</code>
                      <span>Start date in ISO format (YYYY-MM-DD)</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">to</code>
                      <span>End date in ISO format (YYYY-MM-DD)</span>
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
      },
      {
        "country": "United Kingdom", 
        "clicks": 2890
      }
    ],
    "topBrowsers": [
      {
        "browser": "Chrome",
        "clicks": 8920
      }
    ],
    "topDevices": [
      {
        "device": "desktop",
        "clicks": 9240
      }
    ],
    "referrerTypes": [
      {
        "type": "social",
        "clicks": 4320
      },
      {
        "type": "direct",
        "clicks": 3890
      }
    ]
  }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* URL-Specific Analytics */}
          <TabsContent value="url-analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">GET</Badge>
                  <code className="text-lg font-mono">/api/analytics/{"{urlId}"}</code>
                </div>
                <CardDescription>
                  Get detailed analytics for a specific shortened URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Path Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">urlId</code>
                      <span>The unique identifier of the URL (required)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Query Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">period</code>
                      <span>Time period: 7d, 30d, 90d, 1y (default: 30d)</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">from</code>
                      <span>Start date in ISO format</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded min-w-24">to</code>
                      <span>End date in ISO format</span>
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
    "urlId": "url_123",
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
    "topBrowsers": [
      {
        "browser": "Chrome",
        "clicks": 298
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
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Limits & Performance</CardTitle>
            <CardDescription>
              Understanding rate limits and optimizing your analytics API usage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Rate Limits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free Plan:</span>
                    <code>100 requests/hour</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Developer Plan:</span>
                    <code>1,000 requests/hour</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise Plan:</span>
                    <code>10,000 requests/hour</code>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Performance Tips</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Cache analytics data when possible</li>
                  <li>• Use specific date ranges to reduce payload size</li>
                  <li>• Request only needed data fields</li>
                  <li>• Implement proper error handling and retries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/api-reference/urls">
              <ArrowLeft className="mr-2 h-4 w-4" />
              URL Management
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/api-reference/qr-codes">
              QR Codes API
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsAPIPage