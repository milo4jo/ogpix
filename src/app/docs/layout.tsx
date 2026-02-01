import type { Metadata } from "next";

const siteUrl = "https://ogpix.vercel.app";

export const metadata: Metadata = {
  title: "Docs — OGPix",
  description:
    "Learn how to use the OGPix API to generate beautiful Open Graph images. Complete API reference, themes, templates, and examples.",
  openGraph: {
    title: "Docs — OGPix",
    description: "API reference, themes, templates, examples.",
    images: [
      {
        url: `${siteUrl}/api/og?title=Docs&subtitle=API+Reference&theme=dark&fontSize=xl`,
        width: 1200,
        height: 630,
        alt: "OGPix Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docs — OGPix",
    description: "API reference, themes, templates, examples.",
    images: [`${siteUrl}/api/og?title=Docs&subtitle=API+Reference&theme=dark&fontSize=xl`],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
