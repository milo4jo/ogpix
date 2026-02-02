-- Phase 3: Lemon Squeezy Integration
-- Run this after schema.sql

-- Add Lemon Squeezy fields to user_plans
ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none' 
  CHECK (subscription_status IN ('none', 'active', 'cancelled', 'paused', 'expired'));

-- Index for looking up by Lemon Squeezy customer
CREATE INDEX IF NOT EXISTS idx_user_plans_ls_customer 
ON user_plans(lemon_squeezy_customer_id);

-- Function to upgrade user to pro
CREATE OR REPLACE FUNCTION upgrade_to_pro(
  p_user_email TEXT,
  p_ls_customer_id TEXT,
  p_ls_subscription_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id FROM users WHERE email = p_user_email;
  
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update or insert user plan
  INSERT INTO user_plans (user_id, plan, monthly_limit, lemon_squeezy_customer_id, lemon_squeezy_subscription_id, subscription_status, updated_at)
  VALUES (v_user_id, 'pro', -1, p_ls_customer_id, p_ls_subscription_id, 'active', NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    plan = 'pro',
    monthly_limit = -1, -- unlimited
    lemon_squeezy_customer_id = p_ls_customer_id,
    lemon_squeezy_subscription_id = p_ls_subscription_id,
    subscription_status = 'active',
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to downgrade user to free
CREATE OR REPLACE FUNCTION downgrade_to_free(p_ls_subscription_id TEXT) 
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_plans 
  SET 
    plan = 'free',
    monthly_limit = 500,
    subscription_status = 'cancelled',
    updated_at = NOW()
  WHERE lemon_squeezy_subscription_id = p_ls_subscription_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
