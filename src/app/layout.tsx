import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://ogpix.vercel.app";
// Brutal minimalism - matches landing page style
// API key from env (set in Vercel dashboard)
const ogpixApiKey = process.env.OGPIX_API_KEY || "";
const ogImageUrl = ogpixApiKey 
  ? `${siteUrl}/api/og?title=OG+Images.&subtitle=One+URL.&theme=dark&fontSize=xl&key=${ogpixApiKey}&watermark=false`
  : `${siteUrl}/api/og?title=OG+Images.&subtitle=One+URL.&theme=dark&fontSize=xl`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OGPix — Instant OG Image API",
  description:
    "Generate beautiful Open Graph images with a single API call. 15+ themes, templates, and full customization. No design skills needed. Free to use.",
  keywords: [
    "og image",
    "open graph",
    "og image generator",
    "social media images",
    "meta tags",
    "twitter card",
    "api",
    "next.js",
    "vercel",
  ],
  authors: [{ name: "Milo", url: "https://milo-site-self.vercel.app" }],
  creator: "Milo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "OGPix",
    title: "OGPix — Instant OG Image API",
    description:
      "Generate beautiful Open Graph images with a single API call. 15+ themes, templates, and full customization.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "OGPix - Instant OG Image API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OGPix — Instant OG Image API",
    description:
      "Generate beautiful Open Graph images with a single API call. Free to use, no signup required.",
    images: [ogImageUrl],
    creator: "@milo4jo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
