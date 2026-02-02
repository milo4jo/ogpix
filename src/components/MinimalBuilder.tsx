"use client";

import { useState, useMemo, useEffect } from "react";
import { OGPreview } from "./OGPreview";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

// Only show the best themes
const featuredThemes = [
  { id: "dark", label: "Dark", color: "#000000" },
  { id: "gradient", label: "Gradient", color: "linear-gradient(135deg, #667eea, #764ba2)" },
  { id: "sunset", label: "Sunset", color: "linear-gradient(135deg, #f97316, #ec4899)" },
  { id: "aurora", label: "Aurora", color: "linear-gradient(135deg, #00d4ff, #7c3aed)" },
];

export function MinimalBuilder() {
  const [title, setTitle] = useState("Your Next Big Thing");
  const [subtitle, setSubtitle] = useState("");
  const [theme, setTheme] = useState("dark");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const debouncedTitle = useDebounce(title, 300);
  const debouncedSubtitle = useDebounce(subtitle, 300);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("title", debouncedTitle);
    if (debouncedSubtitle) params.set("subtitle", debouncedSubtitle);
    params.set("theme", theme);
    return `/api/og?${params.toString()}`;
  }, [debouncedTitle, debouncedSubtitle, theme]);

  // Build the full URL for copying (uses current values, not debounced)
  const fullUrl = useMemo(() => {
    if (!origin) return "";
    const params = new URLSearchParams();
    params.set("title", title);
    if (subtitle) params.set("subtitle", subtitle);
    params.set("theme", theme);
    return `${origin}/api/og?${params.toString()}`;
  }, [origin, title, subtitle, theme]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Preview */}
      <div className="mb-8">
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          <OGPreview imageUrl={imageUrl} />
        </div>
      </div>

      {/* Minimal Controls */}
      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-neutral-800 py-3 text-2xl sm:text-3xl font-medium text-white focus:outline-none focus:border-neutral-600 placeholder:text-neutral-600"
            placeholder="Enter your title"
          />
        </div>

        {/* Subtitle Input */}
        <div>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full bg-transparent border-b border-neutral-800 py-2 text-lg text-neutral-400 focus:outline-none focus:border-neutral-600 placeholder:text-neutral-700"
            placeholder="Add a subtitle (optional)"
          />
        </div>

        {/* Theme Swatches */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">Theme</span>
          <div className="flex gap-2">
            {featuredThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-8 h-8 rounded-full transition-all ${
                  theme === t.id ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                }`}
                style={{ background: t.color }}
                title={t.label}
              />
            ))}
            <Link
              href="/editor"
              className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors text-xs"
              title="More themes"
            >
              +17
            </Link>
          </div>
        </div>

        {/* URL + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 flex items-center gap-2">
            <code className="text-sm text-neutral-300 truncate flex-1 font-mono">{fullUrl}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <Link
            href="/editor"
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center"
          >
            Open Editor
          </Link>
        </div>
      </div>
    </div>
  );
}
