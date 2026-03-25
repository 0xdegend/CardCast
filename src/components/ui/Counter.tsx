import { useRef, useEffect } from "react";
import { CounterProps } from "@/lib/types";
import { gsap } from "gsap";
export function Counter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CounterProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!elRef.current || hasRun.current) return;
    hasRun.current = true;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.4,
      delay: 0.8,
      ease: "power3.out",
      onUpdate: () => {
        if (!elRef.current) return;
        const v = obj.val;
        let display: string;
        if (target >= 1_000_000) {
          display = `${prefix}${(v / 1_000_000).toFixed(1)}M${suffix}`;
        } else if (target >= 1_000) {
          display = `${prefix}${Math.floor(v / 1000)}K${suffix}`;
        } else {
          display = `${prefix}${v.toFixed(decimals)}${suffix}`;
        }
        elRef.current.textContent = display;
      },
    });
  }, [target, prefix, suffix, decimals]);

  const initVal =
    target >= 1_000_000
      ? `${prefix}0.0M${suffix}`
      : target >= 1_000
        ? `${prefix}0K${suffix}`
        : `${prefix}0${suffix}`;

  return <span ref={elRef}>{initVal}</span>;
}
