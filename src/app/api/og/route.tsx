import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get parameters
  const title = searchParams.get("title") || "Hello World";
  const subtitle = searchParams.get("subtitle") || "";
  const theme = searchParams.get("theme") || "dark";

  // Theme colors
  const themes = {
    dark: { bg: "#000000", text: "#ffffff", accent: "#888888" },
    light: { bg: "#ffffff", text: "#000000", accent: "#666666" },
    gradient: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#ffffff", accent: "#ffffff99" },
    blue: { bg: "#0070f3", text: "#ffffff", accent: "#ffffff99" },
    green: { bg: "#10b981", text: "#ffffff", accent: "#ffffff99" },
  };

  const colors = themes[theme as keyof typeof themes] || themes.dark;
  const isGradient = theme === "gradient";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg,
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 30 ? "48px" : "64px",
              fontWeight: 700,
              color: colors.text,
              margin: 0,
              lineHeight: 1.2,
              maxWidth: "1000px",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: "28px",
                color: colors.accent,
                margin: "20px 0 0 0",
                maxWidth: "800px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "18px", color: colors.accent }}>
            ogpix.dev
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
