"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, CloseIcon, HistoryIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const RECENT_SEARCHES = ["Fintech Regulation", "Sustainable Finance", "Crypto Token Regime"];
const PUBLICATIONS = [
  { label: "DFSA Business Plan 2026", tag: "PDF" },
  { label: "Annual Report 2025", tag: "PDF" },
];
const CATEGORIES = ["All", "Rulebook", "Publications", "Public Register", "News"];
const SEARCH_RESULTS = [
  {
    title: "DFSA Business Plan 2026",
    category: "Publications",
    kind: "Publication",
    description: "The DFSA's strategic priorities and planned regulatory activity for 2026.",
  },
  {
    title: "Annual Report 2025",
    category: "Publications",
    kind: "Publication",
    description: "A review of the DFSA's performance, supervision and key outcomes in 2025.",
  },
  {
    title: "Crypto Token Regulatory Framework",
    category: "Rulebook",
    kind: "Rulebook",
    description:
      "Rules and guidance for firms providing financial services involving Crypto Tokens.",
  },
  {
    title: "Sustainable Finance in the DIFC",
    category: "News",
    kind: "News",
    description: "Latest DFSA initiatives supporting sustainable and transition finance.",
  },
  {
    title: "FinTech Regulation and Innovation Testing Licence",
    category: "Rulebook",
    kind: "Rulebook",
    description: "Information for innovative firms testing new financial products and services.",
  },
  {
    title: "Search the Public Register",
    category: "Public Register",
    kind: "Register",
    description: "Find DFSA authorised firms, individuals, auditors and registered entities.",
  },
  {
    title: "Authorisation and Registration",
    category: "Publications",
    kind: "Guide",
    description: "Guidance on applying to conduct financial services in or from the DIFC.",
  },
  {
    title: "Latest DFSA Regulatory News",
    category: "News",
    kind: "News",
    description: "Recent announcements, consultations and regulatory updates from the DFSA.",
  },
] as const;

type NavSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function NavSearchOverlay({ open, onClose }: NavSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] ?? "All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return SEARCH_RESULTS.filter((result) => {
      const matchesCategory = category === "All" || result.category === category;
      const text = `${result.title} ${result.category} ${result.description}`.toLowerCase();
      return matchesCategory && text.includes(normalizedQuery);
    });
  }, [category, normalizedQuery]);

  function chooseSearch(term: string, nextCategory = "All") {
    setCategory(nextCategory);
    setQuery(term);
    inputRef.current?.focus();
  }

  return (
    <div
      className={cn("nav-search-overlay", open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-label="Search the DFSA"
      aria-hidden={!open}
    >
      <div className="nav-search-topbar">
        <Image
          src="/images/logo-color.svg"
          alt="DFSA"
          width={91}
          height={58}
          className="nav-search-logo"
          unoptimized
        />
        <button
          type="button"
          className="nav-search-close"
          aria-label="Close search"
          onClick={onClose}
        >
          <span>Close</span>
          <CloseIcon size={22} />
        </button>
      </div>

      <div className="nav-search-content">
        <p className="nav-search-eyebrow">Find what you need</p>
        <h2>Search the DFSA</h2>

        <label className="nav-search-field">
          <span className="sr-only">Search the DFSA</span>
          <input
            ref={inputRef}
            type="search"
            placeholder="What are you looking for?"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <SearchIcon size={25} />
        </label>

        <div className="nav-search-categories" aria-label="Search categories">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={cn(item === category && "is-active")}
              aria-pressed={item === category}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="nav-search-body" aria-live="polite">
          {normalizedQuery ? (
            <div className="nav-search-results">
              <div className="nav-search-results-heading">
                <h3>Search results</h3>
                <p>
                  {results.length === 0
                    ? `No matches for “${query.trim()}”`
                    : `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”`}
                </p>
              </div>
              <div className="nav-search-results-list">
                {results.map((result) => (
                  <a href="#" key={result.title} onClick={(event) => event.preventDefault()}>
                    <span className="nav-search-result-kind">{result.kind}</span>
                    <span className="nav-search-result-copy">
                      <strong>{result.title}</strong>
                      <span>{result.description}</span>
                    </span>
                    <span className="nav-search-result-arrow" aria-hidden="true">
                      <ArrowRightIcon size={18} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="nav-search-suggestions">
              <section>
                <h3>Recent Searches</h3>
                <div>
                  {RECENT_SEARCHES.map((term) => (
                    <button type="button" key={term} onClick={() => chooseSearch(term)}>
                      <HistoryIcon size={17} />
                      <span>{term}</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3>Popular Publications</h3>
                <div>
                  {PUBLICATIONS.map((publication) => (
                    <button
                      type="button"
                      key={publication.label}
                      onClick={() => chooseSearch(publication.label, "Publications")}
                    >
                      <span>{publication.label}</span>
                      <span className="nav-search-pdf">{publication.tag}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
