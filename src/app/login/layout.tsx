import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — OGPix",
  description: "Sign in to OGPix to manage your API keys and track usage.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
