"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

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
      const res = await fetch("/api/keys");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Default" }),
      });
      if (!res.ok) throw new Error("Failed to create key");
      await fetchData();
    } catch (err) {
      setError("Failed to create API key");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    try {
      const res = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId }),
      });
      if (!res.ok) throw new Error("Failed to delete key");
      await fetchData();
    } catch (err) {
      setError("Failed to delete API key");
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopied(keyId);
    setTimeout(() => setCopied(null), 2000);
  };

  if (status === "loading" || loading) {
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
            <Link href="/" className="text-neutral-400 hover:text-white text-sm">
              ← Back to Builder
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-neutral-400 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-8 text-red-200">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-sm text-neutral-500 mb-1">Images Generated</div>
            <div className="text-3xl font-bold">{data?.totalUsage || 0}</div>
            <div className="text-xs text-neutral-600 mt-1">
              of {data?.plan.monthly_limit || 100} free/month
            </div>
            <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, ((data?.totalUsage || 0) / (data?.plan.monthly_limit || 100)) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-sm text-neutral-500 mb-1">API Keys</div>
            <div className="text-3xl font-bold">{data?.apiKeys.length || 0}</div>
            <div className="text-xs text-neutral-600 mt-1">active keys</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="text-sm text-neutral-500 mb-1">Plan</div>
            <div className="text-3xl font-bold capitalize">{data?.plan.plan || "Free"}</div>
            <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">
              Upgrade to Pro →
            </button>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <button
              onClick={generateApiKey}
              disabled={creating}
              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "+ New API Key"}
            </button>
          </div>

          {data?.apiKeys && data.apiKeys.length > 0 ? (
            <div className="space-y-3">
              {data.apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center gap-4 bg-black rounded-lg p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{apiKey.name}</span>
                      <span className="text-xs text-neutral-500">
                        {apiKey.usage_count} requests this month
                      </span>
                    </div>
                    <code className="text-sm text-green-400 font-mono truncate block">
                      {apiKey.key}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    className="px-3 py-1.5 bg-neutral-800 rounded text-sm hover:bg-neutral-700 transition-colors shrink-0"
                  >
                    {copied === apiKey.id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="px-3 py-1.5 bg-red-900/50 text-red-400 rounded text-sm hover:bg-red-900 transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <p>No API keys yet.</p>
              <p className="text-sm mt-2">
                Create an API key to track your usage and unlock higher limits.
              </p>
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
${data?.apiKeys[0]?.key ? `url.searchParams.set('key', '${data.apiKeys[0].key}');` : "// url.searchParams.set('key', 'YOUR_API_KEY');"}

// Use as og:image
<meta property="og:image" content={url.toString()} />`}</code>
          </pre>
        </div>

        {/* Usage Details */}
        {data?.apiKeys && data.apiKeys.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Usage by Key</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-800">
                    <th className="pb-3">Key</th>
                    <th className="pb-3">Requests</th>
                    <th className="pb-3">Last Used</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-neutral-800/50">
                      <td className="py-3 font-mono text-neutral-400">{key.key.slice(0, 12)}...</td>
                      <td className="py-3">{key.usage_count}</td>
                      <td className="py-3 text-neutral-500">
                        {key.last_used_at
                          ? new Date(key.last_used_at).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3 text-neutral-500">
                        {new Date(key.created_at).toLocaleDateString()}
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
