import type { Metadata } from "next";

const siteUrl = "https://ogpix.vercel.app";

export const metadata: Metadata = {
  title: "Sign In — OGPix",
  description: "Sign in to OGPix to manage your API keys and track usage.",
  openGraph: {
    title: "Sign In — OGPix",
    description: "Get your free API key. 500 images/month included.",
    images: [
      {
        url: `${siteUrl}/api/og?title=Get+Your+API+Key&subtitle=500+free+images%2Fmonth&theme=gradient`,
        width: 1200,
        height: 630,
        alt: "Sign in to OGPix",
      },
    ],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
