import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting for waitlist signups
const ipSignupCounts = new Map<string, { count: number; resetAt: number }>();
const SIGNUP_RATE_LIMIT = 5; // signups per window per IP
const SIGNUP_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_IP_ENTRIES = 1000;

function checkSignupRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipSignupCounts.get(ip);

  // Cleanup old entries if map is getting large
  if (ipSignupCounts.size > MAX_IP_ENTRIES) {
    for (const [key, value] of ipSignupCounts) {
      if (now > value.resetAt) {
        ipSignupCounts.delete(key);
      }
    }
  }

  if (!record || now > record.resetAt) {
    ipSignupCounts.set(ip, { count: 1, resetAt: now + SIGNUP_RATE_WINDOW_MS });
    return true;
  }

  if (record.count >= SIGNUP_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Lazy init supabase client
let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  supabase = createClient(url, key);
  return supabase;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkSignupRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, source = "website" } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const db = getSupabase();

    // Dev mode: just log and return success if no DB
    if (!db) {
      console.warn(`[Waitlist] ${normalizedEmail} (${source}) - DB not configured`);
      return NextResponse.json({
        success: true,
        message: "You're on the list!",
      });
    }

    // Insert into waitlist
    const { error } = await db
      .from("waitlist")
      .insert({ email: normalizedEmail, source })
      .select()
      .single();

    if (error) {
      // Duplicate email
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "You're already on the list!",
        });
      }

      console.error("[Waitlist] Error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll notify you when Pro launches.",
    });
  } catch (error) {
    console.error("[Waitlist] Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Get waitlist count (for social proof)
export async function GET() {
  try {
    const db = getSupabase();

    if (!db) {
      return NextResponse.json({ count: 0 });
    }

    const { count, error } = await db.from("waitlist").select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
