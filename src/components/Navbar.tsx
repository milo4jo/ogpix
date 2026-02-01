"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm transition-colors relative ${
        active ? "text-white font-medium" : "text-neutral-400 hover:text-white"
      }`}
    >
      {children}
      {active && <span className="absolute -bottom-[17px] left-0 right-0 h-px bg-white" />}
    </Link>
  );
}

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isEditor = pathname === "/editor";
  const isDocs = pathname === "/docs" || pathname?.startsWith("/docs/");
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg hover:text-neutral-300 transition-colors">
          OGPix
        </Link>

        {/* Center Nav */}
        <div className="flex items-center gap-6">
          <NavLink href="/editor" active={isEditor}>
            Editor
          </NavLink>
          <NavLink href="/docs" active={isDocs}>
            Docs
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/milo4jo/ogpix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:flex items-center gap-1"
          >
            GitHub
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {status === "loading" ? (
            <div className="w-20 h-8 bg-neutral-800 rounded animate-pulse" />
          ) : session ? (
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isDashboard
                  ? "bg-white text-black"
                  : "bg-neutral-900 border border-neutral-800 hover:bg-neutral-800"
              }`}
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
