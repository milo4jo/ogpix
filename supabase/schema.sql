-- OGPix Database Schema
-- Run this in Supabase SQL Editor

-- Users table (synced from NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User plans / subscriptions
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  monthly_limit INTEGER DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT 'Default',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Usage logs (for tracking and rate limiting)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  theme TEXT,
  endpoint TEXT DEFAULT '/api/og'
);

-- Create index for efficient usage counting
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key_created 
ON usage_logs(api_key_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_keys_key 
ON api_keys(key);

CREATE INDEX IF NOT EXISTS idx_users_github_id 
ON users(github_id);

-- Function to get monthly usage count
CREATE OR REPLACE FUNCTION get_monthly_usage(p_api_key_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM usage_logs
    WHERE api_key_id = p_api_key_id
    AND created_at >= date_trunc('month', NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can generate (under limit)
CREATE OR REPLACE FUNCTION can_generate(p_api_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_api_key_id UUID;
  v_user_id UUID;
  v_limit INTEGER;
  v_usage INTEGER;
BEGIN
  -- Get API key and user
  SELECT ak.id, ak.user_id INTO v_api_key_id, v_user_id
  FROM api_keys ak
  WHERE ak.key = p_api_key AND ak.is_active = TRUE;
  
  IF v_api_key_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get user's limit
  SELECT COALESCE(up.monthly_limit, 500) INTO v_limit
  FROM user_plans up
  WHERE up.user_id = v_user_id;
  
  IF v_limit IS NULL THEN
    v_limit := 500; -- Default free limit
  END IF;
  
  -- Get current usage
  v_usage := get_monthly_usage(v_api_key_id);
  
  RETURN v_usage < v_limit;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access on users" ON users
  FOR ALL USING (true);

CREATE POLICY "Service role full access on user_plans" ON user_plans
  FOR ALL USING (true);

CREATE POLICY "Service role full access on api_keys" ON api_keys
  FOR ALL USING (true);

CREATE POLICY "Service role full access on usage_logs" ON usage_logs
  FOR ALL USING (true);
