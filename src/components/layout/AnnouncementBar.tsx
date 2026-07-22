"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className={cn("hero-announce-bar", dismissed && "is-hidden")}>
      <span aria-hidden="true">📣</span>
      <span>
        Start your DIFC journey with Authorisation from the DFSA — <a href="#">find out more</a>
      </span>
      <button aria-label="Dismiss announcement" onClick={() => setDismissed(true)}>
        ×
      </button>
    </div>
  );
}
