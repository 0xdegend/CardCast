"use client";

import { useState, useEffect } from "react";
import { Particle } from "@/lib/types";

export function SparkParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.5,
        speed: 8 + Math.random() * 20,
        angle: Math.random() * 360,
        delay: Math.random() * -20,
      })),
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background:
              p.id % 3 === 0
                ? "#00e5cc"
                : p.id % 3 === 1
                  ? "#9b6dff"
                  : "#f5c842",
            boxShadow:
              p.id % 3 === 0
                ? `0 0 ${p.size * 3}px #00e5cc`
                : p.id % 3 === 1
                  ? `0 0 ${p.size * 3}px #9b6dff`
                  : `0 0 ${p.size * 3}px #f5c842`,
            animation: `floatParticle ${p.speed}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
