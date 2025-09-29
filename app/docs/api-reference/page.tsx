import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Link2,
    BarChart3,
    User,
    Key,
    QrCode,
    Zap,
    ArrowRight,
    CheckCircle,
    Clock
} from 'lucide-react'

const ApiReferencePage: NextPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">API Reference</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete reference for all API endpoints with examples, authentication, and comprehensive guides for building with our URL shortening platform.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            REST API
          </Badge>
          <Badge variant="outline" className="bg-pink-50 text-pink-800 border-pink-300">
            <Key className="w-3 h-3 mr-1" />
            API Key Auth
          </Badge>
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300">
            <Clock className="w-3 h-3 mr-1" />
            Rate Limited
          </Badge>
        </div>
      </div>

      {/* Quick Start */}
      <Card className="border-2 border-rose-200 bg-rose-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-rose-600" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get started with the API in minutes. All endpoints require authentication via API key or session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Get Your API Key</h4>
            <p className="text-sm text-muted-foreground mb-3">Create an API key from your dashboard or use session authentication.</p>
            <div className="bg-muted rounded-lg p-3">
              <code className="text-sm">Authorization: Bearer your-api-key</code>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">2. Make Your First Request</h4>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`curl -X POST "https://url.gameup.dev/api/shorten" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"originalUrl": "https://example.com"}'`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Overview */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">API Endpoints</h2>
          <p className="text-muted-foreground">
            Explore all available endpoints organized by functionality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* URL Management */}
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Link2 className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">URL Management</CardTitle>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </div>
              <CardDescription>
                Complete CRUD operations for shortened URLs with advanced features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">POST</Badge>
                  <code>/api/urls</code>
                  <span className="text-muted-foreground">- Create URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">GET</Badge>
                  <code>/api/urls</code>
                  <span className="text-muted-foreground">- List URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">PUT</Badge>
                  <code>/api/urls/{`{id}`}</code>
                  <span className="text-muted-foreground">- Update URLs</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/api-reference/urls">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Simple Shorten */}
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Simple Shorten</CardTitle>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </div>
              <CardDescription>
                Quick and simple URL shortening with minimal configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">POST</Badge>
                  <code>/api/shorten</code>
                  <span className="text-muted-foreground">- Quick shorten</span>
                </div>
                <p className="text-xs text-muted-foreground">Perfect for simple integrations and prototypes.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/api-reference/shorten">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* QR Codes */}
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <QrCode className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">QR Codes</CardTitle>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </div>
              <CardDescription>
                Generate customizable QR codes with multiple output formats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">GET</Badge>
                  <code>/api/qr-code/{`{code}`}</code>
                  <span className="text-muted-foreground">- Generate QR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">POST</Badge>
                  <code>/api/qr-code/generate</code>
                  <Badge variant="outline" className="bg-pink-50 text-pink-800 border-pink-300 text-xs ml-auto">Beta</Badge>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/api-reference/qr-codes">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </div>
              <CardDescription>
                Comprehensive analytics and reporting for click tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">GET</Badge>
                  <code>/api/analytics</code>
                  <span className="text-muted-foreground">- Overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">GET</Badge>
                  <code>/api/analytics/{`{id}`}</code>
                  <span className="text-muted-foreground">- URL stats</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/api-reference/analytics">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <User className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </div>
              <CardDescription>
                Manage user profiles and account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">GET</Badge>
                  <code>/api/profile</code>
                  <span className="text-muted-foreground">- Get profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">PUT</Badge>
                  <code>/api/profile</code>
                  <span className="text-muted-foreground">- Update profile</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/api-reference/profile">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Key className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">API Keys</CardTitle>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </div>
              <CardDescription>
                Create and manage API keys for programmatic access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">GET</Badge>
                  <code>/api/api-keys</code>
                  <span className="text-muted-foreground">- List keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">POST</Badge>
                  <code>/api/api-keys</code>
                  <span className="text-muted-foreground">- Create key</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/api-reference/api-keys">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Common Concepts */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">Common Concepts</h2>
          <p className="text-muted-foreground">
            Important concepts that apply across all API endpoints.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Authentication</CardTitle>
              <CardDescription>
                How to authenticate your API requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-rose-600" />
                  <span><strong>API Keys:</strong> Bearer token authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-pink-600" />
                  <span><strong>Sessions:</strong> Cookie-based dashboard authentication</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/docs/authentication">
                  Learn About Authentication
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate Limiting</CardTitle>
              <CardDescription>
                Understanding API usage limits and best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Standard endpoints:</span>
                  <code>100 req/min</code>
                </div>
                <div className="flex justify-between">
                  <span>QR generation:</span>
                  <code>40 req/min</code>
                </div>
                <div className="flex justify-between">
                  <span>Public endpoints:</span>
                  <code>50 req/min</code>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Limits are per IP address or authenticated user.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ready to Start Building?</CardTitle>
          <CardDescription>
            Get your API key and start building amazing applications with our URL shortening platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard/settings">
              Get API Key
              <Key className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/getting-started">
              Getting Started Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiReferencePage