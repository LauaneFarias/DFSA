"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown, HistoryIcon, MicrophoneIcon, SearchIcon } from "@/components/ui/icons";
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

type ActiveSearchResult = {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
};

/**
 * Spotlight-style search: a pill input that reveals a glass suggestions
 * panel on focus (recent searches + popular publications), closes on
 * outside click or Escape. `ref` is exposed so <FloatingNav>'s search
 * icon can imperatively focus this input from elsewhere on the page.
 *
 * The trailing icon starts as a microphone; tapping it once swaps it
 * to a search icon (which focuses the input and can submit) — a mic
 * -> search toggle rather than two separate always-visible buttons.
 *
 * The category picker is a custom button + dropdown panel rather than
 * a native <select> — a native select brings its own browser-drawn
 * popup and focus outline that couldn't be restyled away (the "border"
 * feedback asked to remove), so this is a fully custom listbox with
 * its own open/close state, matching the site's own hover/active
 * styling instead of OS chrome. Its wrapper's width is still set from
 * the selected value's character count for the same "hug whatever's
 * selected" reason the native version used ("All" stays narrow,
 * "Public Register" grows).
 */
export const HeroSearch = forwardRef<HTMLInputElement>(function HeroSearch(_props, ref) {
  const [focused, setFocused] = useState(false);
  const [micMode, setMicMode] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0] ?? "All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<ActiveSearchResult | null>(null);
  const [isFeedbackVersion, setIsFeedbackVersion] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const categoryWrapRef = useRef<HTMLDivElement>(null);
  const innerInputRef = useRef<HTMLInputElement>(null);

  function setInputRef(node: HTMLInputElement | null) {
    innerInputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
  }

  function handleTrailingIconClick() {
    if (micMode) {
      setMicMode(false);
      innerInputRef.current?.focus();
      return;
    }
    submitSearch();
    innerInputRef.current?.focus();
  }

  function submitSearch() {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setFocused(true);
    setCategoryOpen(false);
    setActiveResult({
      eyebrow: "Search ready",
      title: cleanQuery,
      description: `Showing suggested DFSA results in ${category}.`,
      action: "View search results",
    });
  }

  function selectRecentSearch(term: string) {
    setQuery(term);
    setMicMode(false);
    setFocused(true);
    setCategoryOpen(false);
    setActiveResult({
      eyebrow: "Recent search selected",
      title: term,
      description: `Search suggestions are ready for ${term}.`,
      action: "View matching results",
    });
    innerInputRef.current?.focus();
  }

  function selectPublication(pub: (typeof PUBLICATIONS)[number]) {
    setQuery(pub.label);
    setMicMode(false);
    setFocused(true);
    setCategory("Publications");
    setCategoryOpen(false);
    setActiveResult({
      eyebrow: pub.tag,
      title: pub.label,
      description: "Publication preview selected. You can continue to the document details.",
      action: "Open publication",
    });
    innerInputRef.current?.focus();
  }

  function selectCategory(c: string) {
    setCategory(c);
    setCategoryOpen(false);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    if (isFeedbackVersion) {
      setMicMode(nextQuery.trim().length === 0);
      setActiveResult(null);
    }
  }

  function selectLiveResult(result: (typeof SEARCH_RESULTS)[number]) {
    setQuery(result.title);
    setMicMode(false);
    setFocused(true);
    setCategoryOpen(false);
    setActiveResult({
      eyebrow: result.kind,
      title: result.title,
      description: result.description,
      action: "View result",
    });
    innerInputRef.current?.focus();
  }

  // Real bug fix: the two dropdowns (search history/publications panel,
  // and this category listbox) used to toggle their own open state with
  // no awareness of each other. Opening the category dropdown while the
  // history panel was already open (from a prior focus on the input)
  // left both visible and overlapping — the outside-click handler below
  // couldn't catch this case because the category button sits *inside*
  // wrapRef, so clicking it never counted as "outside" the search panel.
  // Toggling each one explicitly closes the other, so only one is ever
  // open at a time regardless of which is clicked first.
  function toggleCategoryOpen() {
    setCategoryOpen((v) => !v);
    setFocused(false);
  }

  function handleInputFocus() {
    setFocused(true);
    setCategoryOpen(false);
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
      if (categoryWrapRef.current && !categoryWrapRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFocused(false);
        setCategoryOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const syncVersion = () => {
      setIsFeedbackVersion(document.documentElement.dataset.fontVersion === "feedback");
    };
    syncVersion();
    const observer = new MutationObserver(syncVersion);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-font-version"],
    });
    return () => observer.disconnect();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const showLiveResults = isFeedbackVersion && normalizedQuery.length > 0;
  const liveResults = showLiveResults
    ? SEARCH_RESULTS.filter((result) => {
        const matchesCategory = category === "All" || result.category === category;
        const searchableText =
          `${result.title} ${result.category} ${result.description}`.toLowerCase();
        return matchesCategory && searchableText.includes(normalizedQuery);
      }).slice(0, 5)
    : [];

  return (
    <div className="hero-search-wrap" ref={wrapRef}>
      <div className={cn("hero-search-shell", focused && "is-focused")}>
        <div
          className="hero-search-category-wrap"
          ref={categoryWrapRef}
          style={{ width: `${category.length + 5}ch` }}
        >
          <button
            type="button"
            className="hero-search-category"
            aria-haspopup="listbox"
            aria-expanded={categoryOpen}
            onClick={toggleCategoryOpen}
          >
            {category}
          </button>
          <ChevronDown size={11} />

          <div className={cn("hero-category-panel", categoryOpen && "is-open")} role="listbox">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={c === category}
                className={cn("hero-category-option", c === category && "is-active")}
                onClick={() => selectCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <input
          ref={setInputRef}
          type="text"
          className="hero-search-input"
          placeholder="Search DFSA…"
          role="combobox"
          aria-expanded={focused}
          aria-controls="hero-search-panel"
          autoComplete="off"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch();
          }}
        />
        <button
          type="button"
          className="hero-search-submit"
          aria-label={micMode ? "Search by voice" : "Submit search"}
          onClick={handleTrailingIconClick}
        >
          {micMode ? <MicrophoneIcon size={18} /> : <SearchIcon size={18} />}
        </button>
      </div>

      <div className={cn("hero-search-panel", focused && "is-open")} id="hero-search-panel">
        <div className={cn("hero-search-panel-grid", showLiveResults && "is-live-results")}>
          {showLiveResults ? (
            <div className="hero-live-results" aria-live="polite">
              <h4>Search results</h4>
              <p className="hero-live-results-summary">
                {liveResults.length === 0
                  ? `No matches for “${query.trim()}”`
                  : `${liveResults.length} result${liveResults.length === 1 ? "" : "s"} for “${query.trim()}”`}
              </p>
              <div className="hero-result-list">
                {liveResults.map((result) => (
                  <a
                    key={result.title}
                    className="hero-result-item hero-live-result-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      selectLiveResult(result);
                    }}
                  >
                    <span className="hero-result-item-label">
                      <SearchIcon size={14} />
                      {result.title}
                    </span>
                    <span className="hero-live-result-kind">{result.kind}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4>Recent Searches</h4>
                <div className="hero-result-list">
                  {RECENT_SEARCHES.map((term) => (
                    <a
                      key={term}
                      className={cn(
                        "hero-result-item",
                        activeResult?.title === term && "is-active",
                      )}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        selectRecentSearch(term);
                      }}
                    >
                      <span className="hero-result-item-label">
                        <HistoryIcon size={14} />
                        {term}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4>Popular publications</h4>
                <div className="hero-result-list">
                  {PUBLICATIONS.map((pub) => (
                    <a
                      key={pub.label}
                      className={cn(
                        "hero-result-item",
                        activeResult?.title === pub.label && "is-active",
                      )}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        selectPublication(pub);
                      }}
                    >
                      <span>{pub.label}</span>
                      <span className="hero-tag">{pub.tag}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {activeResult ? (
          <div className="hero-search-feedback" aria-live="polite">
            <span className="hero-search-feedback-icon" aria-hidden="true">
              {activeResult.eyebrow === "PDF" ? "PDF" : <SearchIcon size={16} />}
            </span>
            <div className="hero-search-feedback-copy">
              <span>{activeResult.eyebrow === "PDF" ? "Publication" : activeResult.eyebrow}</span>
              <strong>{activeResult.title}</strong>
              <p>{activeResult.description}</p>
            </div>
            <a href="#" className="hero-search-feedback-action">
              {activeResult.action}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
});
