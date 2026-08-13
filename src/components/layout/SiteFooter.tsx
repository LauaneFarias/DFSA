"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { InstagramIcon, LinkedInIcon, NextArrowIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FOOTER_LINKS = ["About", "Data Protection", "Legal Disclaimer", "Our Office"];
const LEGAL_LINKS = ["Terms of Use", "Cookie Policy", "Privacy Policy"];
const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];
const FOOTER_VIDEO_SRC = "/videos/footer-1.mp4"; // user-supplied "footer 1.mp4", renamed (no space) for a clean URL

/**
 * Site footer — reinterprets Figma node 620:264520. Dark, matching
 * the hero's own --hero-surface-dark tone so the page bookends on the
 * same near-black rather than introducing a third dark shade. A real
 * (if non-functional — no backend wired up yet, same as the hero's
 * search box) newsletter form rather than a static mock, and the same
 * pill-CTA-with-circle-arrow used across every other section for the
 * Subscribe button.
 *
 * Background is the user-supplied footer-1.mp4 clip, full-bleed and
 * looping (same autoplay/muted/loop/playsInline + reduced-motion pause
 * pattern as HeroBackground.tsx), with a dark scrim so every bit of
 * content — newsletter, big logo mark, nav columns, bottom bar — stays
 * fully legible sitting on top of it, same as the hero's own video mode.
 */
export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const feedbackImagesVideoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const videos = [videoRef.current, feedbackImagesVideoRef.current].filter(
      (video): video is HTMLVideoElement => video !== null,
    );
    if (reduceMotion) {
      videos.forEach((video) => video.pause());
    } else {
      videos.forEach((video) => {
        video.play().catch(() => {
          /* autoplay can be blocked before user interaction — safe to ignore */
        });
      });
    }
  }, [reduceMotion]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <footer className="footer-section" id="site-footer">
      <div className="footer-bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="footer-bg-video footer-bg-video--default"
          src={FOOTER_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <video
          ref={feedbackImagesVideoRef}
          className="footer-bg-video footer-bg-video--feedback-images"
          src="/videos/feedback-images-policy.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = 0.5;
          }}
        />
        <div className="footer-bg-scrim" />
      </div>

      <div className="footer-container">
        <div className="footer-mark footer-mark--feedback" aria-hidden="true">
          <Image
            src="/images/logo-mark-white.svg"
            alt=""
            width={1626}
            height={1035}
            className="footer-mark-logo"
            unoptimized
          />
        </div>

        <div className="footer-newsletter">
          <div className="footer-newsletter-copy">
            <h2 className="footer-newsletter-heading">
              Stay updated with DFSA{" "}
              <span className="footer-newsletter-heading-alerts">news &amp; alert</span>
            </h2>
            <p className="footer-newsletter-sub">
              Sign up to receive the latest news, alerts, updates and publications
            </p>
          </div>
          <form
            className="footer-newsletter-form footer-newsletter-form--default"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              className="footer-newsletter-input"
              placeholder="Enter your email"
              aria-label="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubmitted(false);
              }}
              required
            />
            <button type="submit" className="footer-newsletter-submit">
              <span>{submitted ? "Subscribed" : "Subscribe"}</span>
              <span className="footer-newsletter-submit-icon">
                <NextArrowIcon size={14} />
              </span>
            </button>
          </form>
          <a
            href="https://services.dfsa.ae/make-an-enquiry/manage-subscription/"
            className="footer-newsletter-submit footer-newsletter-submit--feedback"
          >
            <span>Subscribe</span>
            <span className="footer-newsletter-submit-icon">
              <NextArrowIcon size={14} />
            </span>
          </a>
        </div>

        <div className="footer-mark footer-mark--default" aria-hidden="true">
          <Image
            src="/images/logo-mark-white.svg"
            alt=""
            width={1626}
            height={1035}
            className="footer-mark-logo"
            unoptimized
          />
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-main">
          <div className="footer-brand">
            <Image
              src="/images/logo.svg"
              alt=""
              width={64}
              height={43}
              className="footer-logo"
              unoptimized
            />
            <p className="footer-brand-name">
              DFSA
              <span>Dubai Financial Services Authority</span>
            </p>
          </div>

          <div className="footer-nav-groups">
            <nav className="footer-links-group" aria-label="Footer">
              <div className="footer-links-heading">Navigation</div>
              <ul className="footer-links-list">
                {FOOTER_LINKS.map((label) => (
                  <li key={label}>
                    <a href="#">{label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="footer-links-group" aria-label="Legal">
              <div className="footer-links-heading">Legal</div>
              <ul className="footer-links-list">
                {LEGAL_LINKS.map((label) => (
                  <li key={label}>
                    <a href="#">{label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-links-group">
              <div className="footer-links-heading">Social Connect</div>
              <ul className="footer-links-list footer-social-list">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a href={href} aria-label={`DFSA on ${label}`}>
                      <Icon size={15} />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} Dubai Financial Services Authority. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
