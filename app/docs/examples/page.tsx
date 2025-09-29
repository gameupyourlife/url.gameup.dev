import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft
} from 'lucide-react'

const ExamplesPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/docs" className="hover:text-primary transition-colors">
            Documentation
          </Link>
          <span className="mx-2">/</span>
          <span>Examples</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Code Examples</h1>
          <p className="text-xl text-muted-foreground">
            Practical examples to get you started with the URL Shortener API
          </p>
        </div>

        <Tabs defaultValue="javascript" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
          </TabsList>

          {/* JavaScript Examples */}
          <TabsContent value="javascript">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript/Node.js SDK</CardTitle>
                  <CardDescription>
                    Complete JavaScript implementation for interacting with the API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Setup</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`class URLShortenerAPI {
  constructor(apiKey, baseUrl = 'https://url.gameup.dev/api') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.apiKey}\`,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  }

  // Shorten a URL
  async shortenUrl(originalUrl, customCode = null, expiresAt = null) {
    return this.request('/shorten', {
      method: 'POST',
      body: JSON.stringify({
        originalUrl,
        customCode,
        expiresAt
      })
    });
  }

  // Get all URLs
  async getUrls(page = 1, limit = 10) {
    return this.request(\`/urls?page=\${page}&limit=\${limit}\`);
  }

  // Get URL by ID
  async getUrl(id) {
    return this.request(\`/urls/\${id}\`);
  }

  // Update URL
  async updateUrl(id, updates) {
    return this.request(\`/urls/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Delete URL
  async deleteUrl(id) {
    return this.request(\`/urls/\${id}\`, {
      method: 'DELETE'
    });
  }

  // Get analytics
  async getAnalytics() {
    return this.request('/analytics');
  }

  // Get URL analytics
  async getUrlAnalytics(id) {
    return this.request(\`/analytics/\${id}\`);
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Usage Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`const api = new URLShortenerAPI('gup_your_api_key_here');

// Shorten a URL
try {
  const result = await api.shortenUrl('https://example.com/very/long/url');
  console.log('Short URL:', result.data.shortUrl);
} catch (error) {
  console.error('Error:', error.message);
}

// Get all URLs with pagination
const urls = await api.getUrls(1, 20);
console.log('Total URLs:', urls.data.pagination.total);

// Get analytics
const analytics = await api.getAnalytics();
console.log('Total clicks:', analytics.data.totalClicks);`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">React Hook Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`import { useState, useEffect } from 'react';

const useUrlShortener = (apiKey) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = new URLShortenerAPI(apiKey);

  const shortenUrl = async (originalUrl) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.shortenUrl(originalUrl);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { shortenUrl, loading, error };
};

// Usage in component
const MyComponent = () => {
  const { shortenUrl, loading, error } = useUrlShortener('gup_your_api_key');
  
  const handleShorten = async () => {
    try {
      const shortUrl = await shortenUrl('https://example.com');
      console.log('Created:', shortUrl.shortUrl);
    } catch (error) {
      console.error('Failed to shorten URL');
    }
  };

  return (
    <button onClick={handleShorten} disabled={loading}>
      {loading ? 'Shortening...' : 'Shorten URL'}
    </button>
  );
};`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Python Examples */}
          <TabsContent value="python">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Python SDK</CardTitle>
                  <CardDescription>
                    Python implementation using the requests library
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Python Class</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`import requests
from typing import Optional, Dict, List
import json

class URLShortenerAPI:
    def __init__(self, api_key: str, base_url: str = "https://url.gameup.dev/api"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        
        try:
            data = response.json()
        except json.JSONDecodeError:
            raise Exception(f"Invalid JSON response: {response.text}")
        
        if not data.get('success', False):
            raise Exception(data.get('error', 'API request failed'))
        
        return data
    
    def shorten_url(self, original_url: str, custom_code: Optional[str] = None, 
                   expires_at: Optional[str] = None) -> Dict:
        payload = {'originalUrl': original_url}
        if custom_code:
            payload['customCode'] = custom_code
        if expires_at:
            payload['expiresAt'] = expires_at
        
        return self._request('POST', '/shorten', json=payload)
    
    def get_urls(self, page: int = 1, limit: int = 10) -> Dict:
        return self._request('GET', f'/urls?page={page}&limit={limit}')
    
    def get_url(self, url_id: str) -> Dict:
        return self._request('GET', f'/urls/{url_id}')
    
    def update_url(self, url_id: str, **updates) -> Dict:
        return self._request('PUT', f'/urls/{url_id}', json=updates)
    
    def delete_url(self, url_id: str) -> Dict:
        return self._request('DELETE', f'/urls/{url_id}')
    
    def get_analytics(self) -> Dict:
        return self._request('GET', '/analytics')
    
    def get_url_analytics(self, url_id: str) -> Dict:
        return self._request('GET', f'/analytics/{url_id}')`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Usage Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`# Initialize the API client
api = URLShortenerAPI('gup_your_api_key_here')

try:
    # Shorten a URL
    result = api.shorten_url('https://example.com/very/long/url')
    short_url = result['data']['shortUrl']
    print(f"Short URL: {short_url}")
    
    # Get all URLs
    urls = api.get_urls(page=1, limit=50)
    print(f"Total URLs: {urls['data']['pagination']['total']}")
    
    # Get analytics
    analytics = api.get_analytics()
    print(f"Total clicks: {analytics['data']['totalClicks']}")
    
    # Update a URL
    url_id = result['data']['id']
    updated = api.update_url(url_id, originalUrl='https://updated-example.com')
    print("URL updated successfully")
    
except Exception as e:
    print(f"Error: {e}")`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Bulk Operations Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`def bulk_shorten_urls(api: URLShortenerAPI, urls: List[str]) -> List[Dict]:
    """Shorten multiple URLs with error handling"""
    results = []
    
    for url in urls:
        try:
            result = api.shorten_url(url)
            results.append({
                'original': url,
                'short': result['data']['shortUrl'],
                'success': True
            })
            print(f"✓ Shortened: {url}")
        except Exception as e:
            results.append({
                'original': url,
                'error': str(e),
                'success': False
            })
            print(f"✗ Failed: {url} - {e}")
    
    return results

# Usage
urls_to_shorten = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
]

results = bulk_shorten_urls(api, urls_to_shorten)
successful = [r for r in results if r['success']]
print(f"Successfully shortened {len(successful)} out of {len(urls_to_shorten)} URLs")`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PHP Examples */}
          <TabsContent value="php">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>PHP SDK</CardTitle>
                  <CardDescription>
                    PHP implementation using cURL for HTTP requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">PHP Class</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`<?php
class URLShortenerAPI {
    private $apiKey;
    private $baseUrl;
    
    public function __construct($apiKey, $baseUrl = 'https://url.gameup.dev/api') {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }
    
    private function request($method, $endpoint, $data = null) {
        $url = $this->baseUrl . $endpoint;
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_error($ch)) {
            throw new Exception('cURL error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        $decodedResponse = json_decode($response, true);
        
        if ($httpCode >= 400 || !$decodedResponse['success']) {
            throw new Exception($decodedResponse['error'] ?? 'API request failed');
        }
        
        return $decodedResponse;
    }
    
    public function shortenUrl($originalUrl, $customCode = null, $expiresAt = null) {
        $data = ['originalUrl' => $originalUrl];
        if ($customCode) $data['customCode'] = $customCode;
        if ($expiresAt) $data['expiresAt'] = $expiresAt;
        
        return $this->request('POST', '/shorten', $data);
    }
    
    public function getUrls($page = 1, $limit = 10) {
        return $this->request('GET', "/urls?page=$page&limit=$limit");
    }
    
    public function getUrl($id) {
        return $this->request('GET', "/urls/$id");
    }
    
    public function updateUrl($id, $updates) {
        return $this->request('PUT', "/urls/$id", $updates);
    }
    
    public function deleteUrl($id) {
        return $this->request('DELETE', "/urls/$id");
    }
    
    public function getAnalytics() {
        return $this->request('GET', '/analytics');
    }
    
    public function getUrlAnalytics($id) {
        return $this->request('GET', "/analytics/$id");
    }
}
?>`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Usage Example</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`<?php
$api = new URLShortenerAPI('gup_your_api_key_here');

try {
    // Shorten a URL
    $result = $api->shortenUrl('https://example.com/very/long/url');
    echo "Short URL: " . $result['data']['shortUrl'] . "\\n";
    
    // Get all URLs
    $urls = $api->getUrls(1, 20);
    echo "Total URLs: " . $urls['data']['pagination']['total'] . "\\n";
    
    // Get analytics
    $analytics = $api->getAnalytics();
    echo "Total clicks: " . $analytics['data']['totalClicks'] . "\\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}
?>`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* cURL Examples */}
          <TabsContent value="curl">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>cURL Examples</CardTitle>
                  <CardDescription>
                    Direct HTTP requests using cURL command line tool
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shorten URL</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer gup_your_api_key_here" \\
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "customCode": "my-custom-code"
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Get URLs with Pagination</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X GET "https://url.gameup.dev/api/urls?page=1&limit=50" \\
  -H "Authorization: Bearer gup_your_api_key_here"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Get Analytics</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X GET https://url.gameup.dev/api/analytics \\
  -H "Authorization: Bearer gup_your_api_key_here"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Update URL</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X PUT https://url.gameup.dev/api/urls/your-url-id \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer gup_your_api_key_here" \\
  -d '{
    "originalUrl": "https://example.com/updated-url"
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Delete URL</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X DELETE https://url.gameup.dev/api/urls/your-url-id \\
  -H "Authorization: Bearer gup_your_api_key_here"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Create API Key (Session Auth)</h4>
                    <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
{`curl -X POST https://url.gameup.dev/api/api-keys \\
  -H "Content-Type: application/json" \\
  -H "Cookie: your-session-cookie" \\
  -d '{
    "name": "Integration Key",
    "scopes": ["read", "write"],
    "expiresAt": "2024-12-31T23:59:59.000Z"
  }'`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Always handle API errors gracefully with try-catch blocks</li>
              <li>• Use pagination for large datasets to avoid timeouts</li>
              <li>• Store API keys securely using environment variables</li>
              <li>• Implement retry logic for network failures</li>
              <li>• Monitor your API usage to stay within rate limits</li>
              <li>• Use appropriate scopes for your API keys (read vs write)</li>
            </ul>
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
            <Link href="/dashboard/settings?tab=security">
              Create API Key
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExamplesPage