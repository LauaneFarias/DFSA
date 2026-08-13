"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import {
  ArrowUpRightIcon,
  AuditorIcon,
  DnfbpIcon,
  FirmIcon,
  IndividualIcon,
  InstitutionIcon,
  NextArrowIcon,
} from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const PANEL_VIDEO_SRC = "/videos/hero2.mp4";

type CardVariant = "white" | "feature";

type AuthorisationType = {
  label: string;
  description: string;
  icon: React.ReactNode;
  variant: CardVariant;
};

// One consistent card colour (white) across the grid, per feedback
// against the earlier four-different-colours treatment — the only
// exception is a single gradient "feature" tile (in place of a photo/
// background-image card) that anchors the grid, the same way a
// reference layout mixed one image card in among plain white ones.
const TYPES: AuthorisationType[] = [
  {
    label: "DFSA Authorised Firm",
    description: "Firms conducting financial services in or from the DIFC.",
    icon: <FirmIcon />,
    variant: "feature",
  },
  {
    label: "DFSA Authorised Individual",
    description: "Individuals approved by the DFSA to perform controlled functions.",
    icon: <IndividualIcon />,
    variant: "white",
  },
  {
    label: "Authorised Market Institution",
    description: "Exchanges and clearing houses running DIFC trading and settlement systems.",
    icon: <InstitutionIcon />,
    variant: "white",
  },
  {
    label: "Registered Auditor",
    description: "External auditors registered to audit DFSA-regulated entities.",
    icon: <AuditorIcon />,
    variant: "white",
  },
  {
    label: "Registered DNFBPs",
    description: "Non-financial businesses and professions supervised for anti-money laundering.",
    icon: <DnfbpIcon />,
    variant: "white",
  },
];

/**
 * "Start your DIFC journey" — redesigned per feedback. Previously this
 * mirrored Our Approach almost exactly (left copy + right one-at-a-time
 * accordion list), so the two sections read as duplicates back to back.
 * This version keeps the same maroon/gold backdrop and content, but:
 *
 * - Runs full-bleed and taller (min-height, not just vertical padding),
 *   in line with how Hero/Footer occupy real viewport real estate
 *   instead of a slim content-hugging band.
 * - Replaces the accordion with a static icon + title + description
 *   card grid, so every authorisation type is visible at once instead
 *   of needing a click — a distinct pattern from Our Approach's list.
 */
export function DifcJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(".difc-reveal");
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 28 });
      ScrollTrigger.batch(targets, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: DURATION.slow,
            ease: EASE_SIGNATURE_CSS,
            stagger: 0.08,
            overwrite: true,
          }),
      });
    }, section);

    return () => ctx.revert();
  }, [reduceMotion]);

  // Same autoplay/muted/loop + reduced-motion-pauses pattern as
  // HeroBackground.tsx/SiteFooter.tsx's own video backgrounds.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
    } else {
      video.play().catch(() => {
        /* autoplay can be blocked before user interaction — safe to ignore */
      });
    }
  }, [reduceMotion]);

  return (
    <section className="difc-section" id="difc-journey" ref={sectionRef}>
      {/* Left/right margin + rounded corner per feedback: the outer
          section now uses the same light background as Latest News's
          main container, with the maroon panel inset inside it (like
          .news-panel sits inset inside .news-section) instead of
          running full-bleed edge to edge. */}
      <div className="difc-container">
        <div className="difc-panel">
          {/* Running video in place of the flat maroon gradient, per
              feedback — same full-bleed + dark-scrim treatment as the
              footer's own video background, just clipped to this
              panel's rounded corners instead of running edge to edge. */}
          <div className="difc-panel-bg" aria-hidden="true">
            <video
              ref={videoRef}
              className="difc-panel-video"
              src={PANEL_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="difc-panel-scrim" />
          </div>

          <div className="difc-header difc-reveal">
            <p className="difc-eyebrow">
              Start your <br />
              DIFC journey
            </p>
            <div className="difc-header-action">
              <p className="difc-header-desc">
                Explore the authorisation pathways available in the DIFC and choose{" "}
                <br className="feedback-difc-desc-break" />
                the route that matches your business.
              </p>
              <a href="#" className="difc-cta">
                <span>Learn more</span>
                <span className="difc-cta-icon">
                  <NextArrowIcon size={14} />
                </span>
              </a>
            </div>
          </div>

          <div className="difc-grid difc-reveal">
            {/* Each tile is a real link — no destination page exists yet
                (href="#" as a placeholder), but the hover state below
                (lift + a red arrow fading in) signals that every card
                leads somewhere, same convention as .resources-card. */}
            {TYPES.map((type) => (
              <a
                href="#"
                className={cn("difc-card", `difc-card--${type.variant}`)}
                key={type.label}
                aria-label={type.label}
              >
                <span className="difc-card-icon">{type.icon}</span>
                <h3 className="difc-card-title">{type.label}</h3>
                <p className="difc-card-desc">{type.description}</p>
                <span className="difc-card-arrow" aria-hidden="true">
                  <ArrowUpRightIcon size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
