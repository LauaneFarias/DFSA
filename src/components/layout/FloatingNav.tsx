"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
          {NAVBAR_LINKS.map((label) => (
            <a key={label} href="#">
              {label}
            </a>
          ))}
          {MEGA_MENU.map((item) => (
            <a key={item.label} href="#" className="hero-navbar-feedback-link">
              {item.label}
            </a>
          ))}
          <a href="#" className="hero-navbar-feedback-link">
            E-portal
          </a>
        </nav>

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
