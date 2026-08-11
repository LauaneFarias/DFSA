"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import {
  ArrowUpRightIcon,
  CollaborationIcon,
  GrowthIcon,
  InnovationIcon,
  NextArrowIcon,
  OperationalRiskIcon,
} from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
 * "About the DFSA" renders TWO layouts; about.css decides which is visible,
 * keyed on the per-tab hook data-site-tab (see the "OPTION 2 ONLY" block).
 *
 *   • Default (every tab except Option 2) — the original header + two large
 *     mission-statement panels (one background video, one maroon accent).
 *     Kept exactly as it shipped so Adelle Sans, Feedback + Images and
 *     Option 1 look identical to before the Option-2 redesign.
 *
 *   • Option 2 (data-site-tab="feedback-0408") — the newer "purpose, vision,
 *     values" layout: heading + copy on the left, a 2×2 grid of white pillar
 *     cards on the right.
 *
 * Both markups always render; CSS toggles them. This mirrors how LatestNews
 * renders its standard layout and .news-0408 variant side by side.
 * ==========================================================================*/

/* ---- Default layout data: the two mission-statement panel cards ---------- */
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

/* ---- Option 2 layout data: the four core strategic pillars --------------- */
const PILLARS: { title: string; icon: React.ReactNode }[] = [
  {
    title: "Driving Sustainable, Scalable, and High-Quality Growth",
    icon: <GrowthIcon size={22} />,
  },
  {
    title: "Shaping Policy Through Strategic Collaboration",
    icon: <CollaborationIcon size={22} />,
  },
  {
    title: "Innovating Responsibly and Managing Risk",
    icon: <InnovationIcon size={22} />,
  },
  {
    title: "Driving Operational Excellence",
    icon: <OperationalRiskIcon size={22} />,
  },
];

const LEAD_1 =
  "The DFSA is the independent banking, financial services, and markets regulator of DIFC, a purpose-built financial free zone in Dubai, UAE.";
const LEAD_2 =
  "Find out more about our purpose, vision, values, and strategic pillars on our Annual Report 2025.";

// TODO: point this at the real DFSA Annual Report 2025 URL once available.
const ANNUAL_REPORT_URL = "#annual-report-2025";

export function AboutDfsa() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Play the default layout's background videos (original behaviour). On
  // Option 2 the default layout is display:none, so these are hidden; the
  // global VideoAutoplayManager pauses any that aren't actually on screen.
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

  // Scroll-reveal for whichever layout is visible (both carry .about-reveal).
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
        {/* ─── Default layout (hidden on Option 2 via about.css) ─────────── */}
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

        {/* ─── Option 2 layout (shown only on Option 2 via about.css) ────── */}
        <div className="about-panel">
          <div className="about-layout">
            <div className="about-left about-reveal">
              <h2 className="about-heading">About the DFSA</h2>
              <div className="about-lead-group">
                <p className="about-lead">{LEAD_1}</p>
                <p className="about-lead">{LEAD_2}</p>
                <a href={ANNUAL_REPORT_URL} className="about-cta">
                  <span>Learn more</span>
                  <span className="about-cta-icon">
                    <NextArrowIcon size={14} />
                  </span>
                </a>
              </div>
            </div>

            <div className="about-pillars">
              {PILLARS.map((pillar) => (
                <article key={pillar.title} className="about-pillar-card about-reveal">
                  {/* Gold DFSA pattern, hidden until hover (see about.css). */}
                  <span className="about-pillar-media" aria-hidden="true" />
                  <div className="about-pillar-head">
                    <span className="about-pillar-icon">{pillar.icon}</span>
                    <span className="about-pillar-arrow" aria-hidden="true">
                      <ArrowUpRightIcon size={14} />
                    </span>
                  </div>
                  <h3 className="about-pillar-title">{pillar.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
