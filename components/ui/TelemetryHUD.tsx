"use client";

import { useEffect, useRef } from "react";
import { ascentStore } from "@/lib/ascent";
import { fmtAlt, fmtPressure } from "@/lib/atmosphere";
import { scrambleText } from "@/lib/scramble";
import { WAYPOINT_NAV_EVENT, NavDetail } from "@/lib/polish";

export default function TelemetryHUD() {
  const altRef = useRef<HTMLSpanElement>(null);
  const altuRef = useRef<HTMLSpanElement>(null);
  const prsRef = useRef<HTMLSpanElement>(null);
  const tmpRef = useRef<HTMLSpanElement>(null);
  const vsRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cache: Record<string, string> = {};
    const put = (k: string, v: string) => {
      if (cache[k] !== v) {
        cache[k] = v;
        return true;
      }
      return false;
    };

    const unsub = ascentStore.subscribe((s) => {
      const [av, au] = fmtAlt(s.alt);
      if (put("a", av + au) && altRef.current && altuRef.current) {
        altRef.current.textContent = av;
        altuRef.current.textContent = au;
      }
      const pv = fmtPressure(s.hPa);
      if (put("p", pv) && prsRef.current) prsRef.current.textContent = pv;
      const tv = s.tempC.toFixed(1);
      if (put("t", tv) && tmpRef.current) tmpRef.current.textContent = tv;
      const vv =
        (s.vs >= 0 ? "+" : "") + String(Math.round(Math.max(-600, Math.min(600, s.vs))));
      if (put("v", vv) && vsRef.current) vsRef.current.textContent = vv;
      if (put("ph", s.phase) && phaseRef.current) {
        phaseRef.current.textContent = s.phase;
      }
    });

    let phaseCancel: (() => void) | null = null;
    const onWaypoint = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const phase = ascentStore.get().phase;
      if (phaseRef.current) {
        phaseCancel?.();
        phaseCancel = scrambleText(phaseRef.current, phase, 600);
      }
    };
    window.addEventListener("ascent-waypoint", onWaypoint);

    let navTimer: ReturnType<typeof setTimeout> | null = null;
    const onNav = (e: Event) => {
      const d = (e as CustomEvent<NavDetail>).detail;
      if (navRef.current) {
        navRef.current.textContent = `${d.dir > 0 ? "NEXT" : "PREV"} ▸ ${d.label} · ALT ${d.alt}`;
        navRef.current.classList.add("on");
      }
      if (navTimer) clearTimeout(navTimer);
      navTimer = setTimeout(() => {
        navRef.current?.classList.remove("on");
      }, 900);
    };
    window.addEventListener(WAYPOINT_NAV_EVENT, onNav);

    return () => {
      unsub();
      window.removeEventListener("ascent-waypoint", onWaypoint);
      window.removeEventListener(WAYPOINT_NAV_EVENT, onNav);
      if (navTimer) clearTimeout(navTimer);
      phaseCancel?.();
    };
  }, []);

  return (
    <section id="hud" aria-label="Live flight telemetry">
      <div className="hud-top">
        <span className="updot" aria-hidden />
        TELEMETRY · UPLINK OK
      </div>
      <div className="t-row t-main">
        <span className="t-key">ALT</span>
        <span className="t-val t-big">
          <span ref={altRef}>0</span>
          <span className="u" ref={altuRef}>
            M
          </span>
        </span>
      </div>
      <div className="t-row">
        <span className="t-key">PRS</span>
        <span className="t-val">
          <span ref={prsRef}>1013.25</span> <span className="u">hPa</span>
        </span>
      </div>
      <div className="t-row">
        <span className="t-key">TMP</span>
        <span className="t-val">
          <span ref={tmpRef}>15.0</span> <span className="u">°C</span>
        </span>
      </div>
      <div className="t-row t-hide-sm">
        <span className="t-key">V/S</span>
        <span className="t-val">
          <span ref={vsRef}>+0</span> <span className="u">m/s</span>
        </span>
      </div>
      <div className="phase-chip" ref={phaseRef}>
        PRE-LAUNCH
      </div>
      <div className="nav-chip" ref={navRef} aria-hidden />
    </section>
  );
}
