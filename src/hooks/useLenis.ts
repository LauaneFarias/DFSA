"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/animations/gsap";

/**
 * Drives smooth-scroll physics via Lenis and keeps GSAP's ScrollTrigger
 * in sync with it (Lenis owns the scroll, ScrollTrigger just needs to be
 * told to re-measure on Lenis's own "scroll" tick + rAF loop).
 *
 * Mounted once by <SmoothScrollProvider>; consumer components never need
 * to touch this directly.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
}
