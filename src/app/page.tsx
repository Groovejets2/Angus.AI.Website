// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
