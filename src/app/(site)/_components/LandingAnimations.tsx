"use client";

import { useLayoutEffect, type RefObject } from "react";
import { animate, createTimeline, stagger } from "animejs";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smoothstep = (n: number) => n * n * (3 - 2 * n);

/** Run landing motion from the same component that owns `rootRef` (ref is set). */
export function useLandingAnimations(
  rootRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      root.dataset.anim = "reduced";
      return;
    }

    root.dataset.anim = "on";

    const observers: IntersectionObserver[] = [];
    const cleanups: Array<() => void> = [];
    const animations: Array<{ pause: () => void; revert?: () => void }> = [];

    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const qq = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    const heroBadge = q<HTMLElement>(".hero-badge");
    const heroTitle = q<HTMLElement>(".hero-title");
    const heroCopy = q<HTMLElement>(".hero-copy");
    const heroCta = q<HTMLElement>(".hero-cta");
    const heroVisual = q<HTMLElement>(".hero-visual");
    const dashboardCards = qq<HTMLElement>(".dashboard-card");
    const floatingAccents = qq<HTMLElement>(".floating-accent");

    const tl = createTimeline({
      defaults: { ease: "outQuad", duration: 650 },
    });
    animations.push(tl);

    if (heroBadge) tl.add(heroBadge, { opacity: [0, 1], translateY: [12, 0] });
    if (heroTitle)
      tl.add(heroTitle, { opacity: [0, 1], translateY: [16, 0] }, "-=420");
    if (heroCopy)
      tl.add(heroCopy, { opacity: [0, 1], translateY: [14, 0] }, "-=480");
    if (heroCta)
      tl.add(heroCta, { opacity: [0, 1], scale: [0.96, 1] }, "-=420");
    if (heroVisual)
      tl.add(
        heroVisual,
        {
          opacity: [0, 1],
          scale: [0.96, 1],
          translateY: [20, 0],
          duration: 800,
        },
        "-=380",
      );
    if (dashboardCards.length)
      tl.add(
        dashboardCards,
        { opacity: [0, 1], translateY: [16, 0], delay: stagger(60) },
        "-=320",
      );

    if (floatingAccents.length) {
      animations.push(
        animate(floatingAccents, {
          translateY: [0, -8],
          rotate: [0, 1.5],
          loop: true,
          alternate: true,
          duration: 3200,
          ease: "inOutSine",
          delay: stagger(400),
        }),
      );
    }

    const heroZone = q<HTMLElement>(".hero-zone");
    const darkStage = q<HTMLElement>(".hero-dark-stage");
    const scene = q<HTMLElement>(".hero-scene");
    const sceneDark = q<HTMLElement>(".hero-scene-dark");
    const copyBlock = q<HTMLElement>(".hero-copy-block");
    const fold = q<HTMLElement>(".site-fold");

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

        const rise = smoothstep(clamp01(p / A_END));
        const y = (0.42 - rise * 0.5) * vh;
        const t = `translateY(${y.toFixed(1)}px) scale(${(0.98 + rise * 0.02).toFixed(4)})`;
        if (scene) scene.style.transform = t;
        if (sceneDark) sceneDark.style.transform = t;

        if (copyBlock) {
          copyBlock.style.transform = `translateY(${(p * 40).toFixed(1)}px)`;
        }

        const wipe = smoothstep(clamp01((p - A_END) / (B_END - A_END)));
        if (darkStage) {
          darkStage.style.clipPath = `inset(${((1 - wipe) * 100).toFixed(2)}% 0 0 0)`;
        }

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

    const reveals = qq<HTMLElement>(".section-reveal");
    if (reveals.length) {
      reveals.forEach((el) => {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              el.dataset.revealed = "true";
              animations.push(
                animate(el, {
                  opacity: [0, 1],
                  translateY: [24, 0],
                  duration: 650,
                  ease: "outQuad",
                }),
              );
              io.disconnect();
            });
          },
          { threshold: 0.12 },
        );
        io.observe(el);
        observers.push(io);
      });
    }

    const staggerEls = qq<HTMLElement>(".reveal-card");
    if (staggerEls.length) {
      const groups = new Map<Element, HTMLElement[]>();
      staggerEls.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const list = groups.get(parent) ?? [];
        list.push(el);
        groups.set(parent, list);
      });

      groups.forEach((cards, parent) => {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              cards.forEach((c) => {
                c.dataset.revealed = "true";
              });
              animations.push(
                animate(cards, {
                  opacity: [0, 1],
                  translateY: [20, 0],
                  duration: 600,
                  ease: "outQuad",
                  delay: stagger(80),
                }),
              );
              io.disconnect();
            });
          },
          { threshold: 0.15 },
        );
        io.observe(parent);
        observers.push(io);
      });
    }

    return () => {
      observers.forEach((io) => io.disconnect());
      cleanups.forEach((fn) => fn());
      animations.forEach((a) => {
        a.pause();
        a.revert?.();
      });
      root.dataset.anim = "pending";
      root
        .querySelectorAll<HTMLElement>("[data-revealed]")
        .forEach((el) => delete el.dataset.revealed);
    };
  }, [rootRef]);
}
