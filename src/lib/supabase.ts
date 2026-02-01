import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Lazy-initialized clients to avoid build-time errors
let _supabase: SupabaseClient | null = null;
let _serviceClient: SupabaseClient | null = null;

// Client for browser usage (respects RLS)
export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and Anon Key must be configured");
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Legacy export for compatibility (lazy getter)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient];
  },
});

// Server client with service role (bypasses RLS) - only use server-side
export function getServiceClient(): SupabaseClient {
  if (!_serviceClient) {
    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL not configured");
    }
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_KEY not configured");
    }
    _serviceClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _serviceClient;
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
