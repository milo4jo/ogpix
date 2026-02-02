/**
 * OGPix Constants
 * 
 * Central configuration for all app constants.
 * Update values here instead of searching through code.
 */

// ============================================
// BRANDING
// ============================================
export const BRAND = {
  name: "OGPix",
  tagline: "Beautiful Open Graph images with a single API call",
  watermark: "ogpix",
  url: "https://ogpix.vercel.app",
  github: "https://github.com/milo4jo/ogpix",
  author: {
    name: "Milo",
    url: "https://milo-site-self.vercel.app",
    emoji: "🦊",
  },
} as const;

// ============================================
// API LIMITS
// ============================================
export const LIMITS = {
  // Free tier without API key (per IP)
  anonymousDaily: 20,
  
  // Free tier with API key (per month)
  freeMonthly: 500,
  
  // Pro tier (future)
  proMonthly: Infinity,
  
  // Rate limit window
  rateLimitWindowMs: 24 * 60 * 60 * 1000, // 24 hours
  
  // Max IP entries in memory before cleanup
  maxIpEntries: 10000,
} as const;

// ============================================
// IMAGE SETTINGS
// ============================================
export const IMAGE = {
  width: 1200,
  height: 630,
  format: "png" as const,
  
  // Cache settings (in seconds)
  cache: {
    maxAge: 86400,          // 1 day
    sMaxAge: 86400,         // 1 day (CDN)
    staleWhileRevalidate: 604800, // 7 days
  },
  
  // Border limits
  maxBorderWidth: 20,
  maxBorderRadius: 60,
  
  // Text limits
  maxTitleLength: 150,
  maxSubtitleLength: 300,
  maxTagLength: 50,
  maxAuthorLength: 100,
  maxBadgeLength: 30,
  maxDateLength: 50,
} as const;

// ============================================
// THEMES
// ============================================
export const THEMES = [
  "dark", "light", "gradient", "blue", "green", "purple",
  "orange", "pink", "cyan", "slate", "zinc", "sunset",
  "ocean", "forest", "midnight", "aurora", "ember", "neon",
  "lavender", "mint", "rose",
] as const;

export type Theme = typeof THEMES[number];

// ============================================
// LAYOUTS
// ============================================
export const LAYOUTS = [
  "center", "left", "hero", "minimal", "split", "card", "featured", "modern",
] as const;

export type Layout = typeof LAYOUTS[number];

// ============================================
// PATTERNS
// ============================================
export const PATTERNS = ["none", "dots", "grid", "diagonal"] as const;

export type Pattern = typeof PATTERNS[number];

// ============================================
// TEMPLATES
// ============================================
export const TEMPLATES = [
  "blog", "github", "product", "event", "docs",
  "announcement", "tutorial", "changelog", "showcase", "news",
  "vercel", "minimal", "split", "hero", "feature", "release",
] as const;

export type Template = typeof TEMPLATES[number];

// ============================================
// FONT SIZES
// ============================================
export const FONT_SIZES = ["auto", "sm", "md", "lg", "xl"] as const;

export type FontSize = typeof FONT_SIZES[number];

// ============================================
// LOGO URL ALLOWLIST
// ============================================
export const ALLOWED_LOGO_HOSTS: string[] = [
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

// ============================================
// SECURITY
// ============================================
export const SECURITY = {
  // IPs that skip rate limiting (development only)
  rateLimitBypassIps: ["127.0.0.1", "::1", "localhost"] as string[],
  
  // Blocked hostname patterns for SSRF prevention
  blockedHostnames: [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    ".local",
    ".internal",
    ".localhost",
  ] as string[],
  
  // Private IP ranges (RFC 1918)
  privateIpPrefixes: [
    "192.168.",
    "10.",
    // 172.16.0.0 - 172.31.255.255 handled separately
  ] as string[],
};
