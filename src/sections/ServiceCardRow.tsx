"use client";

import { useEffect, useRef, useState } from "react";
import {
  AuthorisationIcon,
  EnforcementIcon,
  InnovationIcon,
  RegisterIcon,
  RulebookIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type ServiceCard = {
  scene: number;
  /** Title with an explicit line break ("\n") marking the deliberate
   * two-line split shown in the design (see splitTitle below). */
  title: string;
  icon: React.ReactNode;
  /** Only the "featured" card gets the persistent tinted treatment. */
  featured?: boolean;
};

const ICON_SIZE = 26;

/** The five quick-action cards. Selecting one still drives the hero
 * background scene tint (scenes 0–4, matching SCENE_IDS in
 * HeroBackground.tsx). Titles carry an explicit "\n" where the design
 * breaks each into two lines. */
const ACTION_CARDS: ServiceCard[] = [
  { scene: 0, title: "Access the DFSA\nRulebook", icon: <RulebookIcon size={ICON_SIZE} /> },
  {
    scene: 1,
    title: "Obtain or Manage your\nAuthorisation / Registration",
    icon: <AuthorisationIcon size={ICON_SIZE} />,
  },
  { scene: 2, title: "Search the\nPublic Register", icon: <RegisterIcon size={ICON_SIZE} /> },
  {
    scene: 3,
    title: "Read Decision Notices\nand Regulatory Actions",
    icon: <EnforcementIcon size={ICON_SIZE} />,
  },
  {
    scene: 4,
    title: "Explore our Career\nOpportunities",
    icon: <InnovationIcon size={ICON_SIZE} />,
  },
];

type Props = {
  activeScene: number;
  onSelect: (scene: number) => void;
};

/** Splits a card title into its two deliberate lines on the explicit
 * "\n" break authored in the card data (see ACTION_CARDS). */
function splitTitle(title: string): [string, string] {
  const [line1, ...rest] = title.split("\n");
  return [line1 ?? title, rest.join(" ")];
}

/**
 * A row of five quick-action cards. Selecting a card shifts the hero
 * background tint via the shared activeScene state. There's no timed
 * auto-advance — the active card only changes on direct user
 * interaction (click, or touch/drag swipe on narrower screens where
 * the five cards don't all fit at once).
 *
 * The row is a native horizontal scroller (touch swipe works for free)
 * plus a custom mouse drag-to-scroll (see the mousedown/mousemove/
 * mouseup wiring below) for desktop. On a wide viewport all five cards
 * fill the row, so there's nothing to scroll — the drag/scroll only
 * matters once the row overflows.
 *
 * The row's left/right edge-fade (see .hero-card-row's mask-image in
 * hero.css) is scroll-position aware via `is-at-start`/`is-at-end`:
 * at rest the row is scrolled all the way to its start, so there's
 * nothing to its left worth fading.
 */
export function ServiceCardRow({ activeScene, onSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  // Whether the row is scrolled all the way to its start/end — drives
  // the edge-fade mask below so it only fades a side that actually has
  // more (cut-off) content that way.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startScroll: 0, moved: false });

  function updateEdgeState() {
    const row = rowRef.current;
    if (!row) return;
    setAtStart(row.scrollLeft <= 1);
    setAtEnd(row.scrollLeft + row.clientWidth >= row.scrollWidth - 1);
  }

  useEffect(() => {
    updateEdgeState();
  }, []);

  // Keep the active card scrolled into view (only has an effect when the
  // row actually overflows on a narrow viewport).
  useEffect(() => {
    const row = rowRef.current;
    const card = row?.children[activeScene] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [activeScene]);

  function onRowMouseDown(e: React.MouseEvent) {
    const row = rowRef.current;
    if (!row) return;
    dragRef.current = { startX: e.pageX, startScroll: row.scrollLeft, moved: false };
    setIsDragging(true);
  }

  // Mouse drag-to-scroll — touch already gets native momentum scrolling
  // from overflow-x:auto, this adds the same gesture for a mouse.
  // Listens on `document` (not just the row) so a fast drag that leaves
  // the row's bounds doesn't get dropped mid-gesture.
  useEffect(() => {
    if (!isDragging) return;
    function onMove(e: MouseEvent) {
      const row = rowRef.current;
      if (!row) return;
      const delta = e.pageX - dragRef.current.startX;
      if (Math.abs(delta) > 4) dragRef.current.moved = true;
      row.scrollLeft = dragRef.current.startScroll - delta;
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

  function onCardClick(e: React.MouseEvent, scene: number) {
    // A drag that ended on top of a card shouldn't also select it.
    if (dragRef.current.moved) {
      e.preventDefault();
      return;
    }
    onSelect(scene);
  }

  return (
    <div className="hero-card-row-wrap">
      <div
        className={cn(
          "hero-card-row",
          isDragging && "is-dragging",
          atStart && "is-at-start",
          atEnd && "is-at-end",
        )}
        ref={rowRef}
        onMouseDown={onRowMouseDown}
        onScroll={updateEdgeState}
      >
        {ACTION_CARDS.map((card, index) => {
          const isActive = card.scene === activeScene;
          const [titleLine1, titleLine2] = splitTitle(card.title);
          return (
            <button
              key={card.title}
              className={cn(
                "hero-service-card",
                card.featured && isActive && "is-featured",
                isActive && "is-active",
              )}
              // Feeds the splash-to-hero reveal's per-card stagger (see
              // .hero-service-card's animation-delay calc() in hero.css)
              // — each card enters a beat after the last.
              style={{ "--card-index": index } as React.CSSProperties}
              onClick={(e) => onCardClick(e, card.scene)}
            >
              <span className="hero-service-card-icon">{card.icon}</span>
              <span className="hero-service-card-title">
                {titleLine1}
                <br />
                {titleLine2}
              </span>
              <span className="hero-service-card-underline" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
