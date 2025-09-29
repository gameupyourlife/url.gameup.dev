import { NextPage } from 'next'
import { Shield, Key, Lock, AlertTriangle } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { CodeBlock } from '@/components/docs/code-block'

const AuthenticationPage: NextPage = () => {
  return (
    <DocsPage
      title="Authentication"
      description="Secure API authentication using API keys with comprehensive security best practices and implementation guidelines."
      icon={<Shield className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Create API Key",
            description: "Generate your API key from the dashboard.",
            code: `# Get your API key from: https://url.gameup.dev/dashboard/settings
API_KEY="your-api-key-here"`
          },
          {
            title: "Make authenticated request",
            description: "Include your API key in the Authorization header.",
            code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/profile`
          },
          {
            title: "Handle authentication errors",
            description: "Implement proper error handling for auth failures."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="Authentication Methods"
        description="Choose the right authentication method for your integration needs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="API Key Authentication"
            description="Bearer token authentication for server-side applications"
            icon={<Key className="h-6 w-6 text-rose-600" />}
            features={[
              "Server-side integration",
              "Full API access",
              "Rate limit benefits",
              "Advanced features"
            ]}
          />
          <OverviewCard
            title="Anonymous Access"
            description="Limited public access without authentication"
            icon={<Lock className="h-6 w-6 text-pink-600" />}
            features={[
              "Basic URL shortening",
              "Rate limited",
              "No custom features",
              "Public endpoints only"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Key Authentication */}
      <DocsSection
        title="API Key Authentication"
        description="Secure authentication using Bearer tokens for full API access"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Getting Your API Key</h3>
            <p className="text-muted-foreground mb-4">
              To get started with authenticated requests, you&apos;ll need to create an API key from your dashboard:
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <Key className="h-5 w-5 text-rose-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-rose-800">Create API Key</p>
                  <p className="text-sm text-rose-700 mt-1">
                    Visit your <a href="https://url.gameup.dev/dashboard/settings" className="underline font-medium">dashboard settings</a> to generate a new API key with the appropriate permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Making Authenticated Requests</h3>
            <p className="text-muted-foreground mb-4">
              Include your API key in the <code className="px-2 py-1 bg-gray-100 rounded text-sm">Authorization</code> header using the Bearer token format:
            </p>
            <CodeBlock
              language="bash"
              code={`# Basic authenticated request
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/profile

# Create a short URL with authentication
curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "alias": "my-custom-link",
    "title": "My Link"
  }'`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">JavaScript Implementation</h3>
            <CodeBlock
              language="javascript"
              code={`class URLShortenerClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://url.gameup.dev/api';
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async handleErrorResponse(response) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 401:
        throw new Error(&apos;Invalid API key or unauthorized access&apos;);
      case 403:
        throw new Error('Insufficient permissions for this operation');
      case 429:
        throw new Error(&apos;The provided URL is not valid&apos;);
          case &apos;RATE_LIMIT_EXCEEDED&apos;:
            throw new Error(&apos;Rate limit exceeded. Please try again later&apos;);
      default:
        throw new Error(errorData.message || \`HTTP \${response.status}: \${response.statusText}\`);
    }
  }

  async createShortUrl(data) {
    return this.request('/shorten', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getProfile() {
    return this.request('/profile');
  }
}

// Usage
const client = new URLShortenerClient('your-api-key-here');

try {
  const profile = await client.getProfile();
  console.log('User profile:', profile);
} catch (error) {
  console.error('Authentication failed:', error.message);
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Python Implementation</h3>
            <CodeBlock
              language="python"
              code={`import requests
from typing import Optional, Dict, Any
import json

class URLShortenerClient:
    def __init__(self, api_key: str, base_url: str = "https://url.gameup.dev/api"):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            self._handle_error_response(response)
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {e}")
    
    def _handle_error_response(self, response: requests.Response):
        try:
            error_data = response.json()
            message = error_data.get('message', f'HTTP {response.status_code}')
        except json.JSONDecodeError:
            message = f'HTTP {response.status_code}: {response.reason}'
        
        if response.status_code == 401:
            raise Exception('Invalid API key or unauthorized access')
        elif response.status_code == 403:
            raise Exception('Insufficient permissions for this operation')
        elif response.status_code == 429:
            raise Exception('Rate limit exceeded. Please try again later')
        else:
            raise Exception(message)
    
    def create_short_url(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self.request('POST', '/shorten', json=data)
    
    def get_profile(self) -> Dict[str, Any]:
        return self.request('GET', '/profile')
    
    def get_analytics(self, short_code: str, period: str = '30d') -> Dict[str, Any]:
        return self.request('GET', f'/analytics/{short_code}', params={'period': period})

# Usage
client = URLShortenerClient('your-api-key-here')

try:
    profile = client.get_profile()
    print(f"User: {profile['data']['name']}")
except Exception as e:
    print(f"Authentication failed: {e}")`}
            />
          </div>
        </div>
      </DocsSection>

      {/* Anonymous Access */}
      <DocsSection
        title="Anonymous Access"
        description="Limited API access without authentication for basic URL shortening"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Public Endpoints</h3>
            <p className="text-muted-foreground mb-4">
              Some endpoints are available without authentication for basic URL shortening:
            </p>
            <CodeBlock
              language="bash"
              code={`# Create a short URL without authentication
curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'

# Validate a URL without authentication  
curl -X POST https://url.gameup.dev/api/shorten/validate \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Rate Limits for Anonymous Users</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-amber-800">Anonymous Rate Limits</p>
                  <div className="text-sm text-amber-700 mt-1 space-y-1">
                    <p>• 10 URLs per day per IP address</p>
                    <p>• 60 requests per hour</p>
                    <p>• No custom aliases or advanced features</p>
                    <p>• Limited analytics access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocsSection>

      {/* Security Best Practices */}
      <DocsSection
        title="Security Best Practices"
        description="Essential security guidelines for protecting your API keys and data"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">API Key Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">✅ Do</p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Store API keys in environment variables</li>
                      <li>• Use different keys for different environments</li>
                      <li>• Rotate keys regularly</li>
                      <li>• Restrict key permissions when possible</li>
                      <li>• Monitor key usage and logs</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">❌ Don&apos;t</p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1">
                      <li>• Commit keys to version control</li>
                      <li>• Expose keys in client-side code</li>
                      <li>• Share keys between applications</li>
                      <li>• Use keys in URLs or logs</li>
                      <li>• Ignore security alerts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Environment Variables</h3>
            <p className="text-muted-foreground mb-4">
              Always store your API keys in environment variables and never hardcode them in your source code:
            </p>
            <CodeBlock
              language="bash"
              code={`# .env file (never commit this!)
URL_SHORTENER_API_KEY=your-api-key-here
URL_SHORTENER_BASE_URL=https://url.gameup.dev/api

# Load in your application
export URL_SHORTENER_API_KEY="your-api-key-here"`}
            />
            
            <CodeBlock
              language="javascript"
              code={`// Node.js - load from environment
require('dotenv').config();

const client = new URLShortenerClient({
  apiKey: process.env.URL_SHORTENER_API_KEY,
  baseURL: process.env.URL_SHORTENER_BASE_URL
});`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Error Handling</h3>
            <p className="text-muted-foreground mb-4">
              Implement comprehensive error handling to gracefully manage authentication failures:
            </p>
            <CodeBlock
              language="javascript"
              code={`async function handleAuthenticatedRequest(client, operation) {
  try {
    return await operation();
  } catch (error) {
    switch (error.status || error.response?.status) {
      case 401:
        // Invalid API key - check configuration
        console.error('Authentication failed: Invalid API key');
        // Maybe redirect to re-authentication flow
        break;
      
      case 403:
        // Insufficient permissions - upgrade plan or request access
        console.error('Insufficient permissions for this operation');
        break;
      
      case 429:
        // Rate limit exceeded - implement backoff strategy
        console.error('Rate limit exceeded, retrying after delay...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        return handleAuthenticatedRequest(client, operation);
      
      case 500:
        // Server error - retry with exponential backoff
        console.error('Server error, retrying...');
        break;
      
      default:
        console.error('Unexpected error:', error.message);
    }
    throw error;
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Key Rotation</h3>
            <p className="text-muted-foreground mb-4">
              Regularly rotate your API keys for enhanced security:
            </p>
            <CodeBlock
              language="javascript"
              code={`class SecureURLClient {
  constructor() {
    this.primaryKey = process.env.URL_SHORTENER_PRIMARY_KEY;
    this.fallbackKey = process.env.URL_SHORTENER_FALLBACK_KEY;
    this.currentKey = this.primaryKey;
  }

  async request(endpoint, options = {}) {
    try {
      return await this.makeRequest(endpoint, this.currentKey, options);
    } catch (error) {
      if (error.status === 401 && this.fallbackKey) {
        console.warn('Primary key failed, trying fallback key');
        try {
          return await this.makeRequest(endpoint, this.fallbackKey, options);
        } catch (fallbackError) {
          console.error('Both keys failed - key rotation needed');
          throw new Error('All API keys invalid - please rotate keys');
        }
      }
      throw error;
    }
  }

  async makeRequest(endpoint, apiKey, options) {
    // Implementation of actual HTTP request
    const response = await fetch(\`https://url.gameup.dev/api\${endpoint}\`, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw { status: response.status, message: await response.text() };
    }

    return response.json();
  }
}`}
            />
          </div>
        </div>
      </DocsSection>

      {/* Common Authentication Issues */}
      <DocsSection
        title="Troubleshooting"
        description="Common authentication issues and how to resolve them"
      >
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">401 Unauthorized</h4>
            <p className="text-muted-foreground mb-4">Your API key is invalid or missing.</p>
            <div className="space-y-2 text-sm">
              <p>• Check that your API key is correctly set in the Authorization header</p>
              <p>• Verify the key hasn&apos;t been revoked or expired</p>
              <p>• Ensure you&apos;re using the Bearer token format: <code className="px-1 py-0.5 bg-gray-100 rounded">Bearer YOUR_KEY</code></p>
              <p>• Generate a new API key from your dashboard if needed</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">403 Forbidden</h4>
            <p className="text-muted-foreground mb-4">Your API key doesn&apos;t have permission for this operation.</p>
            <div className="space-y-2 text-sm">
              <p>• Check your subscription plan limits</p>
              <p>• Verify the API key has the required scopes</p>
              <p>• Some features require paid plans</p>
              <p>• Contact support if you believe this is an error</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">429 Too Many Requests</h4>
            <p className="text-muted-foreground mb-4">You&apos;ve exceeded the rate limit for your plan.</p>
            <div className="space-y-2 text-sm">
              <p>• Implement exponential backoff in your retry logic</p>
              <p>• Check the <code className="px-1 py-0.5 bg-gray-100 rounded">X-RateLimit-Reset</code> header for retry timing</p>
              <p>• Consider upgrading to a higher plan for increased limits</p>
              <p>• Optimize your requests to reduce API calls</p>
            </div>
          </div>
        </div>
      </DocsSection>
    </DocsPage>
  )
}

export default AuthenticationPage