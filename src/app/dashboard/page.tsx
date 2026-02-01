"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Load or generate API key from localStorage (temporary solution)
    const stored = localStorage.getItem("ogpix_api_key");
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const generateApiKey = () => {
    const key = `ogpix_${crypto.randomUUID().replace(/-/g, "")}`;
    localStorage.setItem("ogpix_api_key", key);
    setApiKey(key);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-neutral-400">Welcome, {session.user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-neutral-400 hover:text-white text-sm">
              ← Back to Builder
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-sm text-neutral-500 mb-1">Images Generated</div>
            <div className="text-3xl font-bold">0</div>
            <div className="text-xs text-neutral-600 mt-1">of 100 free/month</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-sm text-neutral-500 mb-1">Saved Templates</div>
            <div className="text-3xl font-bold">0</div>
            <div className="text-xs text-neutral-600 mt-1">of 3 free</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-sm text-neutral-500 mb-1">Plan</div>
            <div className="text-3xl font-bold">Free</div>
            <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">
              Upgrade to Pro →
            </button>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">API Key</h2>
          {apiKey ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <code className="flex-1 bg-black rounded-lg px-4 py-3 text-sm text-green-400 font-mono">
                  {apiKey}
                </code>
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  className="px-4 py-2 bg-neutral-800 rounded-lg text-sm hover:bg-neutral-700 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-neutral-500">
                Include this key in your requests: <code className="text-neutral-400">?key=YOUR_KEY</code>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-neutral-400 text-sm mb-4">
                Generate an API key to track your usage and unlock higher limits.
              </p>
              <button
                onClick={generateApiKey}
                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Generate API Key
              </button>
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-green-400">{`// With your API key
const url = new URL('https://ogpix.vercel.app/api/og');
url.searchParams.set('title', 'My Blog Post');
url.searchParams.set('theme', 'gradient');
${apiKey ? `url.searchParams.set('key', '${apiKey}');` : "// url.searchParams.set('key', 'YOUR_API_KEY');"}

// Use as og:image
<meta property="og:image" content={url.toString()} />`}</code>
          </pre>
        </div>

        {/* Saved Templates */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Saved Templates</h2>
            <a href="/" className="text-sm text-blue-400 hover:text-blue-300">
              + Create Template
            </a>
          </div>
          <div className="text-center py-12 text-neutral-500">
            <p>No saved templates yet.</p>
            <p className="text-sm mt-2">
              Go to the <a href="/" className="text-blue-400 hover:text-blue-300">Builder</a> to create your first template.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
