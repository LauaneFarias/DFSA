import { Fraunces, DotGothic16 } from "next/font/google";
import localFont from "next/font/local";

/**
 * Type system loaded via next/font (self-hosted automatically, zero
 * layout shift, no external network request at runtime).
 *
 * Niveau Grotesk (HVD Fonts, local) -> primary sitewide sans/display
 *   typeface (--font-niveau), used for both body copy and headings.
 * Fraunces -> kept available (--font-fraunces) but not used by the
 *   current light hero direction; was the editorial serif in the
 *   earlier dark cinematic direction.
 * DotGothic16 -> dot-matrix / LCD-style numerals (--font-dot), used
 *   sparingly and only for stat values in small widget cards — the
 *   "dotted values" detail from the White Beauty Festival reference.
 */
export const niveau = localFont({
  variable: "--font-niveau",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskExtraLight-Italic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskLight-Italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskRegular-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskMedium-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskBold-Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Niveau Grotesk/HVD Fonts - NiveauGroteskBlack-Italic.otf",
      weight: "900",
      style: "italic",
    },
  ],
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dot",
  display: "swap",
});

export const fontVariables = `${niveau.variable} ${fraunces.variable} ${dotGothic.variable}`;
