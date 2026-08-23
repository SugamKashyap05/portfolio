"use client";

import { useEffect, useRef } from "react";
import { ascentStore } from "@/lib/ascent";

const GLYPHS = "#/\\<>[]{}*+-_";
const TEXT = "MISSION COMPLETE · SIGNAL ESTABLISHED";

export default function MissionStamp() {
  const ref = useRef<HTMLDivElement>(null);
  const shownRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let iv: ReturnType<typeof setInterval> | null = null;
    const reveal = () => {
      shownRef.current = true;
      el.classList.add("on");
      if (reduced) {
        el.textContent = TEXT;
        return;
      }
      let i = 0;
      iv = setInterval(() => {
        i++;
        let out = "";
        for (let j = 0; j < TEXT.length; j++) {
          out += j < i ? TEXT[j] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (i >= TEXT.length && iv !== null) {
          clearInterval(iv);
          iv = null;
        }
      }, 26);
    };
    let unsub: (() => void) | null = null;
    if (ascentStore.get().progress >= 0.97) {
      reveal();
    } else {
      unsub = ascentStore.subscribe((s) => {
        if (!shownRef.current && s.progress >= 0.97) reveal();
      });
    }
    return () => {
      if (iv !== null) clearInterval(iv);
      if (unsub) unsub();
    };
  }, []);

  return (
    <div id="mission-stamp" ref={ref} role="status" aria-live="polite">
      MISSION COMPLETE · SIGNAL ESTABLISHED
    </div>
  );
}
