"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const sections = [
  { id: "quickstart", label: "Quick Start" },
  { id: "api-keys", label: "API Keys" },
  { id: "api-reference", label: "API Reference" },
  { id: "themes", label: "Themes" },
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
  { name: "layout", type: "string", required: false, description: "Text alignment: center, left" },
  { name: "tag", type: "string", required: false, description: "Small label above title" },
  { name: "author", type: "string", required: false, description: "Author name at bottom" },
  { name: "logo", type: "url", required: false, description: "URL to logo/icon image" },
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
];

function CodeBlock({ code, language: _language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group max-w-full overflow-hidden">
      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-green-400 whitespace-pre">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function NavLink({ id, label, active }: { id: string; label: string; active: boolean }) {
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
      const scrollPosition = window.scrollY + 150; // Offset for header

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              OGPix
            </Link>
            <span className="text-neutral-500 text-sm hidden sm:inline">Documentation</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
              ← Back to App
            </Link>
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileNavOpen ? (
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
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Sidebar Navigation */}
          <nav
            className={`${
              mobileNavOpen ? "block" : "hidden"
            } lg:block py-6 lg:py-8 lg:sticky lg:top-20 lg:h-fit`}
          >
            <div className="space-y-1">
              {sections.map((section) => (
                <NavLink
                  key={section.id}
                  id={section.id}
                  label={section.label}
                  active={activeSection === section.id}
                />
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="py-6 lg:py-8 space-y-16 min-w-0">
            {/* Quick Start */}
            <section id="quickstart" className="scroll-mt-24">
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
            <section id="api-keys" className="scroll-mt-24">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">API Keys</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                Understanding when and how to use API keys with OGPix.
              </p>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  ✓ Free Tier — Get Started Instantly
                </h3>
                <p className="text-neutral-400">
                  Use without an API key (100 req/hour per IP) or sign up for a free API key (100
                  images/month). Images include a small &quot;ogpix.vercel.app&quot; watermark.
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Free Tier</h2>
              <ul className="list-disc list-inside text-neutral-400 space-y-2 mb-8">
                <li>100 images per month (with API key)</li>
                <li>100 requests per hour without API key (IP-based)</li>
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

              <h2 className="text-xl font-semibold mt-8 mb-4">Using API Keys (Pro)</h2>
              <p className="text-neutral-400 mb-4">
                When Pro launches, you&apos;ll add your API key as a query parameter:
              </p>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Hello&key=YOUR_API_KEY`}
                language="text"
              />
              <p className="text-neutral-400 mt-4 text-sm">Or as an Authorization header:</p>
              <CodeBlock
                code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://ogpix.vercel.app/api/og?title=Hello"`}
                language="bash"
              />
            </section>

            {/* API Reference */}
            <section id="api-reference" className="scroll-mt-24">
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
                          <code className="text-green-400">{param.name}</code>
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
Cache-Control: public, max-age=31536000, immutable`}
                language="text"
              />
            </section>

            {/* Themes */}
            <section id="themes" className="scroll-mt-24">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Themes</h1>
              <p className="text-neutral-400 mb-8 text-lg">
                15 built-in color themes for your images.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.name}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
                  >
                    <code className="text-green-400 font-medium">{theme.name}</code>
                    <p className="text-neutral-500 text-sm mt-1">{theme.description}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Custom Colors</h2>
              <p className="text-neutral-400 mb-4">
                Use the <code className="text-green-400">bg</code> and{" "}
                <code className="text-green-400">text</code> parameters for custom colors:
              </p>
              <CodeBlock code={`/api/og?title=Custom&bg=1a1a2e&text=eaeaea`} language="text" />
            </section>

            {/* Templates */}
            <section id="templates" className="scroll-mt-24">
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
                    <code className="text-green-400 font-medium">{template.name}</code>
                    <p className="text-neutral-500 text-sm mt-1">{template.description}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Example</h2>
              <CodeBlock
                code={`/api/og?title=My+Blog+Post&template=blog&tag=Tutorial&author=John+Doe`}
                language="text"
              />
            </section>

            {/* Examples */}
            <section id="examples" className="scroll-mt-24">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Examples</h1>
              <p className="text-neutral-400 mb-8 text-lg">Common use cases and code snippets.</p>

              <h2 className="text-xl font-semibold mb-4">Blog Post</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=How+to+Build+APIs&subtitle=A+complete+guide+for+beginners&template=blog&theme=dark&tag=Tutorial&author=Jane+Doe`}
                language="text"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">GitHub Project</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=my-awesome-lib&subtitle=Fast+and+lightweight+utility+library&template=github&theme=gradient`}
                language="text"
              />

              <h2 className="text-xl font-semibold mt-8 mb-4">Product Launch</h2>
              <CodeBlock
                code={`https://ogpix.vercel.app/api/og?title=Introducing+ProductX&subtitle=The+future+of+productivity&template=product&theme=sunset&pattern=dots`}
                language="text"
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
                <Link href="/" className="hover:text-white">
                  Back to OGPix
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
          </main>
        </div>
      </div>
    </div>
  );
}
