# Layouts

Reusable page-level layout templates that wrap groups of routes needing
shared chrome beyond the root layout — e.g. a `MarketingLayout` (nav +
footer) versus a `LegalLayout` (simple prose container for
terms/privacy pages).

The Next.js App Router already gives every route its own `layout.tsx`
via nested folders in `src/app`; put a layout here only when the same
structural shell needs to be reused across multiple, non-nested route
groups. Nothing is scaffolded yet — no pages exist to layout.
