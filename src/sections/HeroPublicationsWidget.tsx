"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const LATEST_PUBLICATIONS = [
  { title: "DFSA Business Plan 2026 Published", date: "15 Jul 2026" },
  { title: "Consultation Paper 165 — Crypto Token Regime", date: "10 Jul 2026" },
  { title: "Annual Report 2025 Now Available", date: "30 Jun 2026" },
  { title: "Guidance Note: Sustainable Finance Disclosures", date: "22 Jun 2026" },
];

const ADVANCE_MS = 5000;

/**
 * Compact "one card at a time" publications widget, meant to sit to
 * the right of the hero search bar. Shows a small cover thumbnail next
 * to the title + date, auto-advances on a timer, and pauses on
 * hover/focus so it doesn't fight a user who's actively browsing it.
 * Prev/next arrows and the pill-shaped position indicators both drive
 * the same index state. The thumbnail is a plain branded-gradient
 * placeholder (no per-publication cover art exists yet) — swap
 * .hero-pub-widget-thumb's background for a real <Image> once covers
 * are available.
 */
export function HeroPublicationsWidget() {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function next() {
    setIndex((i) => (i + 1) % LATEST_PUBLICATIONS.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + LATEST_PUBLICATIONS.length) % LATEST_PUBLICATIONS.length);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next();
    }, ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const current = LATEST_PUBLICATIONS[index];

  return (
    <div
      className="hero-pub-widget"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
    >
      <div className="hero-pub-widget-head">
        <span className="hero-pub-widget-eyebrow">Latest Publications</span>
        <div className="hero-pub-widget-arrows">
          <button type="button" aria-label="Previous publication" onClick={prev}>
            <ChevronLeft />
          </button>
          <button type="button" aria-label="Next publication" onClick={next}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="hero-pub-widget-body">
        <span className="hero-pub-widget-thumb" aria-hidden="true" />
        <div className="hero-pub-widget-text">
          <p className="hero-pub-widget-title">{current?.title}</p>
          <p className="hero-pub-widget-date">{current?.date}</p>
        </div>
      </div>

      <div className="hero-pub-widget-dots" role="tablist" aria-label="Publications">
        {LATEST_PUBLICATIONS.map((pub, i) => (
          <button
            key={pub.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show publication ${i + 1}`}
            className={cn("hero-pub-dot", i === index && "is-active")}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
