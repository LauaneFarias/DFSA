"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type FeedId = "publications" | "alerts" | "news";

const TABS: { id: FeedId; label: string }[] = [
  { id: "publications", label: "Latest publications and amendments to legislation" },
  { id: "alerts", label: "Alerts" },
  { id: "news", label: "News" },
];

const FEEDS: Record<FeedId, { text: string; time: string }[]> = {
  publications: [
    { text: "DFSA Business Plan 2026 published", time: "2 hrs ago" },
    { text: "Consultation Paper 165: Crypto Token Regime open for feedback", time: "1 day ago" },
    { text: "Amendments published to the Conduct of Business (COB) Module", time: "3 days ago" },
  ],
  alerts: [
    {
      text: "Investor alert: unauthorised entity impersonating a DFSA-regulated firm",
      time: "45 mins ago",
    },
    { text: "Reminder: Q2 regulatory returns due 31 July", time: "3 hrs ago" },
  ],
  news: [
    { text: "Nasdaq Dubai reopens for trading effective Wednesday", time: "16 mins ago" },
    {
      text: "The DFSA reminds investors to verify firm authorisation before investing",
      time: "1 hr ago",
    },
    { text: "DFSA signs MoU with regional regulator on fintech cooperation", time: "1 day ago" },
  ],
};

/**
 * Compact bottom ticker: a small tab group (Latest Publications /
 * Alerts / News) next to an infinitely-scrolling marquee of the
 * selected feed's items. Deliberately a single slim row so it fits
 * under the stat/card row without breaking the hero's strict
 * single-viewport, no-scroll composition.
 */
export function HeroNewsTicker() {
  const [active, setActive] = useState<FeedId>("publications");
  const [isFeedbackVersion, setIsFeedbackVersion] = useState(false);
  // Option 3 (feedbacks): the client asked for a single moving News feed with no
  // switcher. On that tab we lock the feed to "news" and swap the tab group for a
  // static "News" label; every other tab keeps the full Publications/Alerts/News
  // switcher.
  const [isR2, setIsR2] = useState(false);
  const effectiveActive: FeedId = isR2 ? "news" : active;
  const items = FEEDS[effectiveActive];
  const loopItems = [...items, ...items];

  useEffect(() => {
    const syncVersion = () => {
      const root = document.documentElement;
      setIsFeedbackVersion(root.dataset.fontVersion === "feedback");
      setIsR2(root.dataset.feedbackRound === "r2");
    };
    syncVersion();
    const observer = new MutationObserver(syncVersion);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-font-version", "data-feedback-round"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-news-ticker">
      {isR2 ? (
        <div className="hero-ticker-tabs" role="presentation">
          <span className="hero-ticker-tab is-active">News</span>
        </div>
      ) : (
        <div className="hero-ticker-tabs" role="tablist" aria-label="News feed">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              className={cn("hero-ticker-tab", active === tab.id && "is-active")}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="hero-ticker-viewport">
        <div className="hero-ticker-track" key={effectiveActive}>
          {loopItems.map((item, i) => (
            <span className="hero-ticker-item" key={`${effectiveActive}-${i}`}>
              {isFeedbackVersion ? (
                <a
                  className="hero-ticker-text hero-ticker-link"
                  href="#"
                  aria-hidden={i >= items.length}
                  tabIndex={i >= items.length ? -1 : undefined}
                >
                  {item.text}
                </a>
              ) : (
                <span className="hero-ticker-text">{item.text}</span>
              )}
              <span className="hero-ticker-time">{item.time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
