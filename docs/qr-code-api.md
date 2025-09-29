# QR Code API Documentation

The QR Code API allows you to generate QR codes for your shortened URLs with extensive customization options.

## Endpoints Overview

### 1. Generate QR Code for Short URL (Authenticated)
**Endpoint:** `GET /api/qr-code/{shortCode}`

Generate a QR code for one of your shortened URLs using the short code. Supports both active and inactive URLs if you own them.

### 2. Generate QR Code for URL by ID (Authenticated)
**Endpoint:** `GET /api/qr-code/id/{id}`

Generate a QR code for one of your shortened URLs using the internal UUID. Always requires authentication. Supports both active and inactive URLs since you own them.

### 3. Generate QR Code for Public Short URL
**Endpoint:** `GET /api/qr-code/public/{shortCode}`

Generate a QR code for any active short URL without authentication. Only works with active/public URLs.

### 4. Generate QR Code for Custom URL (Authenticated)
**Endpoint:** `POST /api/qr-code/generate`

Generate a QR code for any arbitrary URL (authenticated users only).

## Authentication

- **Short URL QR codes** (`/api/qr-code/{shortCode}`): Optional. If authenticated, you can generate QR codes for your inactive URLs.
- **ID-based QR codes** (`/api/qr-code/id/{id}`): Always requires authentication. Can generate QR codes for your active and inactive URLs.
- **Public QR codes** (`/api/qr-code/public/{shortCode}`): No authentication required. Only works with active URLs.
- **Custom URL QR codes** (`/api/qr-code/generate`): Requires authentication with 'read' scope.

Authentication can be provided via:
- Session cookie (for web app users)
- API key in `Authorization` header: `Bearer your-api-key`

## Rate Limiting

All QR code endpoints are rate-limited to **40 requests per minute** per IP address or authenticated user.

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

## Query Parameters (GET endpoints)

All QR code generation endpoints support the following query parameters for customization:

### Size & Format
- **`size`** (integer, 100-2000): QR code size in pixels. Default: `256`
- **`format`** (string): Output format. Options: `png`, `svg`, `dataurl`. Default: `png`

### Error Correction
- **`errorCorrectionLevel`** (string): Error correction level. Options:
  - `L` - Low (~7% recovery)
  - `M` - Medium (~15% recovery) - Default
  - `Q` - Quartile (~25% recovery)
  - `H` - High (~30% recovery)

### Appearance
- **`margin`** (integer, 0-20): Margin around QR code in modules. Default: `4`
- **`foregroundColor`** (string): Hex color for dark modules. Default: `#000000`
- **`backgroundColor`** (string): Hex color for light modules. Default: `#FFFFFF`

### Download Options
- **`download`** (boolean): Return as downloadable attachment. Default: `false`
- **`filename`** (string): Custom filename for download. Auto-generated if not provided.

### Public Endpoint Specific
- **`public`** (boolean): For the authenticated endpoint, forces public-only access (active URLs only)

## Examples

### Basic QR Code
```bash
GET /api/qr-code/abc123
```
Returns a 256x256 PNG QR code for the short URL `abc123`.

### QR Code by Internal ID
```bash
GET /api/qr-code/id/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer your-api-key
```
Returns a QR code for your URL using the internal UUID (requires authentication).

### Customized QR Code
```bash
GET /api/qr-code/abc123?size=512&format=svg&errorCorrectionLevel=H&foregroundColor=%23FF0000&backgroundColor=%23FFFF00
```
Returns a 512x512 SVG QR code with red foreground and yellow background, high error correction.

### Download QR Code
```bash
GET /api/qr-code/public/abc123?download=true&filename=my-qr-code.png
```
Downloads the QR code as `my-qr-code.png`.

### Public QR Code (No Auth)
```bash
GET /api/qr-code/public/abc123?size=400&margin=2
```
Returns a QR code for any active short URL without authentication.

### Custom URL QR Code (POST)
```bash
POST /api/qr-code/generate
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",
  "options": {
    "size": 300,
    "format": "png",
    "errorCorrectionLevel": "M",
    "foregroundColor": "#0066CC",
    "backgroundColor": "#FFFFFF"
  }
}
```

## Response Formats

### Image Response (PNG/Binary)
When `format=png` and no special options:
- Content-Type: `image/png`
- Body: Binary image data
- Headers: Cache control headers

### SVG Response
When `format=svg`:
- Content-Type: `image/svg+xml`
- Body: SVG markup as text

### JSON Response
When `format=dataurl` or for custom URL generation:
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "format": "dataurl",
    "shortCode": "abc123",
    "fullUrl": "https://url.gameup.dev/abc123",
    "urlInfo": {
      "originalUrl": "https://example.com/original-long-url",
      "title": "Example Page"
    }
  }
}
```

### Download Response
When `download=true`:
- Content-Disposition: `attachment; filename="qr-code.png"`
- Body: File content in specified format

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid QR code options",
  "errors": {
    "size": "Size must be between 100 and 2000",
    "foregroundColor": "Must be a valid hex color"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required. Please provide a valid session token or API key."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Short URL not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again in 60 seconds."
}
```

## Best Practices

### Performance
- **Cache QR codes**: QR codes for unchanged URLs can be cached on your end
- **Choose appropriate sizes**: Larger sizes (>512px) take more time to generate
- **Use appropriate error correction**: Higher levels increase generation time

### Quality
- **Error correction levels**: Use `H` for environments where QR codes might be damaged
- **Size recommendations**: 
  - Mobile screens: 200-300px
  - Print materials: 400-600px
  - Large displays: 800px+

### Colors
- **Contrast**: Ensure sufficient contrast between foreground and background colors
- **Testing**: Test QR codes with your chosen colors on actual devices
- **Accessibility**: Consider users with color vision deficiencies

## Integration Examples

### JavaScript/Fetch
```javascript
// Generate QR code for existing short URL by short code
const response = await fetch('/api/qr-code/abc123?size=300&format=png');
if (response.ok) {
  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  // Use imageUrl in img src
}

// Generate QR code for existing URL by internal ID (requires auth)
const response = await fetch('/api/qr-code/id/550e8400-e29b-41d4-a716-446655440000?size=300', {
  headers: {
    'Authorization': 'Bearer your-api-key'
  }
});
if (response.ok) {
  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  // Use imageUrl in img src
}

// Generate QR code for custom URL
const response = await fetch('/api/qr-code/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    options: { size: 400, format: 'dataurl' }
  })
});
```

### cURL
```bash
# Public QR code
curl "https://url.gameup.dev/api/qr-code/public/abc123?size=400" \
  -o qr-code.png

# Authenticated QR code by short code
curl "https://url.gameup.dev/api/qr-code/abc123?size=400" \
  -H "Authorization: Bearer your-api-key" \
  -o qr-code.png

# Authenticated QR code by internal ID
curl "https://url.gameup.dev/api/qr-code/id/550e8400-e29b-41d4-a716-446655440000?size=400" \
  -H "Authorization: Bearer your-api-key" \
  -o qr-code.png

# Custom URL QR code
curl -X POST "https://url.gameup.dev/api/qr-code/generate" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","options":{"size":400}}' \
  -o qr-code.png
```

## Troubleshooting

### QR Code Won't Scan
- Check contrast between foreground and background colors
- Ensure sufficient quiet zone (margin) around the QR code
- Try higher error correction level
- Verify the generated URL is accessible

### Large File Sizes
- Use smaller sizes for web display
- Consider SVG format for scalable graphics
- PNG is best for photographs, SVG for simple graphics

### Rate Limiting Issues
- Implement client-side caching
- Use the public endpoint for publicly accessible URLs
- Consider batch processing for multiple QR codes

## Changelog

### v1.0.0
- Initial release
- Support for PNG, SVG, and DataURL formats
- Customizable colors, sizes, and error correction
- Public and authenticated endpoints
- Rate limiting protection