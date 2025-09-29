import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function QRCodesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">QR Codes API</h1>
        <p className="text-muted-foreground text-lg">
          Generate customizable QR codes for your shortened URLs with extensive API endpoints and options.
        </p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Generate QR codes through API endpoints with full customization support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Available Endpoints</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><code>GET /api/qr-code/{`{shortCode}`}</code> - Generate QR for short URL</li>
              <li><code>GET /api/qr-code/id/{`{id}`}</code> - Generate QR by URL ID (authenticated)</li>
              <li><code>GET /api/qr-code/public/{`{shortCode}`}</code> - Public QR generation</li>
              <li><code>POST /api/qr-code/generate</code> - Generate QR for custom URLs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Key Features</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Multiple output formats (PNG, SVG, Data URL)</li>
              <li>Customizable colors, sizes, and error correction levels</li>
              <li>Direct download or API response options</li>
              <li>Rate limiting and authentication support</li>
              <li>Public and private access modes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Tabs defaultValue="shortcode" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shortcode">Short Code</TabsTrigger>
          <TabsTrigger value="id">URL ID</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="custom">Custom URL</TabsTrigger>
        </TabsList>

        {/* Short Code Tab */}
        <TabsContent value="shortcode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">GET</Badge>
                /api/qr-code/{`{shortCode}`}
              </CardTitle>
              <CardDescription>
                Generate QR code for a shortened URL using its short code. Optional authentication for private URLs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Example Request</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`GET /api/qr-code/abc123?size=400&format=png&foregroundColor=%23FF0000

# With authentication
curl "https://url.gameup.dev/api/qr-code/abc123?size=400" \\
  -H "Authorization: Bearer your-api-key"`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`# Returns PNG image data directly
Content-Type: image/png
Content-Length: 1234

# Or JSON for SVG/DataURL formats
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgo...",
    "format": "dataurl",
    "shortCode": "abc123",
    "fullUrl": "https://url.gameup.dev/abc123"
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* URL ID Tab */}
        <TabsContent value="id" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">GET</Badge>
                /api/qr-code/id/{`{id}`}
                <Badge variant="secondary">Auth Required</Badge>
              </CardTitle>
              <CardDescription>
                Generate QR code for your URL using the internal UUID. Always requires authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Example Request</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`GET /api/qr-code/id/550e8400-e29b-41d4-a716-446655440000?size=300&download=true

curl "https://url.gameup.dev/api/qr-code/id/550e8400-e29b-41d4-a716-446655440000" \\
  -H "Authorization: Bearer your-api-key" \\
  -o qr-code.png`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Benefits</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Dashboard Integration:</strong> Use directly with URL management APIs</li>
                  <li><strong>No Extra Lookups:</strong> No need to fetch short code first</li>
                  <li><strong>Inactive URLs:</strong> Generate QR codes for inactive URLs you own</li>
                  <li><strong>Consistent API:</strong> Matches other URL management endpoints</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Public Tab */}
        <TabsContent value="public" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">GET</Badge>
                /api/qr-code/public/{`{shortCode}`}
                <Badge variant="secondary">No Auth</Badge>
              </CardTitle>
              <CardDescription>
                Generate QR code for any active short URL without authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Example Request</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`GET /api/qr-code/public/abc123?size=200&margin=2

# No authentication required
curl "https://url.gameup.dev/api/qr-code/public/abc123?format=svg" \\
  -o qr-code.svg`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Limitations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Active URLs Only:</strong> Only works with active/public URLs</li>
                  <li><strong>Size Limits:</strong> Maximum 512px for public endpoint</li>
                  <li><strong>Rate Limited:</strong> 50 requests per minute per IP</li>
                  <li><strong>Limited Privacy:</strong> Doesn&apos;t expose original URL in response</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom URL Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">POST</Badge>
                /api/qr-code/generate
                <Badge variant="secondary">Auth Required</Badge>
              </CardTitle>
              <CardDescription>
                Generate QR code for any custom URL (authenticated users only).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Example Request</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`POST /api/qr-code/generate
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",
  "options": {
    "size": 400,
    "format": "svg",
    "errorCorrectionLevel": "H",
    "foregroundColor": "#0066CC",
    "backgroundColor": "#FFFFFF"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Use Cases</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>External URLs:</strong> Generate QR codes for any URL, not just shortened ones</li>
                  <li><strong>Batch Processing:</strong> Generate multiple QR codes programmatically</li>
                  <li><strong>Custom Styling:</strong> Full control over appearance and format</li>
                  <li><strong>Integration:</strong> Perfect for embedding in applications or reports</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customization Options */}
      <Card>
        <CardHeader>
          <CardTitle>Customization Options</CardTitle>
          <CardDescription>
            All QR code endpoints support extensive customization through query parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Size & Format</h4>
              <div className="space-y-2 text-sm">
                <div><code>size</code> - Size in pixels (100-2000, default: 256)</div>
                <div><code>format</code> - Output format: png, svg, dataurl</div>
                <div><code>margin</code> - Quiet zone margin (0-20, default: 4)</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Appearance</h4>
              <div className="space-y-2 text-sm">
                <div><code>foregroundColor</code> - Hex color for dark areas</div>
                <div><code>backgroundColor</code> - Hex color for light areas</div>
                <div><code>errorCorrectionLevel</code> - L, M, Q, H</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Download Options</h4>
              <div className="space-y-2 text-sm">
                <div><code>download</code> - Return as attachment (true/false)</div>
                <div><code>filename</code> - Custom filename for downloads</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Error Correction Levels</h4>
              <div className="space-y-2 text-sm">
                <div><code>L</code> - Low (~7% recovery)</div>
                <div><code>M</code> - Medium (~15% recovery) - Default</div>
                <div><code>Q</code> - Quartile (~25% recovery)</div>
                <div><code>H</code> - High (~30% recovery)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting & Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting & Authentication</CardTitle>
          <CardDescription>
            Understanding access controls and usage limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Rate Limits</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">QR Endpoints</Badge>
                  <div className="flex-1">
                    <p className="text-sm">40 requests per minute per IP/user</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">Public Endpoint</Badge>
                  <div className="flex-1">
                    <p className="text-sm">50 requests per minute per IP</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Authentication Methods</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">API Key</Badge>
                  <div className="flex-1">
                    <p className="text-sm">Include in Authorization header: <code>Bearer your-api-key</code></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Session</Badge>
                  <div className="flex-1">
                    <p className="text-sm">Automatic authentication for logged-in dashboard users</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Response Headers</h4>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm">
                  <code>{`X-RateLimit-Limit: 40
X-RateLimit-Remaining: 35
X-RateLimit-Reset: 1640995200
Cache-Control: public, max-age=300`}</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Common patterns for integrating QR code generation into your applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Dashboard QR Code Button</h4>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Generate QR code for URL in dashboard
async function generateQRCode(urlId) {
  const response = await fetch(\`/api/qr-code/id/\${urlId}?size=400&download=true\`, {
    headers: {
      'Authorization': \`Bearer \${apiKey}\`
    }
  });
  
  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = \`qr-code-\${urlId}.png\`;
    a.click();
  }
}`}</code>
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Public QR Code Widget</h4>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Embed QR code in public pages
<img 
  src="/api/qr-code/public/abc123?size=200&margin=2"
  alt="QR Code for https://url.gameup.dev/abc123"
  className="border rounded-lg"
/>`}</code>
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Batch QR Code Generation</h4>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Generate QR codes for multiple URLs
const qrCodes = await Promise.all(
  urlIds.map(async (id) => {
    const response = await fetch(\`/api/qr-code/id/\${id}?format=dataurl\`, {
      headers: { 'Authorization': \`Bearer \${apiKey}\` }
    });
    return response.json();
  })
);`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}