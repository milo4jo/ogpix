# AGENTS.md - OGPix Project Guidelines

## 📋 Project Overview

**OGPix** is a SaaS tool for generating Open Graph images via API.

- **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase
- **Auth:** NextAuth.js with GitHub OAuth
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth handlers
│   │   ├── keys/          # API key management
│   │   └── og/            # OG image generation (edge)
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   └── page.tsx           # Landing page
├── lib/                   # Shared utilities
│   └── supabase.ts        # Supabase client
└── components/            # Reusable components (TODO)
```

## ✅ Code Standards

### TypeScript
- **Strict mode** enabled
- Use explicit types for function parameters
- Prefer interfaces over types for objects
- Use `unknown` instead of `any` when possible

### React
- Use functional components only
- Prefer hooks over class components
- Use `"use client"` directive only when needed
- Keep components small and focused

### Styling
- Use Tailwind CSS utilities
- No inline styles
- Dark mode first (bg-black, text-white)

### Naming
- **Files:** kebab-case (`api-keys.ts`)
- **Components:** PascalCase (`DashboardPage.tsx`)
- **Functions:** camelCase (`getApiKeys()`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_API_KEYS`)

## 🚫 What NOT to Do

1. **No `any` types** - Use `unknown` or proper types
2. **No `console.log`** in production code - Use proper logging
3. **No hardcoded secrets** - Use environment variables
4. **No `// @ts-ignore`** - Fix the actual type issue
5. **No large components** - Split into smaller pieces (< 200 lines)
6. **No inline SQL** - Use Supabase client methods
7. **No synchronous file operations** - Always async

## 🔒 Security Rules

1. **API Keys:** Always validate API keys server-side
2. **Auth:** Check session on all protected routes
3. **Input:** Sanitize all user input
4. **Secrets:** Never commit `.env.local`
5. **CORS:** Only allow trusted origins
6. **Rate Limiting:** Implement on all public endpoints

## 📝 Commit Guidelines

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting (no code change)
- `refactor:` Code restructure
- `test:` Adding tests
- `chore:` Maintenance

Example: `feat: add usage tracking to dashboard`

## 🧪 Testing (TODO)

- Unit tests with Vitest
- E2E tests with Playwright
- Test coverage > 70%

## 🚀 Deployment

- Push to `main` → Auto-deploy to Vercel
- Environment variables managed in Vercel Dashboard
- Database migrations run manually via Supabase Dashboard

## 📊 Quality Checks

Before committing:
```bash
npm run check   # TypeScript + ESLint + Prettier
```

## 🤖 For AI Agents

When working on this project:
1. Read this file first
2. Follow the code standards strictly
3. Run `npm run check` before suggesting changes
4. Prefer small, focused PRs
5. Add tests for new features

## 📁 Important Files

- `.env.local` - Local environment (never commit)
- `supabase/schema.sql` - Database schema
- `eslint.config.mjs` - Linting rules
- `.prettierrc` - Formatting rules
