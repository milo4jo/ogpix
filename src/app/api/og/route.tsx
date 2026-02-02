import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LIMITS, IMAGE, ALLOWED_LOGO_HOSTS, SECURITY, BRAND } from "@/lib/constants";

export const runtime = "edge";

// Supabase client for edge (using service key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// In-memory rate limit store for edge (resets on cold start, but good enough for basic protection)
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkIpRateLimit(ip: string): boolean {
  // Skip rate limiting for localhost (development/testing)
  if (SECURITY.rateLimitBypassIps.includes(ip)) {
    return true;
  }

  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  // Cleanup: Remove expired entries if map is getting large
  if (ipRequestCounts.size > LIMITS.maxIpEntries) {
    for (const [key, value] of ipRequestCounts) {
      if (now > value.resetAt) {
        ipRequestCounts.delete(key);
      }
    }
  }

  if (!record || now > record.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + LIMITS.rateLimitWindowMs });
    return true;
  }

  if (record.count >= LIMITS.anonymousDaily) {
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

    const hostname = parsed.hostname.toLowerCase();

    // Block private/internal hostnames
    for (const blocked of SECURITY.blockedHostnames) {
      if (hostname === blocked || hostname.endsWith(blocked)) {
        return false;
      }
    }

    // Check for private IP ranges (RFC 1918)
    for (const prefix of SECURITY.privateIpPrefixes) {
      if (hostname.startsWith(prefix)) {
        return false;
      }
    }
    
    // 172.16.0.0 - 172.31.255.255
    if (hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      return false;
    }

    // Check if hostname ends with any allowed host
    const isAllowed = ALLOWED_LOGO_HOSTS.some(
      (host) => hostname === host || hostname.endsWith("." + host)
    );

    return isAllowed;
  } catch {
    return false;
  }
}

// Sanitize text input (remove potential XSS/injection)
function sanitizeText(text: string, maxLength: number): string {
  return text
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
}

// Optimized usage tracking with parallel queries where possible
async function trackUsage(
  apiKey: string,
  _theme?: string // Reserved for future use
): Promise<{ allowed: boolean; usage: number; limit: number; isPro: boolean }> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { allowed: true, usage: 0, limit: 500, isPro: false };
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
    return { allowed: false, usage: 0, limit: 0, isPro: false };
  }

  // Parallel: get user plan AND count usage
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const [planResult, usageResult] = await Promise.all([
    supabase.from("user_plans").select("plan, monthly_limit").eq("user_id", keyData.user_id).single(),
    supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("api_key_id", keyData.id)
      .gte("created_at", startOfMonth),
  ]);

  const isPro = planResult.data?.plan === "pro";
  const monthlyLimit = planResult.data?.monthly_limit || 500;
  const currentUsage = usageResult.count || 0;

  // Pro users have unlimited (-1) or very high limit
  const isUnlimited = monthlyLimit === -1;
  if (!isUnlimited && currentUsage >= monthlyLimit) {
    return { allowed: false, usage: currentUsage, limit: monthlyLimit, isPro };
  }

  // Log usage (fire and forget for speed)
  // DB schema: usage_logs has only id, api_key_id, created_at
  (async () => {
    try {
      await supabase.from("usage_logs").insert({ api_key_id: keyData.id });
    } catch {
      // Silently ignore logging failures
    }
  })();

  return { allowed: true, usage: currentUsage + 1, limit: monthlyLimit, isPro };
}

// Pattern components - using inline SVG elements (Satori supports basic SVG shapes)
// OPTIMIZED: Fewer elements with higher opacity for better performance
// Image size: 1200x630

function DotsPattern({ color }: { color: string }) {
  // OPTIMIZED: 100px spacing (was 50px) → ~78 circles instead of ~312
  // Higher opacity (0.25) compensates for fewer dots
  const circles = [];
  const spacing = 100;
  const cols = Math.ceil(1200 / spacing);
  const rows = Math.ceil(630 / spacing);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      circles.push(
        <circle
          key={`${row}-${col}`}
          cx={col * spacing + spacing / 2}
          cy={row * spacing + spacing / 2}
          r={2.5}
          fill={color}
          opacity={0.25}
        />
      );
    }
  }
  
  return (
    <svg
      width="1200"
      height="630"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {circles}
    </svg>
  );
}

function GridPattern({ color }: { color: string }) {
  // OPTIMIZED: 120px spacing (was 80px) → ~15 lines instead of ~22
  // Higher opacity (0.12) for visibility
  const lines = [];
  const spacing = 120;
  
  // Vertical lines
  for (let x = spacing; x < 1200; x += spacing) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={630}
        stroke={color}
        strokeWidth={1}
        opacity={0.12}
      />
    );
  }
  
  // Horizontal lines
  for (let y = spacing; y < 630; y += spacing) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={1200}
        y2={y}
        stroke={color}
        strokeWidth={1}
        opacity={0.12}
      />
    );
  }
  
  return (
    <svg
      width="1200"
      height="630"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {lines}
    </svg>
  );
}

function DiagonalPattern({ color }: { color: string }) {
  // OPTIMIZED: 80px spacing (was 40px) → ~30 lines instead of ~61
  // Higher opacity (0.1) for visibility
  const lines = [];
  const spacing = 80;
  
  // Lines going from top-left to bottom-right
  for (let offset = -630; offset < 1200 + 630; offset += spacing) {
    lines.push(
      <line
        key={offset}
        x1={offset}
        y1={0}
        x2={offset + 630}
        y2={630}
        stroke={color}
        strokeWidth={1}
        opacity={0.1}
      />
    );
  }
  
  return (
    <svg
      width="1200"
      height="630"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {lines}
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
          message: `Daily limit of ${LIMITS.anonymousDaily} images reached. Sign up for a free API key to get ${LIMITS.freeMonthly}/month.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "86400",
            "Cache-Control": "no-store",
          },
        }
      );
    }
  }

  // Check API key and rate limiting if provided
  let userIsPro = false;
  if (apiKey) {
    const theme = searchParams.get("theme") || "dark";
    const { allowed, usage, limit, isPro } = await trackUsage(apiKey, theme);
    userIsPro = isPro;

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
  const title = sanitizeText(searchParams.get("title") || "Hello World", IMAGE.maxTitleLength);
  const subtitle = sanitizeText(searchParams.get("subtitle") || "", IMAGE.maxSubtitleLength);
  const theme = searchParams.get("theme") || "dark";

  // Advanced customization
  const bgColor = searchParams.get("bg") || "";
  const textColor = searchParams.get("text") || "";
  const accentColor = searchParams.get("accent") || "";
  const fontSize = searchParams.get("fontSize") || "auto";
  const layout = searchParams.get("layout") || "center";
  const pattern = searchParams.get("pattern") || "none";
  
  // New: Icon/emoji support
  const icon = searchParams.get("icon") || "";
  // New: Date display
  const date = sanitizeText(searchParams.get("date") || "", IMAGE.maxDateLength);
  // New: Badge/category  
  const badge = sanitizeText(searchParams.get("badge") || "", IMAGE.maxBadgeLength);
  // New: Gradient text option
  const gradientText = searchParams.get("gradientText") === "true";
  const tag = sanitizeText(searchParams.get("tag") || "", IMAGE.maxTagLength);
  const author = sanitizeText(searchParams.get("author") || "", IMAGE.maxAuthorLength);
  // Pro users: no watermark by default (can add with watermark=true)
  // Free users: always have watermark (cannot disable)
  const watermarkParam = searchParams.get("watermark");
  const watermark = userIsPro ? watermarkParam === "true" : true;

  // Border customization (Pro feature preview)
  const borderWidth = parseInt(searchParams.get("borderWidth") || "0", 10);
  const borderColorParam = searchParams.get("borderColor") || "ffffff";
  // Ensure borderColor has # prefix for CSS
  const borderColor = borderColorParam.startsWith("#") ? borderColorParam : `#${borderColorParam}`;
  const borderRadius = parseInt(searchParams.get("borderRadius") || "0", 10);

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
    // New gradient themes
    aurora: {
      bg: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f472b6 100%)",
      text: "#ffffff",
      accent: "#ffffffcc",
    },
    ember: {
      bg: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcc00 100%)",
      text: "#000000",
      accent: "#00000099",
    },
    neon: {
      bg: "linear-gradient(135deg, #0ff 0%, #f0f 50%, #ff0 100%)",
      text: "#000000",
      accent: "#00000099",
    },
    lavender: {
      bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      text: "#1a1a2e",
      accent: "#1a1a2ecc",
    },
    mint: {
      bg: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
      text: "#1a1a2e",
      accent: "#1a1a2ecc",
    },
    rose: {
      bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      text: "#1a1a2e",
      accent: "#1a1a2ecc",
    },
  };

  // Template presets - expanded with Vercel-style layouts
  const templates: Record<string, Partial<{ tag: string; layout: string; pattern: string; badge: string }>> = {
    blog: { tag: "Blog Post", layout: "left", pattern: "dots" },
    github: { tag: "Open Source", layout: "center", pattern: "grid" },
    product: { tag: "Product", layout: "center", pattern: "none" },
    event: { tag: "Event", layout: "center", pattern: "diagonal" },
    docs: { tag: "Documentation", layout: "left", pattern: "grid" },
    // New templates - Vercel-inspired
    announcement: { tag: "Announcement", layout: "hero", pattern: "none" },
    tutorial: { tag: "Tutorial", layout: "left", pattern: "dots" },
    changelog: { tag: "Changelog", layout: "card", pattern: "grid" },
    showcase: { tag: "Showcase", layout: "featured", pattern: "diagonal" },
    news: { tag: "News", layout: "card", pattern: "none" },
    // New Vercel-style templates
    vercel: { layout: "modern", pattern: "none" },
    minimal: { layout: "minimal", pattern: "none" },
    split: { layout: "split", pattern: "none" },
    hero: { layout: "hero", pattern: "none" },
    feature: { badge: "New", layout: "featured", pattern: "none" },
    release: { badge: "Release", layout: "card", pattern: "grid" },
  };

  const templateConfig = templates[template] || {};
  const finalTag = tag || templateConfig.tag || "";
  const finalLayout = layout || templateConfig.layout || "center";
  const finalPattern = pattern || templateConfig.pattern || "none";
  const finalBadge = badge || templateConfig.badge || "";

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
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: colors.bg,
        padding: "60px",
        position: "relative",
        ...(borderWidth > 0 && {
          border: `${Math.min(borderWidth, IMAGE.maxBorderWidth)}px solid ${borderColor}`,
          boxSizing: "border-box",
        }),
        ...(borderRadius > 0 && {
          borderRadius: `${Math.min(borderRadius, IMAGE.maxBorderRadius)}px`,
          overflow: "hidden",
        }),
      }}
    >
      {/* Pattern overlay - now using React components */}
      {finalPattern !== "none" && <PatternOverlay pattern={finalPattern} color={colors.text} />}

      {/* Modern layout - Vercel-style gradient accent bar */}
      {finalLayout === "modern" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #0070f3 0%, #7928ca 50%, #ff0080 100%)",
          }}
        />
      )}

      {/* Content - Layout-specific rendering */}
      <div
        style={{
          display: "flex",
          flexDirection: finalLayout === "split" ? "row" : "column",
          flex: 1,
          justifyContent: 
            finalLayout === "center" || finalLayout === "hero" || finalLayout === "minimal" 
              ? "center" 
              : finalLayout === "modern" || finalLayout === "featured"
                ? "flex-start"
                : "flex-end",
          alignItems: 
            finalLayout === "center" || finalLayout === "hero" || finalLayout === "minimal"
              ? "center"
              : "flex-start",
          textAlign: 
            finalLayout === "center" || finalLayout === "hero" || finalLayout === "minimal"
              ? "center"
              : "left",
          zIndex: 1,
          gap: finalLayout === "split" ? "60px" : 0,
        }}
      >
        {/* Split layout - vertical accent line */}
        {finalLayout === "split" && (
          <div
            style={{
              width: "4px",
              height: "200px",
              background: "linear-gradient(180deg, #0070f3 0%, #7928ca 100%)",
              borderRadius: "2px",
              flexShrink: 0,
            }}
          />
        )}

        {/* Main content wrapper */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Badge (new) */}
          {finalBadge && (
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                color: "#ffffff",
                marginBottom: "16px",
                padding: "6px 16px",
                background: "linear-gradient(135deg, #0070f3 0%, #7928ca 100%)",
                borderRadius: "20px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {finalBadge}
            </div>
          )}

          {/* Icon (new - for hero layout) */}
          {icon && finalLayout === "hero" && (
            <div
              style={{
                fontSize: "72px",
                marginBottom: "24px",
              }}
            >
              {icon}
            </div>
          )}

          {/* Tag */}
          {finalTag && finalLayout !== "minimal" && (
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

          {/* Title - with optional gradient text */}
          <h1
            style={{
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              color: gradientText ? "transparent" : colors.text,
              margin: 0,
              lineHeight: 1.2,
              maxWidth: "1000px",
              ...(gradientText && {
                backgroundImage: "linear-gradient(135deg, #0070f3 0%, #7928ca 50%, #ff0080 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }),
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && finalLayout !== "minimal" && (
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

          {/* Card layout - metadata footer */}
          {finalLayout === "card" && (author || date) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "32px",
                gap: "24px",
                fontSize: "18px",
                color: colors.accent,
              }}
            >
              {author && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: colors.accent,
                      opacity: 0.3,
                    }}
                  />
                  <span>{author}</span>
                </div>
              )}
              {date && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>•</span>
                  <span>{date}</span>
                </div>
              )}
            </div>
          )}

          {/* Default author display (for non-card layouts) */}
          {author && finalLayout !== "card" && finalLayout !== "minimal" && (
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
          <span style={{ fontSize: "16px", color: colors.accent, opacity: 0.6 }}>{BRAND.watermark}</span>
        </div>
      )}
    </div>,
    {
      width: IMAGE.width,
      height: IMAGE.height,
    }
  );

  // Add cache headers for performance
  response.headers.set(
    "Cache-Control",
    `public, max-age=${IMAGE.cache.maxAge}, s-maxage=${IMAGE.cache.sMaxAge}, stale-while-revalidate=${IMAGE.cache.staleWhileRevalidate}`
  );

  return response;
}
