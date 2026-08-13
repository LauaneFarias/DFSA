"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import {
  AuditIcon,
  CyberRiskIcon,
  InsuranceIcon,
  MarketsSupervisionIcon,
  NextArrowIcon,
  OperationalRiskIcon,
} from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ApproachItem = {
  label: string;
  description: string;
  icon: React.ReactNode;
};

const ITEMS: ApproachItem[] = [
  {
    label: "Audit",
    description: "Overseeing the quality and independence of audit work.",
    icon: <AuditIcon size={28} />,
  },
  {
    label: "Cyber Risk",
    description: "Assessing how firms manage and disclose cyber risk.",
    icon: <CyberRiskIcon size={28} />,
  },
  {
    label: "Insurance",
    description: "Supervising DIFC insurers, reinsurers and intermediaries.",
    icon: <InsuranceIcon size={28} />,
  },
  {
    label: "Operational and Technology Risk",
    description:
      "Reviewing the resilience of firms' systems, controls and technology dependencies.",
    icon: <OperationalRiskIcon size={28} />,
  },
  {
    label: "Markets Supervision",
    description: "Monitoring trading venues and market conduct to protect DIFC market integrity.",
    icon: <MarketsSupervisionIcon size={28} />,
  },
];

/**
 * "Our approach to..." — reinterprets Figma node 620:264802: a heading
 * + supporting copy on the left, with large stacked cards on the right.
 *
 * The left column follows the same heading + intro-copy + CTA pattern
 * as AboutDfsa's header, and the CTA itself reuses the site's standard
 * solid-white-pill recipe (see .about-cta / .news-cta) instead of the
 * bespoke ghost-pill this section used previously — so "Learn more"
 * looks and behaves the same everywhere on the page. The earlier
 * faint logo watermark has been dropped in favor of this copy block.
 */
export function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(".approach-reveal");
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
    <section className="approach-section" ref={sectionRef}>
      <div className="approach-container">
        <div className="approach-panel">
          <div className="approach-grid">
            <div className="approach-left approach-reveal">
              <div className="approach-left-copy">
                <h2 className="approach-heading">Our approach to...</h2>
              </div>
            </div>

            <div className="approach-card-stack">
              {ITEMS.map((item, index) => (
                <div
                  key={item.label}
                  className={`approach-card-slot approach-card--${index + 1} approach-reveal`}
                >
                  <article className="approach-card">
                    <span className="approach-card-domain-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div className="approach-card-copy">
                      <h3>{item.label}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span className="approach-card-arrow" aria-hidden="true">
                      <NextArrowIcon size={18} />
                    </span>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
