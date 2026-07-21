"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import {
  DEMO_TOUR_RESTART_EVENT,
  DEMO_TOUR_STORAGE_KEY,
} from "@/components/demo/demoTourEvents";

type TourStep = {
  route: string;
  element: string;
  fallbackElement?: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

const TOUR_STEPS: TourStep[] = [
  {
    route: "/dashboard",
    element: '[data-tour="demo-stats"]',
    title: "Your pipeline at a glance",
    description:
      "Stat cards summarize saved, applied, interview, and offer counts from your board.",
    side: "bottom",
    align: "start",
  },
  {
    route: "/tracker",
    element: '[data-tour="demo-nav-tracker"]',
    title: "Applications board",
    description:
      "Use the sidebar to open your Kanban board and move roles across stages.",
    side: "right",
    align: "start",
  },
  {
    route: "/tracker",
    element: '[data-tour="demo-kanban"]',
    title: "Drag applications across stages",
    description:
      "Open any card for details, notes, deadlines, and contacts. Try moving a few — nothing persists after you leave.",
    side: "top",
    align: "center",
  },
  {
    route: "/interview-prep",
    element: '[data-tour="demo-nav-interview-prep"]',
    title: "Interview Prep",
    description:
      "Company snapshots and interview briefs live here — pre-filled in the demo so you can explore without generating.",
    side: "right",
    align: "start",
  },
  {
    route: "/interview-prep",
    element: '[data-tour="demo-prep-row"]',
    fallbackElement: '[data-tour="demo-prep-hub"]',
    title: "Sample snapshots & briefs",
    description:
      "Open a ready row to read a company snapshot or interview brief. Generating new research is disabled in the demo.",
    side: "top",
    align: "start",
  },
  {
    route: "/dashboard",
    element: '[data-tour="demo-signup"]',
    title: "Ready to track for real?",
    description:
      "Create an account to keep your own pipeline. Demo changes are wiped when you leave.",
    side: "bottom",
    align: "end",
  },
];

function waitForSelector(selector: string, timeoutMs = 8000) {
  return new Promise<Element | null>((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeoutMs);
  });
}

function waitForPathname(route: string, timeoutMs = 8000) {
  return new Promise<void>((resolve) => {
    if (window.location.pathname === route) {
      resolve();
      return;
    }

    const started = Date.now();
    const id = window.setInterval(() => {
      if (
        window.location.pathname === route ||
        Date.now() - started > timeoutMs
      ) {
        window.clearInterval(id);
        resolve();
      }
    }, 50);
  });
}

export function DemoTour() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);
  const advancingRef = useRef(false);
  const activeRef = useRef(false);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.isDemo) return;

    let cancelled = false;

    const markComplete = () => {
      try {
        localStorage.setItem(DEMO_TOUR_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    };

    const destroyDriver = () => {
      try {
        driverRef.current?.destroy();
      } catch {
        // ignore
      }
      driverRef.current = null;
    };

    const showStep = async (index: number) => {
      if (cancelled) return;
      if (advancingRef.current) return;
      advancingRef.current = true;
      activeRef.current = true;

      try {
        destroyDriver();

        const step = TOUR_STEPS[index];
        if (!step) {
          markComplete();
          activeRef.current = false;
          return;
        }

        // Avoid a redundant soft-nav (it re-runs the auth proxy and can drop
        // the demo session). Only navigate when the route actually changes.
        if (pathnameRef.current !== step.route) {
          router.push(step.route);
          await waitForPathname(step.route);
        }

        if (cancelled) return;

        const primary = await waitForSelector(step.element, 8000);
        let elementSelector = step.element;
        if (!primary && step.fallbackElement) {
          const fallback = await waitForSelector(step.fallbackElement, 4000);
          if (fallback) elementSelector = step.fallbackElement;
        }

        await new Promise((r) => window.setTimeout(r, 300));
        if (cancelled) return;

        // If soft-nav was bounced to login, stop the tour instead of painting
        // a popover over the auth page.
        if (window.location.pathname === "/login") {
          destroyDriver();
          activeRef.current = false;
          return;
        }

        const isFirst = index === 0;
        const isLast = index === TOUR_STEPS.length - 1;
        const total = TOUR_STEPS.length;

        const d = driver({
          overlayOpacity: 0.55,
          allowClose: true,
          stagePadding: 8,
          animate: true,
          steps: [
            {
              element: elementSelector,
              popover: {
                title: `${step.title} (${index + 1}/${total})`,
                description: step.description,
                side: step.side,
                align: step.align,
                showButtons: isFirst
                  ? ["next", "close"]
                  : isLast
                    ? ["previous", "close"]
                    : ["next", "previous", "close"],
                nextBtnText: isLast ? "Done" : "Next",
                onNextClick: () => {
                  if (isLast) {
                    markComplete();
                    destroyDriver();
                    activeRef.current = false;
                    return;
                  }
                  advancingRef.current = false;
                  void showStep(index + 1);
                },
                onPrevClick: () => {
                  if (isFirst) return;
                  advancingRef.current = false;
                  void showStep(index - 1);
                },
                onCloseClick: () => {
                  markComplete();
                  destroyDriver();
                  activeRef.current = false;
                },
              },
            },
          ],
        });

        driverRef.current = d;
        d.drive();
      } finally {
        advancingRef.current = false;
      }
    };

    const maybeAutoStart = () => {
      try {
        if (localStorage.getItem(DEMO_TOUR_STORAGE_KEY) === "1") return;
      } catch {
        // ignore
      }
      if (activeRef.current) return;
      void showStep(0);
    };

    const onRestart = () => {
      try {
        localStorage.removeItem(DEMO_TOUR_STORAGE_KEY);
      } catch {
        // ignore
      }
      destroyDriver();
      activeRef.current = false;
      advancingRef.current = false;
      void showStep(0);
    };

    const timer = window.setTimeout(maybeAutoStart, 500);
    window.addEventListener(DEMO_TOUR_RESTART_EVENT, onRestart);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener(DEMO_TOUR_RESTART_EVENT, onRestart);
      destroyDriver();
      activeRef.current = false;
    };
  }, [status, session?.user?.isDemo, router]);

  return null;
}
