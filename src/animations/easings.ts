/**
 * Shared easing/duration tokens for GSAP and Framer Motion so both
 * animation systems feel like one language. Mirrors the --ease-signature
 * and --duration-* custom properties in src/styles/tokens.css.
 */
export const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const; // framer-motion cubic-bezier
export const EASE_SIGNATURE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)"; // gsap / css string

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
} as const;
