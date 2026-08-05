"use client";

import { useEffect } from "react";

/**
 * Keeps the number of simultaneously-playing <video> elements small.
 *
 * Browsers cap how many videos can decode at once (Chrome on macOS in
 * particular); once that cap is exceeded the extra videos silently
 * freeze on their first frame with no error. This page carries ~20
 * background-video elements across its sections, and left alone well
 * over a dozen play at once — including layers that are hidden (an
 * opacity-toggled hero layer, display:none version variants) or far
 * off-screen — which pushed the hero itself past the cap.
 *
 * This manager is the single authority for background-video playback:
 * a video plays only when it is (a) scrolled into view AND (b) actually
 * visible AND (c) meant to autoplay (its `autoplay` property is true).
 * Anything hidden or off-screen is paused, freeing decoder slots.
 * Hover-triggered clips (autoplay=false) are never auto-started here —
 * they're only paused when they leave the viewport; their own hover
 * handlers still start them.
 */
export function VideoAutoplayManager() {
  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
    if (videos.length === 0) return;

    // Whether a video should currently be playing — computed fresh from
    // the DOM each time (not cached), so it stays correct even when a
    // layer is un-hidden after mount (e.g. the version switcher revealing
    // the 04/08 hero video, which was display:none when first observed).
    const shouldPlay = (video: HTMLVideoElement) => {
      if (!video.autoplay) return false; // hover-only clips opt out
      const style = getComputedStyle(video);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (parseFloat(style.opacity || "1") < 0.05) return false;
      const rect = video.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      return (
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth
      );
    };

    const apply = (video: HTMLVideoElement) => {
      if (shouldPlay(video)) {
        video.muted = true;
        const played = video.play();
        if (played) played.catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    };

    // (a) viewport — re-evaluate as sections scroll in and out of view.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => apply(entry.target as HTMLVideoElement)),
      { threshold: 0.01 },
    );
    videos.forEach((video) => io.observe(video));

    // (b) visibility — the version switcher flips which layers are shown
    // via CSS (opacity/display) without moving them in the viewport, so
    // re-evaluate every video when those root attributes change.
    const reapplyAll = () => videos.forEach(apply);
    const mo = new MutationObserver(reapplyAll);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-site-iteration", "data-site-version", "data-font-version"],
    });

    // (c) some browsers block muted autoplay until the first user gesture;
    // re-apply once on the first interaction, then stop listening.
    const events = ["pointerdown", "touchstart", "keydown", "wheel"] as const;
    const onFirstInteraction = () => {
      reapplyAll();
      events.forEach((event) => window.removeEventListener(event, onFirstInteraction));
    };
    events.forEach((event) =>
      window.addEventListener(event, onFirstInteraction, { passive: true }),
    );

    return () => {
      io.disconnect();
      mo.disconnect();
      events.forEach((event) => window.removeEventListener(event, onFirstInteraction));
    };
  }, []);

  return null;
}
