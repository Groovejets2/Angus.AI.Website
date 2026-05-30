// Floating particles hero background with colour cycling (gold → white → grey)
// CSS-only, GPU-accelerated with transform3d + opacity
// ~40 particles, ~1.2KB of CSS

export function ParticleHero() {
  const particleCount = 12; // Large particles, fewer count for visual clarity

  return (
    <div aria-hidden className="particle-hero">
      {Array.from({ length: particleCount }, (_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}
