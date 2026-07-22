"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type FontVersion = "niveau" | "graphik";

const STORAGE_KEY = "dfsa-font-version";

export function FontVersionSwitcher() {
  const [fontVersion, setFontVersion] = useState<FontVersion>(() => {
    if (typeof window === "undefined") return "niveau";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "graphik" || saved === "niveau" ? saved : "niveau";
  });

  useEffect(() => {
    document.documentElement.dataset.fontVersion = fontVersion;
    window.localStorage.setItem(STORAGE_KEY, fontVersion);
  }, [fontVersion]);

  function selectFont(next: FontVersion) {
    setFontVersion(next);
  }

  return (
    <div className="font-version-switcher" aria-label="Typeface version">
      {(["niveau", "graphik"] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={cn(fontVersion === option && "is-active")}
          aria-pressed={fontVersion === option}
          onClick={() => selectFont(option)}
        >
          {option === "niveau" ? "Niveau" : "Graphik"}
        </button>
      ))}
    </div>
  );
}
