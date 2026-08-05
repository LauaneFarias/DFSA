"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import {
  ArrowUpRightIcon,
  CareerIcon,
  EnforcementIcon,
  InnovationIcon,
  IslamicFinanceIcon,
} from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type Resource = {
  index: string;
  title: string;
  icon: React.ReactNode;
  featured?: boolean;
  feedbackTone: "red" | "gray";
  feedbackVideoSrc: string;
};

// Hover-only background clip for the resource cards — muted/looped,
// paused until the card is hovered (see the onMouseEnter/Leave below),
// so four autoplaying videos aren't running at once for no reason.
const CARD_HOVER_VIDEO_SRC = "/videos/hero4.mp4";

/** Renumbered 01–04 in order — the Figma reference had a duplicated
 * "04" label on two cards, evidently a typo in the source file. */
const RESOURCES: Resource[] = [
  {
    index: "01",
    title: "Enforcement and Market Integrity",
    icon: <EnforcementIcon size={26} />,
    feedbackTone: "red",
    feedbackVideoSrc: "/videos/feedback-images-policy.mp4",
  },
  {
    index: "02",
    title: "Islamic Finance",
    icon: <IslamicFinanceIcon size={26} />,
    featured: true,
    feedbackTone: "gray",
    feedbackVideoSrc: "/videos/feedback-images-growth-light.mp4",
  },
  {
    index: "03",
    title: "Innovation at the DFSA",
    icon: <InnovationIcon size={26} />,
    feedbackTone: "red",
    feedbackVideoSrc: "/videos/feedback-images-policy.mp4",
  },
  {
    index: "04",
    title: "Our Career Opportunities",
    icon: <CareerIcon size={26} />,
    feedbackTone: "gray",
    feedbackVideoSrc: "/videos/feedback-images-growth-light.mp4",
  },
];

/**
 * "Additional References" — reinterprets Figma node 620:264488: a
 * simple heading + a row of four resource cards. Mirrors the hero's
 * own service-card language (icon badge + title, one tinted
 * "featured" card) so this closing resources row reads as the same
 * family as the hero's "What We Do" cards, rather than a new pattern.
 */
export function AdditionalResources() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(".resources-reveal");
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

  return (
    <section className="resources-section" ref={sectionRef}>
      <div className="resources-container">
        <div className="resources-header resources-reveal">
          <p className="resources-eyebrow">Additional References</p>
          <h2 className="resources-heading">You may also look into these</h2>
        </div>

        <div className="resources-grid">
          {RESOURCES.map((item) => (
            <a
              href="#"
              key={item.index}
              className={cn(
                "resources-card resources-reveal",
                `resources-card--feedback-${item.feedbackTone}`,
                item.featured && "is-featured",
              )}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                // Default design: the hero4 clip is the hover reveal.
                card
                  .querySelector<HTMLVideoElement>(".resources-card-video--default")
                  ?.play()
                  .catch(() => {
                    /* autoplay-on-hover can be blocked before any user gesture — safe to ignore */
                  });
                // Feedbacks 04/08: reveal the red animated pattern on hover.
                if (document.documentElement.dataset.siteIteration === "feedback-0408") {
                  card
                    .querySelector<HTMLVideoElement>(".resources-card-video--hover-red")
                    ?.play()
                    .catch(() => {});
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.querySelector<HTMLVideoElement>(".resources-card-video--default")?.pause();
                card.querySelector<HTMLVideoElement>(".resources-card-video--hover-red")?.pause();
              }}
            >
              <div className="resources-card-media" aria-hidden="true">
                <video
                  className="resources-card-video resources-card-video--default"
                  src={CARD_HOVER_VIDEO_SRC}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <video
                  className="resources-card-video resources-card-video--feedback"
                  src={item.feedbackVideoSrc}
                  autoPlay={!reduceMotion}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(event) => {
                    event.currentTarget.playbackRate = 0.5;
                  }}
                />
                {/* Feedbacks 04/08 only: the DFSA red animated pattern,
                    revealed on hover for every card (see resources.css).
                    preload="none" + play-on-hover keeps it from loading
                    on the other version tabs. */}
                <video
                  className="resources-card-video resources-card-video--hover-red"
                  src="/videos/feedback-images-policy.mp4"
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  onLoadedMetadata={(event) => {
                    event.currentTarget.playbackRate = 0.5;
                  }}
                />
              </div>
              <div className="resources-card-head">
                <span className="resources-card-index">{item.index}</span>
                <span className="resources-card-arrow" aria-hidden="true">
                  <ArrowUpRightIcon size={14} />
                </span>
              </div>
              <span className="resources-card-icon">{item.icon}</span>
              <h3 className="resources-card-title">{item.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
