"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { NextArrowIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** The DFSA's four core strategic pillars (Annual Report 2025). */
const PILLARS = [
  "Driving Sustainable, Scalable, and High-Quality Growth",
  "Shaping Policy Through Strategic Collaboration",
  "Innovating Responsibly and Managing Risk",
  "Driving Operational Excellence",
];

const LEAD_1 =
  "The DFSA is the independent banking, financial services, and markets regulator of DIFC, a purpose-built financial free zone in Dubai, UAE.";
const LEAD_2 =
  "Find out more about our purpose, vision, values, and strategic pillars on our Annual Report 2025.";
const STRATEGY_INTRO =
  "The DFSA's strategy is underpinned by four core strategic pillars — responding to a rapidly evolving financial landscape while continuing to support DIFC's growth as a globally competitive and resilient financial centre.";

// TODO: point this at the real DFSA Annual Report 2025 URL once available.
const ANNUAL_REPORT_URL = "#annual-report-2025";

/**
 * "About the DFSA" — heading, mandate copy and a "Learn more" link (to
 * the Annual Report 2025) on the left; a short strategy intro and the
 * four core strategic pillars as compact square cards on the right.
 * Replaces the earlier two oversized panels (one of which was a heavy
 * red accent tile) with four equal, neutral cards for a lighter, more
 * consistent treatment.
 */
export function AboutDfsa() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

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
        <div className="about-layout">
          <div className="about-left about-reveal">
            <h2 className="about-heading">About the DFSA</h2>
            <p className="about-lead">{LEAD_1}</p>
            <p className="about-lead">{LEAD_2}</p>
            <a href={ANNUAL_REPORT_URL} className="about-cta">
              <span>Learn more</span>
              <span className="about-cta-icon">
                <NextArrowIcon size={14} />
              </span>
            </a>
          </div>

          <div className="about-right">
            <p className="about-strategy-intro about-reveal">{STRATEGY_INTRO}</p>
            <div className="about-pillars">
              {PILLARS.map((title) => (
                <article key={title} className="about-pillar-card about-reveal">
                  <h3 className="about-pillar-title">{title}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
