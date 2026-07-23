"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type FontVersion = "niveau" | "graphik" | "adelle";

const FONT_OPTIONS = [
  { value: "niveau", label: "Niveau" },
  { value: "graphik", label: "Graphik" },
  { value: "adelle", label: "Adelle Sans" },
] as const;

const STORAGE_KEY = "dfsa-font-version";

function isFontVersion(value: string | null): value is FontVersion {
  return FONT_OPTIONS.some((option) => option.value === value);
}

function applyFontVersion(next: FontVersion) {
  document.documentElement.dataset.fontVersion = next;
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
