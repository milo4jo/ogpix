import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { OGBuilder } from "@/components/OGBuilder";

export const metadata = {
  title: "Editor — OGPix",
  description:
    "Full-featured OG image editor with all themes, templates, and customization options.",
};

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">OG Image Editor</h1>
            <p className="text-neutral-400 mt-1">
              Full customization with 21 themes and 10 templates
            </p>
          </div>
          <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
            ← Back
          </Link>
        </div>

        {/* Full OGBuilder */}
        <OGBuilder />

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              href="/docs#api-reference"
              className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-medium mb-1">API Reference →</h3>
              <p className="text-sm text-neutral-500">All parameters documented</p>
            </Link>
            <Link
              href="/docs#themes"
              className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-medium mb-1">Theme Gallery →</h3>
              <p className="text-sm text-neutral-500">Browse all 21 themes</p>
            </Link>
            <Link
              href="/dashboard"
              className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-medium mb-1">Get API Key →</h3>
              <p className="text-sm text-neutral-500">500 images/month free</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
