import { Container } from "@/components/ui";

/**
 * Placeholder home route — confirms the build pipeline, fonts, Tailwind
 * theme, and smooth-scroll provider are wired correctly end to end.
 * No design has been applied yet; this gets replaced once page design
 * begins in the next project phase.
 */
export default function Home() {
  return (
    <Container
      as="main"
      className="flex min-h-screen flex-col items-center justify-center gap-4 text-center"
    >
      <p className="text-sm tracking-[0.2em] text-neutral-400 uppercase">Project foundation</p>
      <h1 className="font-display text-3xl font-medium text-neutral-900 md:text-5xl">
        DFSA — architecture ready
      </h1>
      <p className="max-w-md text-neutral-500">Design and page-building begin in the next phase.</p>
    </Container>
  );
}
