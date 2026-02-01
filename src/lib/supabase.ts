import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Client for browser usage (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client with service role (bypasses RLS) - only use server-side
export function getServiceClient() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_KEY not configured");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Types for our database tables
export interface ApiKey {
  id: string;
  user_id: string;
  key: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

export interface UsageLog {
  id: string;
  api_key_id: string;
  created_at: string;
  theme: string | null;
  endpoint: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan: "free" | "pro" | "team";
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}
