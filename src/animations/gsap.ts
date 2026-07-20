"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP registry. Import `gsap` from this file (not "gsap" directly)
 * anywhere ScrollTrigger-powered animation is needed, so the plugin is
 * guaranteed to be registered exactly once, client-side only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
