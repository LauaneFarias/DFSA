# components/layout

Structural chrome shared across (nearly) every page: header/nav,
footer, the smooth-scroll provider, skip links, etc.

Only `SmoothScrollProvider.tsx` exists so far (mounted in the root
layout). Header/Footer/Nav are intentionally not scaffolded — those are
design decisions for the next phase, not architecture.
