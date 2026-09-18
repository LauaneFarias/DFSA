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
  | "feedback-0408-v3"
  | "feedback-0408-v4"
  | "feedback-0408-v5"
  | "feedback-0408-v6"
  | "feedback-0408-v7"
  | "hero-slider";

const FONT_OPTIONS = [
  { value: "niveau", label: "Niveau" },
  { value: "graphik", label: "Graphik" },
  { value: "adelle", label: "Adelle Sans" },
  { value: "feedback", label: "Feedback" },
  { value: "feedback-images", label: "Feedback + Images" },
  // The old "Option 1" (hero-slider) has been retired — it's hidden below.
  // The three live tabs are renumbered so the bar now reads "Option 1,
  // Option 2, Option 3" over these three builds (labels only — the underlying
  // hooks/values are unchanged):
  //   Option 1 = feedback-0408      (dark-glass hero)
  //   Option 2 = feedback-0408-v3   (lighter frosted-glass hero)
  //   Option 3 = feedback-0408-v4   (COO image-led direction, static image bg)
  //   Option 4 = feedback-0408-v5   (same image-led tiles, hero4.mp4 video bg)
  // The client approved Option 3. Options 1, 2 and 4 (and the older tabs) are now
  // hidden — see HIDDEN_VERSIONS. "Option 3 (feedbacks)" (feedback-0408-v6) is a
  // clone of the approved Option 3: it inherits every v4 style and adds the
  // feedbackRound="r2" marker so the round-2 amendments land only on it, leaving
  // the approved Option 3 frozen for comparison.
  { value: "hero-slider", label: "(retired)" },
  { value: "feedback-0408", label: "Option 1" },
  { value: "feedback-0408-v3", label: "Option 2" },
  { value: "feedback-0408-v4", label: "Option 3" },
  { value: "feedback-0408-v5", label: "Option 4" },
  { value: "feedback-0408-v6", label: "Option 3 (feedbacks)" },
  // "Option 3 (mega menu)" (feedback-0408-v7) is a clone of the feedbacks tab
  // (all round-2 amendments) that additionally carries data-feedback-mega="white"
  // so the hover mega menu renders as a solid WHITE panel with DARK text — the
  // alternative the client asked to see alongside the glassy version.
  { value: "feedback-0408-v7", label: "Option 3 (main)" },
] as const;

// Versions kept fully wired (styles, logic, and localStorage restore all
// intact) but HIDDEN from the visible tab bar per request. Nothing is
// deleted — to bring a tab back, just remove its value from this list.
// hero-slider is the retired old "Option 1".
const HIDDEN_VERSIONS: readonly FontVersion[] = [
  "niveau",
  "graphik",
  "adelle",
  "feedback",
  "feedback-images",
  "hero-slider",
  // Client approved Option 3 — the alternatives are hidden so the bar shows only
  // "Option 3" (approved, frozen) and "Option 3 (feedbacks)" (round-2 WIP).
  "feedback-0408",
  "feedback-0408-v3",
  "feedback-0408-v5",
  // Per client: keep ONLY "Option 3 (main)" (feedback-0408-v7) on the bar; hide
  // the plain "Option 3" (v4) and "Option 3 (feedbacks)" (v6). Both stay wired.
  "feedback-0408-v4",
  "feedback-0408-v6",
];

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
  // Option 3 (feedback-0408-v3) is a pure superset of Option 2: it maps to the
  // exact same siteVersion / siteIteration / siteTab / fontVersion hooks, so it
  // inherits every Option 2 style. Its ONLY distinction is the heroRevision
  // marker below, which the revised above-fold rules key on.
  // Options 3, 4 and 5 are all pure supersets of Option 2: same siteVersion /
  // siteIteration / siteTab / fontVersion hooks (so they inherit every Option 2
  // style), distinguished only by the heroRevision marker their hero rules key
  // on ("v3" = lighter frosted glass; "v4" = the COO image-led direction).
  // The visible "Option 4" (feedback-0408-v5) reuses the v4 image-led tiles
  // (heroRevision "v4") and adds heroBg="video" so its background is the
  // hero4.mp4 clip instead of the static image.
  const isV3 = next === "feedback-0408-v3";
  const isV4 = next === "feedback-0408-v4";
  const isV5 = next === "feedback-0408-v5";
  // Option 3 (feedbacks): an exact clone of the approved Option 3 (v4), plus a
  // feedbackRound marker so the round-2 amendments can target it in isolation
  // (html[data-feedback-round="r2"]) while the approved Option 3 stays frozen.
  const isV6 = next === "feedback-0408-v6";
  // Option 3 (mega menu): same round-2 clone as v6, plus a feedbackMega marker
  // that switches the hover mega menu to a solid white / dark-text treatment.
  const isV7 = next === "feedback-0408-v7";
  const isImageLed = isV3 || isV4 || isV5 || isV6 || isV7;
  const reusesFeedbackImages =
    next === "feedback-images" || next === "feedback-0408" || next === "hero-slider" || isImageLed;
  root.dataset.siteVersion = reusesFeedbackImages ? "feedback-images" : next;
  root.dataset.siteIteration = next === "hero-slider" || isImageLed ? "feedback-0408" : next;
  root.dataset.siteTab = isImageLed ? "feedback-0408" : next;
  root.dataset.fontVersion = reusesFeedbackImages ? "feedback" : next;
  if (isV3) {
    root.dataset.heroRevision = "v3";
  } else if (isV4 || isV5 || isV6 || isV7) {
    // v5 (video bg), v6 (feedbacks clone) and v7 (feedbacks + white mega) all
    // share the v4 image-led treatment.
    root.dataset.heroRevision = "v4";
  } else {
    delete root.dataset.heroRevision;
  }
  if (isV5) {
    root.dataset.heroBg = "video";
  } else {
    delete root.dataset.heroBg;
  }
  if (isV6 || isV7) {
    root.dataset.feedbackRound = "r2";
  } else {
    delete root.dataset.feedbackRound;
  }
  if (isV7) {
    root.dataset.feedbackMega = "white";
  } else {
    delete root.dataset.feedbackMega;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Font switching still works even if browser storage is unavailable.
  }
}

export function FontVersionSwitcher() {
  // Default to "Option 3 (feedbacks)" (feedback-0408-v6) — the round-2 build the
  // client is now reviewing. The approved Option 3 (v4) stays on the bar too.
  const [fontVersion, setFontVersion] = useState<FontVersion>("feedback-0408-v7");

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        // Only restore a saved choice if it's still a VISIBLE option — so a
        // stale value (e.g. an old "Option 2") can't override the Option 3
        // default now that the other tabs are hidden for the share.
        if (isFontVersion(saved) && !HIDDEN_VERSIONS.includes(saved)) setFontVersion(saved);
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
