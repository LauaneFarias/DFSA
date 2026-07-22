"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STAT_TARGET = 25;
/** Matches .hero-stat-block's own animation-delay in hero.css — the
 * count starts right as the stat block itself finishes fading/rising
 * in, rather than racing ahead of its own reveal. */
const COUNT_START_DELAY_MS = 5400;
const COUNT_DURATION_MS = 1100;

/**
 * Big dot-matrix stat — the "25+ / Financial Sectors Covered" element
 * from the new reference layout, styled after the chunky pixel-font
 * numerals in the White Beauty Festival references (bike computer's
 * "256", the visual.study dashboard's "17"). Uses the existing
 * DotGothic16 --font-dot token, scaled up much larger than the small
 * stat numbers used elsewhere, so it reads as a genuine hero-level
 * focal point rather than a small widget figure.
 *
 * Counts up from 0 to 25 (eased, not linear) rather than just
 * appearing — since it's driven by a plain mount effect, it re-plays
 * on every page load/refresh, same as the rest of the splash-to-hero
 * reveal.
 */
export function HeroStat() {
  const reduceMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      // Scheduled via rAF (an async callback) rather than called
      // synchronously in the effect body.
      const raf = requestAnimationFrame(() => setValue(STAT_TARGET));
      return () => cancelAnimationFrame(raf);
    }

    let raf = 0;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
        // Ease-out cubic — quick at first, settling gently into the
        // final number rather than ticking evenly the whole way.
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * STAT_TARGET));
        if (progress < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }, COUNT_START_DELAY_MS);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <div className="hero-stat-block">
      <p className="hero-stat-block-number">
        {value}
        <span className="hero-stat-block-plus">+</span>
      </p>
      <p className="hero-stat-block-label">
        Financial Sectors
        <br />
        Covered
      </p>
    </div>
  );
}
