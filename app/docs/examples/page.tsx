import { NextPage } from 'next'
import { Code, BookOpen, Rocket, Terminal } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard } from '@/components/docs/docs-layout'
import { CodeBlock } from '@/components/docs/code-block'

const ExamplesPage: NextPage = () => {
  return (
    <DocsPage
      title="Code Examples"
      description="Practical code examples and SDK implementations to get you started with the URL Shortener API quickly."
      icon={<Code className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Overview */}
      <DocsSection
        title="SDK & Language Examples"
        description="Complete implementations in popular programming languages"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="JavaScript/Node.js"
            description="Modern JavaScript SDK with TypeScript support"
            icon={<Code className="h-6 w-6 text-rose-600" />}
            features={[
              "Full TypeScript support",
              "Promise-based API",
              "Built-in error handling",
              "Comprehensive examples"
            ]}
          />
          <OverviewCard
            title="Python SDK"
            description="Pythonic interface with requests library"
            icon={<Terminal className="h-6 w-6 text-pink-600" />}
            features={[
              "Requests-based client",
              "Type hints included",
              "Exception handling",
              "Async/await support"
            ]}
          />
          <OverviewCard
            title="PHP Client"
            description="PSR-compliant PHP client library"
            icon={<BookOpen className="h-6 w-6 text-rose-600" />}
            features={[
              "PSR-4 autoloading",
              "Guzzle HTTP client",
              "Full API coverage",
              "Laravel integration"
            ]}
          />
          <OverviewCard
            title="cURL Examples"
            description="Direct HTTP API integration examples"
            icon={<Rocket className="h-6 w-6 text-pink-600" />}
            features={[
              "Raw HTTP requests",
              "Shell script examples",
              "Authentication patterns",
              "Error handling"
            ]}
          />
        </div>
      </DocsSection>

      {/* JavaScript/Node.js Examples */}
      <DocsSection
        title="JavaScript/Node.js"
        description="Complete JavaScript implementation with modern async/await syntax"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">SDK Installation</h3>
            <CodeBlock
              language="bash"
              code={`npm install @gameup/url-shortener
# or
yarn add @gameup/url-shortener`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Basic Setup</h3>
            <CodeBlock
              language="javascript"
              code={`import { URLShortener } from '@gameup/url-shortener';

// Initialize the client
const client = new URLShortener({
  apiKey: 'your-api-key-here',
  baseURL: 'https://url.gameup.dev/api'
});

// Or use environment variables
const client = new URLShortener({
  apiKey: process.env.URL_SHORTENER_API_KEY
});`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Create Short URL</h3>
            <CodeBlock
              language="javascript"
              code={`async function createShortUrl() {
  try {
    const result = await client.shorten({
      url: 'https://example.com/very-long-url',
      alias: 'my-link',
      title: 'My Awesome Link',
      expiresAt: '2024-12-31T23:59:59Z'
    });
    
    console.log('Short URL created:', result.shortUrl);
    console.log('Short code:', result.shortCode);
    return result;
  } catch (error) {
    console.error('Error creating short URL:', error.message);
    throw error;
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Bulk URL Creation</h3>
            <CodeBlock
              language="javascript"
              code={`async function createBulkUrls() {
  const urls = [
    { url: 'https://example.com/page1', title: 'Page 1' },
    { url: 'https://example.com/page2', title: 'Page 2' },
    { url: 'https://example.com/page3', title: 'Page 3' }
  ];

  try {
    const result = await client.bulkShorten({ urls });
    
    console.log(\`Created \${result.successful} URLs successfully\`);
    result.results.forEach((item, index) => {
      if (item.success) {
        console.log(\`URL \${index + 1}: \${item.data.shortUrl}\`);
      } else {
        console.error(\`URL \${index + 1} failed: \${item.error}\`);
      }
    });
    
    return result;
  } catch (error) {
    console.error('Bulk creation failed:', error.message);
    throw error;
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Get Analytics</h3>
            <CodeBlock
              language="javascript"
              code={`async function getUrlAnalytics(shortCode) {
  try {
    const analytics = await client.getAnalytics(shortCode, {
      period: '30d',
      includeDetails: true
    });
    
    console.log('Total clicks:', analytics.totalClicks);
    console.log('Unique clicks:', analytics.uniqueClicks);
    console.log('Top countries:', analytics.countries);
    console.log('Top referrers:', analytics.referrers);
    
    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error.message);
    throw error;
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Complete Example with Error Handling</h3>
            <CodeBlock
              language="javascript"
              code={`import { URLShortener, URLShortenerError } from '@gameup/url-shortener';

class URLManager {
  constructor(apiKey) {
    this.client = new URLShortener({ apiKey });
  }

  async createUrl(originalUrl, options = {}) {
    try {
      // Validate URL first
      const validation = await this.client.validateUrl(originalUrl);
      if (!validation.valid) {
        throw new Error(\`Invalid URL: \${validation.error}\`);
      }

      // Create short URL
      const shortUrl = await this.client.shorten({
        url: originalUrl,
        ...options
      });

      // Generate QR code
      const qrCode = await this.client.generateQR(shortUrl.shortCode);

      return {
        ...shortUrl,
        qrCode: qrCode.url
      };
    } catch (error) {
      if (error instanceof URLShortenerError) {
        // Handle API-specific errors
        switch (error.code) {
          case 'ALIAS_TAKEN':
            throw new Error('Custom alias is already in use');
          case 'INVALID_URL':
            throw new Error('The provided URL is not valid');
          case 'RATE_LIMIT_EXCEEDED':
            throw new Error('Rate limit exceeded. Please try again later');
          default:
            throw new Error(\`API Error: \${error.message}\`);
        }
      }
      throw error;
    }
  }

  async getUrlStats(shortCode) {
    try {
      const [details, analytics] = await Promise.all([
        this.client.getUrl(shortCode),
        this.client.getAnalytics(shortCode)
      ]);

      return {
        ...details,
        analytics
      };
    } catch (error) {
      console.error('Error fetching URL stats:', error);
      throw error;
    }
  }
}

// Usage
const urlManager = new URLManager(process.env.API_KEY);

async function main() {
  try {
    const result = await urlManager.createUrl('https://example.com', {
      alias: 'example-link',
      title: 'Example Website'
    });
    
    console.log('Created:', result.shortUrl);
    console.log('QR Code:', result.qrCode);
  } catch (error) {
    console.error('Failed to create URL:', error.message);
  }
}

main();`}
            />
          </div>
        </div>
      </DocsSection>

      {/* Python Examples */}
      <DocsSection
        title="Python"
        description="Python SDK with requests library and comprehensive error handling"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">SDK Installation</h3>
            <CodeBlock
              language="bash"
              code={`pip install gameup-url-shortener
# or
poetry add gameup-url-shortener`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Basic Setup</h3>
            <CodeBlock
              language="python"
              code={`from gameup_url_shortener import URLShortener
import asyncio
from datetime import datetime, timedelta

# Initialize the client
client = URLShortener(api_key="your-api-key-here")

# Or use environment variables
import os
client = URLShortener(api_key=os.getenv("URL_SHORTENER_API_KEY"))`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Create Short URL</h3>
            <CodeBlock
              language="python"
              code={`def create_short_url():
    try:
        result = client.shorten(
            url="https://example.com/very-long-url",
            alias="my-python-link",
            title="My Python Link",
            expires_at=(datetime.now() + timedelta(days=30)).isoformat()
        )
        
        print(f"Short URL created: {result['shortUrl']}")
        print(f"Short code: {result['shortCode']}")
        return result
    except Exception as error:
        print(f"Error creating short URL: {error}")
        raise`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Async/Await Support</h3>
            <CodeBlock
              language="python"
              code={`import asyncio
from gameup_url_shortener import AsyncURLShortener

async def async_example():
    async_client = AsyncURLShortener(api_key="your-api-key")
    
    try:
        # Create multiple URLs concurrently
        urls = [
            "https://example.com/page1",
            "https://example.com/page2",
            "https://example.com/page3"
        ]
        
        tasks = [
            async_client.shorten(url=url, title=f"Page {i+1}")
            for i, url in enumerate(urls)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"URL {i+1} failed: {result}")
            else:
                print(f"URL {i+1}: {result['shortUrl']}")
                
    except Exception as error:
        print(f"Async operation failed: {error}")
    finally:
        await async_client.close()

# Run async example
asyncio.run(async_example())`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Complete Class Example</h3>
            <CodeBlock
              language="python"
              code={`from gameup_url_shortener import URLShortener, URLShortenerError
from typing import Optional, Dict, Any
import logging

class URLManager:
    def __init__(self, api_key: str):
        self.client = URLShortener(api_key=api_key)
        self.logger = logging.getLogger(__name__)
    
    def create_url(self, 
                   original_url: str, 
                   alias: Optional[str] = None,
                   title: Optional[str] = None,
                   **kwargs) -> Dict[str, Any]:
        try:
            # Validate URL first
            validation = self.client.validate_url(original_url)
            if not validation["valid"]:
                raise ValueError(f"Invalid URL: {validation.get('error', 'Unknown error')}")
            
            # Create short URL
            result = self.client.shorten(
                url=original_url,
                alias=alias,
                title=title,
                **kwargs
            )
            
            self.logger.info(f"Created short URL: {result['shortCode']}")
            return result
            
        except URLShortenerError as e:
            error_msg = self._handle_api_error(e)
            self.logger.error(f"API Error: {error_msg}")
            raise ValueError(error_msg)
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            raise
    
    def _handle_api_error(self, error: URLShortenerError) -> str:
        error_mappings = {
            "ALIAS_TAKEN": "Custom alias is already in use",
            "INVALID_URL": "The provided URL is not valid",
            "RATE_LIMIT_EXCEEDED": "Rate limit exceeded. Please try again later",
            "UNAUTHORIZED": "Invalid API key or insufficient permissions"
        }
        return error_mappings.get(error.code, f"API Error: {error.message}")
    
    def get_analytics(self, short_code: str, period: str = "30d") -> Dict[str, Any]:
        try:
            return self.client.get_analytics(short_code, period=period)
        except URLShortenerError as e:
            if e.code == "NOT_FOUND":
                raise ValueError(f"Short URL '{short_code}' not found")
            raise ValueError(self._handle_api_error(e))

# Usage example
if __name__ == "__main__":
    import os
    
    manager = URLManager(os.getenv("URL_SHORTENER_API_KEY"))
    
    try:
        result = manager.create_url(
            "https://example.com",
            alias="python-example",
            title="Python Example"
        )
        print(f"Success: {result['shortUrl']}")
        
        # Get analytics
        analytics = manager.get_analytics(result["shortCode"])
        print(f"Clicks: {analytics['totalClicks']}")
        
    except ValueError as e:
        print(f"Error: {e}")`}
            />
          </div>
        </div>
      </DocsSection>

      {/* PHP Examples */}
      <DocsSection
        title="PHP"
        description="PSR-compliant PHP client with Guzzle HTTP support"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Composer Installation</h3>
            <CodeBlock
              language="bash"
              code={`composer require gameup/url-shortener`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Basic Setup</h3>
            <CodeBlock
              language="php"
              code={`<?php
require_once 'vendor/autoload.php';

use GameUp\\URLShortener\\Client;
use GameUp\\URLShortener\\Exception\\URLShortenerException;

// Initialize the client
$client = new Client([
    'api_key' => 'your-api-key-here',
    'base_uri' => 'https://url.gameup.dev/api'
]);

// Or use environment variables
$client = new Client([
    'api_key' => $_ENV['URL_SHORTENER_API_KEY']
]);`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Create Short URL</h3>
            <CodeBlock
              language="php"
              code={`<?php
function createShortUrl($client) {
    try {
        $result = $client->shorten([
            'url' => 'https://example.com/very-long-url',
            'alias' => 'my-php-link',
            'title' => 'My PHP Link',
            'expiresAt' => (new DateTime('+30 days'))->format('c')
        ]);
        
        echo "Short URL created: " . $result['data']['shortUrl'] . "\\n";
        echo "Short code: " . $result['data']['shortCode'] . "\\n";
        
        return $result['data'];
    } catch (URLShortenerException $e) {
        echo "Error creating short URL: " . $e->getMessage() . "\\n";
        throw $e;
    }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Complete Class Example</h3>
            <CodeBlock
              language="php"
              code={`<?php
namespace App\\Services;

use GameUp\\URLShortener\\Client;
use GameUp\\URLShortener\\Exception\\URLShortenerException;
use Psr\\Log\\LoggerInterface;

class URLManager 
{
    private Client $client;
    private LoggerInterface $logger;
    
    public function __construct(string $apiKey, LoggerInterface $logger) 
    {
        $this->client = new Client(['api_key' => $apiKey]);
        $this->logger = $logger;
    }
    
    public function createUrl(string $originalUrl, array $options = []): array 
    {
        try {
            // Validate URL first
            $validation = $this->client->validateUrl($originalUrl);
            if (!$validation['data']['valid']) {
                throw new \\InvalidArgumentException(
                    'Invalid URL: ' . ($validation['data']['error'] ?? 'Unknown error')
                );
            }
            
            // Create short URL
            $result = $this->client->shorten(array_merge([
                'url' => $originalUrl
            ], $options));
            
            $this->logger->info('Created short URL', [
                'short_code' => $result['data']['shortCode'],
                'original_url' => $originalUrl
            ]);
            
            return $result['data'];
            
        } catch (URLShortenerException $e) {
            $errorMsg = $this->handleApiError($e);
            $this->logger->error('API Error', ['error' => $errorMsg]);
            throw new \\RuntimeException($errorMsg);
        }
    }
    
    private function handleApiError(URLShortenerException $e): string 
    {
        $errorMappings = [
            'ALIAS_TAKEN' => 'Custom alias is already in use',
            'INVALID_URL' => 'The provided URL is not valid',
            'RATE_LIMIT_EXCEEDED' => 'Rate limit exceeded. Please try again later',
            'UNAUTHORIZED' => 'Invalid API key or insufficient permissions'
        ];
        
        return $errorMappings[$e->getCode()] ?? 'API Error: ' . $e->getMessage();
    }
    
    public function getAnalytics(string $shortCode, string $period = '30d'): array 
    {
        try {
            $result = $this->client->getAnalytics($shortCode, ['period' => $period]);
            return $result['data'];
        } catch (URLShortenerException $e) {
            if ($e->getCode() === 'NOT_FOUND') {
                throw new \\InvalidArgumentException("Short URL '$shortCode' not found");
            }
            throw new \\RuntimeException($this->handleApiError($e));
        }
    }
    
    public function bulkCreate(array $urls): array 
    {
        try {
            $result = $this->client->bulkShorten(['urls' => $urls]);
            
            $this->logger->info('Bulk creation completed', [
                'total' => $result['data']['total'],
                'successful' => $result['data']['successful'],
                'failed' => $result['data']['failed']
            ]);
            
            return $result['data'];
        } catch (URLShortenerException $e) {
            $this->logger->error('Bulk creation failed', ['error' => $e->getMessage()]);
            throw new \\RuntimeException($this->handleApiError($e));
        }
    }
}

// Usage example
$urlManager = new URLManager($_ENV['URL_SHORTENER_API_KEY'], $logger);

try {
    $result = $urlManager->createUrl('https://example.com', [
        'alias' => 'php-example',
        'title' => 'PHP Example'
    ]);
    
    echo "Success: " . $result['shortUrl'] . "\\n";
    
    // Get analytics
    $analytics = $urlManager->getAnalytics($result['shortCode']);
    echo "Clicks: " . $analytics['totalClicks'] . "\\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}`}
            />
          </div>
        </div>
      </DocsSection>

      {/* cURL Examples */}
      <DocsSection
        title="cURL Examples"
        description="Direct HTTP API integration with shell scripts and automation"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Basic URL Shortening</h3>
            <CodeBlock
              language="bash"
              code={`# Simple URL shortening
curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'

# With custom alias and authentication
curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "alias": "my-link",
    "title": "My Custom Link"
  }'`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Bash Script with Error Handling</h3>
            <CodeBlock
              language="bash"
              code={`#!/bin/bash

API_KEY="your-api-key-here"
BASE_URL="https://url.gameup.dev/api"

# Function to create short URL
create_short_url() {
    local url="$1"
    local alias="$2"
    local title="$3"
    
    local data="{\\"url\\": \\"$url\\""
    
    if [ -n "$alias" ]; then
        data="$data, \\"alias\\": \\"$alias\\""
    fi
    
    if [ -n "$title" ]; then
        data="$data, \\"title\\": \\"$title\\""
    fi
    
    data="$data}"
    
    response=$(curl -s -w "\\n%{http_code}" -X POST "$BASE_URL/shorten" \\
        -H "Authorization: Bearer $API_KEY" \\
        -H "Content-Type: application/json" \\
        -d "$data")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 201 ]; then
        echo "Success: $(echo "$body" | jq -r '.data.shortUrl')"
        return 0
    else
        echo "Error ($http_code): $(echo "$body" | jq -r '.message // .error')"
        return 1
    fi
}

# Function to get analytics
get_analytics() {
    local short_code="$1"
    local period="$2"
    if [ -z "$period" ]; then
        period="30d"
    fi
    
    response=$(curl -s -w "\\n%{http_code}" \\
        -H "Authorization: Bearer $API_KEY" \\
        "$BASE_URL/analytics/$short_code?period=$period")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo "Analytics for $short_code:"
        echo "$body" | jq '.data'
        return 0
    else
        echo "Error ($http_code): $(echo "$body" | jq -r '.message // .error')"
        return 1
    fi
}

# Usage examples
echo "Creating short URL..."
create_short_url "https://example.com" "bash-example" "Bash Script Example"

echo "\\nGetting analytics..."
get_analytics "bash-example"`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Bulk Operations Script</h3>
            <CodeBlock
              language="bash"
              code={`#!/bin/bash

API_KEY="your-api-key-here"
BASE_URL="https://url.gameup.dev/api"

# Function to bulk create URLs from file
bulk_create_from_file() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        echo "File not found: $file"
        return 1
    fi
    
    # Build JSON array from file
    local urls_json="[]"
    while IFS=',' read -r url title alias; do
        # Skip header line
        if [ "$url" = "url" ]; then
            continue
        fi
        
        local url_obj="{\\"url\\": \\"$url\\""
        if [ -n "$title" ] && [ "$title" != "" ]; then
            url_obj="$url_obj, \\"title\\": \\"$title\\""
        fi
        if [ -n "$alias" ] && [ "$alias" != "" ]; then
            url_obj="$url_obj, \\"alias\\": \\"$alias\\""
        fi
        url_obj="$url_obj}"
        
        urls_json=$(echo "$urls_json" | jq ". + [$url_obj]")
    done < "$file"
    
    local data="{\\"urls\\": $urls_json}"
    
    response=$(curl -s -w "\\n%{http_code}" -X POST "$BASE_URL/shorten/bulk" \\
        -H "Authorization: Bearer $API_KEY" \\
        -H "Content-Type: application/json" \\
        -d "$data")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 201 ]; then
        echo "Bulk creation completed:"
        echo "$body" | jq '.data | "Total: \\(.total), Successful: \\(.successful), Failed: \\(.failed)"'
        
        # Show results
        echo "\\nResults:"
        echo "$body" | jq -r '.data.results[] | if .success then "✓ \\(.data.shortUrl)" else "✗ \\(.error): \\(.originalUrl)" end'
        return 0
    else
        echo "Error ($http_code): $(echo "$body" | jq -r '.message // .error')"
        return 1
    fi
}

# Create sample CSV file
cat > urls.csv << EOF
url,title,alias
https://example.com/page1,Page 1,page1
https://example.com/page2,Page 2,page2
https://example.com/page3,Page 3,
EOF

echo "Bulk creating URLs from CSV file..."
bulk_create_from_file "urls.csv"`}
            />
          </div>
        </div>
      </DocsSection>
    </DocsPage>
  )
}

export default ExamplesPage