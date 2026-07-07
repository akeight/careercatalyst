"use client";

// Adapted from React Bits (CountUp, TS + Tailwind). Uses `motion` (already a
// project dependency). Renders the final value as static text under
// prefers-reduced-motion and before hydration, then animates on view.
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  separator?: string;
  className?: string;
}

function formatNumber(value: number, decimals: number, separator: string) {
  const options: Intl.NumberFormatOptions = {
    useGrouping: !!separator,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  const formatted = Intl.NumberFormat("en-US", options).format(value);
  return separator ? formatted.replace(/,/g, separator) : formatted;
}

function decimalPlaces(num: number) {
  const str = num.toString();
  if (str.includes(".")) {
    const decimals = str.split(".")[1] ?? "";
    if (parseInt(decimals, 10) !== 0) return decimals.length;
  }
  return 0;
}

export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  delay = 0,
  separator = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = Math.max(decimalPlaces(from), decimalPlaces(to));
  const finalText = formatNumber(to, decimals, separator);

  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const motionValue = useMotionValue(from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (reduced || !isInView) return;
    const id = setTimeout(() => motionValue.set(to), delay * 1000);
    return () => clearTimeout(id);
  }, [reduced, isInView, motionValue, to, delay]);

  useEffect(() => {
    if (reduced) return;
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest, decimals, separator);
      }
    });
    return () => unsubscribe();
  }, [reduced, springValue, decimals, separator]);

  return (
    <span className={className} ref={ref}>
      {finalText}
    </span>
  );
}
