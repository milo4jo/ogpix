import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OGPix — Instant OG Image API",
  description:
    "Generate beautiful Open Graph images with a single API call. No design skills needed.",
  openGraph: {
    title: "OGPix — Instant OG Image API",
    description: "Generate beautiful Open Graph images with a single API call.",
    type: "website",
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
