"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  usage_count: number;
}

interface DashboardData {
  user: { id: string; name: string; email: string };
  plan: { plan: string; monthly_limit: number };
  apiKeys: ApiKey[];
  totalUsage: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/keys");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch data");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, fetchData]);

  const generateApiKey = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create key");
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Delete this API key? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete key");
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key");
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(keyId);
    setTimeout(() => setCopied(null), 2000);
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
            <span className="text-neutral-500">Loading dashboard...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const usagePercent = Math.min(100, ((data?.totalUsage || 0) / (data?.plan?.monthly_limit || 500)) * 100);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="" 
                className="w-12 h-12 rounded-full ring-2 ring-neutral-800"
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
              <p className="text-neutral-500 text-sm">Welcome back, {session.user?.name?.split(" ")[0] || "there"}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-neutral-500 hover:text-white transition-colors self-start sm:self-auto"
          >
            Sign out →
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8 flex items-start gap-3">
            <span className="text-red-400 text-lg">⚠</span>
            <div>
              <div className="text-red-200 font-medium">Something went wrong</div>
              <div className="text-red-400/80 text-sm mt-1">{error}</div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400/60 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Usage */}
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-500">Images This Month</span>
              <span className="text-xs px-2 py-0.5 bg-neutral-800 rounded-full text-neutral-400">
                {data?.plan?.plan || "free"}
              </span>
            </div>
            <div className="text-4xl font-bold mb-2">{data?.totalUsage || 0}</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent > 80 ? "bg-orange-500" : usagePercent > 50 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500">{Math.round(usagePercent)}%</span>
            </div>
            <div className="text-xs text-neutral-600">
              {data?.plan?.monthly_limit || 500} images/month included
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6">
            <div className="text-sm text-neutral-500 mb-4">Active API Keys</div>
            <div className="text-4xl font-bold mb-2">{data?.apiKeys?.length || 0}</div>
            <div className="text-xs text-neutral-600">
              {data?.apiKeys?.length === 0 ? "Create your first key below" : "Managing your integrations"}
            </div>
          </div>

          {/* Plan */}
          <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border border-neutral-800/50 rounded-2xl p-6">
            <div className="text-sm text-neutral-500 mb-4">Your Plan</div>
            <div className="text-4xl font-bold capitalize mb-2">{data?.plan?.plan || "Free"}</div>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors group">
              Upgrade to Pro <span className="group-hover:translate-x-0.5 inline-block transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl overflow-hidden mb-8">
          <div className="flex items-center justify-between p-6 border-b border-neutral-800/50">
            <div>
              <h2 className="text-lg font-semibold">API Keys</h2>
              <p className="text-sm text-neutral-500 mt-1">Manage your API keys for programmatic access</p>
            </div>
            <button
              onClick={generateApiKey}
              disabled={creating}
              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {creating ? (
                <>
                  <span className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>+ New Key</>
              )}
            </button>
          </div>

          {data?.apiKeys && data.apiKeys.length > 0 ? (
            <div className="divide-y divide-neutral-800/50">
              {data.apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 sm:p-6 hover:bg-neutral-800/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">{apiKey.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-neutral-800 rounded text-neutral-400">
                          {apiKey.usage_count} requests
                        </span>
                      </div>
                      <code className="text-sm text-neutral-400 font-mono bg-black/50 px-3 py-1.5 rounded-lg block truncate">
                        {apiKey.key}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          copied === apiKey.id
                            ? "bg-green-600 text-white"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        }`}
                      >
                        {copied === apiKey.id ? "✓ Copied" : "Copy"}
                      </button>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="px-4 py-2 bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-neutral-600">
                    Created {new Date(apiKey.created_at).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔑</span>
              </div>
              <h3 className="text-lg font-medium mb-2">No API keys yet</h3>
              <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                Create an API key to start generating OG images programmatically. 
                Keys give you higher rate limits and usage tracking.
              </p>
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
          <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm">
              <code>
                <span className="text-neutral-500">{"// Generate an OG image with your API key"}</span>{"\n"}
                <span className="text-blue-400">const</span> url = <span className="text-blue-400">new</span> <span className="text-yellow-400">URL</span>(<span className="text-green-400">&apos;https://ogpix.vercel.app/api/og&apos;</span>);{"\n"}
                url.searchParams.<span className="text-yellow-400">set</span>(<span className="text-green-400">&apos;title&apos;</span>, <span className="text-green-400">&apos;My Amazing Post&apos;</span>);{"\n"}
                url.searchParams.<span className="text-yellow-400">set</span>(<span className="text-green-400">&apos;theme&apos;</span>, <span className="text-green-400">&apos;gradient&apos;</span>);{"\n"}
                {data?.apiKeys?.[0]?.key ? (
                  <>url.searchParams.<span className="text-yellow-400">set</span>(<span className="text-green-400">&apos;key&apos;</span>, <span className="text-green-400">&apos;{data.apiKeys[0].key}&apos;</span>);{"\n"}</>
                ) : (
                  <span className="text-neutral-600">{"// url.searchParams.set('key', 'YOUR_API_KEY');"}{"\n"}</span>
                )}
                {"\n"}
                <span className="text-neutral-500">{"// Use in your HTML"}</span>{"\n"}
                <span className="text-purple-400">{"<meta"}</span> <span className="text-blue-300">property</span>=<span className="text-green-400">&quot;og:image&quot;</span> <span className="text-blue-300">content</span>={"{url}"} <span className="text-purple-400">{"/>"}</span>
              </code>
            </pre>
          </div>
          <div className="mt-4 flex gap-4">
            <Link 
              href="/docs"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Read the docs →
            </Link>
            <Link 
              href="/editor"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Try the editor →
            </Link>
          </div>
        </div>

        {/* Usage Table */}
        {data?.apiKeys && data.apiKeys.length > 0 && (
          <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-800/50">
              <h2 className="text-lg font-semibold">Usage Details</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-800/50">
                    <th className="px-6 py-4 font-medium">Key</th>
                    <th className="px-6 py-4 font-medium">Requests</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/30">
                  {data.apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-neutral-800/10">
                      <td className="px-6 py-4 font-mono text-neutral-400">{key.key.slice(0, 16)}...</td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{key.usage_count}</span>
                        <span className="text-neutral-600 ml-1">this month</span>
                      </td>
                      <td className="px-6 py-4 text-neutral-500">
                        {new Date(key.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-green-400 text-xs">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
