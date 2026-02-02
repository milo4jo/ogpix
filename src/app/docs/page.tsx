"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CodeBlock, InlineCode } from "@/components/CodeBlock";

const sections = [
  { id: "quickstart", label: "Quick Start" },
  { id: "api-keys", label: "API Keys" },
  { id: "api-reference", label: "API Reference" },
  { id: "themes", label: "Themes" },
  { id: "layouts", label: "Layouts" },
  { id: "templates", label: "Templates" },
  { id: "examples", label: "Examples" },
];

const themes = [
  { name: "dark", description: "Dark background with white text" },
  { name: "light", description: "Light background with dark text" },
  { name: "gradient", description: "Purple to pink gradient" },
  { name: "blue", description: "Deep blue background" },
  { name: "green", description: "Forest green background" },
  { name: "purple", description: "Rich purple background" },
  { name: "orange", description: "Warm orange background" },
  { name: "pink", description: "Soft pink background" },
  { name: "cyan", description: "Bright cyan background" },
  { name: "slate", description: "Neutral slate gray" },
  { name: "zinc", description: "Cool zinc gray" },
  { name: "sunset", description: "Orange to red gradient" },
  { name: "ocean", description: "Blue to teal gradient" },
  { name: "forest", description: "Green nature tones" },
  { name: "midnight", description: "Deep navy blue" },
  { name: "aurora", description: "Cyan to purple to pink gradient" },
  { name: "ember", description: "Orange to yellow fire gradient" },
  { name: "neon", description: "Vibrant cyan/magenta/yellow neon" },
  { name: "lavender", description: "Soft purple to blue pastel" },
  { name: "mint", description: "Fresh green pastel gradient" },
  { name: "rose", description: "Warm peach to pink pastel" },
];

const templates = [
  { name: "blog", description: "Blog post with tag and author" },
  { name: "github", description: "Open source project style" },
  { name: "product", description: "Product launch announcement" },
  { name: "event", description: "Event or conference" },
  { name: "docs", description: "Documentation page" },
  { name: "announcement", description: "Announcements and updates" },
  { name: "tutorial", description: "Educational content and guides" },
  { name: "changelog", description: "Release notes and changelogs" },
  { name: "showcase", description: "Portfolio and showcase items" },
  { name: "news", description: "News articles and press releases" },
  // Modern style templates
  { name: "modern", description: "Clean style with gradient accent bar (use template=vercel in API)" },
  { name: "minimal", description: "Ultra-clean, just the title" },
  { name: "split", description: "Left-aligned with gradient accent line" },
  { name: "hero", description: "Large centered title with icon support" },
  { name: "feature", description: "Title with gradient 'New' badge" },
  { name: "release", description: "Release/changelog card style" },
];

const parameters = [
  { name: "title", type: "string", required: true, description: "Main title text" },
  { name: "subtitle", type: "string", required: false, description: "Secondary text below title" },
  {
    name: "theme",
    type: "string",
    required: false,
    description: "Color theme (see Themes section)",
  },
  {
    name: "template",
    type: "string",
    required: false,
    description: "Layout template (see Templates section)",
  },
  {
    name: "pattern",
    type: "string",
    required: false,
    description: "Background pattern: none, dots, grid, diagonal",
  },
  {
    name: "fontSize",
    type: "string",
    required: false,
    description: "Text size: auto, sm, md, lg, xl",
  },
  {
    name: "layout",
    type: "string",
    required: false,
    description: "Layout style: center, left, hero, minimal, split, card, featured, modern",
  },
  { name: "tag", type: "string", required: false, description: "Small label above title" },
  { name: "author", type: "string", required: false, description: "Author name at bottom" },
  { name: "logo", type: "url", required: false, description: "Logo URL (GitHub, Cloudflare, Unsplash, Imgur only)" },
  {
    name: "bg",
    type: "hex",
    required: false,
    description: "Custom background color (e.g., ff5500)",
  },
  { name: "text", type: "hex", required: false, description: "Custom text color (e.g., ffffff)" },
  {
    name: "watermark",
    type: "boolean",
    required: false,
    description: "Show OGPix watermark (default: true)",
  },
  {
    name: "borderWidth",
    type: "number",
    required: false,
    description: "Border width in pixels (max: 20)",
  },
  {
    name: "borderColor",
    type: "hex",
    required: false,
    description: "Border color (e.g., ffffff)",
  },
  {
    name: "borderRadius",
    type: "number",
    required: false,
    description: "Corner radius in pixels (max: 60)",
  },
  // New Vercel-style parameters
  {
    name: "badge",
    type: "string",
    required: false,
    description: "Gradient pill badge above title (e.g., 'New', 'Beta')",
  },
  {
    name: "date",
    type: "string",
    required: false,
    description: "Date display for card layout",
  },
  {
    name: "icon",
    type: "string",
    required: false,
    description: "Emoji/icon for hero layout (e.g., 🚀)",
  },
  {
    name: "gradientText",
    type: "boolean",
    required: false,
    description: "Apply gradient effect to title text",
  },
];

function SidebarLink({ id, label, active }: { id: string; label: string; active: boolean }) {
  return (
    <a
      href={`#${id}`}
      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-white text-black font-medium"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
      }`}
    >
      {label}
    </a>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sections.map((s) => s.id);
      const scrollPosition = window.scrollY + 120; // Offset for navbar

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Global Navbar */}
      <Navbar />

      {/* Docs Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:py-8">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden w-full flex items-center justify-between py-4 text-neutral-400 hover:text-white"
            >
              <span className="text-sm font-medium">
                {sections.find((s) => s.id === activeSection)?.label || "Navigation"}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Sidebar links */}
            <nav
              className={`${mobileNavOpen ? "block" : "hidden"} lg:block space-y-1 pb-4 lg:pb-0`}
            >
              {sections.map((section) => (
                <SidebarLink
                  key={section.id}
                  id={section.id}
                  label={section.label}
                  active={activeSection === section.id}
                />
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="py-8 space-y-16 min-w-0">
            {/* Quick Start */}
            <section id="quickstart" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Quick Start</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                Generate beautiful Open Graph images with a single API call. No signup required for
                the free tier.
              </p>

              <h2 className="text-xl font-semibold mb-4">1. Basic Usage</h2>
              <p className="text-neutral-400 mb-4">
                Just add the OGPix URL to your HTML meta tags:
              </p>
              <CodeBlock
                code={`<meta property="og:image" content="https://ogpix.vercel.app/api/og?title=Your+Title" />`}
                language="html"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">2. With Next.js</h2>
              <p className="text-neutral-400 mb-4">Use in your metadata export:</p>
              <CodeBlock
                code={`export const metadata = {
  openGraph: {
    images: ['https://ogpix.vercel.app/api/og?title=My+Page&theme=dark'],
  },
}`}
                language="typescript"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Download Directly</h2>
              <p className="text-neutral-400 mb-4">Download the image using curl or fetch:</p>
              <CodeBlock
                code={`curl "https://ogpix.vercel.app/api/og?title=Hello&theme=gradient" -o og.png`}
                language="bash"
              />
            </section>

            {/* API Keys */}
            <section id="api-keys" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">API Keys</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                Understanding when and how to use API keys with OGPix.
              </p>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                  ✓ Free Tier — Get Started Instantly
                </h3>
                <p className="text-neutral-400">
                  Try without signup (20 images/day per IP) or get a free API key for 500
                  images/month. Images include a small &quot;ogpix.vercel.app&quot; watermark.
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Free Tier</h2>
              <ul className="list-disc list-inside text-neutral-400 space-y-2 mb-8">
                <li>500 images per month (with free API key)</li>
                <li>20 requests per day without API key (IP-based)</li>
                <li>All themes and templates</li>
                <li>Full customization options</li>
                <li>Small watermark included</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">Pro Tier (Coming Soon)</h2>
              <p className="text-neutral-400 mb-4">The Pro tier will include:</p>
              <ul className="list-disc list-inside text-neutral-400 space-y-2 mb-8">
                <li>Unlimited image generation</li>
                <li>No watermark on images</li>
                <li>Custom fonts</li>
                <li>Priority rendering</li>
                <li>API analytics dashboard</li>
              </ul>

              <div className="bg-neutral-900 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">🚀 Join the Pro Waitlist</h3>
                <p className="text-neutral-400 mb-4">
                  Be the first to know when Pro launches. Enter your email on the{" "}
                  <Link href="/#pricing" className="text-blue-400 hover:underline">
                    pricing section
                  </Link>{" "}
                  of the homepage.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Using Your API Key</h2>
              <p className="text-neutral-400 mb-4">
                Add your API key as a query parameter:
              </p>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Hello&key=YOUR_API_KEY`}
                language="url"
              />
            </section>

            {/* API Reference */}
            <section id="api-reference" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">API Reference</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                Complete reference for all API parameters.
              </p>

              <h2 className="text-xl font-semibold mb-4">Base URL</h2>
              <CodeBlock code="https://ogpix.vercel.app/api/og" />

              <h2 className="text-xl font-semibold mt-8 mb-4">Parameters</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left py-3 pr-4 text-neutral-400 font-medium">
                        Parameter
                      </th>
                      <th className="text-left py-3 pr-4 text-neutral-400 font-medium hidden sm:table-cell">
                        Type
                      </th>
                      <th className="text-left py-3 text-neutral-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param) => (
                      <tr key={param.name} className="border-b border-neutral-800/50">
                        <td className="py-3 pr-4">
                          <InlineCode>{param.name}</InlineCode>
                          {param.required && <span className="text-red-400 text-xs ml-1">*</span>}
                          <span className="sm:hidden text-neutral-500 text-xs block mt-1">
                            {param.type}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-neutral-500 hidden sm:table-cell">
                          {param.type}
                        </td>
                        <td className="py-3 text-neutral-400">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-neutral-500 text-sm mt-4">* Required parameter</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Response</h2>
              <p className="text-neutral-400 mb-4">
                Returns a PNG image (1200×630 pixels) with the appropriate Content-Type header.
              </p>
              <CodeBlock
                code={`Content-Type: image/png
Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800`}
                language="bash"
              />
            </section>

            {/* Themes */}
            <section id="themes" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Themes</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                21 built-in color themes for your images.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.name}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
                  >
                    <InlineCode>{theme.name}</InlineCode>
                    <p className="text-neutral-500 text-sm mt-1">{theme.description}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Custom Colors</h2>
              <p className="text-neutral-400 mb-4">
                Use the <InlineCode>bg</InlineCode> and{" "}
                <InlineCode>text</InlineCode> parameters for custom colors:
              </p>
              <CodeBlock code={`/api/og?title=Custom&bg=1a1a2e&text=eaeaea`} language="url" />
            </section>

            {/* Layouts */}
            <section id="layouts" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Layouts</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                Different layout styles for your OG images, inspired by Vercel&apos;s design.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>center</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Default centered layout</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>left</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Left-aligned at bottom</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>hero</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Large centered title with icon support</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>minimal</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Ultra-clean, just the title</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>split</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Left-aligned with gradient accent line</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>card</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Blog card style with author/date metadata</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>featured</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Title with gradient badge support</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                  <InlineCode>modern</InlineCode>
                  <p className="text-neutral-500 text-sm mt-1">Vercel-style with gradient accent bar at top</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Example</h2>
              <CodeBlock
                code={`/api/og?title=Ship+Faster&subtitle=Deploy+with+confidence&layout=modern`}
                language="url"
              />
            </section>

            {/* Templates */}
            <section id="templates" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Templates</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                Pre-designed layouts for common use cases.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.name}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
                  >
                    <InlineCode>{template.name}</InlineCode>
                    <p className="text-neutral-500 text-sm mt-1">{template.description}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Example</h2>
              <CodeBlock
                code={`/api/og?title=My+Blog+Post&template=blog&tag=Tutorial&author=John+Doe`}
                language="url"
              />
            </section>

            {/* Examples */}
            <section id="examples" className="scroll-mt-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Examples</h1>
              <p className="text-neutral-400 mb-8 text-lg">Common use cases and code snippets.</p>

              <h2 className="text-xl font-semibold mb-4">Blog Post</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=How+to+Build+APIs&subtitle=A+complete+guide+for+beginners&template=blog&theme=dark&tag=Tutorial&author=Jane+Doe`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">GitHub Project</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=my-awesome-lib&subtitle=Fast+and+lightweight+utility+library&template=github&theme=gradient`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Product Launch</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Introducing+ProductX&subtitle=The+future+of+productivity&template=product&theme=sunset&pattern=dots`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Vercel-style Modern</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Ship+Faster&subtitle=Deploy+with+confidence&layout=modern&theme=dark`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Hero with Icon</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Launching+Soon&subtitle=Something+big+is+coming&layout=hero&icon=🚀&theme=dark`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Feature with Badge</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=New+AI+Features&subtitle=Powered+by+GPT-4&badge=New&layout=featured&theme=midnight`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Gradient Title Text</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Beautiful+Gradients&gradientText=true&theme=dark&fontSize=xl`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Card with Metadata</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Release+Notes&subtitle=Version+2.0&layout=card&author=Team&date=Feb+2026&theme=dark`}
                language="url"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Dynamic Generation (Next.js)</h2>
              <CodeBlock
                code={`// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  const ogUrl = new URL('https://ogpix.vercel.app/api/og');
  ogUrl.searchParams.set('title', post.title);
  ogUrl.searchParams.set('subtitle', post.excerpt);
  ogUrl.searchParams.set('template', 'blog');
  ogUrl.searchParams.set('theme', 'dark');
  ogUrl.searchParams.set('author', post.author);

  return {
    openGraph: {
      images: [ogUrl.toString()],
    },
  };
}`}
                language="typescript"
              />
            </section>

            {/* Mini Footer */}
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
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
