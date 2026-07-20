import type { Variants } from "framer-motion";
import { DURATION, EASE_SIGNATURE } from "./easings";

/** Generic fade + rise-in, the default entrance for most sections/blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_SIGNATURE },
  },
};

/** Stagger wrapper — apply to a parent, use fadeUp on its children. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
