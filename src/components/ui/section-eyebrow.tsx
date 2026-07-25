// src/components/ui/section-eyebrow.tsx
import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-medium tracking-[0.18em] uppercase",
        "text-[var(--brand-accent)]",
        className
      )}
    >
      {children}
    </span>
  );
}
