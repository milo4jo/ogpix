# OGPix Design Language

*The definitive guide to OGPix visual and UX standards.*

---

## Core Philosophy

### Brutal Minimalism
Show only what's necessary. Every element must earn its place.

- **No visual clutter** — remove decorative elements that don't serve function
- **High contrast** — black backgrounds, white text, clear hierarchy
- **Generous whitespace** — let content breathe
- **No gratuitous animations** — motion should be purposeful

### Inspired By, Not Copying
We take inspiration from great design (Vercel, Linear, Stripe) but never use their brand names.

**❌ Don't:**
- Name things "Vercel-style" or "Linear-inspired"
- Copy exact color schemes with attribution
- Use competitor logos or trademarks

**✅ Do:**
- Use generic descriptive names: "Modern", "Minimal", "Enhanced"
- Create our own variation of design patterns
- Acknowledge inspiration in internal docs only

---

## Naming Conventions

### Templates & Features
| ❌ Avoid | ✅ Use Instead |
|----------|----------------|
| Vercel | Modern |
| Linear-style | Streamlined |
| Stripe-like | Professional |
| GitHub theme | Developer / OSS |

### Feature Tiers
We currently have **one tier** (Free with limits). Don't label things as "Premium" or "Pro" unless:
1. There's an actual paid tier
2. The feature is genuinely gated

**❌ Don't:** "Border (Premium)" when anyone can use it  
**✅ Do:** Just "Border" — or remove it until there's real gating

---

## UI Elements

### Buttons
```
Primary:    bg-white text-black hover:bg-neutral-200
Secondary:  bg-neutral-900 text-neutral-400 hover:bg-neutral-800
Selected:   bg-white text-black (same as primary)
Danger:     hover:bg-red-900/50 text-red-400
```

### Icons
**Never use emoji arrows:** `→`, `←`, `↗`, `↘`

**Always use SVG:**
```tsx
// Chevron (internal navigation)
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
</svg>

// External link
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
</svg>
```

### Form Elements
- Dark backgrounds: `bg-neutral-900`
- Subtle borders: `border-neutral-800`
- Focus state: `focus:border-neutral-600`
- No heavy shadows or glows

### Cards & Sections
```
Container:  bg-neutral-900/50 border border-neutral-800/50 rounded-xl
Hover:      hover:border-neutral-700
Dividers:   border-neutral-800/30
```

---

## Colors

### Core Palette
```
Background:     #000000 (black)
Surface:        #171717 (neutral-900)
Border:         #262626 (neutral-800)
Text Primary:   #ffffff (white)
Text Secondary: #a3a3a3 (neutral-400)
Text Muted:     #525252 (neutral-600)
```

### Accent Colors (for themes/features)
```
Blue:     #0070f3
Purple:   #7928ca
Pink:     #ff0080
Green:    #10b981
Orange:   #f97316
```

### Gradients
Used sparingly for emphasis:
```
Primary gradient: linear-gradient(135deg, #0070f3 0%, #7928ca 50%, #ff0080 100%)
```

---

## Typography

### Font Stack
System fonts only — no custom font loading:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Scale
- Hero: `text-4xl` to `text-6xl`, `font-bold`
- Page title: `text-2xl` to `text-3xl`, `font-bold`
- Section heading: `text-lg` to `text-xl`, `font-medium`
- Body: `text-base`
- Small/Label: `text-sm` or `text-xs`
- Code: `font-mono`, slightly smaller

### Hierarchy
1. One clear title per section
2. Supporting text in muted color
3. Actions below content

---

## Patterns

### Loading States
Simple spinner, no skeleton screens for simple loads:
```tsx
<div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
```

### Empty States
Centered, muted text, clear CTA:
```tsx
<div className="p-12 text-center text-neutral-500 text-sm">
  No items yet. Create one to get started.
</div>
```

### Error States
Red-tinted background, dismissible:
```tsx
<div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4">
  <span className="text-red-200 text-sm">{error}</span>
</div>
```

---

## Technical Constraints

### @vercel/og (Satori) Limitations
When building OG images:

**❌ Not Supported:**
- SVG `<defs>`, `<pattern>`, `<use>`
- CSS `inherit` value
- Complex CSS Grid
- Many CSS properties

**✅ Supported:**
- Flexbox (`display: flex`)
- Absolute positioning
- Basic SVG shapes
- Inline styles only

**Patterns workaround:** Use many small positioned elements instead of SVG patterns.

### Debouncing
All text inputs that trigger API calls must be debounced (300-500ms):
```typescript
const debouncedValue = useDebounce(value, 300);
// Use debouncedValue for API calls
```

---

## Component Checklist

Before shipping any UI component, verify:

- [ ] No emoji arrows (use SVG)
- [ ] No competitor brand names
- [ ] No false "Premium"/"Pro" labels
- [ ] Dark theme compliant (black/neutral palette)
- [ ] Mobile responsive
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Keyboard accessible

---

## File Locations

| Purpose | Path |
|---------|------|
| Design tokens | This file (`DESIGN.md`) |
| E2E tests | `/tests/*.spec.ts` |
| Components | `/src/components/` |
| API routes | `/src/app/api/` |
| Hooks | `/src/hooks/` |

---

*Last updated: 2026-02-02*
