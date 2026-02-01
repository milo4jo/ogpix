"use client";

import { useState, useMemo } from "react";

const themes = [
  "dark", "light", "gradient", "blue", "green", "purple", 
  "orange", "pink", "cyan", "slate", "zinc", "sunset", "ocean", "forest", "midnight"
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

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${imageUrl}` : imageUrl;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
            OG Images.
            <span className="text-neutral-500"> Instant API.</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Generate beautiful Open Graph images with a single API call. 
            15+ themes, templates, and full customization. No design skills needed.
          </p>
        </div>

        {/* Live Builder */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          {/* Controls */}
          <div className="space-y-6">
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
                {themes.map((t) => (
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
            </div>

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              {showAdvanced ? "− Hide" : "+ Show"} advanced options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
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
                  <div className="flex gap-2">
                    {patterns.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPattern(p)}
                        className={`px-2 py-1 rounded text-xs capitalize ${
                          pattern === p ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"
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
                    <div className="flex gap-1">
                      {fontSizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setFontSize(s)}
                          className={`px-2 py-1 rounded text-xs ${
                            fontSize === s ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"
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
                            layout === l ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"
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
                  Show watermark
                </label>
              </div>
            )}

            {/* API URL */}
            <div>
              <label className="block text-sm text-neutral-500 mb-2">API URL</label>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs text-green-400 break-all">{fullUrl}</code>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(fullUrl)}
                className="mt-2 text-xs text-neutral-500 hover:text-white"
              >
                Copy URL
              </button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm text-neutral-500 mb-2">Preview</label>
            <div className="border border-neutral-800 rounded-lg overflow-hidden sticky top-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="OG Preview" className="w-full" />
            </div>
          </div>
        </div>

        {/* Get Started */}
        <section className="mb-24" id="docs">
          <h2 className="text-3xl font-bold mb-8">Get Started</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Start */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Just add the URL to your HTML meta tags:
              </p>
              <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-green-400">{`<meta property="og:image" content="https://ogpix.vercel.app/api/og?title=Your%20Title" />`}</code>
              </pre>
            </div>

            {/* Next.js */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Next.js</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Use in your metadata export:
              </p>
              <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-green-400">{`export const metadata = {
  openGraph: {
    images: ['https://ogpix.vercel.app/api/og?title=My+Page'],
  },
}`}</code>
              </pre>
            </div>

            {/* Fetch/curl */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">curl / fetch</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Download the image directly:
              </p>
              <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-green-400">{`curl "https://ogpix.vercel.app/api/og?title=Hello" -o og.png`}</code>
              </pre>
            </div>

            {/* Dynamic */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Dynamic Images</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Generate images on-the-fly for each page:
              </p>
              <pre className="bg-black rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-green-400">{`const ogUrl = new URL('https://ogpix.vercel.app/api/og');
ogUrl.searchParams.set('title', post.title);
ogUrl.searchParams.set('subtitle', post.excerpt);
ogUrl.searchParams.set('theme', 'gradient');`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">API Reference</h2>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-neutral-400 font-medium">Parameter</th>
                  <th className="px-6 py-3 text-left text-neutral-400 font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-neutral-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                <tr><td className="px-6 py-3 font-mono text-green-400">title</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">Main title text (required)</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">subtitle</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">Secondary text below title</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">theme</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">dark, light, gradient, blue, green, purple, orange, pink, cyan, slate, zinc, sunset, ocean, forest, midnight</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">template</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">blog, github, product, event, docs</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">pattern</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">none, dots, grid, diagonal</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">fontSize</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">auto, sm, md, lg, xl</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">layout</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">center, left</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">tag</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">Small label above title</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">author</td><td className="px-6 py-3 text-neutral-400">string</td><td className="px-6 py-3">Author name below content</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">logo</td><td className="px-6 py-3 text-neutral-400">url</td><td className="px-6 py-3">URL to logo/icon image</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">bg</td><td className="px-6 py-3 text-neutral-400">color</td><td className="px-6 py-3">Custom background color (hex)</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">text</td><td className="px-6 py-3 text-neutral-400">color</td><td className="px-6 py-3">Custom text color (hex)</td></tr>
                <tr><td className="px-6 py-3 font-mono text-green-400">watermark</td><td className="px-6 py-3 text-neutral-400">boolean</td><td className="px-6 py-3">Show/hide watermark (default: true)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-lg text-neutral-500">/mo</span></p>
              <ul className="space-y-2 text-neutral-400">
                <li>✓ Unlimited images</li>
                <li>✓ All themes & templates</li>
                <li>✓ Full customization</li>
                <li>✓ API access</li>
                <li className="text-neutral-600">• Watermark included</li>
              </ul>
            </div>
            <div className="bg-neutral-900 border border-white/20 rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-3 py-1 rounded-full font-medium">
                Coming Soon
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-4">$5<span className="text-lg text-neutral-500">/mo</span></p>
              <ul className="space-y-2 text-neutral-400">
                <li>✓ Everything in Free</li>
                <li>✓ No watermark</li>
                <li>✓ Custom fonts</li>
                <li>✓ Priority support</li>
                <li>✓ API analytics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          Built by{" "}
          <a href="https://milo-site.milo4jo.workers.dev" className="text-white hover:text-neutral-300" target="_blank">
            Milo
          </a>
          {" "}🦊 •{" "}
          <a href="https://github.com/milo4jo/ogpix" className="hover:text-white" target="_blank">
            GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}
