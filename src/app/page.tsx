import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { OGBuilder } from "@/components/OGBuilder";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            OG Images.
            <span className="text-neutral-500"> Instant API.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-6">
            Generate beautiful Open Graph images with a single API call. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/docs"
              className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center"
            >
              Read the Docs
            </Link>
            <a
              href="https://github.com/milo4jo/ogpix"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-lg font-medium hover:bg-neutral-800 transition-colors text-center"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Live Builder (Client Component) */}
        <OGBuilder />

        {/* Quick Links */}
        <section className="mb-16 sm:mb-24">
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/docs#quickstart"
              className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-semibold mb-2">Quick Start →</h3>
              <p className="text-sm text-neutral-400">Get running in 30 seconds</p>
            </Link>
            <Link
              href="/docs#api-keys"
              className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-semibold mb-2">API Keys →</h3>
              <p className="text-sm text-neutral-400">Free vs Pro explained</p>
            </Link>
            <Link
              href="/docs#api-reference"
              className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors"
            >
              <h3 className="font-semibold mb-2">API Reference →</h3>
              <p className="text-sm text-neutral-400">All parameters documented</p>
            </Link>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16 sm:mb-24" id="pricing">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">
                $0<span className="text-lg text-neutral-500">/mo</span>
              </p>
              <ul className="space-y-2 text-neutral-400 text-sm sm:text-base">
                <li>✓ Unlimited images</li>
                <li>✓ All themes & templates</li>
                <li>✓ Full customization</li>
                <li>✓ No API key required</li>
                <li className="text-neutral-600">• Watermark included</li>
              </ul>
            </div>
            <div className="bg-neutral-900 border border-white/20 rounded-xl p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Coming Soon
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-4">
                $9<span className="text-lg text-neutral-500">/mo</span>
              </p>
              <ul className="space-y-2 text-neutral-400 text-sm sm:text-base mb-6">
                <li>✓ No watermark</li>
                <li>✓ Custom fonts</li>
                <li>✓ Priority rendering</li>
                <li>✓ API analytics</li>
              </ul>
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>
            Built by{" "}
            <a
              href="https://milo-site-self.vercel.app"
              className="text-white hover:text-neutral-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Milo
            </a>{" "}
            🦊
          </p>
          <p className="mt-2">
            <Link href="/docs" className="hover:text-white">
              Docs
            </Link>
            {" · "}
            <a
              href="https://github.com/milo4jo/ogpix"
              className="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
