import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceClient } from "@/lib/supabase";

// Lemon Squeezy webhook events we care about
type LemonSqueezyEvent =
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "order_created";

interface LemonSqueezyWebhook {
  meta: {
    event_name: LemonSqueezyEvent;
    custom_data?: {
      user_email?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      customer_id: number;
      status: string;
      user_email: string;
      user_name: string;
      variant_id: number;
      product_id: number;
      // For subscriptions
      renews_at?: string;
      ends_at?: string;
    };
  };
}

// Verify webhook signature from Lemon Squeezy
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Verify signature
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const webhook: LemonSqueezyWebhook = JSON.parse(rawBody);
    const { event_name } = webhook.meta;
    const { attributes } = webhook.data;

    console.log(`[LemonSqueezy] Received event: ${event_name}`);

    const supabase = getServiceClient();

    switch (event_name) {
      case "subscription_created":
      case "subscription_resumed": {
        // User subscribed to Pro
        const email =
          webhook.meta.custom_data?.user_email || attributes.user_email;

        if (!email) {
          console.error("No email in webhook payload");
          return NextResponse.json(
            { error: "No email provided" },
            { status: 400 }
          );
        }

        // Find user by email
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (!user) {
          console.error(`User not found for email: ${email}`);
          // Still return 200 to acknowledge webhook - user might sign up later
          return NextResponse.json({
            success: true,
            warning: "User not found, will be upgraded on next login",
          });
        }

        // Upgrade to pro
        const { error } = await supabase.from("user_plans").upsert(
          {
            user_id: user.id,
            plan: "pro",
            monthly_limit: -1, // unlimited
            lemon_squeezy_customer_id: String(attributes.customer_id),
            lemon_squeezy_subscription_id: webhook.data.id,
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error("Failed to upgrade user:", error);
          return NextResponse.json(
            { error: "Database error" },
            { status: 500 }
          );
        }

        console.log(`[LemonSqueezy] Upgraded ${email} to Pro`);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        // User cancelled - downgrade to free
        const subscriptionId = webhook.data.id;

        const { error } = await supabase
          .from("user_plans")
          .update({
            plan: "free",
            monthly_limit: 500,
            subscription_status:
              event_name === "subscription_cancelled" ? "cancelled" : "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("lemon_squeezy_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to downgrade user:", error);
        }

        console.log(`[LemonSqueezy] Downgraded subscription ${subscriptionId}`);
        break;
      }

      case "subscription_updated": {
        // Status change (paused, etc)
        const subscriptionId = webhook.data.id;
        const status = attributes.status;

        // Map Lemon Squeezy status to our status
        const statusMap: Record<string, string> = {
          active: "active",
          paused: "paused",
          cancelled: "cancelled",
          expired: "expired",
          past_due: "active", // Keep active for past_due, they might pay
          unpaid: "paused",
        };

        const newStatus = statusMap[status] || "active";
        const isPro = ["active", "past_due"].includes(status);

        const { error } = await supabase
          .from("user_plans")
          .update({
            plan: isPro ? "pro" : "free",
            monthly_limit: isPro ? -1 : 500,
            subscription_status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("lemon_squeezy_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to update subscription:", error);
        }

        console.log(
          `[LemonSqueezy] Updated subscription ${subscriptionId} to ${status}`
        );
        break;
      }

      case "order_created": {
        // One-time purchase or first subscription payment
        console.log(
          `[LemonSqueezy] Order created for customer ${attributes.customer_id}`
        );
        break;
      }

      default:
        console.log(`[LemonSqueezy] Unhandled event: ${event_name}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LemonSqueezy] Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Lemon Squeezy sends GET to verify endpoint
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
