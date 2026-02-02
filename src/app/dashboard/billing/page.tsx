"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";

interface BillingData {
  plan: {
    plan: string;
    monthly_limit: number;
    subscription_status?: string;
  };
  totalUsage: number;
}

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/keys")
        .then((res) => res.json())
        .then((json) => {
          setData({ plan: json.plan, totalUsage: json.totalUsage });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL;

  const handleUpgrade = () => {
    if (!checkoutUrl) {
      alert("Pro plan coming soon!");
      return;
    }
    const url = new URL(checkoutUrl);
    if (session?.user?.email) {
      url.searchParams.set("checkout[email]", session.user.email);
      url.searchParams.set("checkout[custom][user_email]", session.user.email);
    }
    window.open(url.toString(), "_blank");
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  const isPro = data?.plan?.plan === "pro";
  const isUnlimited = data?.plan?.monthly_limit === -1;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">Billing</h1>

        {/* Current Plan */}
        <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Current Plan</div>
              <div className="text-2xl font-bold capitalize">
                {data?.plan?.plan || "Free"}
                {isPro && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </div>
            {!isPro && (
              <button
                onClick={handleUpgrade}
                className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Monthly Limit</div>
              <div className="text-lg font-semibold">
                {isUnlimited ? "Unlimited" : `${data?.plan?.monthly_limit || 500} images`}
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-500 mb-1">Used This Month</div>
              <div className="text-lg font-semibold">{data?.totalUsage || 0} images</div>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="border border-neutral-800/50 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-neutral-800/50">
            <h2 className="font-medium">Plans</h2>
          </div>

          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800/30">
            {/* Free Plan */}
            <div className={`p-6 ${!isPro ? "bg-neutral-900/30" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Free</h3>
                {!isPro && (
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">Current</span>
                )}
              </div>
              <p className="text-2xl font-bold mb-4">$0</p>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>✓ 500 images/month</li>
                <li>✓ All themes</li>
                <li>✓ Full API access</li>
                <li className="text-neutral-600">• Includes watermark</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className={`p-6 ${isPro ? "bg-neutral-900/30" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Pro</h3>
                {isPro && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mb-4">
                $9<span className="text-lg text-neutral-500">/mo</span>
              </p>
              <ul className="space-y-2 text-sm text-neutral-400 mb-4">
                <li>✓ Unlimited images</li>
                <li>✓ No watermark</li>
                <li>✓ Priority support</li>
              </ul>
              {!isPro && (
                <button
                  onClick={handleUpgrade}
                  className="w-full py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Manage Subscription - only for Pro users */}
        {isPro && (
          <div className="mt-8 text-center text-sm text-neutral-500">
            Need to manage your subscription?{" "}
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-300 transition-colors underline"
            >
              Manage on Lemon Squeezy
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
