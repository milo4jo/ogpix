import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { authOptions } from "@/lib/auth";

// GET /api/keys - Get user's API keys and usage
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceClient();
    const githubId = session.user.id;

    // Get or create user
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("github_id", githubId)
      .single();

    if (!user) {
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          github_id: githubId,
          email: session.user.email,
          name: session.user.name,
        })
        .select()
        .single();

      if (error) throw error;
      user = newUser;

      // Create default plan
      await supabase.from("user_plans").insert({
        user_id: user.id,
        plan: "free",
        monthly_limit: 500,
      });
    }

    // Get user's API keys (table only has: id, user_id, key, is_active, created_at)
    const { data: apiKeys } = await supabase
      .from("api_keys")
      .select("id, user_id, key, is_active, created_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    // Get usage for each key this month
    const keysWithUsage = await Promise.all(
      (apiKeys || []).map(async (key, index) => {
        const { count } = await supabase
          .from("usage_logs")
          .select("*", { count: "exact", head: true })
          .eq("api_key_id", key.id)
          .gte(
            "created_at",
            new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
          );

        // Generate a friendly name based on key prefix or index
        const keyPrefix = key.key.split("_")[0];
        const name = keyPrefix === "ogpix" ? `API Key ${index + 1}` : `${keyPrefix} Key`;

        return {
          ...key,
          name,
          usage_count: count || 0,
          last_used_at: null, // Not tracked in DB yet
        };
      })
    );

    // Get user's plan
    const { data: plan } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Get total usage this month
    const totalUsage = keysWithUsage.reduce((sum, k) => sum + k.usage_count, 0);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      plan: plan || { plan: "free", monthly_limit: 500 },
      apiKeys: keysWithUsage,
      totalUsage,
    });
  } catch (error) {
    console.error("Error fetching keys:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST /api/keys - Create a new API key
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Name is ignored - DB doesn't have this column yet
    await request.json().catch(() => ({}));

    const supabase = getServiceClient();
    const githubId = session.user.id;

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("github_id", githubId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new API key
    const key = `ogpix_${crypto.randomUUID().replace(/-/g, "")}`;

    // Insert without 'name' - column doesn't exist in DB
    const { data: apiKey, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        key,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      apiKey: {
        ...apiKey,
        name: "New API Key",
        usage_count: 0,
        last_used_at: null,
      }
    });
  } catch (error) {
    console.error("Error creating key:", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}

// DELETE /api/keys - Deactivate an API key
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { keyId } = await request.json();
    if (!keyId) {
      return NextResponse.json({ error: "Key ID required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const githubId = session.user.id;

    // Get user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("github_id", githubId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deactivate the key (only if owned by user)
    const { error } = await supabase
      .from("api_keys")
      .update({ is_active: false })
      .eq("id", keyId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting key:", error);
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 });
  }
}
