"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** How long the black 0→100 count runs before the logo starts its
 * move, and how long that move takes — together, ~3.9s ("3 or 4
 * seconds"). Both are mirrored as animation-delays on the header's own
 * entrance (see .hero-navbar-center/.hero-top-block/.hero-bottom-row/
 * .hero-news-ticker in hero.css) — keep them in sync if either
 * changes. */
const LOAD_MS = 3000;
const MORPH_MS = 900;
const REDUCED_LOAD_MS = 150;
const REDUCED_MORPH_MS = 150;

const IDENTITY_TRANSFORM = "translate(0px, 0px) scale(1)";

/**
 * The splash page. Always the real colored brand logo (the same
 * logo-color.svg FloatingNav renders in the header), large and
 * centered on a light surface, with a black 0→100 count next to a
 * black progress bar.
 *
 * Once the count finishes, the logo doesn't just fade out — it
 * measures the real header logo's on-screen position/size (the header
 * is mounted underneath the whole time, just hidden behind this
 * overlay) and animates itself to match exactly, landing pixel-for-
 * pixel on top of it, then the splash is removed. That's the
 * splash → landing page interaction: the logo shrinks and moves up
 * into its header position, rather than two logos crossfading.
 *
 * The rest of the header (nav links, controls), then the search
 * block, then "What We Do" cascade in afterwards — see the entrance
 * rules in hero.css.
 */
export function SplashLoader() {
  const reduceMotion = usePrefersReducedMotion();

  const [percent, setPercent] = useState(0);
  const [morphing, setMorphing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [morphTransform, setMorphTransform] = useState(IDENTITY_TRANSFORM);

  const logoRef = useRef<HTMLImageElement>(null);

  const loadMs = reduceMotion ? REDUCED_LOAD_MS : LOAD_MS;
  const morphMs = reduceMotion ? REDUCED_MORPH_MS : MORPH_MS;

  // 0 -> 100 count, driven by real elapsed time rather than a CSS
  // transition so the numeric readout and the bar never drift apart.
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      setPercent(Math.min(100, Math.round((elapsed / loadMs) * 100)));
      if (elapsed < loadMs) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loadMs]);

  // Once loading completes, measure the real header logo and kick off
  // the morph.
  useEffect(() => {
    const timer = setTimeout(() => {
      const logoEl = logoRef.current;
      const headerLogo = document.querySelector<HTMLElement>(".hero-logo");
      if (logoEl && headerLogo) {
        const from = logoEl.getBoundingClientRect();
        const to = headerLogo.getBoundingClientRect();
        const scale = to.width / from.width;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        setMorphTransform(`translate(${dx}px, ${dy}px) scale(${scale})`);
      }
      setMorphing(true);
    }, loadMs);
    return () => clearTimeout(timer);
  }, [loadMs]);

  // Once the morph itself has had time to finish, remove the splash.
  useEffect(() => {
    if (!morphing) return;
    const timer = setTimeout(() => setHidden(true), morphMs);
    return () => clearTimeout(timer);
  }, [morphing, morphMs]);

  return (
    <div
      className={cn("hero-splash", morphing && "hero-splash--morphing", hidden && "is-hidden")}
      role="status"
      aria-label="Loading DFSA"
      aria-hidden={hidden}
    >
      <Image
        ref={logoRef}
        src="/images/logo-color.svg"
        alt="DFSA"
        width={200}
        height={133}
        className="hero-splash-logo"
        style={{ transform: morphTransform, transitionDuration: `${morphMs}ms` }}
        priority
        unoptimized
      />

      <div className="hero-splash-content">
        <div className="hero-splash-progress-track">
          <div className="hero-splash-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="hero-splash-percent" aria-hidden="true">
          {percent}%
        </span>
        <span className="hero-splash-label">Dubai Financial Services Authority</span>
      </div>
    </div>
  );
}
