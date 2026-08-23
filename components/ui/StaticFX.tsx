"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

export default function StaticFX() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWaypoint = () => {
      if (reducedRef.current) return;
      el.classList.remove("burst");
      void el.offsetWidth;
      el.classList.add("burst");
    };
    window.addEventListener("ascent-waypoint", onWaypoint);
    return () => window.removeEventListener("ascent-waypoint", onWaypoint);
  }, []);

  return <div id="staticfx" ref={ref} aria-hidden />;
}
