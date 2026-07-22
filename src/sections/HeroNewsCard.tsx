"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type NewsSlide = {
  tag: string;
  title: string;
  date: string;
  image: string;
};

/** Three featured stories the card cycles through, each with its own
 * image from public/images/news. */
const NEWS_SLIDES: NewsSlide[] = [
  {
    tag: "News",
    title: "DFSA outlines 2026 regulatory priorities for Dubai's financial centre",
    date: "18 March, 2026",
    image: "/images/news/news3.jpg",
  },
  {
    tag: "News",
    title: "Nasdaq Dubai reopens for trading effective Wednesday, 4 March",
    date: "15 March, 2026",
    image: "/images/news/news6.jpg",
  },
  {
    tag: "Alerts",
    title: "Supervision Annual Outreach Session announced for Q2 2026",
    date: "12 March, 2026",
    image: "/images/news/news1.png",
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

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % NEWS_SLIDES.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
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
      <a href="#news" className="hero-news-card-link">
        <span className="hero-news-card-thumb" key={`thumb-${index}`}>
          <Image
            src={slide.image}
            alt=""
            fill
            sizes="160px"
            className="hero-news-card-img"
            priority
          />
        </span>
        <span className="hero-news-card-body" key={`body-${index}`}>
          <span className="hero-news-card-tag">{slide.tag}</span>
          <span className="hero-news-card-title">{slide.title}</span>
          <span className="hero-news-card-date">{slide.date}</span>
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
