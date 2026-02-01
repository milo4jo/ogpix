import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — OGPix",
  description:
    "Learn how to use the OGPix API to generate beautiful Open Graph images. Complete API reference, themes, templates, and examples.",
  openGraph: {
    title: "OGPix Documentation",
    description: "Complete API reference for generating OG images.",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
