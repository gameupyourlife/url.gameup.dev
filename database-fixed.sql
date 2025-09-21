-- First, let's check if we need to clean up any existing data
-- You may need to run this if there are conflicts

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing triggers and functions to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create profiles table (with proper constraints)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create urls table
CREATE TABLE IF NOT EXISTS urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    clicks INTEGER DEFAULT 0 CHECK (clicks >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT urls_original_url_check CHECK (original_url ~ '^https?://'),
    CONSTRAINT urls_short_code_check CHECK (short_code ~ '^[a-zA-Z0-9_-]+$' AND length(short_code) BETWEEN 3 AND 20)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own urls" ON urls;
DROP POLICY IF EXISTS "Users can insert own urls" ON urls;
DROP POLICY IF EXISTS "Users can update own urls" ON urls;
DROP POLICY IF EXISTS "Users can delete own urls" ON urls;
DROP POLICY IF EXISTS "Public can view active urls for redirection" ON urls;

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
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
BEGIN
    -- Get email from the new user record
    user_email := NEW.email;
    
    -- Get full_name from metadata, fallback to empty string if null
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    -- Insert into profiles with error handling that won't block user creation
    BEGIN
        INSERT INTO profiles (id, email, full_name, created_at, updated_at)
        VALUES (
            NEW.id, 
            user_email, 
            NULLIF(user_full_name, ''), -- Convert empty string to NULL
            NOW(), 
            NOW()
        );
        
        RAISE LOG 'Successfully created profile for user %', NEW.id;
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE LOG 'Profile already exists for user %', NEW.id;
        WHEN OTHERS THEN
            -- Log the error but don't prevent user creation
            RAISE LOG 'Failed to create profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the function can be executed by the auth system
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Set proper permissions on the function
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres, anon, authenticated, service_role;

-- Create trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_urls_updated_at ON urls;
CREATE TRIGGER update_urls_updated_at
    BEFORE UPDATE ON urls
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Ensure the auth.users table can be accessed by our function
GRANT SELECT ON auth.users TO postgres;