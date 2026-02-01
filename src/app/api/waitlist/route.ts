import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const body = await request.json();
    const { email, source = "website" } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const db = getSupabase();

    // Dev mode: just log and return success if no DB
    if (!db) {
      console.warn(
        `[Waitlist] ${normalizedEmail} (${source}) - DB not configured`
      );
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
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      );
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

    const { count, error } = await db
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
