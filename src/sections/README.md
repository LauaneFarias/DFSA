# Sections

Page-specific, composed blocks (Hero, About, Services, ContactCTA, etc.)
live here — one file per section, named after what it renders
(`Hero.tsx`, `LogoMarquee.tsx`).

Nothing is scaffolded yet: this project phase is architecture-only, no
visual design has been approved. Once design direction lands, sections
get built here and assembled into pages inside `src/app`.

Convention: a section owns its own layout/spacing (via `<Section>` /
`<Container>` from `src/components/ui`) and its own scroll-triggered
animation (via `src/animations/gsap.ts` or Framer Motion variants from
`src/animations/variants.ts`). Sections should stay presentational —
push data fetching and business logic to the page or a hook.
