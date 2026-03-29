# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build for production
npm run generate  # Static site generation
npm run preview   # Preview production build
```

No test runner is configured. ESLint is available via `@nuxt/eslint`.

## Architecture

This is a **Nuxt 4 + Nuxt Content v3** site. Content is authored in Markdown and rendered via a catch-all route.

**Routing:** `app/pages/[...slug].vue` handles all routes. It queries the `content` collection by path and renders it with `<ContentRenderer>`. A 404 is thrown if no matching content exists.

**Content:** Markdown files in `content/` map directly to routes (`content/index.md` → `/`, `content/about.md` → `/about`). All files are in a single collection named `content` (defined in `content.config.ts`).

**Vue components in Markdown:** Components in `app/components/` can be embedded in Markdown using MDC syntax (e.g., `::alert{color="green"}` or `::counter`). Nuxt Content auto-imports them.

**Modules in use:** `@nuxt/content`, `@nuxt/icon`, `@nuxt/image`, `@nuxt/eslint`, `@vueuse/nuxt`.
