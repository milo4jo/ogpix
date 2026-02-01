"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          OGPix
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-sm text-neutral-400 hover:text-white">
            Docs
          </Link>
          <a
            href="https://github.com/milo4jo/ogpix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-400 hover:text-white"
          >
            GitHub
          </a>

          {status === "loading" ? (
            <div className="w-20 h-8 bg-neutral-800 rounded animate-pulse" />
          ) : session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm hover:bg-neutral-800 transition-colors"
            >
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
              )}
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
