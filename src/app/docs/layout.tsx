import type { Metadata } from "next";

const siteUrl = "https://ogpix.vercel.app";

export const metadata: Metadata = {
  title: "Documentation — OGPix",
  description:
    "Learn how to use the OGPix API to generate beautiful Open Graph images. Complete API reference, themes, templates, and examples.",
  openGraph: {
    title: "OGPix Documentation",
    description:
      "Complete API reference for generating OG images. Themes, templates, and code examples.",
    images: [
      {
        url: `${siteUrl}/api/og?title=OGPix+Docs&subtitle=API+Reference+%26+Examples&theme=midnight&template=docs`,
        width: 1200,
        height: 630,
        alt: "OGPix Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OGPix Documentation",
    description: "Complete API reference for generating OG images.",
    images: [
      `${siteUrl}/api/og?title=OGPix+Docs&subtitle=API+Reference+%26+Examples&theme=midnight&template=docs`,
    ],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
