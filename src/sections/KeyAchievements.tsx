type Stat = { value: string; lines: [string, string] };

/** Default ticker data ("Audit Monitoring in Numbers"), shown on every
 *  feedback tab except Option 2. */
const ACHIEVEMENTS: readonly Stat[] = [
  { value: "25", lines: ["Registered", "Auditors"] },
  { value: "92", lines: ["Audit", "Principals"] },
  { value: "26", lines: ["Inspections", "conducted"] },
  { value: "93", lines: ["Engagement files", "reviewed"] },
  { value: "10,802", lines: ["Continuing Professional", "Development hours"] },
  { value: "216,247", lines: ["Total engagement", "hours"] },
  { value: "1,267", lines: ["Financial Statements", "Auditors’ Reports signed"] },
  { value: "1,968", lines: ["Regulatory", "Reports signed"] },
  { value: "$33.5M", lines: ["Total audit fees charged by", "Registered Auditors"] },
] as const;

/** Option 2 ("DFSA at a glance") ticker data — 2025 Annual Report figures. */
const GLANCE: readonly Stat[] = [
  { value: "1,050", lines: ["Regulated", "entities"] },
  { value: "805", lines: ["Authorised", "firms"] },
  { value: "4,358", lines: ["Authorised", "individuals"] },
  { value: "130", lines: ["Designated non-financial businesses", "or professions (DNFBPs)"] },
  { value: "25", lines: ["Registered", "auditors"] },
  { value: "29", lines: ["Recognised", "bodies"] },
  { value: "44", lines: ["Recognised", "members"] },
  { value: "120", lines: ["Memoranda of Understanding", "(MoUs) signed"] },
] as const;

function AchievementGroup({
  data,
  duplicate = false,
}: {
  data: readonly Stat[];
  duplicate?: boolean;
}) {
  return (
    <div className="achievements-group" aria-hidden={duplicate || undefined}>
      {data.map((achievement) => (
        <article className="achievement-item" key={achievement.value}>
          <strong className="achievement-value">{achievement.value}</strong>
          <p className="achievement-label">
            <span>{achievement.lines[0]}</span>
            <span>{achievement.lines[1]}</span>
          </p>
        </article>
      ))}
    </div>
  );
}

/**
 * "Audit Monitoring in Numbers" / (Option 2) "DFSA at a glance" — a
 * full-bleed marquee of headline figures under a sourced title.
 *
 * Both the title/source copy and the ticker data render in the DOM; CSS
 * (achievements.css, keyed on data-site-tab) shows the "DFSA at a glance"
 * variant on Option 2 and the original "Audit Monitoring" variant on every
 * other feedback tab — same render-both / CSS-toggle pattern used across the
 * Option 2 work.
 */
export function KeyAchievements() {
  return (
    <section
      className="achievements-section"
      id="achievements"
      aria-label="Key achievements and milestones"
    >
      <div className="achievements-container">
        <header className="achievements-head">
          <p className="achievements-eyebrow">
            <span className="ach-title ach-title--default">Audit Monitoring in Numbers</span>
            <span className="ach-title ach-title--glance">DFSA at a glance</span>
          </p>
          <p className="achievements-source">
            <span className="ach-src ach-src--default">
              2025 Annual Report — data as at 31 December 2025
            </span>
            <span className="ach-src ach-src--glance">
              As at 31 December 2025 – data from the 2025 Annual Report
            </span>
          </p>
        </header>

        <div className="achievements-panel achievements-panel--default">
          <div className="achievements-grid">
            <AchievementGroup data={ACHIEVEMENTS} />
            <AchievementGroup data={ACHIEVEMENTS} duplicate />
          </div>
        </div>

        <div className="achievements-panel achievements-panel--glance">
          <div className="achievements-grid">
            <AchievementGroup data={GLANCE} />
            <AchievementGroup data={GLANCE} duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
