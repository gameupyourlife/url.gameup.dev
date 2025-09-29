import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    ArrowRight,
    Key,
    Shield,
    AlertTriangle,
    CheckCircle,
    Eye
} from 'lucide-react'

const AuthenticationPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/docs" className="hover:text-primary transition-colors">
            Documentation
          </Link>
          <span className="mx-2">/</span>
          <span>Authentication</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Authentication</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to authenticate with our API using API keys and understand security best practices
          </p>
        </div>

        {/* Authentication Methods */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Authentication Methods</CardTitle>
            <CardDescription>
              Our API supports two authentication methods depending on your use case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">API Key Authentication</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  For programmatic access and integrations. Include your API key in the Authorization header.
                </p>
                <Badge variant="outline">Recommended for integrations</Badge>
              </div>

              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">Session Authentication</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  For web applications. Uses secure HTTP cookies managed by the browser.
                </p>
                <Badge variant="outline">Used by web interface</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Setup */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Setting up API Keys</CardTitle>
            <CardDescription>
              Create and manage API keys for secure programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 1: Create an API Key</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Sign in to your account and go to Settings</li>
                <li>Navigate to the Security tab</li>
                <li>Click "Create API Key"</li>
                <li>Give your key a descriptive name</li>
                <li>Select appropriate scopes (read, write)</li>
                <li>Optionally set an expiration date</li>
                <li>Copy and store your API key securely</li>
              </ol>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/dashboard/settings?tab=security">
                    Create API Key
                    <Key className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Step 2: Use Your API Key</h3>
              <p className="text-muted-foreground mb-4">
                Include your API key in the Authorization header of all API requests:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm">
{`Authorization: Bearer gup_your_api_key_here`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Scopes */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>API Key Scopes</CardTitle>
            <CardDescription>
              Control what your API keys can access with granular permission scopes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <Eye className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">read</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    View URLs, analytics, and profile data. Safe for client-side applications and reporting tools.
                  </p>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    Allows: GET /api/urls, GET /api/analytics, GET /api/profile
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Shield className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">write</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Create, update, and delete URLs; update profile. Use carefully in server-side applications.
                  </p>
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    Allows: POST /api/shorten, PUT /api/urls, DELETE /api/urls, PUT /api/profile
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">admin</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Full access to all operations. Reserved for future administrative features.
                  </p>
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Status: Reserved for future use
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Best Practices */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Security Best Practices</CardTitle>
            <CardDescription>
              Follow these guidelines to keep your API keys and data secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Do This
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Store API keys in environment variables</li>
                  <li>• Use HTTPS for all API requests</li>
                  <li>• Rotate keys regularly (monthly/quarterly)</li>
                  <li>• Use minimum required scopes</li>
                  <li>• Monitor API key usage patterns</li>
                  <li>• Set expiration dates for temporary keys</li>
                  <li>• Revoke unused or compromised keys immediately</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Don't Do This
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Hard-code API keys in source code</li>
                  <li>• Include keys in client-side JavaScript</li>
                  <li>• Share keys via email or chat</li>
                  <li>• Use the same key across environments</li>
                  <li>• Grant excessive permissions</li>
                  <li>• Ignore unusual usage patterns</li>
                  <li>• Store keys in version control</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Authentication Errors</CardTitle>
            <CardDescription>
              Common authentication errors and how to handle them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">401</Badge>
                  <span className="font-semibold">Unauthorized</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  API key is missing, invalid, or expired.
                </p>
                <div className="bg-muted rounded p-3 text-xs">
                  <pre>{`{
  "success": false,
  "error": "Invalid or expired API key"
}`}</pre>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">403</Badge>
                  <span className="font-semibold">Forbidden</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  API key doesn't have required scope for the operation.
                </p>
                <div className="bg-muted rounded p-3 text-xs">
                  <pre>{`{
  "success": false,
  "error": "Insufficient permissions. Required scope: write"
}`}</pre>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">429</Badge>
                  <span className="font-semibold">Too Many Requests</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Rate limit exceeded. Wait and retry with exponential backoff.
                </p>
                <div className="bg-muted rounded p-3 text-xs">
                  <pre>{`{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds"
}`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Implementation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Example Implementation</CardTitle>
            <CardDescription>
              Secure API key handling in different languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Environment Variables</h4>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div>
                    <code className="text-sm">.env</code>
                    <pre className="text-xs mt-1">URL_SHORTENER_API_KEY=gup_your_api_key_here</pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">
{`const apiKey = process.env.URL_SHORTENER_API_KEY;

if (!apiKey) {
  throw new Error('API key not found in environment variables');
}

const headers = {
  'Authorization': \`Bearer \${apiKey}\`,
  'Content-Type': 'application/json'
};`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Python</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm">
{`import os

api_key = os.getenv('URL_SHORTENER_API_KEY')
if not api_key:
    raise ValueError('API key not found in environment variables')

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t">
          <Button variant="ghost" asChild>
            <Link href="/docs/getting-started">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Getting Started
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/url-management">
              URL Management
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuthenticationPage