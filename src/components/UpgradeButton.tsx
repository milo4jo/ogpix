"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UpgradeButtonProps {
  className?: string;
}

export function UpgradeButton({ className = "" }: UpgradeButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL;

  const handleUpgrade = () => {
    if (status === "unauthenticated") {
      // Redirect to login first, then to checkout
      router.push("/login?callbackUrl=/dashboard?upgrade=true");
      return;
    }

    if (!checkoutUrl) {
      // Fallback to waitlist if checkout not configured
      alert("Pro plan coming soon! Join the waitlist.");
      return;
    }

    // Append user email to checkout for automatic linking
    const url = new URL(checkoutUrl);
    if (session?.user?.email) {
      url.searchParams.set("checkout[email]", session.user.email);
      url.searchParams.set("checkout[custom][user_email]", session.user.email);
    }

    window.open(url.toString(), "_blank");
  };

  return (
    <button
      onClick={handleUpgrade}
      className={`w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors ${className}`}
    >
      Upgrade to Pro
    </button>
  );
}
