import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CommonProps = { text?: string; className?: string };

type AsAnchor = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type InteractiveHoverButtonProps = AsAnchor | AsButton;

const baseClasses =
  "group relative inline-flex h-10 w-32 shrink-0 items-center justify-center gap-2 cursor-pointer overflow-hidden whitespace-nowrap rounded-full border border-[var(--ink-edge)] bg-[var(--ink-1)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--ink-1)]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]";

function Inner({ text }: { text: string }) {
  return (
    <>
      <span className="relative transition-transform duration-200 group-hover:-translate-x-1.5">
        {text}
      </span>
      <ArrowRight
        aria-hidden
        className="size-4 -ml-1 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      />
    </>
  );
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  if ("href" in props && typeof props.href === "string") {
    const isExternal = /^https?:\/\//.test(props.href);
    const { href, ...rest } = props as AsAnchor;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(baseClasses, className)}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...rest}
      >
        <Inner text={text} />
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cn(baseClasses, className)}
      {...(props as AsButton)}
    >
      <Inner text={text} />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
