"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { InteractiveHoverButton } from "./interactive-hover-button";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#approach", label: "Approach" },
  { href: "#contact", label: "Contact" },
];

const CAL_URL = "https://cal.com/angus-ai-hello";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--ink-edge)] bg-[color:rgba(11,11,14,0.78)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-8">
        <a
          href="#top"
          className="font-display text-base font-bold tracking-tight text-[var(--text-primary)] md:text-lg"
        >
          Angus<span className="text-[var(--brand-accent)]">.</span>AI
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--text-primary)] md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:w-0 after:bg-[var(--brand-accent)] after:transition-all after:duration-200 hover:after:w-full"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <InteractiveHoverButton href={CAL_URL} text="Book a call" />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-md text-[var(--text-primary)] md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--ink-edge)] bg-[var(--ink-0)] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-base">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--ink-1)]"
              >
                {n.label}
              </a>
            ))}
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[var(--brand-accent)] px-4 py-3 text-center text-sm font-semibold text-[var(--ink-0)]"
            >
              Book a call
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
