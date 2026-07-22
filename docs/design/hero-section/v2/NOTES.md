# Hero v2 — what changed and why

Based on the DFSA homepage wireframe (IA reference only — visual language is the premium dark system from v1, not the wireframe's blue-on-white style). Same design tokens as v1 (`../DESIGN-SPEC.md` still applies for color/type/spacing/motion fundamentals); this file only covers what's new.

## New in v2

**Floating capsule nav.** Replaced the full-width bar with a small pill (logo, search icon, Sign In, hamburger) — closer to Apple/Linear's minimal header pattern. The hamburger opens a full-screen glass menu overlay with all primary links (large Fraunces type, one per row) plus a secondary column (Contact, Public Register, language). Solidifies to a stronger glass fill after 24px of scroll, same as v1's nav.

**Scene-switching background.** The hero background is now driven by the quick-access row. Each of the five service cards owns a "scene" (`data-scene="0"`–`"4"`): a distinct radial color wash cross-fades in over the shared particle field + skyline whenever that card is active. A small "Now showing — [card title]" label top-right confirms which scene is live. This is the placeholder mechanism for the real ask — swapping each `.scene-wash` div for a `<video>` element per category is a drop-in change; the cross-fade and timing logic doesn't need to move.

**Auto-advancing quick access.** One card is active at all times (filled glass state + a 6-second gold progress rail along its bottom edge). When the rail fills, it auto-advances to the next card and its scene; clicking any card jumps straight to it and restarts the timer; hovering the row pauses it. This is the "tap a card, background changes, it also cycles on its own" behavior from the brief.

**Recently viewed row.** New section beneath search: three circular-thumbnail + label items, matching the wireframe's "Insights on recent IPO trends…" pattern, styled consistent with the rest of the dark system.

**Featured publication — editorial redesign.** v1's card was a glass panel with image-above/text-below. v2 overlays the title directly on the image (text-on-image, magazine-style) with a bottom scrim for contrast, and moves the prev/next + progress dots into a plain footer strip below — a deliberately different visual treatment per the brief's "can be a different design trend" note, while keeping the same carousel behavior.

**Info rail — tabbed, not filtered.** v1 used filter chips beside a permanently-visible ticker. v2 mirrors the wireframe more closely: three tabs (Latest Publications & Amendments / Alerts / News) with an underline active state; selecting a tab swaps the ticker content beneath it. Styling is flatter and less glass-heavy than v1's ticker bar, per "different style" for this section.

**Announcement bar.** Added a dismissible pill beneath the nav for the promo strip visible in the wireframe ("Start your DIFC journey…") — out of scope in the original brief but present in the reference screenshot, so included for IA completeness.

## Still true from v1

Splash loader was not touched (not shown in the wireframe reference, and the brief didn't ask to change it) — v2 assumes it still runs first; the loader markup wasn't duplicated into this file to keep the v2 prototype focused on the hero-proper changes. Say the word if you want it merged into one single end-to-end file.
