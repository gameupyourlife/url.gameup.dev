import { NextPage } from 'next'
import { Rocket, Key, Code, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { CodeBlock } from '@/components/docs/code-block'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const GettingStartedPage: NextPage = () => {
  return (
    <DocsPage
      title="Getting Started"
      description="Learn how to integrate with the URL Shortener API in just a few steps. Get from setup to your first shortened URL in minutes."
      icon={<Rocket className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Create an account",
            description: "Sign up and get your API key from the dashboard.",
            code: `# Visit: https://url.gameup.dev/auth/signup
# Then get your API key from: https://url.gameup.dev/dashboard/settings`
          },
          {
            title: "Make your first request",
            description: "Create your first short URL with a simple API call.",
            code: `curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "title": "My First Link"}'`
          },
          {
            title: "Start building",
            description: "Integrate the API into your application and explore advanced features."
          }
        ]}
      />

      {/* Get Started Steps */}
      <DocsSection
        title="Step-by-Step Guide"
        description="Follow these steps to get up and running with the URL Shortener API"
      >
        <div className="space-y-8">
          {/* Step 1: Create Account */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Create Your Account & API Key
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sign up for an account and create your first API key from the dashboard to start making authenticated requests.
                </p>
                <div className="flex gap-3 mb-4">
                  <Button asChild variant="default">
                    <Link href="https://url.gameup.dev/auth/signup" target="_blank">
                      Sign Up <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="https://url.gameup.dev/dashboard/settings" target="_blank">
                      Get API Key <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> You can start testing immediately with anonymous access (limited to 10 URLs per day), or create an account for full access and advanced features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Make First Request */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Make Your First API Request
                </h3>
                <p className="text-muted-foreground mb-4">
                  Test the API by creating your first shortened URL. You can start with a simple anonymous request or use your API key for authenticated access.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Anonymous Request (No API Key Needed)</h4>
                    <CodeBlock
                      language="bash"
                      code={`curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Authenticated Request (With API Key)</h4>
                    <CodeBlock
                      language="bash"
                      code={`curl -X POST https://url.gameup.dev/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "alias": "my-first-link",
    "title": "My First Shortened URL"
  }'`}
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Expected Response</h4>
                    <CodeBlock
                      language="json"
                      code={`{
  "success": true,
  "data": {
    "id": "url_123abc",
    "shortCode": "abc123",
    "shortUrl": "https://url.gameup.dev/abc123",
    "originalUrl": "https://example.com",
    "title": "My First Shortened URL",
    "qrCode": "https://url.gameup.dev/qr/abc123.png",
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Integrate */}
          <div className="border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Integrate Into Your Application
                </h3>
                <p className="text-muted-foreground mb-4">
                  Now that you have a working API call, integrate the URL shortener into your application using your preferred programming language.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/docs/examples">
                      <Code className="mr-2 h-4 w-4" />
                      View Code Examples
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link href="/docs/api-reference">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      API Reference
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Next Steps:</strong> Explore advanced features like analytics, QR codes, bulk operations, and custom domains in our comprehensive API documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocsSection>

      {/* Integration Options */}
      <DocsSection
        title="Integration Options"
        description="Choose the integration method that works best for your project"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OverviewCard
            title="REST API"
            description="Direct HTTP API integration with any language"
            icon={<Code className="h-6 w-6 text-rose-600" />}
            features={[
              "Language agnostic",
              "Full control",
              "Custom implementation",
              "Direct HTTP calls"
            ]}
          />
          <OverviewCard
            title="JavaScript SDK"
            description="Official JavaScript/Node.js SDK with TypeScript"
            icon={<Rocket className="h-6 w-6 text-pink-600" />}
            features={[
              "TypeScript support",
              "Promise-based",
              "Built-in error handling",
              "Auto-retry logic"
            ]}
          />
          <OverviewCard
            title="Python SDK"
            description="Pythonic client library with async support"
            icon={<Key className="h-6 w-6 text-rose-600" />}
            features={[
              "Async/await support",
              "Type hints included",
              "Requests-based",
              "Exception handling"
            ]}
          />
        </div>
      </DocsSection>

      {/* Common Use Cases */}
      <DocsSection
        title="Common Use Cases"
        description="Popular ways to use the URL Shortener API in your applications"
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Marketing Campaigns</h3>
            <p className="text-muted-foreground mb-4">
              Create trackable short links for marketing campaigns with custom aliases and analytics.
            </p>
            <CodeBlock
              language="javascript"
              code={`// Create campaign links with UTM parameters
const campaignLink = await client.shorten({
  url: "https://yoursite.com/product?utm_source=newsletter&utm_campaign=launch",
  alias: "product-launch-2024",
  title: "Product Launch Campaign",
  tags: ["marketing", "newsletter", "2024"]
});

console.log(\`Campaign URL: \${campaignLink.shortUrl}\`);
console.log(\`QR Code: \${campaignLink.qrCode}\`);`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Social Media Automation</h3>
            <p className="text-muted-foreground mb-4">
              Automatically shorten URLs for social media posts and track engagement.
            </p>
            <CodeBlock
              language="python"
              code={`# Social media post automation
import tweepy
from url_shortener import URLShortener

client = URLShortener(api_key="your-key")

def post_with_short_url(content, url, platform="twitter"):
    # Shorten the URL
    short_result = client.shorten({
        "url": url,
        "title": f"{platform.title()} Post Link",
        "tags": ["social", platform]
    })
    
    # Create post with shortened URL
    post_text = f"{content} {short_result['shortUrl']}"
    
    # Post to social media (example with Twitter)
    if platform == "twitter":
        api.update_status(post_text)
    
    return short_result

# Usage
result = post_with_short_url(
    "Check out our new blog post!",
    "https://blog.example.com/awesome-post"
)`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Email Marketing</h3>
            <p className="text-muted-foreground mb-4">
              Track click-through rates in email campaigns with individual short links.
            </p>
            <CodeBlock
              language="php"
              code={`<?php
// Email campaign with tracking
$urlManager = new URLManager($apiKey);

function createEmailCampaign($recipients, $baseUrl) {
    $results = [];
    
    foreach ($recipients as $recipient) {
        // Create personalized tracking URL
        $trackingUrl = $baseUrl . "?user=" . $recipient['id'] . "&campaign=email2024";
        
        $shortLink = $urlManager->createUrl($trackingUrl, [
            'alias' => 'email-' . $recipient['id'],
            'title' => 'Email Campaign - ' . $recipient['name'],
            'tags' => ['email', 'campaign', '2024']
        ]);
        
        $results[] = [
            'recipient' => $recipient,
            'shortUrl' => $shortLink['shortUrl'],
            'trackingCode' => $shortLink['shortCode']
        ];
    }
    
    return $results;
}

// Generate personalized links for email list
$campaign = createEmailCampaign($emailList, "https://yoursite.com/special-offer");
?>`}
            />
          </div>
        </div>
      </DocsSection>

      {/* Next Steps */}
      <DocsSection
        title="What's Next?"
        description="Continue your integration journey with advanced features and best practices"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">Explore Advanced Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Analytics and click tracking</li>
              <li>• QR code generation</li>
              <li>• Bulk URL operations</li>
              <li>• Custom domains</li>
              <li>• Password protection</li>
              <li>• Expiration dates</li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/docs/api-reference">
                View API Reference
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">Learn Best Practices</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Authentication & security</li>
              <li>• Error handling patterns</li>
              <li>• Rate limiting strategies</li>
              <li>• Performance optimization</li>
              <li>• Monitoring & logging</li>
              <li>• Testing your integration</li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/docs/authentication">
                Security Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DocsSection>

      {/* Support */}
      <DocsSection
        title="Need Help?"
        description="Get support and connect with the community"
      >
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">Get Support</h4>
            <p className="text-muted-foreground mb-4">
              Have questions or need help with your integration? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="mailto:support@gameup.dev">
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="https://github.com/gameupyourlife/url-shortener" target="_blank">
                  View Examples <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DocsSection>
    </DocsPage>
  )
}

export default GettingStartedPage