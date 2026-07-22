# DFSA Website — Hero Section Design Spec

Scope: Hero section only (splash loader through the live information bar). Prototype file: `index.html` in this folder — open it in any browser to see the real interaction and motion (this spec documents what's already built, it isn't a separate proposal).

## Creative direction

Dark, editorial, restrained — the register of Apple, Stripe, Linear, Bloomberg and IBM rather than a fintech startup. Near-black surfaces, a single institutional gold accent used sparingly (seals, active states, key transitions), a cool blue accent for interactive/functional elements (links, focus rings, search states). No saturated gradients, no neon, no playful motion. Every animation reinforces precision and calm authority rather than energy or novelty.

## Design tokens

### Color

| Token                   | Value                    | Usage                                                                     |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `--bg-void`             | `#05060A`                | Page background                                                           |
| `--bg-surface`          | `#0B0D12`                | Icon chips, recessed surfaces                                             |
| `--bg-elevated`         | `rgba(255,255,255,.045)` | Quick-access card fill                                                    |
| `--glass-bg`            | `rgba(9,11,16,.55)`      | Nav (scrolled), search shell, featured card, ticker bar                   |
| `--glass-bg-strong`     | `rgba(9,11,16,.78)`      | Search suggestions panel, solid nav state                                 |
| `--glass-border`        | `rgba(255,255,255,.09)`  | Default hairline on glass surfaces                                        |
| `--glass-border-strong` | `rgba(255,255,255,.18)`  | Hover/active border state                                                 |
| `--text-primary`        | `#F5F6F8`                | Headings, primary UI text                                                 |
| `--text-secondary`      | `rgba(245,246,248,.66)`  | Body copy, nav labels                                                     |
| `--text-tertiary`       | `rgba(245,246,248,.42)`  | Meta, placeholders, timestamps                                            |
| `--accent-blue`         | `#5B8DEF`                | Focus rings, links, functional icons, particle field                      |
| `--accent-gold`         | `#CBA35C`                | Eyebrow labels, active nav underline, primary hover states, progress fill |

Text-on-background rule: `--text-primary` for anything that must read as content; `--text-secondary`/`--text-tertiary` only for supporting/meta text — never pure white, never black.

### Typography

| Role                             | Font                          | Weight                          | Size                                         |
| -------------------------------- | ----------------------------- | ------------------------------- | -------------------------------------------- |
| Eyebrow label                    | Inter                         | 600, uppercase, +0.2em tracking | 12px                                         |
| Headline (H1)                    | Fraunces (optical size 9–144) | 500                             | `clamp(2.5rem, 5vw, 5rem)`, line-height 1.04 |
| Featured card title              | Fraunces                      | 500                             | 1.25rem                                      |
| Body / lede                      | Inter                         | 400                             | 1.0625rem, line-height 1.65                  |
| Nav items                        | Inter                         | 500                             | 14px                                         |
| UI labels (buttons, chips, tags) | Inter                         | 600                             | 11–13px                                      |

Fraunces (a soft, editorial serif with adjustable optical size) is deliberately paired against Inter: it gives the headline the "publication of record" gravitas the brief asks for, while everything functional stays in a clean grotesk so the UI never feels precious.

### Spacing (8pt system)

`--space-1` through `--space-10` = 8 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 120px. Section padding uses `--space-6`–`--space-7`; component-internal padding uses `--space-3`–`--space-4`; micro gaps (icon-to-label) use 8–10px outside the scale, intentionally.

### Radius, elevation, motion

- Radius: `--radius-sm 8px` (chips, icon buttons), `--radius-md 14px` (buttons), `--radius-lg 22px` (search panel, quick-access cards), `--radius-xl 28px` (featured card), `--radius-pill 999px` (search shell, nav CTAs, filter chips).
- Shadow: `--shadow-soft` for resting glass surfaces, `--shadow-elevated` for the featured card and open search panel.
- Motion: `--ease-signature: cubic-bezier(.16,1,.3,1)` (the one easing curve used everywhere — a soft decelerate, no bounce). Durations: fast 200ms (hover/focus), base 450ms (reveals, panel open), slow 900ms (headline mask reveal, card float cycle, splash transition).

## Component specifications

### Splash loader

Full-viewport, `--bg-void`. Center-stacked: a 96px monogram (DFSA initial + circular orbit line, stroke-drawn via `stroke-dashoffset`), two crosshair grid lines fading in behind it (financial-grid motif), a 220px progress track that fills over ~1.6s, and an uppercase label beneath. Total duration ≈1.9s, then the whole overlay cross-fades (opacity + delayed visibility) into the hero — intentional, not padded. Under `prefers-reduced-motion`, duration collapses to ~200ms (still shows, doesn't jar).

### Navigation

Fixed, transparent and un-bordered at the top of page (22px vertical padding). Past 24px of scroll it gains a blurred glass background (`backdrop-filter: blur(20px) saturate(140%)`), a hairline bottom border, and tightens to 14px padding — a deliberate, not abrupt, density change. Primary items get a gold underline that scales in from the left on hover/focus (`transform-origin: left`). Secondary cluster: search icon, EN/AR language toggle, "Public Register" (outline pill), "Sign In" (solid pill, inverts to gold fill on hover). Below 860px width, primary nav and the two text-heavy secondary actions collapse behind a hamburger (see Responsive).

### Hero background

Three-layer stack standing in for the cinematic video: (1) a canvas particle field — 46 soft blue dots drifting upward at 0.05–0.3px/frame, representing "flowing market data"; (2) an inline SVG skyline silhouette (DIFC Gate arch + variable-height towers at 35% stroke opacity) that drifts a few percent left–right on a 60s loop for parallax without any aggressive movement; (3) a scrim — a radial blue glow top-right plus a bottom-weighted dark gradient — so headline and search remain AA-contrast regardless of what sits behind them. **Production swap point:** replace the canvas+SVG pair with the real DIFC/Dubai skyline video; keep the scrim gradient as-is over the video for the same readability guarantee.

### Hero content

Eyebrow ("Dubai Financial Services Authority") in gold, a short rule to its left. Headline splits into two masked lines that rise from below their own overflow-hidden boundary (110% → 0 translateY) staggered 150ms apart — a restrained text-reveal rather than a fade. One-paragraph lede at 46ch max-width so it never runs the full column width.

### Search experience

A pill-shaped shell (category `<select>` · text input · circular submit button) that gains a blue focus ring and border on focus. On focus, a glass suggestions panel drops in (8px rise + 0.98→1 scale + fade, 450ms) directly below, containing: recent searches and trending topics as pill chips (left column), popular regulations and popular publications as a compact result list with a trailing type tag (right column). Escape or an outside click closes it. This is intentionally closer to a command palette than a classic search bar — no page navigation happens until a query is actually submitted.

### Featured publication card

Glass card, top image zone (gradient + diagonal hairline texture standing in for the real cover image) with a floating category tag, then category-free body: date, Fraunces title, one-line summary, and a footer row of prev/next circular controls plus a 3-dot progress indicator (active dot elongates into a pill). The whole card idles on a slow 6s float (±8px), which pauses on hover as the card lifts 6px and its border brightens — motion communicates "alive" without being distracting.

### Quick access cards

Five equal-width cards (Access Rulebook, Authorisation, Public Register, Decision Notices, Careers), each with a circular icon chip, a 14.5px title and a 12.5px sub-label. Resting state is a faint elevated fill; hover brightens the border and reveals a soft blue-to-gold diagonal gradient wash via an absolutely-positioned pseudo-element (`::before` opacity 0→1) rather than swapping the whole background, so the transition stays subtle. Cards enter on scroll via `IntersectionObserver`, staggered 80ms apart, translateY(24px)→0.

### Live information bar

A filter row (All / Publications / Regulatory Updates / Alerts / News — pill toggle, active state inverts to solid) beside a horizontally auto-scrolling ticker. The track is duplicated content animating `translateX(0 → -50%)` over 32s linear, so the loop is seamless; hovering the viewport pauses it (`animation-play-state`). Switching a filter re-renders the track with only matching items, re-doubled for the loop — filter changes are instant, not animated, since the marquee motion itself is the ongoing animation.

## Interaction & motion notes

- One easing curve everywhere (`--ease-signature`) — GSAP/Framer Motion equivalents in production should use the matching cubic-bezier so scroll-driven and component motion read as one system (this mirrors the easing tokens already defined in the main Next.js codebase's `src/animations/easings.ts`).
- Hover feedback is always border/opacity/transform — never a hard color swap — to keep the dark palette feeling controlled.
- Nothing loops indefinitely except the skyline drift and the ticker marquee, and both pause/stop under `prefers-reduced-motion`.
- Splash, headline reveal, and card entrances are all one-shot — they do not replay on scroll-back.

## Accessibility

- Visible focus rings (`:focus-visible`, 2px blue outline) on every interactive element, including nav links, chips, and card controls.
- Skip-to-content link, visually hidden until focused.
- `prefers-reduced-motion` disables the particle field, skyline drift, ticker marquee, and shortens the splash to a near-instant transition.
- Search input uses `role="combobox"` and `aria-expanded`; nav toggle and icon-only buttons carry `aria-label`.
- Color contrast: body/secondary text against `--bg-void` and `--glass-bg` meets WCAG AA at the sizes specified; gold/blue accents are used for emphasis, never as the sole carrier of meaning.
- All interactions (search focus, filter switching, card navigation) are keyboard-reachable — no hover-only functionality.

## Responsive recomposition

This isn't a stack-everything response — each breakpoint re-balances what's primary.

**Desktop (>1180px):** two-column hero (copy+search 58% / featured card 42%), five quick-access cards in a single row, full nav visible.

**Tablet (860–1180px):** hero drops to a single column (search and featured card stack, featured card capped at 460px so it doesn't stretch full-width awkwardly), quick-access moves to a 3-column grid (last two cards wrap to a shorter second row rather than shrinking to fit 5-across), nav unchanged.

**Mobile (≤860px):** primary nav and the two text-only secondary actions (language switch, Public Register) collapse behind a hamburger, headline drops to `clamp(2.25rem, 8vw, 3rem)`, search suggestions panel becomes single-column, quick-access becomes a 2-column grid, and the live bar's filter row drops below the ticker with its own top divider and horizontal scroll (rather than compressing filter labels).

**Small mobile (≤520px):** container padding tightens, featured card controls wrap instead of compressing, quick-access stays 2-column at reduced gap.

## What's out of scope here

Per the brief, only the hero (splash → nav → hero → quick access → live bar) is designed. No section below the hero exists in the prototype or this spec.
