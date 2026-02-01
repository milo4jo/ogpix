import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MinimalBuilder } from "@/components/MinimalBuilder";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            OG Images.
            <br />
            <span className="text-neutral-500">One URL.</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-xl mx-auto">
            Beautiful Open Graph images with a single API call.
          </p>
        </div>

        {/* Minimal Builder */}
        <MinimalBuilder />
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-900" />

      {/* Features - Ultra Minimal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid sm:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">21</div>
            <div className="text-neutral-500">Themes</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">&lt;100ms</div>
            <div className="text-neutral-500">Response</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500</div>
            <div className="text-neutral-500">Free/month</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-900" />

      {/* Quick Links */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/editor"
            className="p-6 border border-neutral-800 rounded-xl hover:border-neutral-700 hover:bg-neutral-900/50 transition-all group"
          >
            <h3 className="font-semibold mb-2 group-hover:text-white flex items-center gap-2">
              Full Editor
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </h3>
            <p className="text-sm text-neutral-500">All themes, templates, options</p>
          </Link>
          <Link
            href="/docs"
            className="p-6 border border-neutral-800 rounded-xl hover:border-neutral-700 hover:bg-neutral-900/50 transition-all group"
          >
            <h3 className="font-semibold mb-2 group-hover:text-white flex items-center gap-2">
              Documentation
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </h3>
            <p className="text-sm text-neutral-500">API reference & examples</p>
          </Link>
          <Link
            href="/dashboard"
            className="p-6 border border-neutral-800 rounded-xl hover:border-neutral-700 hover:bg-neutral-900/50 transition-all group"
          >
            <h3 className="font-semibold mb-2 group-hover:text-white flex items-center gap-2">
              Get API Key
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </h3>
            <p className="text-sm text-neutral-500">Free tier, no credit card</p>
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-900" />

      {/* Pricing - Minimal */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24" id="pricing">
        <h2 className="text-3xl font-bold mb-12 text-center">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-8 border border-neutral-800 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-6">$0</p>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li>✓ 500 images/month</li>
              <li>✓ All themes & templates</li>
              <li>✓ Full API access</li>
              <li className="text-neutral-600">• Includes watermark</li>
            </ul>
          </div>
          <div className="p-8 border border-white/20 rounded-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-3 py-1 rounded-full font-medium">
              Coming Soon
            </div>
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-6">
              $9<span className="text-lg text-neutral-500">/mo</span>
            </p>
            <ul className="space-y-3 text-neutral-400 text-sm mb-6">
              <li>✓ Unlimited images</li>
              <li>✓ No watermark</li>
              <li>✓ Priority support</li>
            </ul>
            <WaitlistForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-neutral-500">
          Built by{" "}
          <a
            href="https://milo-site-self.vercel.app"
            className="text-white hover:text-neutral-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Milo
          </a>{" "}
          🦊
        </div>
      </div>
    </main>
  );
}
