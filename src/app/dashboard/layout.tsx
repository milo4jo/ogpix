import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — OGPix",
  description: "Manage your API keys and track usage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
