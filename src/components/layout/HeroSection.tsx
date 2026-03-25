"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
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

  // Mouse parallax
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

  // Entry animation timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orb breathe
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

      // Headline words stagger
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

      // Word3 shimmer loop
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

  // Button magnetic effect
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-120vh) translateX(40px); opacity: 0; }
        }

        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,204,0.6); }
          50% { box-shadow: 0 0 0 6px rgba(0,229,204,0); }
        }

        @keyframes borderGlow {
          0%, 100% { border-color: rgba(155,109,255,0.25); }
          50% { border-color: rgba(0,229,204,0.45); }
        }

        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        .word-shimmer {
          background: linear-gradient(
            90deg,
            #00e5cc 0%,
            #ffffff 30%,
            #00e5cc 50%,
            #9b6dff 70%,
            #00e5cc 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(0,229,204,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,204,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .stat-item + .stat-item::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 1px; height: 32px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent);
        }

        .eyebrow-badge {
          animation: borderGlow 3s ease-in-out infinite;
        }

        .btn-primary-glow {
          box-shadow: 0 0 0 0 rgba(0,229,204,0);
          transition: box-shadow 0.3s ease, transform 0.2s ease, filter 0.2s ease;
        }
        .btn-primary-glow:hover {
          box-shadow: 0 0 32px rgba(0,229,204,0.4), 0 0 64px rgba(0,229,204,0.15);
          filter: brightness(1.08);
        }

        .btn-secondary-glow {
          transition: box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .btn-secondary-glow:hover {
          box-shadow: 0 0 20px rgba(155,109,255,0.25);
          border-color: rgba(155,109,255,0.6);
        }

        .scan-line {
          animation: scanLine 4s linear infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-[96vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #030308 0%, #060612 40%, #040410 80%, #050508 100%)",
        }}
      >
        {/* ── Layer 1: Animated grid ── */}
        <div
          ref={gridRef}
          className="absolute inset-[-10%] hero-grid opacity-70"
          style={{ willChange: "transform" }}
        />

        {/* ── Layer 2: Grain ── */}
        <GrainOverlay />

        {/* ── Layer 3: Primary orb ── */}
        <div
          ref={orbRef}
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            height: "900px",
            willChange: "transform",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,229,204,0.07) 0%, rgba(155,109,255,0.04) 40%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />
        </div>

        {/* ── Layer 4: Secondary offset orb ── */}
        <div
          ref={orb2Ref}
          className="absolute pointer-events-none"
          style={{
            top: "30%",
            right: "-5%",
            width: "600px",
            height: "600px",
            willChange: "transform",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(155,109,255,0.06) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* ── Layer 5: Bottom accent orb ── */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "800px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(0,229,204,0.04) 0%, transparent 65%)",
            filter: "blur(20px)",
          }}
        />

        {/* ── Layer 6: Spark particles ── */}
        <SparkParticles />

        {/* ── Layer 7: Scan line ── */}
        <div
          className="scan-line absolute left-0 right-0 h-[1px] pointer-events-none opacity-10 z-[3]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,204,0.6), transparent)",
          }}
        />

        {/* ── Floating Cards (Desktop) ── */}
        <div className="hidden lg:block">
          {FLOATING_CARDS.slice(0, 4).map((card, i) => (
            <FloatingCard key={i} {...card} cardIndex={i} />
          ))}
        </div>

        {/* ── Hero Content ── */}
        <div className="relative z-10 text-center max-w-[860px] mx-auto px-6 pt-15">
          {/* Eyebrow badge */}
          <div
            ref={eyebrowRef}
            className="eyebrow-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-10 opacity-0"
            style={{
              background: "rgba(0,229,204,0.06)",
              borderColor: "rgba(0,229,204,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: "#00e5cc",
                boxShadow: "0 0 6px #00e5cc",
                animation: "livePulse 2s ease-in-out infinite",
              }}
            />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                color: "rgba(0,229,204,0.9)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              The Future of Card Collecting is Onchain
            </span>
            <span
              className="text-[10px] opacity-50"
              style={{ color: "#00e5cc" }}
            >
              ✦
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="overflow-hidden mb-2"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(58px, 9.5vw, 108px)",
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
              color: "#f0f0ff",
            }}
          >
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
              style={{ display: "inline-block" }}
            >
              Win.
            </span>
          </h1>
          <div
            className="mx-auto mt-5 mb-8 opacity-30"
            style={{
              width: "120px",
              height: "1.5px",
              background:
                "linear-gradient(90deg, transparent, #00e5cc, #9b6dff, transparent)",
            }}
          />
          <p
            ref={subRef}
            className="opacity-0"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(15px, 2vw, 19px)",
              lineHeight: 1.7,
              color: "rgba(240,240,255,0.55)",
              maxWidth: "560px",
              margin: "0 auto 40px",
              fontWeight: 300,
            }}
          >
            The first prediction market built for TCG collectors.
            <br />
            <span style={{ color: "rgba(240,240,255,0.75)", fontWeight: 400 }}>
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
              className="btn-primary-glow relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold overflow-hidden group"
              style={{
                background:
                  "linear-gradient(135deg, #00e5cc 0%, #00b5a4 50%, #007d74 100%)",
                color: "#001a18",
                fontSize: "15px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.01em",
                minWidth: "190px",
                justifyContent: "center",
              }}
              {...makeMagnetic(btn1Ref)}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)",
                  transform: "translateX(-100%)",
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Start Predicting
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </Link>

            <Link
              ref={btn2Ref}
              href="/leaderboard"
              className="btn-secondary-glow relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(240,240,255,0.15)",
                color: "rgba(240,240,255,0.8)",
                fontSize: "15px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                minWidth: "190px",
                justifyContent: "center",
              }}
              {...makeMagnetic(btn2Ref)}
            >
              <Trophy size={15} strokeWidth={2} />
              View Leaderboard
            </Link>
          </div>
          <div
            ref={statsRef}
            className="opacity-0 relative pt-10"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "200px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(0,229,204,0.4), transparent)",
              }}
            />

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
                  className="stat-item relative text-center px-8 py-2"
                  style={{ minWidth: "120px" }}
                >
                  {/* Divider between stats */}
                  {i > 0 && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2"
                      style={{
                        width: "1px",
                        height: "36px",
                        background:
                          "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontFamily: "'Syne', monospace",
                      fontSize: "clamp(22px, 3vw, 30px)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      background: "linear-gradient(135deg, #00e5cc, #4da6ff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <Counter target={target} prefix={prefix} suffix={suffix} />
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      color: "rgba(240,240,255,0.35)",
                      marginTop: "4px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(3,3,8,0.7) 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[4]"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,8,1) 0%, transparent 100%)",
          }}
        />
      </section>
    </>
  );
}
