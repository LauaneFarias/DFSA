const ACHIEVEMENTS = [
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

function AchievementGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="achievements-group" aria-hidden={duplicate || undefined}>
      {ACHIEVEMENTS.map((achievement) => (
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

export function KeyAchievements() {
  return (
    <section
      className="achievements-section"
      id="achievements"
      aria-label="Key achievements and milestones"
    >
      <div className="achievements-container">
        <div className="achievements-panel">
          <div className="achievements-grid">
            <AchievementGroup />
            <AchievementGroup duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
