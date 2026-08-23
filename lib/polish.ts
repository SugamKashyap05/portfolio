"use client";

import { useEffect } from "react";
import { scrambleText } from "@/lib/scramble";
import { peekSmoothScroll } from "@/lib/scroll-bus";

export const WAYPOINT_NAV_EVENT = "waypoint-nav";

export type NavDetail = { label: string; alt: string; dir: 1 | -1 };

function motionReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function useMagneticButtons() {
  useEffect(() => {
    if (motionReduced() || !finePointer()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".btn"));
    if (!els.length) return;
    const cur = els.map(() => ({ x: 0, y: 0 }));
    let mx = -9999;
    let my = -9999;
    let raf = 0;

    const frame = () => {
      raf = 0;
      let live = false;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - cur[i].x;
        const cy = r.top + r.height / 2 - cur[i].y;
        const ex = Math.max(r.left - mx, 0, mx - r.right);
        const ey = Math.max(r.top - my, 0, my - r.bottom);
        const dist = Math.hypot(ex, ey);
        let tx = 0;
        let ty = 0;
        if (dist < 60) {
          const vx = mx - cx;
          const vy = my - cy;
          const len = Math.hypot(vx, vy) || 1;
          const mag = 6 * (1 - dist / 60);
          tx = (vx / len) * mag;
          ty = (vy / len) * mag;
        }
        cur[i].x += (tx - cur[i].x) * 0.25;
        cur[i].y += (ty - cur[i].y) * 0.25;
        if (Math.abs(cur[i].x) > 0.05 || Math.abs(cur[i].y) > 0.05) {
          el.style.transform = `translate3d(${cur[i].x.toFixed(2)}px, ${cur[i].y.toFixed(2)}px, 0)`;
          live = true;
        } else if (el.style.transform) {
          cur[i].x = 0;
          cur[i].y = 0;
          el.style.transform = "";
        }
      });
      if (live) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      kick();
    };
    const release = () => {
      mx = -9999;
      my = -9999;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", release, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", release);
      document.documentElement.removeEventListener("pointerleave", release);
      els.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, []);
}

export function useScrambleLogHeadings() {
  useEffect(() => {
    if (motionReduced()) return;
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>(".log h2")
    );
    if (!heads.length) return;
    const cancels = new Map<HTMLElement, () => void>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          io.unobserve(en.target);
          const h = en.target as HTMLElement;
          cancels.get(h)?.();
          cancels.set(h, scrambleText(h, h.textContent ?? "", 600));
        }
      },
      { threshold: 0.5 }
    );
    heads.forEach((h) => io.observe(h));
    return () => {
      io.disconnect();
      cancels.forEach((cancel) => cancel());
      cancels.clear();
    };
  }, []);
}

export function useWaypointKeys() {
  useEffect(() => {
    const reduced = motionReduced();
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const ae = document.activeElement;
      const tag = (ae?.tagName ?? "").toUpperCase();
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (ae instanceof HTMLElement && ae.isContentEditable)
      )
        return;
      let dir: 1 | -1 = 1;
      if (e.key === "j" || e.key === "J") dir = 1;
      else if (e.key === "k" || e.key === "K") dir = -1;
      else return;
      e.preventDefault();

      const wps = Array.from(
        document.querySelectorAll<HTMLElement>("[data-waypoint]")
      );
      if (!wps.length) return;
      const tops = wps.map(
        (el) => el.getBoundingClientRect().top + window.scrollY
      );
      const mid = window.scrollY + window.innerHeight * 0.5;
      let idx = 0;
      tops.forEach((t, i) => {
        if (t <= mid) idx = i;
      });
      const nextIdx = Math.min(wps.length - 1, Math.max(0, idx + dir));
      const tgt = wps[nextIdx];
      const lenis = peekSmoothScroll() as {
        scrollTo(target: Element, options?: { offset?: number }): void;
      } | null;
      if (lenis) {
        lenis.scrollTo(tgt, {
          offset: -(window.innerHeight - tgt.offsetHeight) / 2,
        });
      } else {
        tgt.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "center",
        });
      }
      window.dispatchEvent(
        new CustomEvent<NavDetail>(WAYPOINT_NAV_EVENT, {
          detail: {
            label: (tgt.dataset.label ?? "").toUpperCase(),
            alt: tgt.dataset.alt ?? "",
            dir,
          },
        })
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
