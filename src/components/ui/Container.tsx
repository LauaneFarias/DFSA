import type { ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/**
 * Centers content and caps it at the design system's max content width
 * (--container-content in tokens.css). Use this instead of ad-hoc
 * "max-w-* mx-auto px-*" combinations so the content measure stays
 * consistent across every section.
 */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-(--container-content) px-6 md:px-10", className)}
      {...props}
    />
  );
}
