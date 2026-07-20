import { SITE_CONFIG } from "@/lib/constants";

/**
 * Central content/config data layer. Anything that could plausibly come
 * from a CMS later (nav items, social links, footer copy) should be
 * typed and exported from here rather than hard-coded in components —
 * makes swapping in a real CMS a data-layer change, not a UI rewrite.
 */
export type NavItem = {
  label: string;
  href: string;
};

export const site = {
  ...SITE_CONFIG,
  nav: [] as NavItem[], // populated once IA/navigation is designed
  social: [] as { label: string; href: string }[],
};
