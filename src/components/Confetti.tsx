"use client";

import { useMemo } from "react";

const KLEUREN = ["#0072CE", "#006546", "#ecb93f", "#0033A0", "#48b483", "#5da9e9"];

// Lichtgewicht CSS-confetti, geen dependencies.
export default function Confetti({ count = 28 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.8,
        size: 7 + Math.random() * 7,
        color: KLEUREN[i % KLEUREN.length],
        round: Math.random() > 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 0.55),
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
