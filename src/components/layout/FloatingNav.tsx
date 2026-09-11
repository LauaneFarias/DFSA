"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRightIcon, CloseIcon, SearchIcon, TwoLinesIcon } from "@/components/ui/icons";
import { getHeroLogoSrc } from "@/hooks/useHeroThemeOption";
import { cn } from "@/lib/cn";
import { NavSearchOverlay } from "./NavSearchOverlay";

/** Visible in the center of the floating bar, always open (not hidden behind the hamburger). */
const NAVBAR_LINKS = ["About", "Legal Framework", "What We Do", "Resources", "News", "More"];

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
  const [isR2, setIsR2] = useState(false);
  useEffect(() => {
    const sync = () => setIsR2(document.documentElement.dataset.feedbackRound === "r2");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-feedback-round"],
    });
    return () => observer.disconnect();
  }, []);
  const navbarLinks = isR2 ? NAVBAR_LINKS.filter((label) => label !== "More") : NAVBAR_LINKS;

  // Option 3 (feedbacks): full-width hover mega-menu, portaled to <body> so it
  // escapes the transformed nav bar and can span the viewport.
  const [navMega, setNavMega] = useState<string | null>(null);
  const megaCloseTimer = useRef<number | null>(null);
  const openMega = (label: string) => {
    if (megaCloseTimer.current) window.clearTimeout(megaCloseTimer.current);
    setNavMega(label);
  };
  const closeMega = () => {
    megaCloseTimer.current = window.setTimeout(() => setNavMega(null), 140);
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
              <div
                key={label}
                className="hero-nav-mega-item"
                onMouseEnter={() => openMega(label)}
                onMouseLeave={closeMega}
              >
                <a href="#" className={cn(navMega === label && "is-open")}>
                  {label}
                </a>
              </div>
            );
          })}
          {MEGA_MENU.map((item) => (
            <a key={item.label} href="#" className="hero-navbar-feedback-link">
              {item.label}
            </a>
          ))}
          <a href="#" className="hero-navbar-feedback-link">
            E-portal
          </a>
        </nav>

        {isR2 &&
          navMega &&
          R2_MEGA[navMega] &&
          createPortal(
            <div
              /* Portaled to <body>, so it can't inherit the header's is-scrolled
                 state via CSS — mirror it here so the mega can match the nav's
                 two looks: glassy/dark over the hero, light frosted when the nav
                 has shrunk to its scrolled pill. */
              className={cn("hero-nav-mega-panel", scrolled && "is-scrolled")}
              role="menu"
              aria-label={navMega}
              onMouseEnter={() => openMega(navMega)}
              onMouseLeave={closeMega}
            >
              {R2_MEGA[navMega].map((col) => (
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
              ))}
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
