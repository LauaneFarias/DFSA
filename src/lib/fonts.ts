import { Inter, Manrope } from "next/font/google";

/**
 * Placeholder type system loaded via next/font (self-hosted automatically,
 * zero layout shift, no external network request at runtime).
 *
 * Inter -> body copy / UI text (--font-sans)
 * Manrope -> headings / display text (--font-display)
 *
 * Swap these for licensed brand fonts later: either point to local files
 * with next/font/local, or change the Google Font imports here. Every
 * consumer references the CSS variables below, so this is the only file
 * that needs to change.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${manrope.variable}`;
