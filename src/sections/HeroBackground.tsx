"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const SCENE_IDS = [0, 1, 2, 3, 4];

export type HeroBgMode = "video" | "image" | "decorative";

const VIDEO_SRC = "/videos/hero5.mp4"; // testing hero5 — swap to hero2/hero3/hero4.mp4 any time
const IMAGE_SRC = "/images/hero%20bg%202.png"; // testing — the file on disk is "hero bg 2.png"
// Option 1 (decorative) header footage — replaces the old oversized
// logo watermark, sitting behind a light scrim so the dark-on-light
// hero text stays legible.
const HEADER_VIDEO_SRC = "/videos/iStock-1432335897.mp4";
// Feedbacks 04/08 only: hero2.mp4 frames the Museum of the Future with
// the calm sky in the upper area, so the headline sits over a quiet
// region instead of the busy façade. Rendered as an extra layer and
// shown only in the 04/08 iteration (see hero.css); every other tab
// keeps HEADER_VIDEO_SRC above.
const HEADER_VIDEO_SRC_0408 = "/videos/hero2.mp4";

type Props = {
  activeScene: number;
  /**
   * Which background layer renders — driven by Hero.tsx's Option 1/2
   * toggle (see FloatingNav's theme-option switch). Hero.tsx also
   * reads the same mode to decide whether to flip the page into
   * dark-on-light text via .hero-scope--light-bg in hero.css.
   *
   * - "video": Option 1 — the full-bleed video + dark scrim, white text.
   * - "decorative": Option 2 — the original no-media "premium
   *   enterprise" layers (oversized SVG logo watermark, drifting
   *   gradient blooms tied to the active card, an animated dot
   *   texture). Light background, so the whole hero flips to
   *   dark-on-light text for legibility.
   * - "image": an earlier still-life test (a static PNG, hero bg
   *   2.png) that predated "decorative" being wired up for Option 2 —
   *   no longer used by the toggle, kept only in case a flat image
   *   background is wanted again later.
   */
  bgMode: HeroBgMode;
};

export function HeroBackground({ activeScene, bgMode }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Background-video playback (play the visible layer, pause hidden /
  // off-screen ones so the browser's concurrent-decode cap isn't hit) is
  // handled centrally by <VideoAutoplayManager>. The `autoPlay` attribute
  // on each layer below is what it keys off; nothing to do here.

  // Layer 4 (part 2): tiny mouse-parallax applied directly as a
  // transform on the wrapper holding the watermark + gradient blooms
  // (set imperatively, not via React state, so it never triggers a
  // re-render) — the dot texture layer stays static outside this
  // wrapper. Only relevant to "decorative" mode, and skipped entirely
  // when the user prefers reduced motion.
  useEffect(() => {
    if (reduceMotion || bgMode !== "decorative") return;
    const el = bgRef.current;
    if (!el) return;
    let raf = 0;
    function handleMove(e: MouseEvent) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        el!.style.transform = `translate3d(${(nx * 16).toFixed(1)}px, ${(ny * 16).toFixed(1)}px, 0)`;
      });
    }
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [bgMode, reduceMotion]);

  if (bgMode === "video") {
    return (
      <div className="hero-bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-bg-video"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-bg-video-scrim" />
      </div>
    );
  }

  if (bgMode === "image") {
    return (
      <div className="hero-bg" aria-hidden="true">
        <Image src={IMAGE_SRC} alt="" fill priority unoptimized className="hero-bg-image" />
      </div>
    );
  }

  return (
    <div className="hero-bg" aria-hidden="true">
      {/* Layer 1: full-bleed header footage (replaces the old oversized
          logo watermark) behind a light scrim that keeps the
          dark-on-light hero text legible. */}
      <video
        ref={videoRef}
        className="hero-bg-video hero-bg-video--header"
        src={HEADER_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Feedbacks 04/08 only: shown/hidden via CSS on data-site-iteration
          (the --header layer above is hidden in that iteration). */}
      <video
        className="hero-bg-video hero-bg-video--0408"
        src={HEADER_VIDEO_SRC_0408}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="hero-bg-video-scrim hero-bg-video-scrim--light" />

      <div className="hero-bg-parallax" ref={bgRef}>
        {/* Layer 2 + 4: gradient lighting blooms, drifting + tied to active card */}
        {SCENE_IDS.map((id) => (
          <div
            key={id}
            className={cn("hero-bg-shape", id === activeScene && "is-active")}
            data-scene={id}
          />
        ))}
      </div>

      {/* Layer 3: subtle dot texture, static, sits above everything else in this layer */}
      <div className="hero-dot-texture" />
    </div>
  );
}
