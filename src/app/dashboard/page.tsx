"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeModal } from "@/components/WelcomeModal";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  created_at: string;
  usage_count: number;
}

interface DashboardData {
  user: { id: string; name: string; email: string };
  plan: { plan: string; monthly_limit: number };
  apiKeys: ApiKey[];
  totalUsage: number;
  isNewUser?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

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
      
      if (json.isNewUser || (json.apiKeys?.length === 0 && !localStorage.getItem("ogpix_onboarded"))) {
        setShowWelcome(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
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
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Delete this API key?")) return;
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
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!session) return null;

  const usagePercent = Math.min(100, ((data?.totalUsage || 0) / (data?.plan?.monthly_limit || 500)) * 100);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("ogpix_onboarded", "true");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {showWelcome && (
        <WelcomeModal
          userName={session.user?.name || ""}
          onClose={handleCloseWelcome}
          onCreateKey={() => {
            handleCloseWelcome();
            generateApiKey();
          }}
        />
      )}
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header - minimal */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8 flex items-center justify-between">
            <span className="text-red-200 text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">✕</button>
          </div>
        )}

        {/* Stats - 3 columns, uniform style */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-5">
            <div className="text-sm text-neutral-500 mb-2">Images</div>
            <div className="text-3xl font-bold">{data?.totalUsage || 0}</div>
            <div className="mt-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="text-xs text-neutral-600 mt-2">of {data?.plan?.monthly_limit || 500}/month</div>
          </div>
          
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-5">
            <div className="text-sm text-neutral-500 mb-2">API Keys</div>
            <div className="text-3xl font-bold">{data?.apiKeys?.length || 0}</div>
            <div className="text-xs text-neutral-600 mt-2">active</div>
          </div>
          
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-5">
            <div className="text-sm text-neutral-500 mb-2">Plan</div>
            <div className="text-3xl font-bold capitalize">{data?.plan?.plan || "Free"}</div>
            <Link href="/#pricing" className="text-xs text-neutral-500 hover:text-white mt-2 inline-block">
              Upgrade
            </Link>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="border border-neutral-800/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-800/50">
            <h2 className="font-medium">API Keys</h2>
            <button
              onClick={generateApiKey}
              disabled={creating}
              className="px-4 py-1.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "+ New Key"}
            </button>
          </div>

          {data?.apiKeys && data.apiKeys.length > 0 ? (
            <div className="divide-y divide-neutral-800/30">
              {data.apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <code className="text-sm text-neutral-400 font-mono block truncate">
                      {apiKey.key}
                    </code>
                    <div className="text-xs text-neutral-600 mt-1">
                      {apiKey.usage_count} requests · Created {new Date(apiKey.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      className={`px-3 py-1.5 rounded text-sm transition-all ${
                        copied === apiKey.id
                          ? "bg-green-600 text-white"
                          : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      {copied === apiKey.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-red-900/50 text-neutral-500 hover:text-red-400 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-500 text-sm">
              No API keys yet. Create one to get started.
            </div>
          )}
        </div>

        {/* Quick link to docs - minimal */}
        <div className="mt-8 text-center">
          <Link 
            href="/docs"
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            View API documentation
          </Link>
        </div>
      </div>
    </main>
  );
}
