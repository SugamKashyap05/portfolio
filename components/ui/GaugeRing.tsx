"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks";

const easeOutBack = (t: number) => {
  const c = 1.35;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export default function GaugeRing({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const ndlRef = useRef<SVGGElement>(null);
  const numRef = useRef<SVGTextElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const v = Math.min(100, Math.max(0, value));

  const ticks = useMemo(() => {
    const out: Array<{
      x1: number; y1: number; x2: number; y2: number; major: boolean;
    }> = [];
    for (let i = 0; i <= 40; i++) {
      const ang = (-225 + i * 6.75) * (Math.PI / 180);
      const major = i % 5 === 0;
      const r1 = 59.5;
      const r2 = major ? 50 : 55;
      out.push({
        x1: 70 + Math.cos(ang) * r1,
        y1: 70 + Math.sin(ang) * r1,
        x2: 70 + Math.cos(ang) * r2,
        y2: 70 + Math.sin(ang) * r2,
        major,
      });
    }
    return out;
  }, []);

  useEffect(() => {
    if (!inView || !arcRef.current || !ndlRef.current || !numRef.current) return;
    if (reduced) {
      arcRef.current.setAttribute("stroke-dasharray", `${v} 100`);
      ndlRef.current.setAttribute(
        "transform",
        `rotate(${-135 + (270 * v) / 100} 70 70)`
      );
      numRef.current.textContent = String(Math.round(v));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1500;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = easeOutBack(t);
      const vv = v * e;
      arcRef.current!.setAttribute(
        "stroke-dasharray",
        `${Math.min(100, vv).toFixed(2)} 100`
      );
      ndlRef.current!.setAttribute(
        "transform",
        `rotate(${((-135 + (270 * vv) / 100)).toFixed(2)} 70 70)`
      );
      numRef.current!.textContent = String(Math.round(Math.min(100, vv)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, v]);

  return (
    <figure className="gauge" ref={wrapRef as React.RefObject<HTMLElement>}>
      <svg viewBox="0 0 140 140" role="img" aria-label={`${label}: ${value} percent`}>
        <defs>
          <radialGradient id={uid} cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#152238" />
            <stop offset="1" stopColor="#070d1b" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="66" fill={`url(#${uid})`} stroke="rgba(148,186,255,.25)" />
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1.toFixed(2)}
            y1={t.y1.toFixed(2)}
            x2={t.x2.toFixed(2)}
            y2={t.y2.toFixed(2)}
            stroke={t.major ? "rgba(255,180,84,.9)" : "rgba(150,182,225,.35)"}
            strokeWidth={t.major ? 1.7 : 1}
          />
        ))}
        <circle
          className="g-track"
          cx="70"
          cy="70"
          r="54"
          pathLength={100}
          transform="rotate(135 70 70)"
        />
        <circle
          className="g-arc"
          ref={arcRef}
          cx="70"
          cy="70"
          r="54"
          pathLength={100}
          transform="rotate(135 70 70)"
          strokeDasharray="0 100"
        />
        <g className="g-ndl" ref={ndlRef} transform="rotate(-135 70 70)">
          <line x1="70" y1="70" x2="70" y2="27" />
          <circle className="g-hub" cx="70" cy="70" r="4" />
        </g>
        <text className="g-num" x="70" y="80" textAnchor="middle" ref={numRef}>
          0
        </text>
        <text className="g-unit" x="70" y="94" textAnchor="middle">
          %
        </text>
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
