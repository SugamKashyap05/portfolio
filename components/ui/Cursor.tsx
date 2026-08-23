"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

export default function Cursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setActive(true);
    const root = document.documentElement;
    root.classList.add("custom-cursor-active");
    return () => {
      root.classList.remove("custom-cursor-active");
      setActive(false);
    };
  }, [reduced]);

  useEffect(() => {
    if (!active) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let dx = mx;
    let dy = my;
    let hot = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target;
      const hit =
        t instanceof Element &&
        typeof t.closest === "function" &&
        t.closest("a,button") !== null;
      if (hit !== hot) {
        hot = hit;
        ring.classList.toggle("hot", hit);
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dx += (mx - dx) * 0.6;
      dy += (my - dy) * 0.6;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
      dot.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div className="reticle-root" aria-hidden>
      <div className="reticle-ring" ref={ringRef}>
        <span />
      </div>
      <div className="reticle-dot" ref={dotRef} />
    </div>
  );
}
