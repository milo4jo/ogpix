import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// Supabase client for edge (using service key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// In-memory rate limit store for edge (resets on cold start, but good enough for basic protection)
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const IP_RATE_LIMIT = 100; // requests per window
const IP_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + IP_RATE_WINDOW_MS });
    return true;
  }

  if (record.count >= IP_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Validate logo URL to prevent SSRF
function isValidLogoUrl(url: string): boolean {
  if (!url) return true;

  try {
    const parsed = new URL(url);

    // Only allow https
    if (parsed.protocol !== "https:") return false;

    // Block private/internal IPs and localhost
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }

    // Allow common image hosts and CDNs
    const allowedHosts = [
      "github.com",
      "githubusercontent.com",
      "avatars.githubusercontent.com",
      "raw.githubusercontent.com",
      "cloudflare.com",
      "cdn.jsdelivr.net",
      "images.unsplash.com",
      "i.imgur.com",
      "pbs.twimg.com",
    ];

    // Check if hostname ends with any allowed host
    const isAllowed = allowedHosts.some(
      (host) => hostname === host || hostname.endsWith("." + host)
    );

    return isAllowed;
  } catch {
    return false;
  }
}

// Sanitize text input (remove potential XSS/injection)
function sanitizeText(text: string, maxLength: number = 200): string {
  return text
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
}

// Optimized usage tracking with parallel queries where possible
async function trackUsage(
  apiKey: string,
  theme: string
): Promise<{ allowed: boolean; usage: number; limit: number }> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { allowed: true, usage: 0, limit: 100 };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // First get the API key
  const { data: keyData } = await supabase
    .from("api_keys")
    .select("id, user_id, is_active")
    .eq("key", apiKey)
    .eq("is_active", true)
    .single();

  if (!keyData) {
    return { allowed: false, usage: 0, limit: 0 };
  }

  // Parallel: get user plan AND count usage
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const [planResult, usageResult] = await Promise.all([
    supabase
      .from("user_plans")
      .select("monthly_limit")
      .eq("user_id", keyData.user_id)
      .single(),
    supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("api_key_id", keyData.id)
      .gte("created_at", startOfMonth),
  ]);

  const monthlyLimit = planResult.data?.monthly_limit || 100;
  const currentUsage = usageResult.count || 0;

  if (currentUsage >= monthlyLimit) {
    return { allowed: false, usage: currentUsage, limit: monthlyLimit };
  }

  // Log usage and update last_used_at in parallel (fire and forget for speed)
  Promise.all([
    supabase.from("usage_logs").insert({
      api_key_id: keyData.id,
      theme: theme,
      endpoint: "/api/og",
    }),
    supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id),
  ]);

  return { allowed: true, usage: currentUsage + 1, limit: monthlyLimit };
}

// Pattern components (no dangerouslySetInnerHTML)
function DotsPattern({ color }: { color: string }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function GridPattern({ color }: { color: string }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="1" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function DiagonalPattern({ color }: { color: string }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <pattern id="diagonal" width="10" height="10" patternUnits="userSpaceOnUse">
          <path
            d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
            stroke={color}
            strokeWidth="1"
            opacity="0.1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diagonal)" />
    </svg>
  );
}

function PatternOverlay({ pattern, color }: { pattern: string; color: string }) {
  switch (pattern) {
    case "dots":
      return <DotsPattern color={color} />;
    case "grid":
      return <GridPattern color={color} />;
    case "diagonal":
      return <DiagonalPattern color={color} />;
    default:
      return null;
  }
}

export async function GET(request: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("key");

  // Rate limiting for requests without API key
  if (!apiKey) {
    if (!checkIpRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Add an API key for higher limits.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "3600",
            "Cache-Control": "no-store",
          },
        }
      );
    }
  }

  // Check API key and rate limiting if provided
  if (apiKey) {
    const theme = searchParams.get("theme") || "dark";
    const { allowed, usage, limit } = await trackUsage(apiKey, theme);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded or invalid API key",
          usage,
          limit,
          message:
            usage >= limit
              ? `Monthly limit of ${limit} images reached. Upgrade to Pro for more.`
              : "Invalid or inactive API key",
        },
        {
          status: 429,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }
  }

  // Basic parameters (sanitized)
  const title = sanitizeText(searchParams.get("title") || "Hello World", 150);
  const subtitle = sanitizeText(searchParams.get("subtitle") || "", 300);
  const theme = searchParams.get("theme") || "dark";

  // Advanced customization
  const bgColor = searchParams.get("bg") || "";
  const textColor = searchParams.get("text") || "";
  const accentColor = searchParams.get("accent") || "";
  const fontSize = searchParams.get("fontSize") || "auto";
  const layout = searchParams.get("layout") || "center";
  const pattern = searchParams.get("pattern") || "none";
  const tag = sanitizeText(searchParams.get("tag") || "", 50);
  const author = sanitizeText(searchParams.get("author") || "", 100);
  const watermark = searchParams.get("watermark") !== "false";

  // Validate logo URL
  const logoUrlParam = searchParams.get("logo") || "";
  const logoUrl = isValidLogoUrl(logoUrlParam) ? logoUrlParam : "";

  // Template presets
  const template = searchParams.get("template") || "";

  // Theme colors
  const themes: Record<string, { bg: string; text: string; accent: string }> = {
    dark: { bg: "#000000", text: "#ffffff", accent: "#888888" },
    light: { bg: "#ffffff", text: "#000000", accent: "#666666" },
    gradient: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff",
      accent: "#ffffffcc",
    },
    blue: { bg: "#0070f3", text: "#ffffff", accent: "#ffffffcc" },
    green: { bg: "#10b981", text: "#ffffff", accent: "#ffffffcc" },
    purple: { bg: "#8b5cf6", text: "#ffffff", accent: "#ffffffcc" },
    orange: { bg: "#f97316", text: "#ffffff", accent: "#ffffffcc" },
    pink: { bg: "#ec4899", text: "#ffffff", accent: "#ffffffcc" },
    cyan: { bg: "#06b6d4", text: "#ffffff", accent: "#ffffffcc" },
    slate: { bg: "#1e293b", text: "#f8fafc", accent: "#94a3b8" },
    zinc: { bg: "#18181b", text: "#fafafa", accent: "#71717a" },
    sunset: {
      bg: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
      text: "#ffffff",
      accent: "#ffffffcc",
    },
    ocean: {
      bg: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",
      text: "#ffffff",
      accent: "#ffffffcc",
    },
    forest: {
      bg: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
      text: "#ffffff",
      accent: "#ffffffcc",
    },
    midnight: {
      bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      text: "#f8fafc",
      accent: "#94a3b8",
    },
  };

  // Template presets
  const templates: Record<string, Partial<{ tag: string; layout: string; pattern: string }>> = {
    blog: { tag: "Blog Post", layout: "left", pattern: "dots" },
    github: { tag: "Open Source", layout: "center", pattern: "grid" },
    product: { tag: "Product", layout: "center", pattern: "none" },
    event: { tag: "Event", layout: "center", pattern: "diagonal" },
    docs: { tag: "Documentation", layout: "left", pattern: "grid" },
  };

  const templateConfig = templates[template] || {};
  const finalTag = tag || templateConfig.tag || "";
  const finalLayout = layout || templateConfig.layout || "center";
  const finalPattern = pattern || templateConfig.pattern || "none";

  const baseColors = themes[theme as keyof typeof themes] || themes.dark;
  const colors = {
    bg: bgColor || baseColors.bg,
    text: textColor || baseColors.text,
    accent: accentColor || baseColors.accent,
  };

  // Font size calculation
  const getFontSize = () => {
    if (fontSize === "sm") return 48;
    if (fontSize === "md") return 56;
    if (fontSize === "lg") return 64;
    if (fontSize === "xl") return 80;
    // Auto: based on title length
    if (title.length > 60) return 40;
    if (title.length > 40) return 48;
    if (title.length > 25) return 56;
    return 64;
  };

  const titleFontSize = getFontSize();

  const response = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: colors.bg,
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Pattern overlay - now using React components */}
        {finalPattern !== "none" && <PatternOverlay pattern={finalPattern} color={colors.text} />}

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: finalLayout === "center" ? "center" : "flex-end",
            alignItems: finalLayout === "center" ? "center" : "flex-start",
            textAlign: finalLayout === "center" ? "center" : "left",
            zIndex: 1,
          }}
        >
          {/* Tag */}
          {finalTag && (
            <div
              style={{
                display: "flex",
                fontSize: "18px",
                color: colors.accent,
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 500,
              }}
            >
              {finalTag}
            </div>
          )}

          {/* Logo */}
          {logoUrl && (
            <img
              src={logoUrl}
              width={60}
              height={60}
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
              }}
            />
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              color: colors.text,
              margin: 0,
              lineHeight: 1.2,
              maxWidth: "1000px",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: "28px",
                color: colors.accent,
                margin: "20px 0 0 0",
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Author */}
          {author && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "24px",
                fontSize: "20px",
                color: colors.accent,
              }}
            >
              by {author}
            </div>
          )}
        </div>

        {/* Watermark */}
        {watermark && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "60px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 1,
            }}
          >
            <span style={{ fontSize: "16px", color: colors.accent, opacity: 0.6 }}>ogpix.dev</span>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  // Add cache headers for performance
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");

  return response;
}
