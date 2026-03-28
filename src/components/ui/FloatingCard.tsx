"use client";

import type { FloatingCardProps, FloatingCardRank } from "@/lib/types";
import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const RANK_ORDER: Record<FloatingCardRank, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Mythic: 3,
  Legendary: 4,
};

function rankFloatWeight(rank: FloatingCardRank): number {
  return 0.75 + RANK_ORDER[rank] * 0.16;
}

function hasPrestigeGlow(rank: FloatingCardRank): boolean {
  return rank === "Mythic" || rank === "Legendary";
}

export function FloatingCard({
  image,
  rank,
  color,
  glowColor,
  style,
  cardIndex,
}: FloatingCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const rankRef = useRef<HTMLDivElement>(null);
  const floatTlRef = useRef<gsap.core.Timeline | null>(null);
  const mythicGlowTlRef = useRef<gsap.core.Timeline | null>(null);
  const hoverDepth = useRef({ x: 0, y: 0 });
  const isPressed = useRef(false);

  const quickTilt = useCallback((dx: number, dy: number) => {
    if (!tiltRef.current || isPressed.current) return;
    hoverDepth.current = { x: dx, y: dy };
    gsap.to(tiltRef.current, {
      rotationY: dx * 22,
      rotationX: -dy * 18,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 920,
    });
    if (imageWrapRef.current) {
      gsap.to(imageWrapRef.current, {
        x: dx * 6,
        y: dy * 5,
        duration: 0.45,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const floatEl = floatRef.current;
    const tiltEl = tiltRef.current;
    const glowEl = glowRef.current;
    const shineEl = shineRef.current;
    const rankEl = rankRef.current;
    if (!root || !floatEl || !tiltEl) return;

    const w = rankFloatWeight(rank);
    const dir = cardIndex % 2 === 0 ? 1 : -1;
    const introDelay = 0.08 * cardIndex;

    const ctx = gsap.context(() => {
      gsap.set(floatEl, { transformPerspective: 980 });
      gsap.set(tiltEl, { transformStyle: "preserve-3d" });

      gsap.fromTo(
        root,
        { opacity: 0, y: 56, scale: 0.88, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          delay: introDelay,
          ease: "power3.out",
        },
      );

      const floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        delay: introDelay + 0.55,
      });
      floatTl.to(floatEl, {
        y: `${(-12 - cardIndex * 3) * w}px`,
        rotation: `${dir * (2.2 + cardIndex * 0.45) * w}deg`,
        duration: 2.9 + cardIndex * 0.35,
        ease: "sine.inOut",
      });
      floatTlRef.current = floatTl;

      if (shineEl) {
        const r = RANK_ORDER[rank];
        gsap
          .timeline({ repeat: -1, delay: introDelay + 0.85 })
          .set(shineEl, { x: "-130%" })
          .to(shineEl, {
            x: "180%",
            duration: r >= 2 ? 1.35 : 1.65,
            ease: "power2.inOut",
          })
          .to({}, { duration: 4.6 + r * 1.05 });
      }

      if (hasPrestigeGlow(rank) && glowEl) {
        const mythicTl = gsap.timeline({ repeat: -1, yoyo: true });
        mythicTl.to(glowEl, {
          opacity: rank === "Legendary" ? 1 : 0.98,
          scale: rank === "Legendary" ? 1.28 : 1.24,
          duration: rank === "Legendary" ? 2.1 : 1.85,
          ease: "sine.inOut",
        });
        mythicGlowTlRef.current = mythicTl;
      }

      if (rankEl) {
        gsap.fromTo(
          rankEl,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: introDelay + 0.35,
            ease: "power2.out",
          },
        );
      }
    }, root);

    const handleEnter = () => {
      floatTlRef.current?.pause();
      mythicGlowTlRef.current?.pause();
      gsap.to(floatEl, {
        scale: 1.06,
        duration: 0.42,
        ease: "back.out(1.6)",
      });
      if (glowEl) {
        gsap.to(glowEl, {
          opacity: hasPrestigeGlow(rank) ? 1 : 0.92,
          scale: 1.12,
          duration: 0.35,
        });
      }
      if (rankEl) {
        gsap.to(rankEl, { scale: 1.04, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleLeave = () => {
      isPressed.current = false;
      floatTlRef.current?.resume();
      mythicGlowTlRef.current?.resume();
      hoverDepth.current = { x: 0, y: 0 };
      gsap.to(floatEl, {
        scale: 1,
        duration: 0.55,
        ease: "elastic.out(1, 0.55)",
      });
      gsap.to(tiltEl, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.65,
        ease: "power3.out",
      });
      if (imageWrapRef.current) {
        gsap.to(imageWrapRef.current, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        });
      }
      if (glowEl) {
        gsap.to(glowEl, {
          opacity: hasPrestigeGlow(rank) ? (rank === "Legendary" ? 0.58 : 0.55) : 0.42,
          scale: 1,
          duration: 0.45,
        });
      }
      if (rankEl) {
        gsap.to(rankEl, { scale: 1, duration: 0.35, ease: "power2.out" });
      }
    };

    const handleMove = (e: PointerEvent) => {
      const rect = tiltEl.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      quickTilt(dx, dy);
    };

    const handleDown = () => {
      isPressed.current = true;
      gsap.to(tiltEl, { scale: 0.97, duration: 0.12, ease: "power2.out" });
    };

    const handleUp = () => {
      isPressed.current = false;
      gsap.to(tiltEl, {
        scale: 1,
        duration: 0.38,
        ease: "elastic.out(1, 0.6)",
      });
      const { x, y } = hoverDepth.current;
      quickTilt(x, y);
    };

    root.addEventListener("pointerenter", handleEnter);
    root.addEventListener("pointerleave", handleLeave);
    root.addEventListener("pointermove", handleMove);
    root.addEventListener("pointerdown", handleDown);
    root.addEventListener("pointerup", handleUp);
    root.addEventListener("pointercancel", handleLeave);

    return () => {
      root.removeEventListener("pointerenter", handleEnter);
      root.removeEventListener("pointerleave", handleLeave);
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerdown", handleDown);
      root.removeEventListener("pointerup", handleUp);
      root.removeEventListener("pointercancel", handleLeave);
      floatTlRef.current = null;
      mythicGlowTlRef.current = null;
      ctx.revert();
    };
  }, [cardIndex, quickTilt, rank]);

  const tierBarWidth =
    rank === "Legendary"
      ? "96%"
      : rank === "Mythic"
        ? "92%"
        : rank === "Rare"
          ? "78%"
          : rank === "Uncommon"
            ? "64%"
            : "52%";

  return (
    <div
      ref={rootRef}
      className="absolute cursor-pointer select-none touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-(--teal) focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8faff]"
      style={{ ...style, willChange: "transform, opacity" }}
      tabIndex={0}
      role="article"
      aria-label={`${rank} rarity trading card preview`}
    >
      <div
        ref={floatRef}
        className="relative"
        style={{ willChange: "transform" }}
      >
        <div
          ref={glowRef}
          className="absolute -inset-6 rounded-[22px] blur-2xl opacity-[0.42] pointer-events-none z-0"
          style={{ background: glowColor }}
        />

        <div ref={tiltRef} className="relative z-1">
          <div
            className="relative w-48 overflow-hidden rounded-[14px] border bg-white/90 shadow-[0_18px_44px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl"
            style={{
              borderColor: `${color}55`,
              boxShadow: `0 20px 48px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px ${color}22`,
            }}
          >
            <div
              ref={shineRef}
              className="pointer-events-none absolute inset-0 z-30 w-[160%] opacity-[0.55] mix-blend-overlay"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.92) 49%, rgba(255,255,255,0.25) 52%, transparent 68%)",
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 z-5 opacity-[0.22]"
              style={{
                background: `linear-gradient(145deg, ${color}30 0%, transparent 42%, ${color}15 100%)`,
              }}
            />

            <div className="relative z-10 flex flex-col gap-2.5 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Rarity
                </span>
                <div
                  ref={rankRef}
                  className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-sm ring-2 ring-white/50"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    boxShadow: `0 4px 14px ${color}44`,
                  }}
                >
                  {rank}
                </div>
              </div>

              <div
                className="relative w-full overflow-hidden rounded-[10px] ring-1 ring-slate-900/5"
                style={{
                  background: `radial-gradient(ellipse 85% 70% at 50% 15%, ${color}28 0%, #f1f5f9 72%, #e2e8f0 100%)`,
                }}
              >
                <div
                  ref={imageWrapRef}
                  className="relative"
                  style={{ willChange: "transform" }}
                >
                  <Image
                    src={image}
                    width={208}
                    height={278}
                    alt={`${rank} rarity card artwork`}
                    sizes="208px"
                    className="h-auto w-full object-cover object-top"
                    priority={cardIndex < 2}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/35 via-transparent to-white/20" />
                </div>

                <div
                  className="pointer-events-none absolute bottom-0 left-1/2 h-1 -translate-x-1/2 rounded-full opacity-80"
                  style={{
                    width: tierBarWidth,
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    boxShadow: `0 0 12px ${color}66`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
