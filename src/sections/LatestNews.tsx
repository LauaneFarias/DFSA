"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE_SIGNATURE_CSS } from "@/animations/easings";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { NextArrowIcon, PrevArrowIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type NewsTag = "News" | "Alerts" | "Events";

type NewsItem = {
  date: string;
  tag: NewsTag;
  title: string;
  feedbackTitleLines?: readonly [string, string];
  feedbackImagesImage?: string;
  /** Every story gets its own photo. Only one real press photo exists
   * in public/images/news right now, so every item below
   * placeholder-reuses it — swap each `image` path once a story has
   * its own asset, no other change needed. */
  image: string;
};

/** The 7 real press photos supplied for this section — cycled across
 * the 10 stories below (shuffled, no two adjacent cards repeat the
 * same shot) instead of one placeholder reused everywhere. Add more
 * files here any time there are new photos to bring in. */
const NEWS_IMAGES = [
  "/images/news/news3.jpg",
  "/images/news/news6.jpg",
  "/images/news/news1.png",
  "/images/news/news5.jpg",
  "/images/news/news2.png",
  "/images/news/news7.jpg",
  "/images/news/news4.jpg",
  "/images/news/news6.jpg",
  "/images/news/news1.png",
  "/images/news/news3.jpg",
] as const satisfies readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

const NEWS_ITEMS: NewsItem[] = [
  {
    date: "18 March, 2026",
    tag: "News",
    title: "DFSA outlines 2026 regulatory priorities for Dubai's financial centre",
    feedbackTitleLines: [
      "DFSA outlines 2026 regulatory priorities",
      "for Dubai's financial centre",
    ],
    image: NEWS_IMAGES[0],
    feedbackImagesImage: "/images/feedback-images-news-1.png",
  },
  {
    date: "15 March, 2026",
    tag: "Alerts",
    title: "Supervision Annual Outreach Session",
    image: NEWS_IMAGES[1],
    feedbackImagesImage: "/images/feedback-images-news-2.png",
  },
  {
    date: "15 March, 2026",
    tag: "News",
    title: "Nasdaq Dubai reopens for trading effective Wednesday, 4 March",
    image: NEWS_IMAGES[2],
    feedbackImagesImage: "/images/feedback-images-news-3.png",
  },
  {
    date: "15 March, 2026",
    tag: "News",
    title: "Notice of Amendments to Legislation March 2026",
    feedbackTitleLines: ["Notice of Amendments to Legislation", "March 2026"],
    image: NEWS_IMAGES[3],
    feedbackImagesImage: "/images/feedback-images-news-4.png",
  },
  {
    date: "15 March, 2026",
    tag: "Events",
    title: "Amana Financial Services (Dubai) Limited impersonated",
    feedbackTitleLines: ["Amana Financial Services (Dubai) Limited", "impersonated"],
    image: NEWS_IMAGES[4],
    feedbackImagesImage: "/images/feedback-images-news-5.png",
  },
  {
    date: "12 March, 2026",
    tag: "News",
    title: "Consultation Paper No. 165 open for public comment",
    image: NEWS_IMAGES[5],
  },
  {
    date: "10 March, 2026",
    tag: "News",
    title: "DFSA renews Memorandum of Understanding with the Central Bank of Egypt",
    image: NEWS_IMAGES[6],
  },
  {
    date: "8 March, 2026",
    tag: "Alerts",
    title: "Unauthorised entity offering investment advice under a fictitious licence",
    image: NEWS_IMAGES[7],
  },
  {
    date: "5 March, 2026",
    tag: "Events",
    title: "DIFC Fintech Week 2026 registration now open",
    image: NEWS_IMAGES[8],
  },
  {
    date: "2 March, 2026",
    tag: "News",
    title: "DFSA publishes 2025 Annual Report on regulatory outcomes",
    image: NEWS_IMAGES[9],
  },
];

function tagClass(tag: NewsTag) {
  return `news-tag news-tag--${tag.toLowerCase()}`;
}

/** Reads the current card width + row gap straight off the DOM, so the
 * scroll-by-one-card amount below always matches whatever the CSS
 * happens to be (clamp()'d card width, responsive gap, etc.) instead
 * of a hardcoded pixel guess going stale. */
function getStepPx(track: HTMLDivElement) {
  const card = track.querySelector<HTMLElement>(".news-carousel-card");
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
  return card.getBoundingClientRect().width + gap;
}

/**
 * "Latest News" — a second, normally-scrolled section sitting directly
 * under the hero (shared across both Option 1/2 hero themes; this
 * section doesn't itself change look with that toggle).
 *
 * Tenth pass — back to a real scrolling carousel (not an `order`-based
 * reshuffle), per feedback that tapping next/prev wasn't producing any
 * visible movement:
 *   - Next scrolls the row forward by one card's width (content slides
 *     left, revealing more from the right); Previous scrolls it back
 *     (content slides right). Both animate via the track's own native
 *     smooth scroll, so it's an actual slide, not an instant reflow.
 *   - The "01 / 10" counter and the prev/next disabled state are both
 *     derived FROM scroll position (nearest card to the current
 *     scrollLeft, and whether that scroll is at either end) rather
 *     than driving it — so dragging the row by hand (see the mouse
 *     drag-to-scroll below) keeps the counter in sync too, and Previous
 *     is only disabled right at the very first card, same for Next at
 *     the very last.
 *   - Cards no longer carry a per-card CSS `order` — they render in
 *     their normal left-to-right story order, full stop.
 *
 * Site-wide smooth scroll (Lenis + GSAP ScrollTrigger) is already wired
 * up once in the root layout — see SmoothScrollProvider/useLenis. This
 * component still adds its own scroll-triggered fade/rise-in reveal
 * for the heading and each card, plus a continuous scroll parallax on
 * the panel itself (both skipped entirely under prefers-reduced-motion).
 */
export function LatestNews() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startScroll: 0, moved: false });
  const reduceMotion = usePrefersReducedMotion();
  const total = NEWS_ITEMS.length;

  // Feedbacks 04/08 two-part layout: the first story becomes the tall
  // left feature, the next four fill the right-hand 2×2 text grid.
  const featureStory = NEWS_ITEMS[0]!;
  const gridStories = NEWS_ITEMS.slice(1, 5);

  // Keeps the "01 / 10" counter and the prev/next disabled state
  // matched to wherever the row actually is — called after every
  // scroll (button-triggered, dragged, or swiped).
  function syncScrollState() {
    const track = trackRef.current;
    if (!track) return;
    const step = getStepPx(track);
    const index = step > 0 ? Math.round(track.scrollLeft / step) : 0;
    setActiveIndex(Math.min(Math.max(index, 0), total - 1));
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }

  useEffect(() => {
    syncScrollState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Next → scroll forward (content moves left). Previous → scroll back
  // (content moves right). Plain scrollBy, so it's the browser's own
  // smooth-scroll animation doing the sliding, not a manual tween.
  function goTo(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const step = getStepPx(track);
    track.scrollBy({ left: direction * step, behavior: reduceMotion ? "instant" : "smooth" });
  }

  // Mouse drag-to-scroll, same pattern as ServiceCardRow's row (touch
  // swipe already works for free via overflow-x:auto — this just adds
  // the equivalent gesture for a mouse). Listens on `document`, not
  // just the track, so a fast drag that leaves the track's bounds
  // mid-gesture doesn't get dropped.
  function onTrackMouseDown(e: React.MouseEvent) {
    if (
      document.documentElement.dataset.fontVersion === "feedback" &&
      window.matchMedia("(min-width: 981px)").matches
    ) {
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { startX: e.pageX, startScroll: track.scrollLeft, moved: false };
    setIsDragging(true);
  }

  useEffect(() => {
    if (!isDragging) return;
    function onMove(e: MouseEvent) {
      const track = trackRef.current;
      if (!track) return;
      const delta = e.pageX - dragRef.current.startX;
      if (Math.abs(delta) > 4) dragRef.current.moved = true;
      track.scrollLeft = dragRef.current.startScroll - delta;
    }
    function onUp() {
      setIsDragging(false);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  // A drag that ended on top of a card shouldn't also follow its link.
  function onCardClick(e: React.MouseEvent) {
    if (dragRef.current.moved) e.preventDefault();
  }

  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(".news-reveal");
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

      // Continuous scroll parallax (separate from the reveal-once
      // animation above, and not skipped once it's played): the whole
      // panel drifts up slightly slower than the page scroll as the
      // section passes through the viewport.
      gsap.fromTo(
        ".news-panel",
        { y: 60 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section className="news-section" ref={sectionRef}>
      <div className="news-container">
        <div className="news-panel">
          <div className="news-panel-header news-reveal">
            <h2 className="news-heading">
              Latest <span className="news-heading-accent">News</span>
            </h2>
            <a href="#" className="news-cta">
              <span>Explore all news</span>
              <span className="news-cta-icon">
                <NextArrowIcon size={14} />
              </span>
            </a>
          </div>

          <div className="news-carousel-head news-reveal">
            <p className="news-carousel-count">
              {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <div className="news-carousel-nav">
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => goTo(-1)}
                disabled={atStart}
              >
                <PrevArrowIcon size={16} />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={() => goTo(1)}
                disabled={atEnd}
              >
                <NextArrowIcon size={16} />
              </button>
            </div>
          </div>

          <div
            className={cn("news-carousel-track", isDragging && "is-dragging")}
            ref={trackRef}
            onMouseDown={onTrackMouseDown}
            onScroll={syncScrollState}
          >
            {NEWS_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <a
                  href="#"
                  key={item.title}
                  className={cn("news-carousel-card news-reveal")}
                  aria-label={item.title}
                  aria-current={isActive}
                  onClick={onCardClick}
                >
                  <div className="news-carousel-card-image">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      unoptimized
                      className="news-carousel-card-media news-carousel-card-media--default"
                    />
                    {item.feedbackImagesImage ? (
                      <Image
                        src={item.feedbackImagesImage}
                        alt=""
                        fill
                        unoptimized
                        className="news-carousel-card-media news-carousel-card-media--feedback-images"
                      />
                    ) : null}
                    <span className={tagClass(item.tag)}>{item.tag}</span>
                  </div>
                  <div className="news-carousel-card-body">
                    <h3 className="news-carousel-card-title">
                      <span className="news-title-default">{item.title}</span>
                      {item.feedbackTitleLines && (
                        <span className="feedback-news-title-lines">
                          <span>{item.feedbackTitleLines[0]}</span>
                          <span>{item.feedbackTitleLines[1]}</span>
                        </span>
                      )}
                    </h3>
                    <span className="news-date">{item.date}</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* ── Feedbacks 04/08 news layout ──────────────────────────
              A two-part composition shown only in the 04/08 iteration
              (CSS-gated on html[data-site-iteration="feedback-0408"],
              which also hides the carousel above). Left: one tall
              feature story with its date/tag/headline set directly on a
              DFSA brand pattern. Right: four text-led stories in a 2×2
              grid on a subtle brand pattern — no photography. The
              entrance animation is pure CSS (see news.css) so it plays
              cleanly each time the tab is activated, rather than relying
              on the JS reveal that only runs once on mount. */}
          <div className="news-0408">
            <a href="#" className="news-0408-feature" aria-label={featureStory.title}>
              <div className="news-0408-feature-text">
                <span className="news-0408-date">{featureStory.date}</span>
                <span className={tagClass(featureStory.tag)}>{featureStory.tag}</span>
                <h3 className="news-0408-feature-title">{featureStory.title}</h3>
              </div>
            </a>
            <div className="news-0408-grid">
              {gridStories.map((item) => (
                <a href="#" key={item.title} className="news-0408-cell" aria-label={item.title}>
                  <span className="news-0408-date">{item.date}</span>
                  <span className={tagClass(item.tag)}>{item.tag}</span>
                  <h3 className="news-0408-cell-title">{item.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
