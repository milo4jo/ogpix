"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  mobile?: boolean;
  onClick?: () => void;
}

function NavLink({ href, children, active, mobile, onClick }: NavLinkProps) {
  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`block px-4 py-3 text-base transition-colors ${
          active
            ? "text-white font-medium bg-neutral-800"
            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
        }`}
      >
        {children}
      </Link>
    );
  }

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEditor = pathname === "/editor";
  const isDocs = pathname === "/docs" || pathname?.startsWith("/docs/");
  const isDashboard = pathname === "/dashboard";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-lg hover:text-neutral-300 transition-colors"
          onClick={closeMenu}
        >
          OGPix
        </Link>

        {/* Desktop Center Nav */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink href="/editor" active={isEditor}>
            Editor
          </NavLink>
          <NavLink href="/docs" active={isDocs}>
            Docs
          </NavLink>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="https://github.com/milo4jo/ogpix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
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

        {/* Mobile: Sign in + Hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          {status !== "loading" && !session && (
            <button
              onClick={() => signIn("github")}
              className="px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium"
            >
              Sign in
            </button>
          )}
          {status !== "loading" && session && (
            <Link href="/dashboard" onClick={closeMenu}>
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-neutral-700" />
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-black">
          <NavLink href="/editor" active={isEditor} mobile onClick={closeMenu}>
            Editor
          </NavLink>
          <NavLink href="/docs" active={isDocs} mobile onClick={closeMenu}>
            Docs
          </NavLink>
          {session && (
            <NavLink href="/dashboard" active={isDashboard} mobile onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
          <a
            href="https://github.com/milo4jo/ogpix"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 text-base text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            onClick={closeMenu}
          >
            GitHub ↗
          </a>
        </div>
      )}
    </nav>
  );
}
