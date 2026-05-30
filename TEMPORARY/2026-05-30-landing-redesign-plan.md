# Angus AI Landing Page Redesign Implementation Plan (revised post-ICT 2)

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. TDD is partial here - visual redesign work uses typecheck + build + visual smoke test as the verification gates in place of unit tests.
>
> **Server / Client boundary:** All new components (`SiteHeader`, `HeroBackground`, `SectionEyebrow`) are Server Components by default. Only `SiteHeader` carries `"use client"` because its mobile menu uses `useState`. Do NOT add `"use client"` to `HeroBackground` or `SectionEyebrow` defensively.

**Goal:** Redesign the Angus AI landing page so it presents as a confident, modern NZ consultancy site - not a generic AI / LLM template - while running smoothly on an Intel HD Graphics 5500 (i7-5500U dual-core).

**Architecture:** Single Next.js 16 page (App Router). All animation is CSS-keyframe or static SVG - no canvas, no JS animation loops, no `backdrop-filter`, no `filter: blur()` above 12px. Heavy components (`Vortex`, blurred orbs) are deleted. Service icons switch from emoji to thin-stroke Lucide line icons. Palette shifts from blue/cyan/purple LLM gradient to dark warm-charcoal + single warm-neutral accent named `--brand-accent` (deliberately prefixed to avoid colliding with shadcn's `--accent` token).

**Tech Stack:** Next.js 16 + React 19 + Tailwind 4 + Lucide React + Plus Jakarta Sans (display) + Inter (body).

---

## Three User Decisions Embedded (please answer before Phase 3 dispatches)

**D1 - Hero background animation** (recommend C):

- **A. Drifting mesh** - two large radial gradients on `::before` / `::after`, slow `transform: translate3d()` drift over 50s, with `filter: blur(10px)`. **Cost: low steady-state (compositor-cached blur layer); brief stutter possible during window resize as the GPU re-rasterises the blurred layer.**
- **B. Aurora sweep** - single linear gradient, `background-position` shift over 30s, plus a thin diagonal SVG line travelling on a 12s loop. **Cost: moderate. `background-position` animation on a gradient is NOT GPU-accelerated in Chromium; full-area paint each frame. On HD Graphics 5500 + dual-core CPU this may jank under concurrent load. Not recommended on this hardware.**
- **C. Constellation grid** - fixed SVG dot grid (~50-112 dots), staggered opacity pulse via CSS animation-delay. **Cost: low (opacity-only; compositor-cheap). Best fit for this hardware.**

**D2 - Single accent colour** (recommend i):

- **i. Muted gold #C8A86A** - warm, premium, distinctive against blue/cyan AI sites. WCAG: 8.66:1 on #0B0B0E (passes everywhere)
- **ii. Soft amber #E0A063** - warmer still, more energetic
- **iii. Cool slate #8FA1B4** - architectural, restrained

**D3 - "Learn More" anchor target** (recommend #services):

- **a. #services** - visitors usually want "what do you do" before "how"
- **b. #approach** - leads with methodology

---

## File Structure

**Files created:**
- `src/components/ui/site-header.tsx` - sticky header (logo + 3 anchor links + CTA + mobile disclosure)
- `src/components/ui/hero-background.tsx` - the chosen low-cost hero animation
- `src/components/ui/section-eyebrow.tsx` - small reusable eyebrow label
- `src/lib/site-content.ts` - all hero/services/approach copy in one place for easy review

**Files modified:**
- `src/app/page.tsx` - full rewrite using new components + content module
- `src/app/layout.tsx` - metadata polish, NZ English description, font weight pruning
- `src/app/globals.css` - replace orb animations with new palette + scroll behaviour + reduced-motion guard
- `src/components/ui/interactive-hover-button.tsx` - **minimal change: add `href` support; visual behaviour unchanged from existing**
- `package.json` - prune `simplex-noise` AND `framer-motion` (both unused after Vortex removal)

**Files deleted:**
- `src/components/ui/vortex.tsx` - unused canvas particle system

**Public assets added:**
- `public/images/approach-accent.webp` - one editorial accent image, placed in the Approach section right column (mandatory placement once user approves URL)

---

## Task 1: Foundation - delete Vortex, prune dead deps

**Files:**
- Delete: `src/components/ui/vortex.tsx`
- Modify: `package.json`

- [ ] **Step 1: Verify zero remaining references**

Run: `grep -rE "vortex|simplex-noise|framer-motion" --include="*.tsx" --include="*.ts" src/`
Expected: only `src/components/ui/vortex.tsx` itself appears (it imports the other two). Once it is deleted, none of the three remain in `src/`.

- [ ] **Step 2: Delete the file**

PowerShell: `Remove-Item src/components/ui/vortex.tsx`

- [ ] **Step 3: Re-verify**

Run the grep again. Expected: zero results.

- [ ] **Step 4: Remove unused deps from `package.json`**

Edit `package.json`, delete these lines from `dependencies`:
- `"framer-motion": "^12.35.0",`
- `"simplex-noise": "^4.0.3",`

- [ ] **Step 5: Reinstall**

Run: `npm install`
Expected: lockfile updates, no errors. `node_modules/framer-motion` and `node_modules/simplex-noise` are removed.

- [ ] **Step 6: Confirm `lucide-react` is present**

Confirm `"lucide-react": "^0.577.0"` is in `dependencies`. It is - no install needed.

- [ ] **Step 7: Commit**

Run: `git add -A && git commit -m "chore: remove unused Vortex component and dead deps (simplex-noise, framer-motion)"`

---

## Task 2: Design tokens - palette, motion, scroll behaviour

**Files:**
- Modify: `src/app/globals.css` (replace orb block + add tokens, scroll behaviour, reduced motion)

- [ ] **Step 1: Replace lines 136-200 (the existing orb + fade-up block) with the following**

```css
/* ===== Angus AI Brand Tokens =====
   Prefixed with --brand-* to avoid colliding with shadcn's --accent, --primary, etc.
   The existing shadcn :root / .dark blocks above are kept intact for any shadcn
   components that need them (button.tsx, etc.). */
:root {
  /* Surfaces */
  --ink-0: #0B0B0E;        /* page background */
  --ink-1: #15161B;        /* card surface */
  --ink-edge: rgba(255,255,255,0.06);

  /* Text */
  --text-primary: #F4F4F2;
  --text-secondary: rgba(244,244,242,0.62);
  --text-muted: rgba(244,244,242,0.40);

  /* Brand accent (resolved at Phase 3 from D2 - default muted gold) */
  --brand-accent: #C8A86A;
  --brand-accent-soft: rgba(200,168,106,0.14);

  /* Motion */
  --hero-anim-duration: 50s;
}

/* ===== Smooth scroll + sticky-header offset for in-page anchors ===== */
html { scroll-behavior: smooth; }
section[id], main[id] {
  scroll-margin-top: 4rem;   /* matches md:h-16 header height */
}

/* ===== Reduced motion: kill keyframe animations only =====
   Transitions are intentionally NOT disabled - they are short and user-initiated
   (button hover, link colour change). Disabling them would make hover snap
   on/off, which looks broken rather than respectful. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
  }
}

/* ===== Hero background keyframes added in Task 4 from D1 ===== */
```

- [ ] **Step 2: Verify the file parses**

Run: `npm run lint`
Expected: no CSS or TS errors.

- [ ] **Step 3: Commit**

Run: `git add src/app/globals.css && git commit -m "feat(design): brand tokens, scroll-margin for sticky header, reduced-motion guard"`

---

## Task 3: Layout metadata polish + font weight prune

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace lines 11-22**

```tsx
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700"],   // pruned from 5 weights to 2 - saves ~80KB woff2
});

export const metadata: Metadata = {
  title: "Angus AI - AI strategy and implementation for NZ businesses",
  description:
    "Independent AI guidance for New Zealand businesses. We help leaders identify, implement, and optimise AI where it earns its keep - and avoid where it does not.",
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

Run: `git add src/app/layout.tsx && git commit -m "feat(layout): NZ business tone metadata, prune Plus Jakarta weights to 500/700"`

---

## Task 4: Hero background component (chosen from D1)

**Files:**
- Create: `src/components/ui/hero-background.tsx`
- Modify: `src/app/globals.css` (append keyframes block at end)

> Pick ONE variant per the user's D1 answer. Default if user did not specify: **C (Constellation grid)**. Delete the other two variant blocks below from this file before commit.

### Variant A - Drifting mesh

- [ ] **Step 1: Create the component**

```tsx
// src/components/ui/hero-background.tsx
export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-mesh">
      <span className="hero-bg-mesh__a" />
      <span className="hero-bg-mesh__b" />
      <span className="hero-bg-grain" />
    </div>
  );
}
```

- [ ] **Step 2: Append CSS keyframes to `globals.css`**

```css
.hero-bg-mesh { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.hero-bg-mesh__a, .hero-bg-mesh__b {
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  border-radius: 50%;
  filter: blur(10px);
  opacity: 0.35;
  will-change: transform;
}
.hero-bg-mesh__a {
  background: radial-gradient(circle, var(--brand-accent) 0%, transparent 60%);
  top: -20vmax; left: -15vmax;
  animation: hero-drift-a var(--hero-anim-duration) ease-in-out infinite alternate;
}
.hero-bg-mesh__b {
  background: radial-gradient(circle, #3a3a52 0%, transparent 60%);
  bottom: -25vmax; right: -20vmax;
  animation: hero-drift-b calc(var(--hero-anim-duration) * 1.4) ease-in-out infinite alternate;
}
.hero-bg-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' /></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>");
  opacity: 0.5;
}
@keyframes hero-drift-a {
  from { transform: translate3d(0,0,0); }
  to   { transform: translate3d(8vmax, 5vmax, 0); }
}
@keyframes hero-drift-b {
  from { transform: translate3d(0,0,0); }
  to   { transform: translate3d(-6vmax, -4vmax, 0); }
}
```

### Variant B - Aurora sweep (re-engineered to use transform, not background-position)

- [ ] **Step 1: Create the component**

```tsx
// src/components/ui/hero-background.tsx
export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-aurora">
      <span className="hero-bg-aurora__sheet" />
      <span className="hero-bg-aurora__line" />
    </div>
  );
}
```

- [ ] **Step 2: Append CSS - uses `transform` translation rather than `background-position` so it stays compositor-cheap**

```css
.hero-bg-aurora { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.hero-bg-aurora__sheet {
  position: absolute; top: -40%; left: -40%;
  width: 180%; height: 180%;
  background: linear-gradient(115deg,
    transparent 0%,
    var(--brand-accent-soft) 35%,
    transparent 55%,
    rgba(143,161,180,0.10) 75%,
    transparent 95%);
  will-change: transform;
  animation: hero-aurora 40s linear infinite;
}
.hero-bg-aurora__line {
  position: absolute; top: 30%; left: -20%;
  width: 140%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--brand-accent), transparent);
  opacity: 0.35;
  animation: hero-line 12s linear infinite;
}
@keyframes hero-aurora {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-20%, -20%, 0); }
}
@keyframes hero-line {
  0%   { transform: translate3d(-10%, 0, 0); opacity: 0; }
  20%  { opacity: 0.35; }
  80%  { opacity: 0.35; }
  100% { transform: translate3d(40%, 80vh, 0); opacity: 0; }
}
```

### Variant C - Constellation grid (default recommended)

- [ ] **Step 1: Create the component**

```tsx
// src/components/ui/hero-background.tsx
export function HeroBackground() {
  const cols = 14;
  const rows = 8;
  return (
    <div aria-hidden className="hero-bg-grid">
      {Array.from({ length: cols * rows }, (_, i) => (
        <span
          key={i}
          className="hero-bg-grid__dot"
          style={{ animationDelay: `${(i % 11) * 0.6}s` }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Append CSS - no `will-change` (Chromium auto-promotes during animation; on 112 elements an always-on `will-change` permanently allocates VRAM layers)**

```css
.hero-bg-grid {
  position: absolute; inset: 0;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  grid-template-rows: repeat(8, 1fr);
  padding: 6vh 4vw;
  gap: 0;
  pointer-events: none;
}
.hero-bg-grid__dot {
  align-self: center;
  justify-self: center;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.25;
  animation: hero-pulse 6s ease-in-out infinite;
}
.hero-bg-grid__dot:nth-child(7n) {
  background: var(--brand-accent);
  opacity: 0.35;
}
@keyframes hero-pulse {
  0%, 100% { opacity: 0.18; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(1.4); }
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

Run: `git add src/components/ui/hero-background.tsx src/app/globals.css && git commit -m "feat(hero): low-cost CSS background animation"`

---

## Task 5: Section eyebrow component

**Files:**
- Create: `src/components/ui/section-eyebrow.tsx`

- [ ] **Step 1: Create the component (Server Component - no `"use client"` needed)**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

Run: `git add src/components/ui/section-eyebrow.tsx && git commit -m "feat(ui): add SectionEyebrow component for editorial labels"`

---

## Task 6: Adjust InteractiveHoverButton - keep existing visual behaviour, add `href` support only

> ICT 2 flagged a behavioural regression in the previous draft (changed height, font weight, removed dot scale animation). The user said "I like what I have" - so keep the existing visual behaviour 1:1 and only add the discriminated union for `href` routing.

**Files:**
- Modify: `src/components/ui/interactive-hover-button.tsx`

- [ ] **Step 1: Replace file contents (visual classes match the existing component verbatim; the only addition is the anchor variant)**

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

Run: `git add src/components/ui/interactive-hover-button.tsx && git commit -m "feat(button): support href (anchor + auto external-link attrs), visuals unchanged"`

---

## Task 7: Site header (sticky, slim, with mobile disclosure)

**Files:**
- Create: `src/components/ui/site-header.tsx`

- [ ] **Step 1: Create the component (needs `"use client"` for `useState` mobile toggle)**

```tsx
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

        <nav className="hidden items-center gap-7 text-sm text-[var(--text-secondary)] md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="transition-colors hover:text-[var(--text-primary)]"
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
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-base text-[var(--text-secondary)]">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 transition-colors hover:bg-[var(--ink-1)] hover:text-[var(--text-primary)]"
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

Run: `git add src/components/ui/site-header.tsx && git commit -m "feat(header): sticky slim header with mobile disclosure and Cal.com CTA"`

---

## Task 8: Site content module (all copy in one reviewable file)

**Files:**
- Create: `src/lib/site-content.ts`

- [ ] **Step 1: Create the file**

```ts
import {
  Compass,
  Map as MapIcon,
  Workflow,
  LineChart,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const CAL_URL = "https://cal.com/angus-ai-hello";
export const CONTACT_EMAIL = "angus.ai.hello@gmail.com";

export const hero = {
  eyebrow: "AI strategy and implementation",
  title: "Practical AI for businesses that want results, not hype.",
  subtitle:
    "Independent guidance to identify where AI earns its keep, implement it cleanly, and measure the return. No jargon, no overreach.",
  primaryCta: "Book a call",
  secondaryCta: "How we work",
};

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: Compass,
    title: "AI assessment",
    description:
      "We map your operations and identify where AI delivers measurable value - and where it does not.",
  },
  {
    icon: MapIcon,
    title: "Implementation strategy",
    description:
      "A clear roadmap covering tooling, sequencing, team training, and risk - sized to your business.",
  },
  {
    icon: Workflow,
    title: "Technical integration",
    description:
      "We embed AI into your existing systems and workflows with minimal disruption and full handover.",
  },
  {
    icon: LineChart,
    title: "Performance optimisation",
    description:
      "Ongoing tuning so the systems we deliver get better with use, not worse.",
  },
  {
    icon: Users,
    title: "Team training",
    description:
      "Pragmatic upskilling for the people who will use these tools every day - not vendor demos.",
  },
  {
    icon: Sparkles,
    title: "Innovation consulting",
    description:
      "An honest read on emerging AI capability and how it applies to your sector right now.",
  },
];

export const approaches = [
  {
    title: "Discover",
    description:
      "We start with your operations, constraints, and goals - then identify where AI creates real value.",
  },
  {
    title: "Design",
    description:
      "A focused plan aligned with your timeline and budget. No platforms before problems.",
  },
  {
    title: "Deploy",
    description:
      "We execute the rollout with care, keeping disruption low and the team across what is changing.",
  },
  {
    title: "Optimise",
    description:
      "Continuous refinement using real performance data and your team's feedback loop.",
  },
];

export const ctaSection = {
  eyebrow: "Get started",
  title: "Ready to put AI to work?",
  subtitle:
    "Book a short call. We will tell you honestly whether AI is the right move - and if it is, what shape it should take.",
  buttonLabel: "Book a call",
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

Run: `git add src/lib/site-content.ts && git commit -m "feat(content): centralise site copy with Lucide icon assignments"`

---

## Task 9: Rewrite page.tsx

**Files:**
- Modify: `src/app/page.tsx` (full replacement)

> NOTE: this task is split into two commits. The first commit ships the page WITHOUT the editorial image (placeholder div). The second commit (after Task 10 user approval) drops the image in.

- [ ] **Step 1: Replace contents (placeholder div where image will land, marked with `data-image-slot`)**

```tsx
import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { SiteHeader } from "@/components/ui/site-header";
import { HeroBackground } from "@/components/ui/hero-background";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  CAL_URL,
  CONTACT_EMAIL,
  hero,
  services,
  approaches,
  ctaSection,
  type Service,
} from "@/lib/site-content";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-[var(--ink-0)] text-[var(--text-primary)]">
      <SiteHeader />

      {/* HERO */}
      <section className="relative isolate flex min-h-[calc(100vh-3.5rem)] w-full items-center overflow-hidden border-b border-[var(--ink-edge)] px-4 md:min-h-[calc(100vh-4rem)] md:px-10">
        <HeroBackground />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-start text-left">
          <SectionEyebrow className="mb-6">{hero.eyebrow}</SectionEyebrow>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[var(--text-secondary)] md:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5">
            <InteractiveHoverButton
              href={CAL_URL}
              text={hero.primaryCta}
              className="w-44 bg-[var(--brand-accent)] text-[var(--ink-0)] border-transparent"
            />
            <InteractiveHoverButton
              href="#services"
              text={hero.secondaryCta}
              className="w-44"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-b border-[var(--ink-edge)] px-4 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow className="mb-4">Services</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            What we do
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--text-secondary)] md:text-lg">
            Six places where we tend to add the most value. We will tell you which apply to you.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--ink-edge)] bg-[var(--ink-edge)] md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.title} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH - has the editorial image slot */}
      <section id="approach" className="border-b border-[var(--ink-edge)] px-4 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow className="mb-4">Approach</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            How we work
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              {approaches.map((step, idx) => (
                <div key={step.title}>
                  <div className="font-display text-sm font-medium text-[var(--brand-accent)]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display mt-3 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div
              data-image-slot="approach-accent"
              className="relative hidden aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--ink-edge)] bg-[var(--ink-1)] lg:block"
            >
              {/* image inserted in Task 10 step 4 */}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-4 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow className="mb-4">{ctaSection.eyebrow}</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            {ctaSection.title}
          </h2>
          <p className="mt-5 text-base text-[var(--text-secondary)] md:text-lg">
            {ctaSection.subtitle}
          </p>
          <div className="mt-10 flex justify-center">
            <InteractiveHoverButton
              href={CAL_URL}
              text={ctaSection.buttonLabel}
              className="w-56 bg-[var(--brand-accent)] text-[var(--ink-0)] border-transparent"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--ink-edge)] px-4 py-14 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">
              Angus<span className="text-[var(--brand-accent)]">.</span>AI
            </p>
            <p className="mt-3 max-w-xs text-sm text-[var(--text-secondary)]">
              Independent AI strategy and implementation for New Zealand businesses.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">Site</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#services" className="hover:text-[var(--text-primary)]">Services</a></li>
              <li><a href="#approach" className="hover:text-[var(--text-primary)]">Approach</a></li>
              <li><a href="#contact" className="hover:text-[var(--text-primary)]">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[var(--text-primary)]">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)]">
                  Book a call
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-[var(--ink-edge)] pt-6 text-center text-xs text-[var(--text-muted)]">
          &copy; 2026 Angus AI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <div className="group relative flex flex-col bg-[var(--ink-0)] p-8 transition-colors duration-200 hover:bg-[var(--ink-1)]">
      <Icon className="size-6 text-[var(--brand-accent)]" strokeWidth={1.5} aria-hidden />
      <h3 className="font-display mt-5 text-lg font-bold">{service.title}</h3>
      <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
        {service.description}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit (image slot still empty)**

Run: `git add src/app/page.tsx && git commit -m "feat(page): redesign landing page with NZ tone, line icons, brand-accent palette"`

---

## Task 10: Source editorial image and place it in the Approach slot (mandatory after user approval)

**Files:**
- Create: `public/images/approach-accent.webp`
- Modify: `src/app/page.tsx` (fill the `data-image-slot="approach-accent"` div with `<Image>`)

- [ ] **Step 1: Search Unsplash for 2 candidates**

Aim for: monochromatic or near-monochrome, no people, no obvious tech imagery. Likely searches: "architectural detail", "concrete texture", "fern macro", "NZ coastal landscape".

- [ ] **Step 2: Present 2 candidate URLs to user via AskUserQuestion**

Format: option A `<url>`, option B `<url>`, with thumbnail descriptions. Halt until user picks one or both, or rejects.

- [ ] **Step 3: Download chosen image as WebP, ~1200px wide for accent**

PowerShell: `Invoke-WebRequest -Uri "<chosen-url-with-w=1200&fm=webp>" -OutFile public/images/approach-accent.webp`

- [ ] **Step 4: Insert `<Image>` into the Approach slot in `page.tsx`**

Replace the empty `data-image-slot="approach-accent"` div's contents:

```tsx
<div
  data-image-slot="approach-accent"
  className="relative hidden aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--ink-edge)] bg-[var(--ink-1)] lg:block"
>
  <Image
    src="/images/approach-accent.webp"
    alt=""
    fill
    sizes="360px"
    className="object-cover opacity-80 mix-blend-luminosity"
  />
</div>
```

`alt=""` because the image is decorative. `mix-blend-luminosity` desaturates the image so it blends with the dark palette.

- [ ] **Step 5: Typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: clean. Image gets optimised by next/image at build time.

- [ ] **Step 6: Commit**

Run: `git add public/images src/app/page.tsx && git commit -m "feat(assets): add editorial accent image to Approach section (Unsplash, royalty-free)"`

---

## Task 11: Accessibility + responsive + NZ-English sweep

- [ ] **Step 1: WCAG AA contrast (pre-computed - verify the implementation matches the tokens)**

Expected ratios on `--ink-0` (`#0B0B0E`):
- `--text-primary` (`#F4F4F2`) ~ 18:1 (passes body)
- `--text-secondary` (rgba 0.62 effective `#9B9B9B`) ~ 7.16:1 (passes body)
- `--text-muted` (rgba 0.40 effective `#666666`) ~ 3.2:1 (only used for tiny tertiary text - passes large/UI)
- `--brand-accent` (`#C8A86A`) ~ 8.66:1 (passes everywhere)
- Primary CTA: `--ink-0` text on `--brand-accent` background = 8.66:1 (passes)

If any of these are not visually right, raise the offending alpha by 0.05 increments.

- [ ] **Step 2: Visual responsive check**

Start dev server: `npm run dev`. Visit `http://localhost:3000`. Resize browser to 360, 768, 1024, 1440. Verify:
- No horizontal scroll
- Mobile (<768): header collapses to logo + hamburger; tap hamburger expands nav panel with Services / Approach / Contact / Book a call
- Hero text scales smoothly
- Service grid: 1 col mobile, 2 col tablet, 3 col desktop
- Approach: 1 col mobile, 2 col tablet (steps), image column appears at `lg`
- Tap each in-page anchor link - confirm scroll lands BELOW the sticky header (because of `scroll-margin-top`)

- [ ] **Step 3: Reduced motion**

In Chrome devtools > Rendering > "Emulate prefers-reduced-motion: reduce". Verify:
- Hero animation halts (Variant C dots stop pulsing; Variant A orbs stop drifting; Variant B sheet stops translating)
- Button hover transition STILL works (transitions intentionally preserved)

- [ ] **Step 4: NZ English spell sweep (extended regex)**

Run: `grep -rEn "optimize|optimization|organize|organization|color|favor|favorite|center|behavior|program(?!me)" --include="*.tsx" --include="*.ts" src/`
Expected: zero hits in app/page/content (Tailwind utility class names like `text-color-*` are not present; the existing shadcn `--color-*` tokens are framework-owned and not flagged because the grep is against TS/TSX only).

- [ ] **Step 5: Smoke test CTAs**

In the running dev server:
- Click hero "Book a call" - confirm a new tab opens to `https://cal.com/angus-ai-hello`
- Click hero "How we work" - confirm in-page scroll to Services section, with section title visible below the header
- Click footer email - confirm it opens the system mail composer
- Click footer "Book a call" - new tab to Cal.com

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds, zero warnings about unused imports or framer-motion / simplex-noise.

- [ ] **Step 7: Commit any fixes**

Run: `git add -A && git commit -m "fix(a11y): contrast, responsive, NZ English, smoke-test sweep"`

---

## Self-Review Checklist (run before handing to ICT 4)

- [ ] Every spec item covered:
  - no AI icons (Tasks 8 + 9: Lucide line icons, `strokeWidth=1.5`)
  - low CPU/GPU animations (Task 4 variants all stay compositor-friendly; B was re-engineered to use `transform` not `background-position`)
  - sleek smart fonts (Tasks 3 + 9: Plus Jakarta + Inter, 2-weight prune)
  - modern responsive (Task 11 sweep at 4 breakpoints + mobile menu in Task 7)
  - Cal.com CTA wired (Tasks 8 + 9)
  - email shown in footer (Task 9, mailto link)
  - NZ English (Task 11 extended grep)
  - Vortex deleted, dead deps removed (Task 1)
  - reduced-motion respected without breaking hover (Task 2)
  - editorial image placed in Approach (Task 10)
- [ ] No "TBD" or "TODO" markers
- [ ] Function and type names consistent across tasks (`InteractiveHoverButton`, `SiteHeader`, `HeroBackground`, `SectionEyebrow`, `Service`, `CAL_URL`, `CONTACT_EMAIL`)
- [ ] All `--brand-accent` references (no `--accent` leakage that would collide with shadcn)
- [ ] Commits frequent and atomic

---

## Acceptance Criteria (for ICT 4 to test against)

- **AC1** No emoji icons anywhere; service icons are Lucide line icons (stroke 1.5)
- **AC2** No `backdrop-filter` anywhere; no `filter: blur()` above 12px
- **AC3** `Vortex` component removed; `simplex-noise` AND `framer-motion` deps pruned from `package.json`
- **AC4** Hero "Book a call" wired to `https://cal.com/angus-ai-hello` with `target="_blank" rel="noopener noreferrer"`
- **AC5** Hero "How we work" anchor-scrolls to `#services`, landing BELOW the sticky header
- **AC6** Footer CTA wired to Cal.com; footer shows `angus.ai.hello@gmail.com` as a `mailto:` link
- **AC7** Sticky header present with logo + 3 anchor links + Book a call CTA; mobile renders a working disclosure menu
- **AC8** `prefers-reduced-motion: reduce` disables keyframe animations but preserves button hover transitions
- **AC9** WCAG AA contrast (text-primary 18:1, text-secondary 7.16:1, accent 8.66:1, primary CTA 8.66:1) verified
- **AC10** Responsive at 360, 768, 1024, 1440 with no horizontal scroll
- **AC11** NZ English throughout copy (optimise, organise, colour, centre)
- **AC12** `npm run build` passes cleanly, zero unused-import warnings
- **AC13** Hero background animation present and visibly distinct from cyan/blue LLM gradient
- **AC14** No token collision: `--brand-accent` does not override shadcn's `--accent`; existing shadcn components (e.g. `button.tsx`) continue rendering as before
- **AC15** Editorial image placed in the Approach section right column at `lg` breakpoint and above; decorative `alt=""`
