"use client";

import { useState } from "react";
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
  const items = FEEDS[active];
  const loopItems = [...items, ...items];

  return (
    <div className="hero-news-ticker">
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

      <div className="hero-ticker-viewport">
        <div className="hero-ticker-track" key={active}>
          {loopItems.map((item, i) => (
            <span className="hero-ticker-item" key={`${active}-${i}`}>
              <span className="hero-ticker-text">{item.text}</span>
              <span className="hero-ticker-time">{item.time}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
