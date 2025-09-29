import { NextPage } from 'next'
import { User, Settings, Mail, Shield } from 'lucide-react'
import { DocsPage, DocsSection, OverviewCard, QuickStart } from '@/components/docs/docs-layout'
import { ApiEndpoint } from '@/components/docs/api-endpoint'

const ProfilePage: NextPage = () => {
  return (
    <DocsPage
      title="Profile API"
      description="Manage user profiles, account settings, and preferences with comprehensive profile management endpoints."
      icon={<User className="h-8 w-8 text-rose-600" />}
      status="Stable"
    >
      {/* Quick Start */}
      <QuickStart
        steps={[
          {
            title: "Get your profile",
            description: "Retrieve your current profile information.",
            code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/profile`
          },
          {
            title: "Update profile details",
            description: "Modify your profile information.",
            code: `curl -X PUT https://url.gameup.dev/api/profile \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Doe", "company": "Acme Inc"}'`
          },
          {
            title: "Manage preferences",
            description: "Configure your account settings and preferences."
          }
        ]}
      />

      {/* Overview */}
      <DocsSection
        title="Profile Features"
        description="Comprehensive profile and account management"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewCard
            title="Profile Management"
            description="Complete profile information and customization"
            icon={<User className="h-6 w-6 text-rose-600" />}
            features={[
              "Personal information",
              "Avatar management",
              "Contact details",
              "Profile visibility"
            ]}
          />
          <OverviewCard
            title="Account Settings"
            description="Configure account preferences and behavior"
            icon={<Settings className="h-6 w-6 text-pink-600" />}
            features={[
              "Notification preferences",
              "Privacy settings",
              "Default configurations",
              "Integration settings"
            ]}
          />
          <OverviewCard
            title="Email Management"
            description="Manage email addresses and verification"
            icon={<Mail className="h-6 w-6 text-rose-600" />}
            features={[
              "Primary email",
              "Additional emails",
              "Email verification",
              "Notification emails"
            ]}
          />
          <OverviewCard
            title="Security Settings"
            description="Account security and access control"
            icon={<Shield className="h-6 w-6 text-pink-600" />}
            features={[
              "Password management",
              "Two-factor auth",
              "Login sessions",
              "Security logs"
            ]}
          />
        </div>
      </DocsSection>

      {/* API Endpoints */}
      <DocsSection
        title="Profile Endpoints"
        description="Complete profile and account management functionality"
      >
        {/* Get Profile */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/profile"
          title="Get Profile"
          description="Retrieve the current user's profile information including personal details and account settings."
          responses={[
            {
              status: 200,
              description: "Profile retrieved successfully",
              example: `{
  "success": true,
  "data": {
    "id": "user_123abc",
    "email": "john@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "company": "Acme Inc",
    "website": "https://johndoe.com",
    "bio": "Full-stack developer",
    "avatar": "https://cdn.example.com/avatars/user_123abc.jpg",
    "location": "San Francisco, CA",
    "timezone": "America/Los_Angeles",
    "plan": "pro",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "settings": {
      "emailNotifications": true,
      "publicProfile": false,
      "defaultUrlExpiration": null,
      "analyticsRetention": "1y"
    },
    "usage": {
      "urlsCreated": 1250,
      "totalClicks": 45000,
      "apiCalls": 12500
    }
  }
}`
            }
          ]}
          examples={[
            {
              title: "Get Current Profile",
              request: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://url.gameup.dev/api/profile`,
              response: `{
  "success": true,
  "data": {
    "id": "user_123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "pro"
  }
}`,
              language: "curl"
            }
          ]}
        />

        {/* Update Profile */}
        <ApiEndpoint
          method="PUT"
          endpoint="/api/profile"
          title="Update Profile"
          description="Update the current user's profile information and settings."
          requestBody={{
            description: "Profile fields to update",
            example: `{
  "name": "John Smith",
  "company": "New Company Inc",
  "website": "https://johnsmith.com",
  "bio": "Senior Software Engineer",
  "location": "New York, NY",
  "timezone": "America/New_York",
  "settings": {
    "emailNotifications": false,
    "publicProfile": true,
    "defaultUrlExpiration": "30d"
  }
}`
          }}
          responses={[
            {
              status: 200,
              description: "Profile updated successfully",
              example: `{
  "success": true,
  "data": {
    "id": "user_123abc",
    "name": "John Smith",
    "company": "New Company Inc",
    "website": "https://johnsmith.com",
    "bio": "Senior Software Engineer",
    "location": "New York, NY",
    "timezone": "America/New_York",
    "updatedAt": "2024-01-20T15:30:00.000Z",
    "settings": {
      "emailNotifications": false,
      "publicProfile": true,
      "defaultUrlExpiration": "30d"
    }
  },
  "message": "Profile updated successfully"
}`
            },
            {
              status: 400,
              description: "Invalid profile data",
              example: `{
  "error": "Invalid timezone",
  "message": "The provided timezone is not valid"
}`
            }
          ]}
          examples={[
            {
              title: "Update Basic Info",
              request: `curl -X PUT https://url.gameup.dev/api/profile \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Smith",
    "company": "New Company Inc"
  }'`,
              response: `{
  "success": true,
  "data": {
    "name": "John Smith",
    "company": "New Company Inc",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}`,
              language: "curl"
            }
          ]}
        />

        {/* Upload Avatar */}
        <ApiEndpoint
          method="POST"
          endpoint="/api/profile/avatar"
          title="Upload Avatar"
          description="Upload a new profile avatar image."
          requestBody={{
            description: "Multipart form data with image file",
            example: `Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="avatar"; filename="avatar.jpg"
Content-Type: image/jpeg

[Binary image data]
--boundary--`
          }}
          responses={[
            {
              status: 200,
              description: "Avatar uploaded successfully",
              example: `{
  "success": true,
  "data": {
    "avatar": "https://cdn.example.com/avatars/user_123abc.jpg",
    "thumbnails": {
      "small": "https://cdn.example.com/avatars/user_123abc_sm.jpg",
      "medium": "https://cdn.example.com/avatars/user_123abc_md.jpg",
      "large": "https://cdn.example.com/avatars/user_123abc_lg.jpg"
    },
    "uploadedAt": "2024-01-20T15:30:00.000Z"
  },
  "message": "Avatar uploaded successfully"
}`
            },
            {
              status: 400,
              description: "Invalid image file",
              example: `{
  "error": "Invalid file type",
  "message": "Only JPEG, PNG, and WebP images are supported"
}`
            }
          ]}
          examples={[
            {
              title: "Upload Avatar",
              request: `curl -X POST https://url.gameup.dev/api/profile/avatar \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "avatar=@avatar.jpg"`,
              response: `{
  "success": true,
  "data": {
    "avatar": "https://cdn.example.com/avatars/user_123abc.jpg"
  }
}`,
              language: "curl"
            }
          ]}
          notes={[
            {
              type: "info",
              content: "Supported formats: JPEG, PNG, WebP. Maximum file size: 5MB. Images are automatically resized and optimized."
            }
          ]}
        />

        {/* Delete Profile */}
        <ApiEndpoint
          method="DELETE"
          endpoint="/api/profile"
          title="Delete Profile"
          description="Permanently delete the current user's profile and all associated data."
          requestBody={{
            description: "Confirmation details for account deletion",
            example: `{
  "confirmation": "DELETE",
  "password": "current_password",
  "reason": "No longer need the service"
}`
          }}
          responses={[
            {
              status: 200,
              description: "Profile deleted successfully",
              example: `{
  "success": true,
  "message": "Profile and all associated data have been permanently deleted",
  "deletedAt": "2024-01-20T15:30:00.000Z"
}`
            },
            {
              status: 400,
              description: "Invalid confirmation",
              example: `{
  "error": "Invalid confirmation",
  "message": "You must type 'DELETE' to confirm account deletion"
}`
            }
          ]}
          notes={[
            {
              type: "warning",
              content: "This action cannot be undone. All URLs, analytics data, API keys, and profile information will be permanently deleted."
            }
          ]}
        />

        {/* Get Usage Stats */}
        <ApiEndpoint
          method="GET"
          endpoint="/api/profile/usage"
          title="Get Usage Statistics"
          description="Retrieve detailed usage statistics for the current user's account."
          parameters={[
            {
              name: "period",
              type: "string",
              description: "Time period for usage stats",
              enum: ["7d", "30d", "90d", "1y", "all"],
              default: "30d",
              example: "30d"
            }
          ]}
          responses={[
            {
              status: 200,
              description: "Usage statistics retrieved successfully",
              example: `{
  "success": true,
  "data": {
    "period": "30d",
    "urls": {
      "created": 125,
      "active": 98,
      "expired": 12,
      "deleted": 15
    },
    "clicks": {
      "total": 4500,
      "unique": 3200,
      "today": 45,
      "thisWeek": 320
    },
    "api": {
      "calls": 1250,
      "rateLimit": 10000,
      "remaining": 8750
    },
    "storage": {
      "used": "2.5MB",
      "limit": "100MB",
      "percentage": 2.5
    },
    "topUrls": [
      {
        "shortCode": "abc123",
        "title": "My Popular Link",
        "clicks": 450
      }
    ]
  }
}`
            }
          ]}
        />
      </DocsSection>
    </DocsPage>
  )
}

export default ProfilePage