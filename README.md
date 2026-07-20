# DFSA — Website Foundation

Production-ready project foundation for an award-level, interactive corporate website. This phase covers architecture and tooling only — no pages or visual design are built yet. See `docs/ARCHITECTURE.md` for the full folder-by-folder and dependency-by-dependency breakdown.

## Stack

| Concern                 | Choice                                                            | Why                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework               | Next.js 16 (App Router, Turbopack)                                | Best-in-class performance defaults (RSC, streaming, image/font optimization), file-based routing, native SEO APIs (metadata, sitemap, robots). |
| Language                | TypeScript (strict)                                               | Type safety at scale; easiest handoff between developers.                                                                                      |
| Styling                 | Tailwind CSS v4 (CSS-first `@theme`)                              | Utility-first velocity with a token-driven design system; no runtime CSS-in-JS cost.                                                           |
| Scroll-driven animation | GSAP + ScrollTrigger + Lenis                                      | The de facto stack behind most Awwwards-tier sites — timeline control, scroll-linked motion, and buttery inertial scrolling.                   |
| Component/UI animation  | Framer Motion                                                     | Declarative enter/exit and gesture animation for React components, layered on top of GSAP for scroll work.                                     |
| Fonts                   | `next/font/google`                                                | Self-hosted at build time — zero layout shift, no third-party request at runtime.                                                              |
| Formatting/Linting      | ESLint 9 (flat config) + Prettier + `prettier-plugin-tailwindcss` | Consistent code and class-order across the whole team.                                                                                         |
| Git hooks               | Husky + lint-staged                                               | Nothing unformatted or lint-failing reaches a commit.                                                                                          |
| Images                  | `sharp`                                                           | Required by Next.js for fast, correct image optimization in production.                                                                        |

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command                                   | Purpose                                     |
| ----------------------------------------- | ------------------------------------------- |
| `npm run dev`                             | Start the local dev server (Turbopack).     |
| `npm run build`                           | Production build.                           |
| `npm run start`                           | Serve the production build locally.         |
| `npm run lint` / `npm run lint:fix`       | Run/fix ESLint.                             |
| `npm run format` / `npm run format:check` | Run/check Prettier.                         |
| `npm run typecheck`                       | Run the TypeScript compiler with no output. |

A pre-commit hook (Husky + lint-staged) automatically lints and formats staged files.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Anything prefixed `NEXT_PUBLIC_` is exposed to the browser — never put secrets there.

## Recommended workflow

1. Branch per feature/page (`feature/hero-section`).
2. Build UI in `src/components/ui` (generic, reusable, no page-specific logic).
3. Compose page-specific blocks in `src/sections`.
4. Assemble sections into routes under `src/app`.
5. Scroll/enter animation: use `src/animations/variants.ts` (Framer Motion) for simple entrance effects, and `src/animations/gsap.ts` + `ScrollTrigger` for pinned/scrubbed scroll sequences.
6. Run `npm run lint && npm run typecheck && npm run build` before opening a PR.

## Handoff notes

- Brand colors, type, and fonts are placeholders — see the "swap points" called out in `src/styles/tokens.css` and `src/lib/fonts.ts`.
- `src/sections`, `src/layouts`, and `src/components/layout` intentionally contain no design yet (each has a README explaining what belongs there) — this phase was scoped to architecture only.
- Full architecture rationale: `docs/ARCHITECTURE.md`.
