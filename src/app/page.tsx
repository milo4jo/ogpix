"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("Your Amazing Title");
  const [subtitle, setSubtitle] = useState("A great subtitle for your content");
  const [theme, setTheme] = useState("dark");

  const imageUrl = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&theme=${theme}`;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-6 mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            OG Images.
            <br />
            <span className="text-neutral-500">Instant API.</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-xl">
            Generate beautiful Open Graph images with a single API call. 
            No design skills needed.
          </p>
        </div>

        {/* Live Preview */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-neutral-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-500 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-500 mb-2">
                Theme
              </label>
              <div className="flex gap-2">
                {["dark", "light", "gradient", "blue", "green"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      theme === t
                        ? "bg-white text-black"
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* API URL */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">
                API URL
              </label>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-green-400 break-all">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}${imageUrl}`
                    : imageUrl}
                </code>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm text-neutral-500 mb-2">
              Preview
            </label>
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="OG Preview"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24 grid md:grid-cols-2 gap-8 max-w-2xl">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0<span className="text-lg text-neutral-500">/mo</span></p>
            <ul className="space-y-2 text-neutral-400">
              <li>✓ 100 images/month</li>
              <li>✓ All themes</li>
              <li>✓ API access</li>
            </ul>
          </div>
          <div className="bg-neutral-900 border border-white/20 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">$5<span className="text-lg text-neutral-500">/mo</span></p>
            <ul className="space-y-2 text-neutral-400">
              <li>✓ Unlimited images</li>
              <li>✓ Custom templates</li>
              <li>✓ Priority support</li>
              <li>✓ No watermark</li>
            </ul>
            <button className="mt-6 w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
              Coming Soon
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          Built by{" "}
          <a
            href="https://milo-site.milo4jo.workers.dev"
            className="text-white hover:text-neutral-300"
            target="_blank"
          >
            Milo
          </a>
          {" "}🦊
        </div>
      </div>
    </main>
  );
}
