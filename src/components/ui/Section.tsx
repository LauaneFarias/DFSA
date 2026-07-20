import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/**
 * Vertical rhythm wrapper for page sections (--spacing-section in
 * tokens.css keeps top/bottom whitespace consistent and fluid across
 * breakpoints). Compose with <Container> for horizontal constraint.
 */
export function Section<T extends ElementType = "section">({
  as,
  className,
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";
  return <Component className={cn("py-(--spacing-section)", className)} {...props} />;
}
