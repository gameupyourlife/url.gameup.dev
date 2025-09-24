-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create urls table
CREATE TABLE IF NOT EXISTS urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for urls
CREATE POLICY "Users can view own urls" ON urls
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own urls" ON urls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own urls" ON urls
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own urls" ON urls
    FOR DELETE USING (auth.uid() = user_id);

-- Allow public read access to urls for redirection (only active urls)
CREATE POLICY "Public can view active urls for redirection" ON urls
    FOR SELECT USING (is_active = TRUE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_urls_updated_at
    BEFORE UPDATE ON urls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create clicks table for detailed analytics
CREATE TABLE IF NOT EXISTS clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
    short_code TEXT NOT NULL,
    
    -- Request info
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    host TEXT,
    
    -- Device info
    device_type TEXT,
    device_vendor TEXT,
    device_model TEXT,
    
    -- Browser info
    browser_name TEXT,
    browser_version TEXT,
    
    -- OS info
    os_name TEXT,
    os_version TEXT,
    
    -- Engine info
    engine_name TEXT,
    engine_version TEXT,
    
    -- CPU info
    cpu_architecture TEXT,
    
    -- Location info
    country_code TEXT,
    country_name TEXT,
    cf_country TEXT, -- Cloudflare country header
    cf_ray TEXT,     -- Cloudflare ray ID
    
    -- Additional headers
    accept_language TEXT,
    accept_encoding TEXT,
    dnt TEXT, -- Do Not Track
    
    -- Analytics flags
    is_bot BOOLEAN DEFAULT FALSE,
    
    -- URL search parameters (stored as JSONB for flexibility)
    search_params JSONB,
    
    -- Referer analysis
    referer_domain TEXT,
    referer_type TEXT, -- 'direct', 'social', 'search', 'website'
    referer_source TEXT,
    
    -- Timestamps
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for clicks table
-- Users can view clicks for their own URLs
CREATE POLICY "Users can view clicks for own urls" ON clicks
    FOR SELECT USING (
        url_id IN (
            SELECT id FROM urls WHERE user_id = auth.uid()
        )
    );

-- System can insert click records (no user restriction needed for analytics)
CREATE POLICY "Allow click insertions" ON clicks
    FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks(url_id);
CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_clicks_ip_address ON clicks(ip_address);
CREATE INDEX IF NOT EXISTS idx_clicks_country_code ON clicks(country_code);
CREATE INDEX IF NOT EXISTS idx_clicks_referer_type ON clicks(referer_type);
CREATE INDEX IF NOT EXISTS idx_clicks_is_bot ON clicks(is_bot);
CREATE INDEX IF NOT EXISTS idx_clicks_browser_name ON clicks(browser_name);
CREATE INDEX IF NOT EXISTS idx_clicks_os_name ON clicks(os_name);
CREATE INDEX IF NOT EXISTS idx_clicks_device_type ON clicks(device_type);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_clicks_url_date ON clicks(url_id, clicked_at);
CREATE INDEX IF NOT EXISTS idx_clicks_country_date ON clicks(country_code, clicked_at);
CREATE INDEX IF NOT EXISTS idx_clicks_referer_date ON clicks(referer_type, clicked_at);

-- Create trigger for updated_at
CREATE TRIGGER update_clicks_updated_at
    BEFORE UPDATE ON clicks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment URL click count safely
CREATE OR REPLACE FUNCTION increment_url_clicks(url_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE urls 
    SET clicks = clicks + 1, updated_at = NOW()
    WHERE id = url_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;