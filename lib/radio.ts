"use client";

import { ascentStore } from "@/lib/ascent";

export type RadioPhase = "standby" | "live" | "muted";

export const RADIO_PHASE_EVENT = "ascent-radio-phase";

const STORE_KEY = "ascent-radio";

let ac: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let hissGain: GainNode | null = null;
let lastBurst = 0;

let humGain: GainNode | null = null;
let humFilter: BiquadFilterNode | null = null;
let humStarted = false;
let autostartInstalled = false;

let phase: RadioPhase = "standby";

function ensure(): boolean {
  if (ac) return true;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(ac.destination);
    const len = ac.sampleRate;
    noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  } catch {
    ac = null;
    return false;
  }
}

function readPersisted(): RadioPhase {
  try {
    return window.sessionStorage.getItem(STORE_KEY) === "muted"
      ? "muted"
      : "live";
  } catch {
    return "live";
  }
}

function writePersisted(p: RadioPhase) {
  try {
    window.sessionStorage.setItem(STORE_KEY, p);
  } catch {
    return;
  }
}

function notify() {
  try {
    window.dispatchEvent(new CustomEvent(RADIO_PHASE_EVENT, { detail: phase }));
  } catch {
    return;
  }
}

function velTarget(vsAbs: number): number {
  const k = Math.min(1, vsAbs / 400);
  return 0.035 + k * (0.14 - 0.035);
}

function cutoffFor(vsAbs: number): number {
  const k = Math.min(1, vsAbs / 400);
  return 120 + k * (260 - 120);
}

function onAscentUpdate() {
  if (!ac || !humGain || !humFilter || !humStarted) return;
  const vsAbs = Math.abs(ascentStore.get().vs);
  const t = ac.currentTime;
  const target = phase === "live" ? velTarget(vsAbs) : 0;
  humGain.gain.setTargetAtTime(target, t, 0.25);
  humFilter.frequency.setTargetAtTime(cutoffFor(vsAbs), t, 0.25);
}

function startHiss() {
  if (!ac || !noiseBuf || !master || hissGain) return;
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 700;
  hissGain = ac.createGain();
  hissGain.gain.value = 0;
  src.connect(lp);
  lp.connect(hissGain);
  hissGain.connect(master);
  src.start();
}

function startHum() {
  if (!ac || !master || !noiseBuf || humStarted) return;
  try {
    const o1 = ac.createOscillator();
    o1.type = "sawtooth";
    o1.frequency.value = 42;
    const o2 = ac.createOscillator();
    o2.type = "sawtooth";
    o2.frequency.value = 43.3;
    humFilter = ac.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.value = 140;
    humFilter.Q.value = 0.7;
    humGain = ac.createGain();
    humGain.gain.value = 0;
    o1.connect(humFilter);
    o2.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(master);
    const nsrc = ac.createBufferSource();
    nsrc.buffer = noiseBuf;
    nsrc.loop = true;
    const nbp = ac.createBiquadFilter();
    nbp.type = "bandpass";
    nbp.frequency.value = 90;
    nbp.Q.value = 0.9;
    const ng = ac.createGain();
    ng.gain.value = 0.05;
    nsrc.connect(nbp);
    nbp.connect(ng);
    ng.connect(humGain);
    o1.start();
    o2.start();
    nsrc.start();
    humStarted = true;
    ascentStore.subscribe(onAscentUpdate);
  } catch {
    humStarted = false;
  }
}

function applyGains() {
  if (!ac) return;
  const t = ac.currentTime;
  const vsAbs = Math.abs(ascentStore.get().vs);
  if (humGain && humStarted) {
    const g = humGain.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(Math.max(g.value, 0.0001), t);
    if (phase === "live") {
      g.setTargetAtTime(velTarget(vsAbs), t, 0.6);
    } else {
      g.setTargetAtTime(0, t, 0.12);
    }
  }
  if (hissGain) {
    hissGain.gain.setTargetAtTime(phase === "live" ? 0.015 : 0, t, 0.15);
  }
}

export function initAmbientAudio() {
  if (phase !== "standby") return;
  phase = readPersisted();
  if (!ensure()) return;
  if (ac!.state === "suspended") void ac!.resume();
  startHiss();
  startHum();
  applyGains();
  notify();
}

export function installAmbientAutostart(): () => void {
  if (typeof window === "undefined" || autostartInstalled) return () => {};
  autostartInstalled = true;
  const events: (keyof WindowEventMap)[] = [
    "pointerdown",
    "keydown",
    "wheel",
    "touchmove",
  ];
  const opts: AddEventListenerOptions = { once: true, passive: true };
  const handler = (e: Event) => {
    const el = e.target as Element | null;
    if (el && typeof el.closest === "function" && el.closest("#radiobtn")) {
      return;
    }
    events.forEach((n) => window.removeEventListener(n, handler));
    initAmbientAudio();
  };
  events.forEach((n) => window.addEventListener(n, handler, opts));
  return () => {
    events.forEach((n) => window.removeEventListener(n, handler));
    autostartInstalled = false;
  };
}

export function radioBurst() {
  if (phase !== "live" || !ac || !noiseBuf || !master) return;
  const now = performance.now();
  if (now - lastBurst < 260) return;
  lastBurst = now;
  const t = ac.currentTime;

  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.8;
  bp.frequency.setValueAtTime(1600, t);
  bp.frequency.exponentialRampToValueAtTime(240, t + 0.38);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.32, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + 0.45);

  pip(t + 0.13);
  pip(t + 0.21);

  function pip(at: number) {
    if (!ac || !master) return;
    const o = ac.createOscillator();
    o.type = "square";
    o.frequency.value = 1240;
    const og = ac.createGain();
    og.gain.setValueAtTime(0.0001, at);
    og.gain.linearRampToValueAtTime(0.05, at + 0.008);
    og.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    o.connect(og);
    og.connect(master);
    o.start(at);
    o.stop(at + 0.06);
  }
}

export function radioToggle(): { enabled: boolean; failed: boolean } {
  if (!ensure()) return { enabled: false, failed: true };
  if (ac!.state === "suspended") void ac!.resume();
  if (phase === "standby") {
    phase = "live";
    startHiss();
    startHum();
  } else {
    phase = phase === "live" ? "muted" : "live";
  }
  writePersisted(phase);
  applyGains();
  notify();
  return { enabled: phase === "live", failed: false };
}

export function isRadioEnabled() {
  return phase === "live";
}

export function getRadioPhase(): RadioPhase {
  return phase;
}
