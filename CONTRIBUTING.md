# Contributing to OGPix

Thanks for your interest in contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ogpix.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Run checks: `npm run check`
7. Commit with a clear message
8. Push and open a PR

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run format   # Format with Prettier
npm run check    # Run all checks
```

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint for linting
- Meaningful commit messages

## Adding a New Theme

1. Edit `src/app/api/og/route.tsx`
2. Add your theme to the `themes` object
3. Add the theme name to `page.tsx` themes array
4. Test with the live builder
5. Update README if significant

## Questions?

Open an issue or reach out to [@milo4jo](https://github.com/milo4jo).
