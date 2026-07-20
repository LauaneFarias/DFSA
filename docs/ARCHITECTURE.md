# Architecture

This document explains every folder and every dependency in the project, and why each choice was made. Written for a developer or designer picking this up cold.

## Folder-by-folder

```
dfsa-website/
├── public/                 Static assets served as-is from "/"
│   ├── fonts/               Local font files, if/when a licensed brand font replaces next/font/google
│   ├── images/               Raster/vector images not needing Next's <Image> pipeline (e.g. favicons)
│   ├── videos/               Background/hero video files
│   └── icons/                 Standalone SVG icons, favicons, app icons
├── src/
│   ├── app/                 Next.js App Router — one folder per route, file-based
│   │   ├── layout.tsx         Root HTML shell: fonts, global CSS, SmoothScrollProvider, <Metadata>
│   │   ├── page.tsx           Placeholder home route (proves the pipeline works end to end)
│   │   ├── not-found.tsx      404 page
│   │   ├── robots.ts          Generates /robots.txt
│   │   ├── sitemap.ts         Generates /sitemap.xml
│   │   └── globals.css        Imports Tailwind + design tokens; the only global stylesheet
│   ├── components/
│   │   ├── ui/                 Generic, page-agnostic building blocks (Container, Section, buttons,
│   │   │                       inputs). Should have zero business logic and zero brand-specific styling
│   │   │                       hardcoded — always read from design tokens.
│   │   └── layout/              Structural chrome shared across (nearly) every page: header, footer,
│   │                            nav, SmoothScrollProvider. Only SmoothScrollProvider exists so far.
│   ├── sections/               Page-specific composed blocks (Hero, About, Services...). Empty until
│   │                           design direction is approved — see sections/README.md.
│   ├── layouts/                Reusable page-level layout templates for route groups that need shared
│   │                           chrome beyond the root layout (e.g. a marketing shell vs. a legal-pages
│   │                           shell). Empty until pages exist — see layouts/README.md.
│   ├── animations/             The animation foundation:
│   │   ├── gsap.ts               Single place GSAP + ScrollTrigger get imported/registered from
│   │   ├── easings.ts            Shared easing/duration tokens so GSAP and Framer Motion feel identical
│   │   └── variants.ts           Reusable Framer Motion variants (fadeUp, staggerChildren)
│   ├── lib/                    Framework-agnostic utilities
│   │   ├── cn.ts                 clsx + tailwind-merge helper for conditional/conflict-safe class names
│   │   ├── fonts.ts               next/font/google setup (Inter + Manrope placeholders)
│   │   └── constants.ts           Site-wide constants (name, description, breakpoints)
│   ├── data/                   Content/config data layer (nav items, social links) — the layer that
│   │                           would point at a CMS later instead of components hardcoding copy
│   ├── hooks/                  Reusable React hooks: useLenis (smooth scroll), useMediaQuery,
│   │                           useIsomorphicLayoutEffect
│   ├── types/                  Shared/ambient TypeScript declarations
│   └── styles/
│       └── tokens.css            Design tokens as a Tailwind v4 @theme block (colors, type, motion,
│                                 layout) — the single file to edit for a rebrand
├── docs/                    This file
├── eslint.config.mjs        Flat ESLint config (eslint-config-next + Prettier compatibility)
├── next.config.ts           Next.js config (image formats, package import optimization)
├── postcss.config.mjs       Registers the Tailwind v4 PostCSS plugin
├── tsconfig.json            Strict TypeScript config with the `@/*` → `src/*` path alias
├── .editorconfig            Cross-editor whitespace/indent consistency
├── .prettierrc.json         Prettier config (incl. Tailwind class sorting)
├── .lintstagedrc.json       What lint-staged runs on commit
├── .husky/pre-commit         Runs lint-staged before every commit
└── .env.example             Documented environment variable template
```

## Dependency-by-dependency

### Runtime

- **next** — the framework: routing, rendering (SSR/SSG/ISR), image/font optimization, built-in SEO primitives (`generateMetadata`, `sitemap.ts`, `robots.ts`).
- **react / react-dom** — required peer of Next; React 19.
- **gsap** — the animation engine for scroll-driven, timeline-based sequences; the standard choice for high-production interactive sites.
- **lenis** — inertia-based smooth scrolling, kept in sync with GSAP's `ScrollTrigger` in `src/hooks/useLenis.ts`.
- **framer-motion** — declarative React animation (mount/unmount transitions, gestures, layout animation) for component-level motion that doesn't need GSAP's timeline complexity.
- **clsx** — tiny utility for conditionally joining class names.
- **tailwind-merge** — resolves conflicting Tailwind classes when composing components (e.g. a consumer overriding a default `p-4`).

### Development

- **typescript** — pinned to the 5.7 line. (`npm install` may offer a newer major; this project intentionally pins to the version range that `eslint-config-next`'s bundled `typescript-eslint` fully supports today — bump deliberately, not automatically.)
- **@types/node, @types/react, @types/react-dom** — type definitions for Node and React APIs.
- **tailwindcss, @tailwindcss/postcss, postcss, autoprefixer** — Tailwind v4's CSS-first pipeline (theme defined via `@theme` in `src/styles/tokens.css`, no `tailwind.config.js` needed).
- **eslint, eslint-config-next** — Next's official flat-config lint rules (Core Web Vitals + TypeScript + accessibility rules bundled in).
- **eslint-config-prettier** — turns off ESLint rules that would conflict with Prettier's formatting.
- **prettier, prettier-plugin-tailwindcss** — code formatting, with automatic Tailwind class sorting.
- **husky, lint-staged** — pre-commit hook infrastructure so lint/format issues never reach a commit.
- **sharp** — high-performance image processing; Next.js uses it under the hood for the production image optimizer.

## Design tokens & theming

Tailwind v4 reads `@theme` blocks directly from CSS instead of a JS config file. All color, type, motion, and layout primitives live in `src/styles/tokens.css` as CSS custom properties, which Tailwind turns into matching utilities automatically (e.g. `--color-brand` → `bg-brand`/`text-brand`/`border-brand`). Every current value is a placeholder — swapping the brand palette, fonts, or spacing scale is a single-file change, and every component built on top of these tokens updates automatically.

## Animation model

Two systems, one vocabulary:

- **GSAP + ScrollTrigger** (`src/animations/gsap.ts`) for anything driven by scroll position — pinning, scrubbing, parallax, scroll-triggered timelines.
- **Framer Motion** (`src/animations/variants.ts`) for React-native enter/exit and gesture animation on components.
- **Lenis** (`src/hooks/useLenis.ts`, mounted via `SmoothScrollProvider` in the root layout) provides the inertial smooth-scroll feel and keeps `ScrollTrigger` measurements in sync.
- Both systems share the same easing curve and duration scale (`src/animations/easings.ts`, mirrored in the `--ease-signature`/`--duration-*` tokens) so scroll-driven and component-driven motion never feel like two different products.

## SEO & performance defaults already in place

- `generateMetadata`-ready root layout with Open Graph/Twitter defaults.
- `robots.ts` and `sitemap.ts` for crawler directives (extend `sitemap.ts` once real routes exist).
- `next/font/google` self-hosts fonts at build time (no runtime request, no layout shift).
- `next.config.ts` enables AVIF/WebP image formats and scopes `optimizePackageImports` to `gsap`/`framer-motion` to keep bundles lean.
- Strict TypeScript (`noUncheckedIndexedAccess`, `strict: true`) catches whole classes of runtime bugs at compile time.

## What's deliberately not here yet

Per the scope of this phase, no visual design, no header/footer/nav, and no page sections exist. `src/sections`, `src/layouts`, and `src/components/layout` each carry a README explaining exactly what belongs there once design direction is approved.
