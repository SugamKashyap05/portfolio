"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/hooks";
import { registerSmoothScroll } from "@/lib/scroll-bus";

export default function SmoothScroll({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    registerSmoothScroll(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      registerSmoothScroll(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
