"use client";

import { useEffect, useState } from "react";

export type HeroThemeOption = "1" | "2";

/** The exact logo asset FloatingNav renders for a given theme — shared
 * with SplashLoader so its big splash mark always matches what the
 * header is about to show (maroon+gold on the light background for
 * Option 1, white+gold on dark video for Option 2 — swapped from the
 * original 1/2 assignment per feedback, so the light-bg direction is
 * now Option 1 and the default). */
export function getHeroLogoSrc(themeOption: HeroThemeOption) {
  return themeOption === "1" ? "/images/logo-color.svg" : "/images/logo.svg";
}

/** Persists the demo theme pick across refreshes — see the Option 1/2
 * switch in FloatingNav. Shared by Hero (which owns the toggle) and
 * SplashLoader (which reads it read-only to decide whether to run the
 * Option 2 splash-to-hero handoff). */
export const HERO_THEME_STORAGE_KEY = "dfsa-hero-theme-option";

/**
 * SSR-safe read of the persisted theme option. Server render and first
 * client paint both assume Option 1 (the light background — now the
 * default per feedback); if Option 2 (video) was saved, this corrects
 * itself right after mount — a one-frame flash that's an acceptable
 * trade-off for a demo toggle like this (matches the original
 * trade-off documented in Hero.tsx).
 */
export function useHeroThemeOption() {
  const [themeOption, setThemeOptionState] = useState<HeroThemeOption>("1");

  useEffect(() => {
    const stored = window.localStorage.getItem(HERO_THEME_STORAGE_KEY);
    if (stored === "1" || stored === "2") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeOptionState(stored);
    }
  }, []);

  function setThemeOption(option: HeroThemeOption) {
    setThemeOptionState(option);
    window.localStorage.setItem(HERO_THEME_STORAGE_KEY, option);
  }

  return [themeOption, setThemeOption] as const;
}
