"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { WaitlistForm } from "@/components/WaitlistForm";

const themes = [
  "dark",
  "light",
  "gradient",
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "cyan",
  "slate",
  "zinc",
  "sunset",
  "ocean",
  "forest",
  "midnight",
];

const templates = [
  { id: "", name: "Custom" },
  { id: "blog", name: "Blog Post" },
  { id: "github", name: "GitHub/OSS" },
  { id: "product", name: "Product" },
  { id: "event", name: "Event" },
  { id: "docs", name: "Documentation" },
];

const patterns = ["none", "dots", "grid", "diagonal"];
const fontSizes = ["auto", "sm", "md", "lg", "xl"];
const layouts = ["center", "left"];

export default function Home() {
  const [title, setTitle] = useState("Build Something Amazing");
  const [subtitle, setSubtitle] = useState("The fastest way to generate OG images");
  const [theme, setTheme] = useState("dark");
  const [template, setTemplate] = useState("");
  const [pattern, setPattern] = useState("none");
  const [fontSize, setFontSize] = useState("auto");
  const [layout, setLayout] = useState("center");
  const [tag, setTag] = useState("");
  const [author, setAuthor] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("title", title);
    if (subtitle) params.set("subtitle", subtitle);
    params.set("theme", theme);
    if (template) params.set("template", template);
    if (pattern !== "none") params.set("pattern", pattern);
    if (fontSize !== "auto") params.set("fontSize", fontSize);
    if (layout !== "center") params.set("layout", layout);
    if (tag) params.set("tag", tag);
    if (author) params.set("author", author);
    if (!watermark) params.set("watermark", "false");
    return `/api/og?${params.toString()}`;
  }, [title, subtitle, theme, template, pattern, fontSize, layout, tag, author, watermark]);

  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${imageUrl}` : imageUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-lg font-medium hover:bg-neutral-800 transition-colors text-center"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Live Builder */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-24">
          {/* Controls */}
          <div className="space-y-5 sm:space-y-6">
            {/* Template */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">Template</label>
              <div className="flex flex-wrap gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      template === t.id
                        ? "bg-white text-black"
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-600"
                placeholder="Your amazing title"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-600"
                placeholder="A compelling description"
              />
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">Theme</label>
              <div className="flex flex-wrap gap-2">
                {themes.slice(0, 8).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1.5 rounded-lg capitalize text-sm transition-colors ${
                      theme === t
                        ? "bg-white text-black"
                        : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-neutral-900 text-neutral-500 hover:bg-neutral-800"
                >
                  +{themes.length - 8} more
                </button>
              </div>
              {showAdvanced && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {themes.slice(8).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-3 py-1.5 rounded-lg capitalize text-sm transition-colors ${
                        theme === t
                          ? "bg-white text-black"
                          : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced Options Toggle */}
            <details className="group">
              <summary className="text-sm text-neutral-500 hover:text-white transition-colors cursor-pointer list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">→</span>
                Advanced options
              </summary>
              <div className="mt-4 space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Tag/Label</label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm"
                      placeholder="Blog Post"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Pattern</label>
                  <div className="flex flex-wrap gap-2">
                    {patterns.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPattern(p)}
                        className={`px-2 py-1 rounded text-xs capitalize ${
                          pattern === p
                            ? "bg-white text-black"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Font Size</label>
                    <div className="flex flex-wrap gap-1">
                      {fontSizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setFontSize(s)}
                          className={`px-2 py-1 rounded text-xs ${
                            fontSize === s
                              ? "bg-white text-black"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Layout</label>
                    <div className="flex gap-1">
                      {layouts.map((l) => (
                        <button
                          key={l}
                          onClick={() => setLayout(l)}
                          className={`px-2 py-1 rounded text-xs capitalize ${
                            layout === l
                              ? "bg-white text-black"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-neutral-400">
                  <input
                    type="checkbox"
                    checked={watermark}
                    onChange={(e) => setWatermark(e.target.checked)}
                    className="rounded"
                  />
                  Show watermark (Pro removes this)
                </label>
              </div>
            </details>

            {/* API URL */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">Your API URL</label>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex items-start gap-2">
                <code className="text-xs sm:text-sm text-green-400 break-all flex-1">
                  {fullUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <label className="block text-sm text-neutral-500 mb-2">Preview</label>
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <img src={imageUrl} alt="OG Preview" className="w-full" />
            </div>
            <p className="text-xs text-neutral-600 mt-2 text-center">
              1200×630px · PNG · Optimized for social sharing
            </p>
          </div>
        </div>

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
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
