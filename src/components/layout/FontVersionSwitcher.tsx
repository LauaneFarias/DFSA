"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type FontVersion =
  | "niveau"
  | "graphik"
  | "adelle"
  | "feedback"
  | "feedback-images"
  | "feedback-0408"
  | "hero-slider";

const FONT_OPTIONS = [
  { value: "niveau", label: "Niveau" },
  { value: "graphik", label: "Graphik" },
  { value: "adelle", label: "Adelle Sans" },
  { value: "feedback", label: "Feedback" },
  { value: "feedback-images", label: "Feedback + Images" },
  // Option 1 (hero-slider) is listed before Option 2 (feedback-0408) so
  // the visible tab bar reads left-to-right "Option 1, Option 2".
  { value: "hero-slider", label: "Option 1" },
  { value: "feedback-0408", label: "Option 2" },
] as const;

// Versions kept fully wired (styles, logic, and localStorage restore all
// intact) but HIDDEN from the visible tab bar per request. Nothing is
// deleted — to bring a tab back, just remove its value from this list.
const HIDDEN_VERSIONS: readonly FontVersion[] = ["niveau", "graphik", "feedback"];

const VISIBLE_OPTIONS = FONT_OPTIONS.filter((option) => !HIDDEN_VERSIONS.includes(option.value));

const STORAGE_KEY = "dfsa-font-version";

function isFontVersion(value: string | null): value is FontVersion {
  return FONT_OPTIONS.some((option) => option.value === value);
}

function applyFontVersion(next: FontVersion) {
  // Feedback + Images starts as an exact visual/behavioural copy of
  // Feedback. `siteVersion` keeps the tabs independently targetable
  // for future image changes, while `fontVersion` continues to activate
  // every existing Feedback style and interaction without duplicating a
  // large set of selectors.
  //
  // Feedbacks 04/08 in turn starts as an exact copy of Feedback + Images:
  // it reuses the whole `feedback-images` style set via `siteVersion`, but
  // gets its own `siteIteration` hook so future 04/08-specific tweaks can
  // target it in isolation (`html[data-site-iteration="feedback-0408"]`)
  // without duplicating the feedback-images selectors.
  const root = document.documentElement;
  // Hero Slider reuses the whole Feedbacks 04/08 iteration (bento cards,
  // ticker, background scrim, etc.) and differs only in two ways — an
  // image slideshow background instead of the video, and no news card —
  // so it rides the same siteVersion + siteIteration hooks as 04/08 and
  // carries its exact identity on siteTab, which those two slider-only
  // tweaks target in isolation.
  const reusesFeedbackImages =
    next === "feedback-images" || next === "feedback-0408" || next === "hero-slider";
  root.dataset.siteVersion = reusesFeedbackImages ? "feedback-images" : next;
  root.dataset.siteIteration = next === "hero-slider" ? "feedback-0408" : next;
  root.dataset.siteTab = next;
  root.dataset.fontVersion = reusesFeedbackImages ? "feedback" : next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Font switching still works even if browser storage is unavailable.
  }
}

export function FontVersionSwitcher() {
  // Default to Option 1 (the hero-slider tab) for first-time visitors;
  // a saved choice in localStorage still wins on mount.
  const [fontVersion, setFontVersion] = useState<FontVersion>("hero-slider");

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (isFontVersion(saved)) setFontVersion(saved);
      } catch {
        // Keep the server-rendered default if storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    applyFontVersion(fontVersion);
  }, [fontVersion]);

  function selectFont(next: FontVersion) {
    applyFontVersion(next);
    setFontVersion(next);
  }

  return (
    <div className="font-version-switcher" aria-label="Typeface version">
      {VISIBLE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(fontVersion === option.value && "is-active")}
          aria-pressed={fontVersion === option.value}
          onClick={() => selectFont(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
