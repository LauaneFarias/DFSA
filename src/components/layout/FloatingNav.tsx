"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CloseIcon,
  SearchIcon,
  TwoLinesIcon,
} from "@/components/ui/icons";
import { getHeroLogoSrc } from "@/hooks/useHeroThemeOption";
import { cn } from "@/lib/cn";
import { NavSearchOverlay } from "./NavSearchOverlay";

/** Visible in the center of the floating bar, always open (not hidden behind the hamburger).
 *  Order per client (Sep 2026): About, What We Do, Legal Framework, Public Register,
 *  Resources, News. "Contact" was removed from the bar (moved to the site footer). */
const NAVBAR_LINKS = [
  "About",
  "What We Do",
  "Legal Framework",
  "Public Register",
  "Resources",
  "News",
  "More",
];

/** Right-hand, external-facing group of the bar — rendered after the primary
 *  links (before E-portal). These take the visitor to separate/external pages.
 *  "Enquiries" is new per client; "Contact" was removed. */
const SECONDARY_LINKS = ["Enquiries", "Services"];

const MEGA_MENU = [
  {
    label: "Contact",
    kicker: "Get in touch",
    summary: "Find office details, enquiry routes, media contacts and support channels.",
    links: ["Contact the DFSA", "Our Office", "Media enquiries", "Submit an enquiry"],
  },
  {
    label: "Public Register",
    kicker: "Verify firms",
    summary: "Search regulated firms, authorised individuals and recognised market institutions.",
    links: [
      "Search the Public Register",
      "Authorised Firms",
      "Authorised Individuals",
      "Registered Auditors",
    ],
  },
  {
    label: "Services",
    kicker: "Digital services",
    summary: "Access authorisation services, rulebook tools, notices and regulatory actions.",
    links: ["Authorisation Services", "DFSA Rulebook", "Decision Notices", "Regulatory Actions"],
  },
] as const;

// Option 3 (feedbacks): hover mega-menu content mirroring the live DFSA site
// (dfsa.ae). Each top-nav label maps to a set of columns (heading + links).
// Links are placeholders (href="#") until wired to real destinations.
const R2_MEGA: Record<string, { heading: string; links: string[] }[]> = {
  About: [
    {
      heading: "Who we are",
      links: [
        "The DFSA",
        "Governance",
        "How we regulate",
        "International Assessment",
        "Corporate Social Responsibility",
      ],
    },
    {
      heading: "Our structure",
      links: ["Board of Directors", "Executive Team", "Financial Markets Tribunal", "DFSA Journey"],
    },
  ],
  "Legal Framework": [
    {
      heading: "Legislation & Guidance",
      links: [
        "Legislation",
        "Consultation Papers",
        "Call For Evidence",
        "Policy Statements",
        "Amendments to Legislation",
      ],
    },
    { heading: "Rules & Law", links: ["DFSA Rulebook", "DFSA Administered Law"] },
  ],
  "What We Do": [
    {
      heading: "AML, CTF & Sanctions",
      links: [
        "Summary",
        "Regulatory Framework",
        "Supervisory Methodology",
        "AML/CTF & Sanctions Obligations",
        "Financial Crime Prevention Notices",
      ],
    },
    {
      heading: "Authorisation Services",
      links: [
        "Overview",
        "Getting Help",
        "Expanding Your Business",
        "Collective Investment Funds",
        "DFSA Listing Authority",
        "Checklists",
        "Forms",
        "Approved Documents",
      ],
    },
    {
      heading: "Enforcement",
      links: [
        "About Enforcement",
        "Decision Notices & Regulatory Actions",
        "International Relations",
      ],
    },
    {
      heading: "How We Regulate",
      links: [
        "Markets Supervision",
        "Supervision",
        "Audit Supervision",
        "Cyber Risk Supervision",
        "Insurance Supervision",
        "Sustainable Finance",
        "Client Assets",
      ],
    },
  ],
  Resources: [
    { heading: "Consumer", links: ["Investment Guide", "Complaints"] },
    {
      heading: "Regulatory",
      links: [
        "Consultation Papers",
        "Discussion Papers",
        "Laws and Rules",
        "Guides & Handbooks",
        "Speeches",
        "FAQs",
        "Forms",
        "Fees",
      ],
    },
    {
      heading: "Publications & Reports",
      links: [
        "Annual Report",
        "Business Plan",
        "DFSA in Action",
        "Audit Monitoring Reports",
        "Cyber Reports",
        "Explainers",
        "Thematic Reviews",
      ],
    },
    { heading: "DFSA Alerts", links: ["Alerts", "How to avoid being scammed"] },
  ],
};

// Option 3 (mega menu) — the richer hover-panel layout the client referenced:
// a left intro (label + description), a primary sub-section list, the active
// section's items on the right (+ a "View All" pill), and a supporting image.
// Descriptions are placeholders until real copy is supplied.
const MEGA_INTRO: Record<string, string> = {
  About:
    "Learn who the DFSA is, how we are governed, and how we regulate financial services in the DIFC.",
  "Legal Framework":
    "Explore the laws, rules and regulations that underpin the DIFC's regulatory framework.",
  "What We Do": "Understand our authorisation, supervision and enforcement remit across the DIFC.",
  Resources: "Access publications, guidance, tools and data to support your work with the DFSA.",
};
const MEGA_IMAGE: Record<string, string> = {
  About: "/images/iStock-1163368822.jpg",
  "Legal Framework": "/images/iStock-2270384014.jpg",
  "What We Do": "/images/approach-0408-glass.jpg",
  Resources: "/images/resources-0408-careers.jpg",
};

type Props = {
  /** Which of the two demo landing-page themes is active — see Hero.tsx. */
  themeOption: "1" | "2";
  onThemeOptionChange: (option: "1" | "2") => void;
};

/**
 * Header structure: the logo sits free on the page background (no box
 * behind it), the primary links float as plain text truly centered in
 * the bar (no card/pill behind them), and the right side is reduced to
 * three controls — a standalone Option 1/2 theme picker (image/light
 * bg is now Option 1 and the default, video is Option 2 — see
 * Hero.tsx and HeroBackground.tsx), a merged
 * profile chip (language switch + notification + avatar, in that
 * order), and the hamburger. The EN/AR language switch used to be its
 * own standalone chip next to the theme picker; it now lives inside
 * the profile chip alongside the bell, the same way the bell and
 * avatar are already grouped — narrowing the header's right side
 * overall. The hamburger still opens a full-screen dark menu overlay
 * with the complete link set (see hero.css .hero-menu-overlay).
 */
export function FloatingNav({ themeOption }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [activeMegaLabel, setActiveMegaLabel] = useState<(typeof MEGA_MENU)[number]["label"]>(
    MEGA_MENU[0].label,
  );
  const activeMega = MEGA_MENU.find((item) => item.label === activeMegaLabel) ?? MEGA_MENU[0];

  // Option 3 (feedbacks): the client asked to drop "More" from the top nav.
  // isMega marks the "Option 3 (mega menu)" tab, which uses a richer hover panel.
  const [isR2, setIsR2] = useState(false);
  const [isMega, setIsMega] = useState(false);
  useEffect(() => {
    const sync = () => {
      setIsR2(document.documentElement.dataset.feedbackRound === "r2");
      setIsMega(document.documentElement.dataset.feedbackMega === "white");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-feedback-round", "data-feedback-mega"],
    });
    return () => observer.disconnect();
  }, []);
  // Which primary sub-section (middle column) is active in the mega-menu layout;
  // its items fill the right column. Reset to the first whenever the open nav
  // item changes.
  const [activePrimary, setActivePrimary] = useState(0);
  const navbarLinks = isR2 ? NAVBAR_LINKS.filter((label) => label !== "More") : NAVBAR_LINKS;

  // Option 3 (feedbacks): full-width hover mega-menu, portaled to <body> so it
  // escapes the transformed nav bar and can span the viewport.
  const [navMega, setNavMega] = useState<string | null>(null);
  // While closing, keep the panel mounted briefly so it can fade out instead of
  // snapping shut (see .hero-nav-mega-panel--rich.is-closing).
  const [megaClosing, setMegaClosing] = useState(false);
  const megaCloseTimer = useRef<number | null>(null);
  const openMega = (label: string) => {
    if (megaCloseTimer.current) window.clearTimeout(megaCloseTimer.current);
    setMegaClosing(false);
    if (label !== navMega) setActivePrimary(0);
    setNavMega(label);
  };
  // The mega opens on HOVER. Closing is delayed so the pointer can travel from
  // the nav item down into the panel without the menu flickering shut.
  const closeMega = () => {
    if (megaCloseTimer.current) window.clearTimeout(megaCloseTimer.current);
    setMegaClosing(true);
    megaCloseTimer.current = window.setTimeout(() => {
      setNavMega(null);
      setMegaClosing(false);
    }, 180);
  };

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 72);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setIntroPlayed(true), 5600);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "hero-navbar-outer",
          scrolled && "is-scrolled",
          introPlayed && "has-played-intro",
          navMega && "has-open-mega",
        )}
        // Close only when the pointer leaves the WHOLE header (not each nav item),
        // so moving between items — or down into the panel — never closes the menu
        // mid-move. The panel's own onMouseEnter re-cancels the close as you enter it.
        onMouseLeave={() => {
          if (navMega) closeMega();
        }}
      >
        <div className="hero-navbar-left">
          <Image
            /* Option 1 (dark video bg) keeps the white+gold mark for
               contrast; Option 2 (light bg) switches to the real DFSA
               brand colors — maroon lettering + gold ring — matching
               the official logo reference rather than a
               filtered/monochrome version. */
            src={getHeroLogoSrc(themeOption)}
            alt="DFSA"
            width={58}
            height={38}
            className="hero-logo hero-logo--full"
            priority
            unoptimized
          />
          <Image
            src="/images/logo-mark-white.svg"
            alt="DFSA"
            width={58}
            height={38}
            className="hero-logo hero-logo--mark"
            unoptimized
          />
        </div>

        <nav className="hero-navbar-center" aria-label="Primary">
          {navbarLinks.map((label) => {
            const mega = isR2 ? R2_MEGA[label] : undefined;
            if (!mega) {
              return (
                <a key={label} href="#">
                  {label}
                </a>
              );
            }
            return (
              <div key={label} className="hero-nav-mega-item" onMouseEnter={() => openMega(label)}>
                <a
                  href="#"
                  className={cn(navMega === label && "is-open")}
                  aria-expanded={navMega === label}
                  onClick={(event) => event.preventDefault()}
                >
                  {label}
                </a>
              </div>
            );
          })}
          {/* External-facing group (Enquiries, Services, E-portal) — a small
              outward arrow marks them as leaving for a separate page, per client. */}
          {[...SECONDARY_LINKS, "E-portal"].map((label) => (
            <a key={label} href="#" className="hero-navbar-feedback-link hero-navbar-external-link">
              {label}
              <ArrowUpRightIcon size={12} />
            </a>
          ))}
        </nav>

        {isR2 &&
          navMega &&
          R2_MEGA[navMega] &&
          createPortal(
            <div
              /* Portaled to <body>, so it can't inherit the header's is-scrolled
                 state via CSS — mirror it here so the mega can match the nav's
                 two looks: glassy/dark over the hero, light frosted when the nav
                 has shrunk to its scrolled pill. On the mega-menu tab it uses a
                 richer intro / primary list / items / image layout (--rich). */
              className={cn(
                "hero-nav-mega-panel",
                scrolled && "is-scrolled",
                isMega && "hero-nav-mega-panel--rich",
                megaClosing && "is-closing",
              )}
              role="menu"
              aria-label={navMega}
              onMouseEnter={() => openMega(navMega)}
              onMouseLeave={closeMega}
            >
              {isMega ? (
                <>
                  {/* Left: section label + description. */}
                  <div className="hero-nav-mega-intro">
                    <p className="hero-nav-mega-intro-label">
                      <span className="hero-nav-mega-dot" aria-hidden="true" />
                      {navMega}
                    </p>
                    {MEGA_INTRO[navMega] && (
                      <p className="hero-nav-mega-intro-desc">{MEGA_INTRO[navMega]}</p>
                    )}
                  </div>

                  {/* Middle: primary sub-sections (the R2_MEGA column headings). */}
                  <div className="hero-nav-mega-primary">
                    {R2_MEGA[navMega].map((col, i) => (
                      <button
                        type="button"
                        key={col.heading}
                        className={cn(
                          "hero-nav-mega-primary-item",
                          i === activePrimary && "is-active",
                        )}
                        onMouseEnter={() => setActivePrimary(i)}
                        onFocus={() => setActivePrimary(i)}
                      >
                        {col.heading}
                      </button>
                    ))}
                  </div>

                  {/* Right: the active section's items + a View All action. */}
                  <div className="hero-nav-mega-secondary">
                    <ul>
                      {(R2_MEGA[navMega][activePrimary] ?? R2_MEGA[navMega][0])?.links.map(
                        (link) => (
                          <li key={link}>
                            <a href="#">{link}</a>
                          </li>
                        ),
                      )}
                    </ul>
                    <a href="#" className="hero-nav-mega-viewall">
                      <span>View All</span>
                      <ArrowRightIcon size={18} />
                    </a>
                  </div>

                  {/* Far right: supporting image. */}
                  <div className="hero-nav-mega-media" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={MEGA_IMAGE[navMega] ?? MEGA_IMAGE.About} alt="" />
                  </div>
                </>
              ) : (
                R2_MEGA[navMega].map((col) => (
                  <div key={col.heading} className="hero-nav-mega-col">
                    <div className="hero-nav-mega-heading">{col.heading}</div>
                    <ul>
                      {col.links.map((link) => (
                        <li key={link}>
                          <a href="#">{link}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>,
            document.body,
          )}

        <div className="hero-navbar-right">
          <button
            className="hero-navbar-search-btn"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              if (document.documentElement.dataset.fontVersion !== "feedback") return;
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <SearchIcon size={18} />
          </button>

          <div className="hero-profile-pill">
            <button
              type="button"
              className="hero-profile-lang"
              aria-label={
                locale === "en" ? "Switch language to Arabic" : "Switch language to English"
              }
              onClick={() => setLocale((v) => (v === "en" ? "ar" : "en"))}
            >
              {locale === "en" ? "العربية" : "EN"}
            </button>
            <Image
              src="/profile%20pictures/profile-avatar.png"
              alt="Profile"
              width={32}
              height={32}
              className="hero-avatar"
              unoptimized
            />
          </div>

          <a href="#" className="hero-navbar-sign-in">
            Sign in
          </a>

          <button
            className="hero-navbar-menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <TwoLinesIcon size={18} />
          </button>
        </div>
      </header>

      <NavSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className={cn("hero-menu-overlay", menuOpen && "is-open")}>
        <div className="hero-mega">
          <div className="hero-mega-top">
            <button
              type="button"
              className="hero-mega-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <CloseIcon size={24} />
            </button>
            <label className="hero-mega-search">
              <SearchIcon size={22} />
              <input type="search" placeholder="Search" aria-label="Search" />
            </label>
          </div>

          <div className="hero-mega-body">
            <nav className="hero-mega-links" aria-label="Quick links">
              {MEGA_MENU.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={cn(item.label === activeMega.label && "is-active")}
                  onFocus={() => setActiveMegaLabel(item.label)}
                  onMouseEnter={() => setActiveMegaLabel(item.label)}
                >
                  <span>{item.label}</span>
                  <ArrowRightIcon size={22} />
                </a>
              ))}
            </nav>

            <div className="hero-mega-panel">
              <p className="hero-mega-kicker">{activeMega.kicker}</p>
              <h3>{activeMega.label}</h3>
              <p className="hero-mega-summary">{activeMega.summary}</p>
              <div className="hero-mega-panel-links">
                {activeMega.links.map((link) => (
                  <a href="#" key={link}>
                    <span>{link}</span>
                    <ArrowRightIcon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-mega-footer">
            <a href="#">About</a>
            <a href="#">Legal Framework</a>
            <a href="#">What We Do</a>
            <a href="#">Resources</a>
            <a href="#">News</a>
          </div>
        </div>
      </div>
    </>
  );
}
