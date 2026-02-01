import type { Metadata } from "next";

const siteUrl = "https://ogpix.vercel.app";

export const metadata: Metadata = {
  title: "Sign In — OGPix",
  description: "Sign in to OGPix to manage your API keys and track usage.",
  openGraph: {
    title: "Sign In — OGPix",
    description: "Get your free API key. 500 images/month.",
    images: [
      {
        url: `${siteUrl}/api/og?title=Sign+In&subtitle=Get+your+API+key&theme=dark&fontSize=xl`,
        width: 1200,
        height: 630,
        alt: "Sign in to OGPix",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In — OGPix",
    description: "Get your free API key. 500 images/month.",
    images: [`${siteUrl}/api/og?title=Sign+In&subtitle=Get+your+API+key&theme=dark&fontSize=xl`],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
