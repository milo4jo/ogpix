import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Pattern SVGs
const patterns = {
  none: "",
  dots: `<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.3"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/>`,
  grid: `<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/></pattern><rect width="100%" height="100%" fill="url(#grid)"/>`,
  diagonal: `<pattern id="diagonal" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="1" opacity="0.1"/></pattern><rect width="100%" height="100%" fill="url(#diagonal)"/>`,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Basic parameters
  const title = searchParams.get("title") || "Hello World";
  const subtitle = searchParams.get("subtitle") || "";
  const theme = searchParams.get("theme") || "dark";
  
  // Advanced customization
  const bgColor = searchParams.get("bg") || "";
  const textColor = searchParams.get("text") || "";
  const accentColor = searchParams.get("accent") || "";
  const fontSize = searchParams.get("fontSize") || "auto";
  const layout = searchParams.get("layout") || "center";
  const pattern = searchParams.get("pattern") || "none";
  const logoUrl = searchParams.get("logo") || "";
  const tag = searchParams.get("tag") || "";
  const author = searchParams.get("author") || "";
  const watermark = searchParams.get("watermark") !== "false";
  
  // Template presets
  const template = searchParams.get("template") || "";

  // Theme colors
  const themes: Record<string, { bg: string; text: string; accent: string }> = {
    dark: { bg: "#000000", text: "#ffffff", accent: "#888888" },
    light: { bg: "#ffffff", text: "#000000", accent: "#666666" },
    gradient: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#ffffff", accent: "#ffffffcc" },
    blue: { bg: "#0070f3", text: "#ffffff", accent: "#ffffffcc" },
    green: { bg: "#10b981", text: "#ffffff", accent: "#ffffffcc" },
    purple: { bg: "#8b5cf6", text: "#ffffff", accent: "#ffffffcc" },
    orange: { bg: "#f97316", text: "#ffffff", accent: "#ffffffcc" },
    pink: { bg: "#ec4899", text: "#ffffff", accent: "#ffffffcc" },
    cyan: { bg: "#06b6d4", text: "#ffffff", accent: "#ffffffcc" },
    slate: { bg: "#1e293b", text: "#f8fafc", accent: "#94a3b8" },
    zinc: { bg: "#18181b", text: "#fafafa", accent: "#71717a" },
    sunset: { bg: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)", text: "#ffffff", accent: "#ffffffcc" },
    ocean: { bg: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)", text: "#ffffff", accent: "#ffffffcc" },
    forest: { bg: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)", text: "#ffffff", accent: "#ffffffcc" },
    midnight: { bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", text: "#f8fafc", accent: "#94a3b8" },
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

  const isGradient = colors.bg.includes("gradient");

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

  return new ImageResponse(
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
        {/* Pattern overlay */}
        {finalPattern !== "none" && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              color: colors.text,
            }}
            dangerouslySetInnerHTML={{ __html: patterns[finalPattern as keyof typeof patterns] || "" }}
          />
        )}

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
            <span style={{ fontSize: "16px", color: colors.accent, opacity: 0.6 }}>
              ogpix.dev
            </span>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
