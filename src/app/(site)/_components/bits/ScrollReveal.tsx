"use client";

// Adapted from React Bits (ScrollReveal, TS + Tailwind). Uses GSAP ScrollTrigger
// to reveal text word-by-word (opacity + optional blur) as it scrolls into view.
// Under prefers-reduced-motion it renders the text fully visible with no scrub.
import { useEffect, useMemo, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  as?: ElementType;
  containerClassName?: string;
  textClassName?: string;
  baseOpacity?: number;
  enableBlur?: boolean;
  blurStrength?: number;
  wordAnimationEnd?: string;
}

export default function ScrollReveal({
  children,
  as: Tag = "p",
  containerClassName = "",
  textClassName = "",
  baseOpacity = 0.12,
  enableBlur = true,
  blurStrength = 5,
  wordAnimationEnd = "bottom bottom-=10%",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => {
    return children.split(/(\s+)/).map((word, index) => {
      if (/^\s+$/.test(word)) return word;
      return (
        <span className="reveal-word inline-block" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const wordEls = el.querySelectorAll<HTMLElement>(".reveal-word");
    if (prefersReduced || !wordEls.length) return;

    const tweens: gsap.core.Tween[] = [];

    tweens.push(
      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity, willChange: "opacity, filter" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.045,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=15%",
            end: wordAnimationEnd,
            scrub: true,
          },
        },
      ),
    );

    if (enableBlur) {
      tweens.push(
        gsap.fromTo(
          wordEls,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.045,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=15%",
              end: wordAnimationEnd,
              scrub: true,
            },
          },
        ),
      );
    }

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [baseOpacity, enableBlur, blurStrength, wordAnimationEnd]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <Tag className={textClassName}>{words}</Tag>
    </div>
  );
}
