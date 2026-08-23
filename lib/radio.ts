"use client";

let ac: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let hissGain: GainNode | null = null;
let lastBurst = 0;
let enabled = false;

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

export function radioBurst() {
  if (!enabled || !ac || !noiseBuf || !master) return;
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
  enabled = !enabled;
  if (enabled) {
    startHiss();
    hissGain?.gain.setTargetAtTime(0.015, ac!.currentTime, 0.15);
  } else {
    hissGain?.gain.setTargetAtTime(0, ac!.currentTime, 0.1);
  }
  return { enabled, failed: false };
}

export function isRadioEnabled() {
  return enabled;
}
