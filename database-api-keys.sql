-- API Keys Table Schema
-- Add this to your existing database.sql file

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Human readable name for the key
    key_hash TEXT NOT NULL UNIQUE, -- Hashed version of the API key
    key_prefix TEXT NOT NULL, -- First 8 chars of key for identification
    scopes TEXT[] DEFAULT ARRAY['read', 'write'], -- Permissions for this key
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT api_keys_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
    CONSTRAINT api_keys_scopes_valid CHECK (
        scopes <@ ARRAY['read', 'write', 'admin'] AND 
        array_length(scopes, 1) > 0
    )
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for api_keys
CREATE POLICY "Users can view own API keys" ON api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at);

-- Create trigger for updated_at
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update last_used_at when API key is used
CREATE OR REPLACE FUNCTION update_api_key_last_used(key_hash_param TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE api_keys 
    SET last_used_at = NOW() 
    WHERE key_hash = key_hash_param AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add API key usage tracking table (optional, for detailed analytics)
CREATE TABLE IF NOT EXISTS api_key_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    response_status INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for usage tracking
CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON api_key_usage(created_at);

-- Enable RLS for usage tracking
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for API key usage (users can only see their own key usage)
CREATE POLICY "Users can view own API key usage" ON api_key_usage
    FOR SELECT USING (
        api_key_id IN (
            SELECT id FROM api_keys WHERE user_id = auth.uid()
        )
    );