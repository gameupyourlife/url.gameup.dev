import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    ArrowRight,
    Key,
    Code,
    CheckCircle, ExternalLink
} from 'lucide-react'

const GettingStartedPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/docs" className="hover:text-primary transition-colors">
            Documentation
          </Link>
          <span className="mx-2">/</span>
          <span>Getting Started</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Getting Started</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to integrate with our URL Shortener API in just a few steps
          </p>
        </div>

        {/* Quick Start Steps */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Follow these steps to get started with the API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Create an API Key</h3>
                  <p className="text-muted-foreground mb-3">
                    Sign up for an account and create your first API key from the dashboard
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/settings?tab=security">
                      Create API Key
                      <Key className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Make Your First Request</h3>
                  <p className="text-muted-foreground mb-3">
                    Test the API by creating your first shortened URL
                  </p>
                  <div className="bg-muted rounded-lg p-4">
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
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Explore the Documentation</h3>
                  <p className="text-muted-foreground mb-3">
                    Check out all available endpoints and advanced features
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/docs/api-reference">
                      API Reference
                      <Code className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">API Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Base URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded p-3 font-mono text-sm">
                  https://url.gameup.dev/api
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">API Key</Badge>
                  <Badge variant="outline">Session</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Include your API key in the Authorization header
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authentication Example */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Include your API key in the Authorization header for all requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm">
{`Authorization: Bearer gup_your_api_key_here`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Your API key starts with <code className="bg-muted px-1 rounded">gup_</code> and can be found in your dashboard settings.
            </p>
          </CardContent>
        </Card>

        {/* Response Format */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Response Format</CardTitle>
            <CardDescription>
              All API responses follow a consistent JSON format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Success Response</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">
{`{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Error Response</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">
{`{
  "success": false,
  "error": "Error message",
  "errors": { ... } // For validation errors
}`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HTTP Status Codes */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>HTTP Status Codes</CardTitle>
            <CardDescription>
              Standard HTTP status codes used by the API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-green-100 text-green-800">200</Badge>
                  <span className="text-sm">Success</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-red-100 text-red-800">400</Badge>
                  <span className="text-sm">Bad Request</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-red-100 text-red-800">401</Badge>
                  <span className="text-sm">Unauthorized</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-red-100 text-red-800">403</Badge>
                  <span className="text-sm">Forbidden</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-red-100 text-red-800">404</Badge>
                  <span className="text-sm">Not Found</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-red-100 text-red-800">500</Badge>
                  <span className="text-sm">Server Error</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>
              API usage limits to ensure fair usage for all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="font-medium">Standard Rate Limit</span>
                <Badge>1,000 requests/hour</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="font-medium">Burst Limit</span>
                <Badge>100 requests/minute</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Rate limit headers are included in all responses to help you track your usage.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Now that you know the basics, explore more advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/docs/authentication">
                  <Key className="mr-2 h-4 w-4" />
                  Authentication Guide
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/url-management">
                  <Code className="mr-2 h-4 w-4" />
                  URL Management
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/analytics">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Analytics API
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/examples">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Code Examples
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <Button variant="ghost" asChild>
            <Link href="/docs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/authentication">
              Authentication
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GettingStartedPage