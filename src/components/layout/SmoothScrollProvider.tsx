"use client";

import type { ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";

/**
 * Mount once in the root layout. Wires up Lenis + GSAP ScrollTrigger for
 * the whole app; children render untouched (no DOM wrapper injected).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}
