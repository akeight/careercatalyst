"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  animate,
  createScope,
  createTimeline,
  stagger,
  utils,
  type Scope,
} from "animejs";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smoothstep = (n: number) => n * n * (3 - 2 * n);

export function LandingAnimations({
  rootRef,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
}) {
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Content is visible by default; only animate when motion is allowed.
    if (prefersReducedMotion) return;

    const observers: IntersectionObserver[] = [];
    const cleanups: Array<() => void> = [];

    scope.current = createScope({ root: rootRef }).add(() => {
      // Hero entrance sequence.
      const tl = createTimeline({
        defaults: { ease: "outQuad", duration: 650 },
      });
      tl.add(".hero-badge", { opacity: [0, 1], translateY: [12, 0] })
        .add(".hero-title", { opacity: [0, 1], translateY: [16, 0] }, "-=420")
        .add(".hero-copy", { opacity: [0, 1], translateY: [14, 0] }, "-=480")
        .add(".hero-cta", { opacity: [0, 1], scale: [0.96, 1] }, "-=420")
        .add(
          ".hero-visual",
          {
            opacity: [0, 1],
            scale: [0.96, 1],
            translateY: [20, 0],
            duration: 800,
          },
          "-=380",
        )
        .add(
          ".dashboard-card",
          { opacity: [0, 1], translateY: [16, 0], delay: stagger(60) },
          "-=320",
        );

      // Slow, subtle floating accents.
      animate(".floating-accent", {
        translateY: [0, -8],
        rotate: [0, 1.5],
        loop: true,
        alternate: true,
        duration: 3200,
        ease: "inOutSine",
        delay: stagger(400),
      });

      // Hero: pinned light->dark scrub with the dashboard parallaxing up into
      // the headline, then the next band folds up over the pinned stage.
      const heroZone = root.querySelector<HTMLElement>(".hero-zone");
      const darkStage = root.querySelector<HTMLElement>(".hero-dark-stage");
      const scene = root.querySelector<HTMLElement>(".hero-scene");
      const sceneDark = root.querySelector<HTMLElement>(".hero-scene-dark");
      const copyBlock = root.querySelector<HTMLElement>(".hero-copy-block");
      const fold = root.querySelector<HTMLElement>(".site-fold");

      if (heroZone) {
        const mqDesktop = window.matchMedia("(min-width: 768px)");
        let pinned = false;
        let ticking = false;

        const resetHero = () => {
          if (scene) scene.style.transform = "";
          if (sceneDark) sceneDark.style.transform = "";
          if (copyBlock) copyBlock.style.transform = "";
          if (darkStage) darkStage.style.clipPath = "";
          if (fold) fold.style.transform = "";
        };

        // Phase boundaries across the pin (0..1):
        //  A [0    -> 0.42]  dashboard parallaxes up and over the almost-pinned copy
        //  B [0.42 -> 0.72]  dark theme wipes in from the bottom to the top
        //  C [0.72 -> 1   ]  hold; the next band parallaxes up from the bottom
        const A_END = 0.42;
        const B_END = 0.72;

        const compute = () => {
          ticking = false;
          if (!pinned) return;
          const vh = window.innerHeight;
          const distance = heroZone.offsetHeight - vh;
          const p = clamp01(
            distance > 0 ? (window.scrollY - heroZone.offsetTop) / distance : 0,
          );

          // Phase A: dashboard rises from low/peeking up to center screen.
          const rise = smoothstep(clamp01(p / A_END));
          const y = (0.42 - rise * 0.5) * vh;
          const t = `translateY(${y.toFixed(1)}px) scale(${(0.98 + rise * 0.02).toFixed(4)})`;
          if (scene) scene.style.transform = t;
          if (sceneDark) sceneDark.style.transform = t;

          // Copy is "almost pinned": a slow drift down, stays fully opaque as the
          // dashboard passes over it.
          if (copyBlock) {
            copyBlock.style.transform = `translateY(${(p * 40).toFixed(1)}px)`;
          }

          // Phase B: dark theme wipe from bottom -> top via clip-path inset.
          const wipe = smoothstep(clamp01((p - A_END) / (B_END - A_END)));
          if (darkStage) {
            darkStage.style.clipPath = `inset(${((1 - wipe) * 100).toFixed(2)}% 0 0 0)`;
          }

          // Phase C: fold band parallaxes up from the bottom over the dark stage.
          if (fold) {
            const enter = clamp01((window.scrollY + vh - fold.offsetTop) / vh);
            fold.style.transform = `translateY(${((1 - enter) * 72).toFixed(1)}px)`;
          }
        };

        const onScrollTick = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(compute);
        };

        const setPinned = (on: boolean) => {
          if (on === pinned) return;
          pinned = on;
          heroZone.classList.toggle("is-pinned", on);
          fold?.classList.toggle("is-folding", on);
          if (on) compute();
          else resetHero();
        };

        const onModeChange = (e: MediaQueryListEvent) => setPinned(e.matches);
        setPinned(mqDesktop.matches);
        mqDesktop.addEventListener("change", onModeChange);
        window.addEventListener("scroll", onScrollTick, { passive: true });
        window.addEventListener("resize", onScrollTick);
        cleanups.push(() => {
          mqDesktop.removeEventListener("change", onModeChange);
          window.removeEventListener("scroll", onScrollTick);
          window.removeEventListener("resize", onScrollTick);
          heroZone.classList.remove("is-pinned");
          fold?.classList.remove("is-folding");
          resetHero();
        });
      }

      // Scroll reveal: individual blocks.
      const reveals = Array.from(
        root.querySelectorAll<HTMLElement>(".section-reveal"),
      );
      if (reveals.length) {
        utils.set(reveals, { opacity: 0, translateY: 24 });
        reveals.forEach((el) => {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  animate(el, {
                    opacity: [0, 1],
                    translateY: [24, 0],
                    duration: 650,
                    ease: "outQuad",
                  });
                  io.disconnect();
                }
              });
            },
            { threshold: 0.12 },
          );
          io.observe(el);
          observers.push(io);
        });
      }

      // Scroll reveal: staggered card groups (per container).
      const staggerReveal = (selector: string) => {
        const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
        if (!els.length) return;

        const groups = new Map<Element, HTMLElement[]>();
        els.forEach((el) => {
          const parent = el.parentElement;
          if (!parent) return;
          const list = groups.get(parent) ?? [];
          list.push(el);
          groups.set(parent, list);
        });

        groups.forEach((cards, parent) => {
          utils.set(cards, { opacity: 0, translateY: 20 });
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  animate(cards, {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    ease: "outQuad",
                    delay: stagger(80),
                  });
                  io.disconnect();
                }
              });
            },
            { threshold: 0.15 },
          );
          io.observe(parent);
          observers.push(io);
        });
      };

      staggerReveal(".reveal-card");

      return () => {
        observers.forEach((io) => io.disconnect());
        cleanups.forEach((fn) => fn());
      };
    });

    return () => {
      observers.forEach((io) => io.disconnect());
      cleanups.forEach((fn) => fn());
      scope.current?.revert();
    };
  }, [rootRef]);

  return null;
}
