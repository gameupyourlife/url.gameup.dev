# GameUp URL Shortener API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Key Management](#api-key-management)
4. [URL Management](#url-management)
5. [Analytics](#analytics)
6. [User Profile](#user-profile)
7. [Response Format](#response-format)
8. [Error Codes](#error-codes)
9. [Rate Limits](#rate-limits)
10. [Examples](#examples)

## Overview

The GameUp URL Shortener API provides comprehensive URL shortening, management, and analytics capabilities. The API supports both session-based authentication (for web applications) and API key authentication (for programmatic access).

**Base URL:** `https://url.gameup.dev/api`

## Authentication

The API supports two authentication methods:

### 1. Session Authentication
Used by the web application. Session cookies are automatically handled by the browser.

### 2. API Key Authentication
For programmatic access, include your API key in the request headers:

```
Authorization: Bearer gup_your_api_key_here
```

### API Key Scopes
API keys have different scopes that determine what actions they can perform:
- `read`: View URLs, analytics, and profile data
- `write`: Create, update, and delete URLs; update profile
- `admin`: Full access to all operations (future use)

## API Key Management

### Create API Key
Create a new API key for your account.

**Endpoint:** `POST /api/api-keys`  
**Authentication:** Session only (for security)  
**Required Scope:** N/A

**Request Body:**
```json
{
  "name": "My Integration Key",
  "scopes": ["read", "write"],
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "id": "uuid",
    "name": "My Integration Key",
    "key": "gup_1234567890abcdef...",
    "keyPrefix": "gup_123456...",
    "scopes": ["read", "write"],
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "lastUsedAt": null,
    "usageCount": 0,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### List API Keys
Get all your API keys.

**Endpoint:** `GET /api/api-keys`  
**Authentication:** Session only  
**Required Scope:** N/A

### Update API Key
Update an existing API key's name, scopes, or expiration.

**Endpoint:** `PUT /api/api-keys/{id}`  
**Authentication:** Session only  
**Required Scope:** N/A

### Revoke API Key
Revoke (deactivate) an API key.

**Endpoint:** `POST /api/api-keys/{id}/revoke`  
**Authentication:** Session only  
**Required Scope:** N/A

### Delete API Key
Permanently delete an API key.

**Endpoint:** `DELETE /api/api-keys/{id}`  
**Authentication:** Session only  
**Required Scope:** N/A

## URL Management

### Shorten URL
Create a new short URL.

**Endpoint:** `POST /api/shorten`  
**Authentication:** Optional (anonymous or authenticated)  
**Required Scope:** `write` (if authenticated)

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customCode": "my-custom-code",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shortCode": "abc123",
    "shortUrl": "https://url.gameup.dev/abc123",
    "originalUrl": "https://example.com/very/long/url",
    "title": "Example Page",
    "clicks": 0,
    "isActive": true,
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "userId": null
  }
}
```

### Get URL Info
Retrieve information about a short URL without redirecting.

**Endpoint:** `GET /api/shorten?code={shortCode}`  
**Authentication:** Optional  
**Required Scope:** `read` (if authenticated)

### List URLs
Get all URLs created by the authenticated user.

**Endpoint:** `GET /api/urls`  
**Authentication:** Required  
**Required Scope:** `read`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "urls": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Single URL
Get details of a specific URL.

**Endpoint:** `GET /api/urls/{id}`  
**Authentication:** Required  
**Required Scope:** `read`

### Update URL
Update an existing URL's properties.

**Endpoint:** `PUT /api/urls/{id}`  
**Authentication:** Required  
**Required Scope:** `write`

**Request Body:**
```json
{
  "originalUrl": "https://example.com/updated-url",
  "customCode": "new-custom-code",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Toggle URL Status
Activate or deactivate a URL.

**Endpoint:** `PATCH /api/urls/{id}/toggle`  
**Authentication:** Required  
**Required Scope:** `write`

### Delete URL
Permanently delete a URL.

**Endpoint:** `DELETE /api/urls/{id}`  
**Authentication:** Required  
**Required Scope:** `write`

## Analytics

### Overall Analytics
Get comprehensive analytics for all your URLs.

**Endpoint:** `GET /api/analytics`  
**Authentication:** Required  
**Required Scope:** `read`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUrls": 15,
    "totalClicks": 1250,
    "activeUrls": 12,
    "clicksToday": 45,
    "clicksThisWeek": 320,
    "clicksThisMonth": 890,
    "topUrls": [...],
    "clickTrends": [...],
    "geographicData": [...],
    "deviceData": [...],
    "referrerData": [...]
  }
}
```

### URL-Specific Analytics
Get detailed analytics for a specific URL.

**Endpoint:** `GET /api/analytics/{id}`  
**Authentication:** Required  
**Required Scope:** `read`

## User Profile

### Get Profile
Get the current user's profile and statistics.

**Endpoint:** `GET /api/profile`  
**Authentication:** Required  
**Required Scope:** `read`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "statistics": {
      "total_urls": 15,
      "active_urls": 12,
      "total_clicks": 1250,
      "urls_this_month": 5,
      "average_clicks": 83
    }
  }
}
```

### Update Profile
Update the user's profile information.

**Endpoint:** `PUT /api/profile`  
**Authentication:** Required  
**Required Scope:** `write`

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Delete Profile
Delete the user's account and all associated data.

**Endpoint:** `DELETE /api/profile`  
**Authentication:** Required  
**Required Scope:** `write`

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": { ... } // For validation errors
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input or validation errors |
| 401 | Unauthorized - Authentication required or invalid |
| 403 | Forbidden - Insufficient permissions/scope |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limits

API keys are subject to rate limiting based on their usage patterns:
- **Standard**: 1000 requests per hour
- **Burst**: Up to 100 requests per minute

When rate limits are exceeded, the API returns a `429 Too Many Requests` response with retry information in the headers.

## Examples

### Creating and Using an API Key

1. **Create an API key** (session authentication required):
```bash
curl -X POST https://url.gameup.dev/api/api-keys \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name": "Integration Key",
    "scopes": ["read", "write"]
  }'
```

2. **Use the API key** to create a short URL:
```bash
curl -X POST https://url.gameup.dev/api/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer gup_your_api_key_here" \
  -d '{
    "originalUrl": "https://example.com/very/long/url"
  }'
```

### Retrieving Analytics

```bash
curl -X GET https://url.gameup.dev/api/analytics \
  -H "Authorization: Bearer gup_your_api_key_here"
```

### JavaScript/Node.js Example

```javascript
const apiKey = 'gup_your_api_key_here';
const baseUrl = 'https://url.gameup.dev/api';

// Shorten a URL
async function shortenUrl(originalUrl) {
  const response = await fetch(`${baseUrl}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ originalUrl })
  });
  
  const data = await response.json();
  return data;
}

// Get analytics
async function getAnalytics() {
  const response = await fetch(`${baseUrl}/analytics`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  
  const data = await response.json();
  return data;
}
```

### Python Example

```python
import requests

API_KEY = 'gup_your_api_key_here'
BASE_URL = 'https://url.gameup.dev/api'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {API_KEY}'
}

# Shorten a URL
def shorten_url(original_url):
    response = requests.post(
        f'{BASE_URL}/shorten',
        headers=headers,
        json={'originalUrl': original_url}
    )
    return response.json()

# Get all URLs
def get_urls():
    response = requests.get(f'{BASE_URL}/urls', headers=headers)
    return response.json()

# Example usage
result = shorten_url('https://example.com/very/long/url')
print(f"Short URL: {result['data']['shortUrl']}")
```

---

## Security Best Practices

1. **Store API keys securely** - Never expose them in client-side code
2. **Use environment variables** - Store keys in environment variables, not in code
3. **Rotate keys regularly** - Create new keys and revoke old ones periodically
4. **Use appropriate scopes** - Only grant the minimum permissions needed
5. **Monitor usage** - Check your API key usage statistics regularly
6. **Revoke compromised keys** - Immediately revoke any keys that may be compromised

## Support

For additional help or questions about the API:
- Check the response error messages for detailed information
- Ensure your API key has the required scopes
- Verify your request format matches the documentation examples