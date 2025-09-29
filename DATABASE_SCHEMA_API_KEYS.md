# Database Schema Update for API Keys

This document describes the database schema additions required to support API key authentication in the URL shortener application.

## New Table: `api_keys`

```sql
-- API Keys table for managing user API keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(256) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_api_keys_expires ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_api_keys_updated_at();
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on the api_keys table
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can view their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own API keys
CREATE POLICY "Users can create own API keys" ON api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own API keys
CREATE POLICY "Users can update own API keys" ON api_keys
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own API keys
CREATE POLICY "Users can delete own API keys" ON api_keys
    FOR DELETE USING (auth.uid() = user_id);
```

## Table Structure Details

### Fields Description

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | Foreign key to profiles table |
| `name` | VARCHAR(100) | Human-readable name for the API key |
| `key_hash` | VARCHAR(256) | SHA-256 hash of the API key (for security) |
| `key_prefix` | VARCHAR(20) | First few characters of the key for identification |
| `scopes` | TEXT[] | Array of scopes (read, write, admin) |
| `last_used_at` | TIMESTAMP | When the key was last used |
| `usage_count` | INTEGER | Number of times the key has been used |
| `expires_at` | TIMESTAMP | Optional expiration date |
| `is_active` | BOOLEAN | Whether the key is active |
| `created_at` | TIMESTAMP | When the key was created |
| `updated_at` | TIMESTAMP | When the key was last updated |

### Scopes

The API key system supports the following scopes:

- **`read`**: Allows viewing URLs, analytics, and profile data
- **`write`**: Allows creating, updating, and deleting URLs; updating profile
- **`admin`**: Full access to all operations (reserved for future use)

### Security Features

1. **Key Hashing**: API keys are stored as SHA-256 hashes, not plaintext
2. **Key Prefixes**: Only the first few characters are stored for identification
3. **Expiration**: Keys can have optional expiration dates
4. **Usage Tracking**: Keys track usage count and last used timestamp
5. **Scoped Permissions**: Keys can be limited to specific operations
6. **RLS Policies**: Users can only access their own API keys

## Usage Patterns

### Creating a New API Key

When a user creates a new API key:
1. Generate a cryptographically secure random key with `gup_` prefix
2. Hash the key using SHA-256
3. Store only the hash and prefix in the database
4. Return the full key to the user (this is the only time they'll see it)

### Validating API Keys

For each API request with an API key:
1. Extract the key from the `Authorization: Bearer` header
2. Hash the provided key using SHA-256
3. Look up the key_hash in the database
4. Check if the key is active and not expired
5. Verify the required scope is included in the key's scopes
6. Update last_used_at and increment usage_count

### Key Management

Users can:
- View all their API keys (with usage statistics)
- Update key names, scopes, and expiration dates
- Revoke keys (set is_active to false)
- Delete keys permanently

## Migration Script

If you need to add this table to an existing database, use the complete SQL script above. Make sure to:

1. Run the table creation script
2. Apply the RLS policies
3. Update your application code to use the new authentication system

## Backup Considerations

When backing up the database:
- API keys contain sensitive hashed data
- Consider excluding or encrypting API key backups
- Ensure backup access is properly secured
- Document key recovery procedures for users

## Monitoring and Maintenance

Consider implementing:
- Regular cleanup of expired keys
- Monitoring of key usage patterns
- Alerts for suspicious API key activity
- Automatic key rotation policies for high-value integrations