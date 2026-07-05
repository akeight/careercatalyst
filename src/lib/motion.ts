import type { Transition, Variants } from "motion/react";

// Intercom-inspired easing curve for smooth, premium transitions.
export const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Shared spring used for interactive/step transitions.
export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
};

// Fade + rise, used for section/card reveals.
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeCurve },
  },
};

// Fade only, for subtle elements.
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: easeCurve } },
};

// Parent container that staggers its children's reveals.
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Directional slide + fade for wizard steps. direction: 1 = forward, -1 = back.
export const stepVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easeCurve },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.3, ease: easeCurve },
  }),
};

// Standard hover/tap feedback for buttons and interactive cards.
export const hoverTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};
