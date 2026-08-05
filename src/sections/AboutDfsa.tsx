"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { CollaborationIcon, GrowthIcon, NextArrowIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type PanelCard = {
  key: string;
  variant: "video" | "accent";
  title: string;
  description: string;
  icon: React.ReactNode;
  videoSrc?: string;
  feedbackImagesVideoSrc?: string;
};

const CARDS: PanelCard[] = [
  {
    key: "growth",
    variant: "video",
    title: "Driving sustainable, scalable and high-quality growth",
    description:
      "The DFSA is an integrated principles-based regulator that follows a risk-based approach in the supervision of regulated firms, including Financial Institutions, Registered Auditors, and Credit Rating Agencies.",
    icon: <GrowthIcon size={24} />,
    videoSrc: "/videos/hero4.mp4",
    feedbackImagesVideoSrc: "/videos/feedback-images-growth-light.mp4",
  },
  {
    key: "policy",
    variant: "accent",
    title: "Shaping policy through strategic collaboration",
    description:
      "We work closely with international regulators and industry bodies to keep the DIFC's regulatory framework at the forefront of global standards.",
    icon: <CollaborationIcon size={24} />,
    videoSrc: "/videos/hero4.mp4",
    feedbackImagesVideoSrc: "/videos/feedback-images-policy.mp4",
  },
];

/**
 * "About the DFSA" — rebuilt to match the approved content wireframe
 * exactly (no stat/matrix numbers — those were a design detour from
 * an earlier round and are gone): a header with heading + subheading
 * on one side and the DFSA mandate paragraph + Learn More on the
 * other, then two full-size panels below — one light, one filled —
 * each carrying one of the two existing mission statements.
 *
 * The wireframe only specifies content and rough layout (it's
 * explicitly a wireframe, not a visual design), so the actual look —
 * the maroon/ink/gold gradient on the accent panel, the type scale,
 * the hover lift — is this site's own design language rather than the
 * wireframe's literal flat blue/white fill, matching the brand
 * palette used everywhere else on the page.
 *
 * Interaction, second pass: no more index numbers (01/02) and no more
 * arrow-only hover hint — instead each card carries the same solid
 * white "Learn more" pill used by Latest News (see .news-cta in
 * news.css), kept invisible until the card is hovered/focused, so the
 * whole panel itself is the hover trigger and the CTA is the payoff.
 *
 * Third pass: the first (formerly flat off-white) card now plays
 * hero4.mp4 as a cover-fit background video — no scrim/overlay, the
 * footage itself is bright/near-white, so this card kept its
 * original dark-ink-on-light text treatment (unlike the accent card's
 * white-on-dark) for legibility against the real, unfiltered video.
 */
export function AboutDfsa() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const videos =
      sectionRef.current?.querySelectorAll<HTMLVideoElement>(".about-panel-card-video");
    if (!videos?.length) return;
    if (reduceMotion) {
      videos.forEach((video) => video.pause());
    } else {
      videos.forEach((video) => {
        video.playbackRate = video.classList.contains("about-panel-card-video--feedback-images")
          ? 0.5
          : 1;
        video.play().catch(() => {
          /* autoplay can be blocked before user interaction — safe to ignore */
        });
      });
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(".about-reveal");
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
    <section className="about-section" ref={sectionRef}>
      <div className="about-container">
        <div className="about-header about-reveal">
          <div className="about-header-heading">
            <h2 className="about-heading">About the DFSA</h2>
            <p className="about-subheading">Our purpose, vision and values.</p>
          </div>
          <div className="about-header-intro">
            <p className="about-intro-text">
              The Dubai Financial Services Authority (DFSA) is the independent regulator of banking,
              wealth and asset management, capital markets and insurance in DIFC, a purpose-built
              financial free zone in Dubai, UAE.
            </p>
            <a href="#" className="about-cta">
              <span>Learn more</span>
              <span className="about-cta-icon">
                <NextArrowIcon size={14} />
              </span>
            </a>
          </div>
        </div>

        <div className="about-grid">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className={`about-panel-card about-panel-card--${card.variant} about-reveal`}
            >
              {card.videoSrc ? (
                <video
                  className="about-panel-card-video about-panel-card-video--default"
                  src={card.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />
              ) : null}
              {card.feedbackImagesVideoSrc ? (
                <video
                  className="about-panel-card-video about-panel-card-video--feedback-images"
                  src={card.feedbackImagesVideoSrc}
                  onLoadedMetadata={(event) => {
                    event.currentTarget.playbackRate = 0.5;
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />
              ) : null}
              <span className="about-panel-card-icon">{card.icon}</span>
              <h3 className="about-panel-card-title">{card.title}</h3>
              <p className="about-panel-card-description">{card.description}</p>
              <a href="#" className="about-cta about-panel-card-cta">
                <span>Learn more</span>
                <span className="about-cta-icon">
                  <NextArrowIcon size={14} />
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
