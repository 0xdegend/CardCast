"use client";
import { FloatingCardProps } from "@/lib/types";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function FloatingCard({
  image,
  label,
  sublabel,
  grade,
  color,
  glowColor,
  style,
  cardIndex,
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    // Independent float timeline per card
    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(el, {
      y: `${-14 - cardIndex * 4}px`,
      rotation: `${(cardIndex % 2 === 0 ? 1 : -1) * (2 + cardIndex * 0.5)}deg`,
      duration: 3.2 + cardIndex * 0.6,
      ease: "sine.inOut",
    });

    // Shine sweep loop
    if (shineRef.current) {
      gsap.to(shineRef.current, { x: "200%", duration: 0 });
      const shineTl = gsap.timeline({
        repeat: -1,
        delay: 1.5 + cardIndex * 2.3,
      });
      shineTl
        .set(shineRef.current, { x: "-120%" })
        .to(shineRef.current, {
          x: "220%",
          duration: 0.8,
          ease: "power2.inOut",
        })
        .to({}, { duration: 4 + cardIndex * 1.5 });
    }

    // Hover interactions
    const handleEnter = () => {
      floatTl.pause();
      gsap.to(el, {
        scale: 1.08,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 1, scale: 1.3, duration: 0.3 });
      }
    };

    const handleLeave = () => {
      floatTl.resume();
      gsap.to(el, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0.5, scale: 1, duration: 0.4 });
      }
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      gsap.to(el, {
        rotationY: dx * 20,
        rotationX: -dy * 20,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 400,
      });
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("mousemove", handleMove);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("mousemove", handleMove);
      floatTl.kill();
    };
  }, [cardIndex]);

  // Dynamic color values that can't be expressed purely in static Tailwind classes
  // are passed as CSS custom properties so Tailwind's arbitrary value syntax stays clean.
  return (
    <div
      ref={cardRef}
      className="absolute cursor-pointer select-none"
      style={{ ...style, willChange: "transform" }}
    >
      {/* Glow behind card */}
      <div
        ref={glowRef}
        className="absolute -inset-5 rounded-2xl blur-2xl opacity-50 pointer-events-none transition-none z-0"
        style={{ background: glowColor }}
      />

      {/* Card body */}
      <div
        className="relative w-[140px] rounded-sm overflow-hidden
          bg-[linear-gradient(145deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)]
          backdrop-blur-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
        style={{
          border: `1px solid ${color}55`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 0.5px ${color}44`,
        }}
      >
        {/* Shine layer */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none z-20 -translate-x-[120%]
            bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]"
        />

        {/* Holographic film */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, transparent 40%, ${color}11 60%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 p-3 flex flex-col items-center gap-1.5">
          {/* Art area */}
          <div
            className="w-full aspect-[3/4] flex items-center justify-center text-3xl relative overflow-hidden"
            style={{
              background: `radial-gradient(circle at 40% 35%, ${color}33 0%, rgba(0,0,0,0.4) 70%)`,
              boxShadow: `inset 0 0 20px ${color}22`,
            }}
          >
            <Image
              src={image}
              width={200}
              height={40}
              alt="Card image"
              sizes="90px"
              className="object-cover drop-shadow-lg"
            />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_60%_30%,white,transparent_60%)]" />
          </div>

          {/* Label */}
          <div className="text-center w-full">
            <div className="text-[10px] font-black tracking-wider text-white uppercase leading-none">
              {label}
            </div>
            <div className="text-[8px] text-white/40 mt-0.5 leading-none">
              {sublabel}
            </div>
          </div>

          {/* Grade badge */}
          {grade && (
            <div
              className="text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase text-black"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}88)`,
                boxShadow: `0 0 8px ${color}88`,
              }}
            >
              {grade}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
