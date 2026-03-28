"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FLOATING_CARDS } from "@/lib/data/floatingData";
import { gsap } from "gsap";
import { FloatingCard } from "../ui/FloatingCard";
import { SparkParticles } from "../ui/SparkPaticles";
import { Counter } from "../ui/Counter";
import { GrainOverlay } from "../ui/GrainOverlay";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;

    if (orbRef.current) {
      gsap.to(orbRef.current, {
        x: mx * 60,
        y: my * 40,
        duration: 1.8,
        ease: "power2.out",
      });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: mx * -40,
        y: my * -30,
        duration: 2.2,
        ease: "power2.out",
      });
    }
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        x: mx * 12,
        y: my * 8,
        duration: 2.5,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, {
        scale: 1.18,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orb2Ref.current, {
        scale: 1.12,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        eyebrowRef.current,
        { y: 24, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9 },
      )
        .fromTo(
          word1Ref.current,
          { y: 60, opacity: 0, skewX: -6 },
          { y: 0, opacity: 1, skewX: 0, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          word2Ref.current,
          { y: 60, opacity: 0, skewX: -6 },
          { y: 0, opacity: 1, skewX: 0, duration: 0.8 },
          "-=0.6",
        )
        .fromTo(
          word3Ref.current,
          { y: 60, opacity: 0, skewX: -4, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            skewX: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        )
        .fromTo(
          subRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          ctaRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.3",
        )
        .fromTo(
          statsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.2",
        );

      if (word3Ref.current) {
        gsap.to(word3Ref.current, {
          backgroundPosition: "200% center",
          duration: 3,
          repeat: -1,
          ease: "none",
          delay: 2,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const makeMagnetic = (btnRef: React.RefObject<HTMLAnchorElement | null>) => ({
    onMouseMove: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btnRef.current, {
        x: dx * 0.28,
        y: dy * 0.18,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    onMouseLeave: () => {
      if (!btnRef.current) return;
      gsap.to(btnRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    },
    onMouseDown: () => {
      if (!btnRef.current) return;
      gsap.to(btnRef.current, { scale: 0.95, duration: 0.1 });
    },
    onMouseUp: () => {
      if (!btnRef.current) return;
      gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });
    },
  });

  return (
    <section
      ref={sectionRef}
      className="hero-section relative min-h-[96vh] flex items-center justify-center overflow-hidden"
    >
      <div
        ref={gridRef}
        className="hero-grid absolute inset-[-10%] opacity-70"
        style={{ willChange: "transform" }}
      />
      <GrainOverlay />
      <div
        ref={orbRef}
        className="hero-orb-primary absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-225 h-225 will-change-transform"
      >
        <div className="hero-orb-primary-inner w-full h-full rounded-full" />
      </div>
      <div
        ref={orb2Ref}
        className="hero-orb-secondary absolute pointer-events-none top-[30%] -right-[5%] w-150 h-150 will-change-transform"
      >
        <div className="hero-orb-secondary-inner w-full h-full rounded-full" />
      </div>
      <div className="hero-bottom-glow absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" />
      <SparkParticles />
      <div className="scan-line hero-scan-line absolute left-0 right-0 h-px pointer-events-none opacity-10 z-3" />
      <div className="hidden lg:block absolute inset-0">
        {FLOATING_CARDS.slice(0, 4).map((card, i) => {
          const positions = [
            // Left side
            { top: "5%", left: "6%", rotate: "-12deg" },
            { top: "52%", left: "10%", rotate: "-6deg" },

            // Right side
            { top: "5%", right: "6%", rotate: "10deg" },
            { top: "52%", right: "10%", rotate: "6deg" },
          ];

          return (
            <FloatingCard
              key={`${card.rank}-${card.image}-${i}`}
              {...card}
              cardIndex={i}
              style={{
                ...positions[i],
                zIndex: 10 - i,
              }}
            />
          );
        })}
      </div>
      <div className="relative z-10 text-center max-w-215 mx-auto px-6 pt-15">
        <div
          ref={eyebrowRef}
          className="eyebrow-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-sm border mb-10 opacity-0"
        >
          <span className="live-dot w-1.5 h-1.5 rounded-full shrink-0" />
          <span className="eyebrow-text text-[11px] font-bold uppercase tracking-[0.18em]">
            The Future of Card Collecting is Onchain
          </span>
        </div>
        <h1 ref={headlineRef} className="hero-headline overflow-hidden mb-2">
          <span
            ref={word1Ref}
            className="inline-block opacity-0 will-change-transform"
          >
            Predict.{" "}
          </span>
          <span
            ref={word2Ref}
            className="inline-block opacity-0 will-change-transform"
          >
            Collect.{" "}
          </span>
          <span
            ref={word3Ref}
            className="word-shimmer inline-block opacity-0 will-change-transform"
          >
            Win.
          </span>
        </h1>
        <div className="hero-divider mx-auto mt-5 mb-8 opacity-30" />
        <p ref={subRef} className="hero-sub opacity-0">
          The first prediction market built for TCG collectors.
          <br />
          <span className="hero-sub-highlight">
            Bet on card prices, grading outcomes, and pull odds
          </span>{" "}
          — then earn points toward the airdrop.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center opacity-0 mb-16"
        >
          <Link
            ref={btn1Ref}
            href="/markets"
            className="btn-primary-glow relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm font-bold overflow-hidden group min-w-47.5 justify-center"
            {...makeMagnetic(btn1Ref)}
          >
            <div className="btn-primary-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2">
              Start Predicting
              <ArrowRight size={16} strokeWidth={2.5} />
            </span>
          </Link>

          <Link
            ref={btn2Ref}
            href="/leaderboard"
            className="btn-secondary-glow relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm font-bold min-w-47.5 justify-center"
            {...makeMagnetic(btn2Ref)}
          >
            View Leaderboard
          </Link>
        </div>
        <div
          ref={statsRef}
          className="stats-container opacity-0 relative pt-10"
        >
          <div className="stats-top-glow absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="flex flex-wrap justify-center gap-0">
            {[
              {
                label: "Total Volume",
                target: 4200000,
                prefix: "$",
                suffix: "",
              },
              {
                label: "Active Markets",
                target: 12840,
                prefix: "",
                suffix: "",
              },
              { label: "Predictors", target: 89200, prefix: "", suffix: "" },
              { label: "Avg Accuracy", target: 68, prefix: "", suffix: "%" },
            ].map(({ label, target, prefix, suffix }, i) => (
              <div
                key={label}
                className="stat-item relative text-center px-8 py-2 min-w-30"
              >
                {i > 0 && (
                  <div className="stat-divider absolute left-0 top-1/2 -translate-y-1/2" />
                )}
                <div className="stat-value">
                  <Counter target={target} prefix={prefix} suffix={suffix} />
                </div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-vignette absolute inset-0 pointer-events-none z-1" />
      <div className="hero-bottom-fade absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-4" />
    </section>
  );
}
