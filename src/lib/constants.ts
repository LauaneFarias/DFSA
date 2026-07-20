export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "DFSA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dfsa.example",
  description: "Placeholder description — replace once messaging is finalized.",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
