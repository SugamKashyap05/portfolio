export const EASE_CINEMA = [0.16, 1, 0.3, 1] as const;

export const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_CINEMA },
  },
} as const;

export const revealStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
} as const;

export const maskWipe = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.1, ease: EASE_CINEMA },
  },
} as const;

export const viewportOnce = { once: true, margin: "-15% 0px" } as const;
