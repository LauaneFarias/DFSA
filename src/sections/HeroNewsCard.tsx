"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type NewsSlide = {
  tag: string;
  title: string;
  proposition: string;
  date: string;
  shortDate: string;
  image: string;
};

/** Three featured stories the card cycles through, each with its own
 * image from public/images/news. */
const NEWS_SLIDES: NewsSlide[] = [
  {
    tag: "News",
    title: "DFSA outlines 2026 regulatory priorities for Dubai's financial centre",
    proposition: "A clear view of the priorities shaping regulation across the DIFC.",
    date: "18 March, 2026",
    shortDate: "18.03.2026",
    image: "/images/news/news3.jpg",
  },
  {
    tag: "News",
    title: "Nasdaq Dubai reopens for trading effective Wednesday, 4 March",
    proposition: "Stay informed on key market developments and operational updates.",
    date: "15 March, 2026",
    shortDate: "15.03.2026",
    image: "/images/news/news6.jpg",
  },
  {
    tag: "Alerts",
    title: "Supervision Annual Outreach Session announced for Q2 2026",
    proposition: "Connect with the DFSA's supervisory priorities for firms and stakeholders.",
    date: "12 March, 2026",
    shortDate: "12.03.2026",
    image: "/images/news/news4.jpg",
  },
];

const ADVANCE_MS = 5000;

/**
 * Featured-news card occupying the hero bottom-row's left column —
 * where the big dot-matrix "25+" stat used to sit. A white card that
 * matches the service cards' height, laid out horizontally: a contained
 * (rounded, not full-bleed) press-photo thumbnail on the left, with a
 * tag, headline and date to its right. It's a slider: three stories
 * auto-advance on a timer, with three dot indicators (bottom-right) that
 * also let you jump directly to a slide. Auto-advance is paused for
 * reduced-motion users, who still get the clickable dots.
 */
export function HeroNewsCard() {
  const [index, setIndex] = useState(0);
  const reduceMotion = usePrefersReducedMotion();
  const feedbackVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % NEWS_SLIDES.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    const video = feedbackVideoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      const isFeedback = document.documentElement.dataset.fontVersion === "feedback";
      if (isFeedback && !reduceMotion) {
        video.play().catch(() => {
          // The animated texture is decorative; the gradient remains
          // complete if autoplay is unavailable.
        });
      } else {
        video.pause();
      }
    };

    syncPlayback();
    const observer = new MutationObserver(syncPlayback);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-font-version"],
    });
    return () => observer.disconnect();
  }, [reduceMotion]);

  const slide = NEWS_SLIDES[index];
  // Pre-existing type-strictness issue, unrelated to this round's
  // changes — noUncheckedIndexedAccess flags array indexing as
  // possibly undefined even though `index` is always kept in range by
  // the modulo above. This guard narrows the type so TS is satisfied;
  // in practice it never actually returns null.
  if (!slide) return null;

  return (
    <div className="hero-news-card">
      <video
        ref={feedbackVideoRef}
        className="hero-news-card-feedback-video"
        src="/videos/hero4.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <a href="#news" className="hero-news-card-link">
        <span className="hero-news-card-thumb" key={`thumb-${index}`}>
          <Image
            src={slide.image}
            alt=""
            fill
            sizes="(max-width: 620px) 40vw, (max-width: 980px) 38vw, 160px"
            className="hero-news-card-img"
            priority
          />
          <span className="hero-news-card-image-meta">
            <span className="hero-news-card-tag hero-news-card-tag--image">{slide.tag}</span>
            <span className="hero-news-card-date-tag">{slide.shortDate}</span>
          </span>
        </span>
        <span className="hero-news-card-body" key={`body-${index}`}>
          <span className="hero-news-card-tag hero-news-card-tag--body">{slide.tag}</span>
          <span className="hero-news-card-title">{slide.title}</span>
          <span className="hero-news-card-proposition">{slide.proposition}</span>
          <span className="hero-news-card-date hero-news-card-date--body">{slide.date}</span>
        </span>
      </a>

      <div className="hero-news-card-dots" role="tablist" aria-label="Featured news">
        {NEWS_SLIDES.map((item, i) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to news ${i + 1}`}
            className={cn("hero-news-card-dot", i === index && "is-active")}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
