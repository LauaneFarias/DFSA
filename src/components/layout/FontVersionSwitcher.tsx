"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type FontVersion =
  "niveau" | "graphik" | "adelle" | "feedback" | "feedback-images" | "feedback-0408";

const FONT_OPTIONS = [
  { value: "niveau", label: "Niveau" },
  { value: "graphik", label: "Graphik" },
  { value: "adelle", label: "Adelle Sans" },
  { value: "feedback", label: "Feedback" },
  { value: "feedback-images", label: "Feedback + Images" },
  { value: "feedback-0408", label: "Feedbacks 04/08" },
] as const;

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
  root.dataset.siteVersion = next === "feedback-0408" ? "feedback-images" : next;
  root.dataset.siteIteration = next;
  root.dataset.fontVersion =
    next === "feedback-images" || next === "feedback-0408" ? "feedback" : next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Font switching still works even if browser storage is unavailable.
  }
}

export function FontVersionSwitcher() {
  const [fontVersion, setFontVersion] = useState<FontVersion>("niveau");

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
      {FONT_OPTIONS.map((option) => (
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
