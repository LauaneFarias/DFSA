"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { useHeroThemeOption } from "@/hooks/useHeroThemeOption";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { HeroBackground } from "./HeroBackground";
import { HeroNewsTicker } from "./HeroNewsTicker";
import { HeroNewsCard } from "./HeroNewsCard";
import { HeroSearch } from "./HeroSearch";
import { ServiceCardRow } from "./ServiceCardRow";

/**
 * Composes the "premium enterprise" hero direction (matches the
 * greeting → headline → search → stat/card-row reference layout):
 * the floating pill navbar, a background layer (video, static image,
 * or the earlier no-media decorative layers — see HeroBackground.tsx),
 * a top block with a time-of-day greeting, headline and search, and a
 * bottom row pairing the big dot-matrix "25+" stat with the "What We
 * Do"/"DFSA Resources" tabbed card carousel. The carousel is purely
 * user-driven — no timed auto-advance — the active card only changes
 * when someone actually clicks a card, uses the arrows, or
 * drags/swipes the row.
 *
 * Two full demo themes live side by side behind one Option 1/2 switch
 * in the header (next to the language switch): Option 1 is the header
 * footage/decorative background (the "decorative" bgMode — see
 * HeroBackground.tsx) with the whole page flipped to dark text for
 * legibility (see .hero-scope--light-bg in hero.css) — this is the
 * default; Option 2 keeps its own video background but otherwise
 * reuses Option 1's information/layout (grid proportions, card
 * sizing, the ticker pinned to the hero's true bottom edge, no
 * separate Publications widget, always-2-line headline — see
 * .hero-scope--video-v2 in hero.css). Two deliberate exceptions carry
 * over from the original video theme instead of copying Option 1
 * verbatim: the search bar keeps its existing frosted-glass look, and
 * the "What We Do" cards keep the site's glassmorphism material
 * (translucent blur, not Option 1's opaque white) with white
 * icon/title text — both already proven legible over the video. The
 * pick is saved to localStorage so it survives a refresh — this is a
 * client-only preference, so the very first server-rendered paint
 * always assumes Option 1 and corrects itself right after mount if
 * Option 2 was saved; that one-frame correction is an acceptable
 * trade-off for a demo toggle like this.
 *
 * Still a strict single-viewport (no scroll) composition — see
 * .hero-scope's height:100dvh + overflow:hidden in hero.css.
 */
export function Hero() {
  const [activeScene, setActiveScene] = useState(0);
  const [themeOption, selectThemeOption] = useHeroThemeOption();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const bgMode = themeOption === "1" ? "decorative" : "video";

  // Scroll parallax on the hero's exit: as the page scrolls past the
  // hero and the "Latest News" panel rises up over it, only the
  // background and top block drift. The bottom news/service strip stays
  // fixed in place per feedback.
  // Driven by the site's existing Lenis + GSAP ScrollTrigger stack;
  // skipped for reduced-motion users.
  useEffect(() => {
    if (reduceMotion) return;
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: scope,
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
      } as const;
      gsap.to(".hero-bg", { yPercent: 12, ease: "none", scrollTrigger });
      gsap.to(".hero-top-row", { y: -40, opacity: 0.2, ease: "none", scrollTrigger });
    }, scope);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div
      ref={scopeRef}
      className={cn(
        "hero-scope",
        themeOption === "1" && "hero-scope--light-bg",
        themeOption === "2" && "hero-scope--video-v2",
      )}
      suppressHydrationWarning
    >
      <a href="#hero-main" className="hero-skip-link">
        Skip to main content
      </a>

      <FloatingNav themeOption={themeOption} onThemeOptionChange={selectThemeOption} />

      <main className="hero-main" id="hero-main">
        <HeroBackground activeScene={activeScene} bgMode={bgMode} />

        <div className="hero-content-grid">
          <div className="hero-top-row">
            <div className="hero-top-block">
              <p className="hero-eyebrow-greeting" suppressHydrationWarning>
                Welcome to the Dubai Financial Services Authority
              </p>
              <h1 className="hero-headline">
                {/* Always a deliberate 2-line break now (used to be
                    Option 1 only, with Option 2 rendering the whole
                    thing on one line) — per feedback, both options
                    should read the same way. */}
                We Are Shaping The Financial Markets
                <br />
                Of The Future
              </h1>
              <HeroSearch ref={searchInputRef} />
            </div>

            {/* Both options now drop the separate Publications
                widget — its content already duplicates the ticker's
                own "Latest Publications" tab below, and per feedback
                the bottom info strip (ticker) should be the single
                home for publications/alerts/news rather than having
                two overlapping widgets. Was Option 1-only; Option 2
                now matches. HeroPublicationsWidget.tsx is kept around
                unused in case a widget like this is wanted again. */}
          </div>

          <div className="hero-bottom-row">
            <HeroNewsCard />
            <ServiceCardRow activeScene={activeScene} onSelect={setActiveScene} />
          </div>
        </div>

        {/* A sibling of .hero-content-grid (not nested inside it) —
            for Option 2 this is absolutely positioned against
            .hero-main's own bottom edge (see hero.css), which only
            works because .hero-main, not the content grid, is its
            containing block. Nesting it inside the grid was docking
            it against the grid's own bottom edge instead — the exact
            same place the "What We Do" row already ends — which is
            what was causing the overlap. */}
        <HeroNewsTicker />
      </main>
    </div>
  );
}
