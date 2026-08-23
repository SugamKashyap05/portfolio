"use client";

import { MAX_ALT, isa, phaseAt } from "@/lib/atmosphere";

export type AscentState = {
  progress: number;
  alt: number;
  hPa: number;
  tempC: number;
  vs: number;
  phase: string;
};

const initial: AscentState = {
  progress: 0,
  alt: 0,
  hPa: 1013.25,
  tempC: 15,
  vs: 0,
  phase: "PRE-LAUNCH",
};

let state: AscentState = initial;

type Listener = (s: AscentState) => void;
const listeners = new Set<Listener>();

export const ascentStore = {
  get(): AscentState {
    return state;
  },
  set(patch: Partial<AscentState>) {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export function computeAscent(scrollY: number, scrollMax: number): AscentState {
  const progress = scrollMax > 0 ? Math.min(1, Math.max(0, scrollY / scrollMax)) : 0;
  const alt = progress * MAX_ALT;
  const { hPa, tempC } = isa(alt);
  return { progress, alt, hPa, tempC, vs: state.vs, phase: phaseAt(alt) };
}

export const WAYPOINT_EVENT = "ascent-waypoint";

export function dispatchWaypoint(index: number, direction: 1 | -1) {
  window.dispatchEvent(
    new CustomEvent(WAYPOINT_EVENT, { detail: { index, direction } })
  );
}

export function centerFrac(el: HTMLElement, vh: number, scrollMax: number): number {
  const r = el.getBoundingClientRect();
  const center = r.top + window.scrollY + r.height / 2;
  return Math.min(0.985, Math.max(0.015, (center - vh * 0.55) / Math.max(1, scrollMax)));
}
