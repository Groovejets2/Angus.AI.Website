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
