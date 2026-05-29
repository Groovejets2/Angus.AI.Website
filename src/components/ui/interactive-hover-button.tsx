import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CommonProps = { text?: string; className?: string };

type AsAnchor = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

type AsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type InteractiveHoverButtonProps = AsAnchor | AsButton;

// Visual classes copied verbatim from the existing button to preserve the look the user said they like.
const baseClasses =
  "group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold";

function Inner({ text }: { text: string }) {
  return (
    <>
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary" />
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
