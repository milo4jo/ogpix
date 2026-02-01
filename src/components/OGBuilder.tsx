"use client";

import { useState, useMemo, useEffect } from "react";
import { OGPreview } from "./OGPreview";
import { useDebounce } from "@/hooks/useDebounce";

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

export function OGBuilder() {
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
  const [origin, setOrigin] = useState("");

  // Get origin on client side
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Debounce text inputs to prevent request on every keystroke
  const debouncedTitle = useDebounce(title, 300);
  const debouncedSubtitle = useDebounce(subtitle, 300);
  const debouncedTag = useDebounce(tag, 300);
  const debouncedAuthor = useDebounce(author, 300);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("title", debouncedTitle);
    if (debouncedSubtitle) params.set("subtitle", debouncedSubtitle);
    params.set("theme", theme);
    if (template) params.set("template", template);
    if (pattern !== "none") params.set("pattern", pattern);
    if (fontSize !== "auto") params.set("fontSize", fontSize);
    if (layout !== "center") params.set("layout", layout);
    if (debouncedTag) params.set("tag", debouncedTag);
    if (debouncedAuthor) params.set("author", debouncedAuthor);
    if (!watermark) params.set("watermark", "false");
    return `/api/og?${params.toString()}`;
  }, [
    debouncedTitle,
    debouncedSubtitle,
    theme,
    template,
    pattern,
    fontSize,
    layout,
    debouncedTag,
    debouncedAuthor,
    watermark,
  ]);

  // Live URL for copying (uses current values, not debounced)
  const liveUrl = useMemo(() => {
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

  const fullUrl = origin ? `${origin}${liveUrl}` : liveUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
                <div className="flex flex-wrap gap-1">
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
              Show watermark (Pro removes this)
            </label>
          </div>
        </details>

        {/* API URL */}
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Your API URL</label>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex items-start gap-2">
            <code className="text-xs sm:text-sm text-green-400 break-all flex-1">{fullUrl}</code>
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
          <OGPreview imageUrl={imageUrl} />
        </div>
        <p className="text-xs text-neutral-600 mt-2 text-center">
          1200×630px · PNG · Optimized for social sharing
        </p>
      </div>
    </div>
  );
}
