"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-neutral-400 mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Go home
          </Link>
        </div>
        {error.digest && <p className="text-xs text-neutral-600 mt-8">Error ID: {error.digest}</p>}
      </div>
    </main>
  );
}
