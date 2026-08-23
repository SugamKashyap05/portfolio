"use client";

import { useEffect, useRef } from "react";
import {
  MAX_ALT,
  clamp,
  lerp,
  rgbStr,
  skyAt,
} from "@/lib/atmosphere";
import { ascentStore, computeAscent, centerFrac, dispatchWaypoint } from "@/lib/ascent";
import { useReducedMotion } from "@/lib/hooks";

const CLOUD_K = 0.34;
const CLOUD_SPAN = 16700;

type Star = {
  x: number; y: number; r: number; sp: number; ph: number; c: string;
};
type Cloud = {
  x: number; alt: number; w: number; h: number; a: number; spd: number; ph: number;
};
type FogStrip = {
  yo: number; h: number; a: number; sp: number; ph: number;
};

const CB_ALT = 11700;

function makeRibbonSprite(core: string, tail: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 220;
  c.height = 520;
  const g = c.getContext("2d")!;
  const v = g.createLinearGradient(0, 0, 0, 520);
  v.addColorStop(0, `${core}00`);
  v.addColorStop(0.22, `${core}8c`);
  v.addColorStop(0.48, `${core}b4`);
  v.addColorStop(0.74, `${tail}59`);
  v.addColorStop(1, `${tail}00`);
  g.fillStyle = v;
  g.fillRect(0, 0, 220, 520);
  const m = g.createLinearGradient(0, 0, 220, 0);
  m.addColorStop(0, "rgba(0,0,0,0)");
  m.addColorStop(0.5, "rgba(0,0,0,1)");
  m.addColorStop(1, "rgba(0,0,0,0)");
  g.globalCompositeOperation = "destination-in";
  g.fillStyle = m;
  g.fillRect(0, 0, 220, 520);
  return c;
}

function makeBloomSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  const rg = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  rg.addColorStop(0, "rgba(255,246,228,0.92)");
  rg.addColorStop(0.32, "rgba(255,214,158,0.42)");
  rg.addColorStop(0.62, "rgba(255,178,110,0.12)");
  rg.addColorStop(1, "rgba(255,170,100,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 256, 256);
  return c;
}

function makeCloudSprite(tint: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 300;
  c.height = 170;
  const g = c.getContext("2d")!;
  const blobs: Array<{ x: number; y: number; r: number }> = [];
  for (let i = 0; i < 9; i++) {
    blobs.push({
      x: 40 + Math.random() * 220,
      y: 105 - Math.random() * 45,
      r: 26 + Math.random() * 36,
    });
  }
  blobs.push({ x: 150, y: 118, r: 80 });
  for (const b of blobs) {
    const rg = g.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
    rg.addColorStop(0, `${tint}52`);
    rg.addColorStop(1, `${tint}00`);
    g.fillStyle = rg;
    g.beginPath();
    g.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let scrollMax = 1;
    let fracs: number[] = [];
    let waypointEls: HTMLElement[] = [];
    let lastWi = -2;
    let vel = 0;
    let lastSy = window.scrollY;
    let prevT = performance.now();
    let raf = 0;
    let titleTick = 0;
    let prevAlt = 0;
    let cbT = -10;
    let shakeT0 = -10;

    const swayCur = { x: 0, y: 0 };
    const swayTgt = { x: 0, y: 0 };

    const stars: Star[] = Array.from({ length: 230 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.3,
      sp: 0.5 + Math.random() * 2,
      ph: Math.random() * 6.283,
      c:
        Math.random() < 0.12
          ? "#bcd9ff"
          : Math.random() < 0.1
            ? "#ffe3c0"
            : "#ffffff",
    }));

    const clouds: Cloud[] = Array.from({ length: 30 }, () => {
      const w = 190 + Math.random() * 230;
      return {
        x: Math.random(),
        alt: 1200 + Math.random() * 16400,
        w,
        h: w * 0.55,
        a: 0.45 + Math.random() * 0.5,
        spd: 0.08 + Math.random() * 0.22,
        ph: Math.random() * 6.283,
      };
    });

    const fogs: FogStrip[] = Array.from({ length: 6 }, (_, i) => ({
      yo: 0.72 + i * 0.05,
      h: 16 + Math.random() * 26,
      a: 0.1 + Math.random() * 0.12,
      sp: 0.12 + Math.random() * 0.2,
      ph: Math.random() * 6.283,
    }));

    const S_DAY = makeCloudSprite("#eef4ff");
    const S_WARM = makeCloudSprite("#ffddb6");

    const AUR = [
      { spr: makeRibbonSprite("#50ffb4", "#9660ff"), a: 1, yo: 0.3 },
      { spr: makeRibbonSprite("#5cffc2", "#8a5cff"), a: 0.78, yo: 0.52 },
      { spr: makeRibbonSprite("#46f0aa", "#a86bff"), a: 0.6, yo: 0.14 },
    ];
    const BLOOM = makeBloomSprite();

    const shot = { on: false, x: 0, y: 0, vx: 0, vy: 0, l: 0, next: 5 };
    const sat = {
      on: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, dur: 0, next: 18,
    };

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv!.width = Math.round(vw * dpr);
      cv!.height = Math.round(vh * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function measure() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      resizeCanvas();
      scrollMax = Math.max(
        1,
        document.documentElement.scrollHeight - vh
      );
      waypointEls = Array.from(
        document.querySelectorAll<HTMLElement>("[data-waypoint]")
      );
      fracs = waypointEls.map((el) => centerFrac(el, vh, scrollMax));
    }

    function wiFor(p: number) {
      let wi = -1;
      for (let i = 0; i < fracs.length; i++) {
        if (p >= fracs[i] - 1e-6) wi = i;
      }
      return wi;
    }

    function updateShooter(t: number, vis: number) {
      if (vis < 0.35 || reducedRef.current) {
        shot.on = false;
        shot.next = t + 4 + Math.random() * 8;
        return;
      }
      if (!shot.on && t > shot.next) {
        shot.on = true;
        shot.l = 0;
        const ang = Math.PI * (0.15 + Math.random() * 0.2);
        shot.x = Math.random() * vw * 0.8 + vw * 0.1;
        shot.y = Math.random() * vh * 0.3;
        const sp = 900 + Math.random() * 500;
        shot.vx = Math.cos(ang) * sp;
        shot.vy = Math.sin(ang) * sp;
      }
      if (!shot.on) return;
      shot.l += 1 / 60;
      if (shot.l > 0.7) {
        shot.on = false;
        shot.next = t + 5 + Math.random() * 9;
        return;
      }
      const x2 = shot.x - shot.vx * 0.09;
      const y2 = shot.y - shot.vy * 0.09;
      const gr = ctx!.createLinearGradient(shot.x, shot.y, x2, y2);
      gr.addColorStop(0, "rgba(255,255,255,.9)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.strokeStyle = gr;
      ctx!.lineWidth = 1.6;
      ctx!.globalAlpha = Math.max(0, 1 - shot.l / 0.7) * vis;
      ctx!.beginPath();
      ctx!.moveTo(shot.x, shot.y);
      ctx!.lineTo(x2, y2);
      ctx!.stroke();
      shot.x += shot.vx / 60;
      shot.y += shot.vy / 60;
    }

    function updateSat(t: number, vis: number) {
      if (!sat.on) {
        if (vis < 0.05 || t < sat.next) return;
        sat.on = true;
        sat.life = 0;
        sat.dur = 12 + Math.random() * 6;
        const ltr = Math.random() < 0.5;
        sat.x = ltr ? -30 : vw + 30;
        sat.y = vh * (0.06 + Math.random() * 0.55);
        const dy = (Math.random() - 0.5) * vh * 0.3;
        sat.vx = (ltr ? vw + 60 : -(vw + 60)) / sat.dur;
        sat.vy = dy / sat.dur;
        return;
      }
      sat.life += 1 / 60;
      sat.x += sat.vx / 60;
      sat.y += sat.vy / 60;
      if (sat.life > sat.dur || sat.x < -40 || sat.x > vw + 40) {
        sat.on = false;
        sat.next = t + 15 + Math.random() * 20;
        return;
      }
      ctx!.globalAlpha = vis * (0.7 + 0.3 * Math.sin(t * 6));
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(sat.x - 0.9, sat.y - 0.9, 1.8, 1.8);
      if (sat.y < vh * 0.5) {
        ctx!.globalAlpha = 0.55 * Math.min(1, vis * 1.6);
        ctx!.fillStyle = "rgba(170,215,255,0.9)";
        ctx!.font = "9px 'JetBrains Mono', monospace";
        ctx!.fillText("ISS · 408 KM", sat.x + 10, sat.y - 8);
      }
    }

    function drawAurora(t: number, alt: number) {
      const gate =
        clamp((alt - 50000) / 9000, 0, 1) * clamp((85000 - alt) / 9000, 0, 1);
      if (gate <= 0.004) return;
      const span = vw + 420;
      for (let i = 0; i < AUR.length; i++) {
        const rb = AUR[i];
        const ph = t * (11 + i * 5) + i * span * 0.37;
        const x = ((ph % span) + span) % span - 210;
        const y = vh * rb.yo + Math.sin(t * 0.26 + i * 2.1) * 46;
        const w = 170 + i * 55;
        const h = vh * (0.85 + i * 0.12);
        ctx!.globalAlpha =
          gate * 0.17 * rb.a * (0.75 + 0.25 * Math.sin(t * 0.21 + i * 1.7));
        ctx!.drawImage(rb.spr, x, y - h * 0.5, w, h);
      }
    }

    function drawScene(t: number, alt: number) {
      ctx!.clearRect(0, 0, vw, vh);

      const svis = clamp((alt - 26000) / 34000, 0, 1);
      if (svis > 0) {
        for (const s of stars) {
          const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
          ctx!.globalAlpha = svis * tw;
          ctx!.fillStyle = s.c;
          ctx!.fillRect(s.x * vw, s.y * vh, s.r, s.r);
        }
      }

      updateShooter(t, svis);
      updateSat(t, svis);
      drawAurora(t, alt);

      const wWarm = clamp(1 - alt / 9500, 0, 1);
      for (const c of clouds) {
        let y = vh * 1.12 + (alt - c.alt) * CLOUD_K + Math.sin(t * 0.25 + c.ph) * 6;
        let guard = 0;
        while (y > vh + 320 && guard++ < 4) {
          c.alt += CLOUD_SPAN;
          y = vh * 1.12 + (alt - c.alt) * CLOUD_K;
        }
        guard = 0;
        while (y < -340 && guard++ < 4) {
          c.alt -= CLOUD_SPAN;
          y = vh * 1.12 + (alt - c.alt) * CLOUD_K;
        }
        if (y < -340 || y > vh + 320) continue;
        const x = c.x * (vw + 520) - 260 + Math.sin(t * c.spd + c.ph) * 26;
        ctx!.globalAlpha = 0.92 * c.a;
        ctx!.drawImage(S_DAY, x - c.w / 2, y - c.h / 2, c.w, c.h);
        if (wWarm > 0.02) {
          ctx!.globalAlpha = wWarm * 0.75 * c.a;
          ctx!.drawImage(S_WARM, x - c.w / 2, y - c.h / 2, c.w, c.h);
        }
      }

      const fa = clamp(1 - alt / 3600, 0, 1);
      if (fa > 0.01) {
        for (const f of fogs) {
          const yy = vh * f.yo + alt * 0.9;
          if (yy > vh + 60) continue;
          const off = Math.sin(t * f.sp + f.ph) * 30;
          const grd = ctx!.createLinearGradient(0, yy - f.h, 0, yy + f.h);
          grd.addColorStop(0, "rgba(226,232,244,0)");
          grd.addColorStop(0.5, `rgba(226,232,244,${(f.a * fa).toFixed(3)})`);
          grd.addColorStop(1, "rgba(226,232,244,0)");
          ctx!.fillStyle = grd;
          ctx!.fillRect(-vw * 0.25 + off, yy - f.h, vw * 1.5, f.h * 2);
        }
      }

      const bA = 0.5 * clamp((alt - 90000) / 10000, 0, 1);
      if (bA > 0.002) {
        const vmin = Math.min(vw, vh);
        const cx = vw * 0.58 + vmin * 0.32;
        const cy = vh * 0.12 + vmin * 0.32;
        const r = vmin * 1.05;
        ctx!.globalAlpha = bA;
        ctx!.drawImage(BLOOM, cx - r, cy - r, r * 2, r * 2);
      }
      ctx!.globalAlpha = 1;
    }

    function frame(tms: number) {
      const t = tms / 1000;
      const dt = Math.min(64, tms - prevT) || 16.7;
      prevT = tms;

      const sy = window.scrollY;
      const next = computeAscent(sy, scrollMax);
      const mpp = MAX_ALT / Math.max(1, scrollMax);
      const inst = ((sy - lastSy) / dt) * 1000 * mpp;
      lastSy = sy;
      vel += (inst - vel) * 0.12;
      next.vs = vel;
      ascentStore.set(next);
      const alt = next.alt;
      const p = next.progress;

      if ((prevAlt - CB_ALT) * (alt - CB_ALT) < 0 && t - cbT > 2 && !reducedRef.current) {
        cbT = t;
        shakeT0 = t;
      }
      prevAlt = alt;
      const cbAge = t - cbT;
      const wo = cbAge >= 0 && cbAge < 0.45 ? 0.55 * Math.pow(1 - cbAge / 0.45, 2) : 0;

      const st = document.documentElement.style;
      const sk = skyAt(alt);
      st.setProperty("--skyt", rgbStr(sk.top));
      st.setProperty("--skym", rgbStr(sk.mid));
      st.setProperty("--skyb", rgbStr(sk.bot));
      st.setProperty(
        "--sun-o",
        (0.9 * Math.pow(clamp(1 - alt / 36000, 0, 1), 1.35)).toFixed(3)
      );
      st.setProperty("--horizon-o", (0.9 * clamp(1 - alt / 6500, 0, 1)).toFixed(3));
      st.setProperty("--earth-o", clamp((alt - 16000) / 9000, 0, 1).toFixed(3));
      st.setProperty(
        "--earth-y",
        (lerp(1.24, 0.47, Math.pow(p, 1.12)) * vh).toFixed(1) + "px"
      );
      st.setProperty("--ground-o", clamp(1 - alt / 1500, 0, 1).toFixed(3));
      st.setProperty("--ground-y", (alt * 0.9).toFixed(1) + "px");

      drawScene(t, alt);

      if (wo > 0.002) {
        ctx!.globalAlpha = wo;
        ctx!.fillStyle = "#f4f8ff";
        ctx!.fillRect(0, 0, vw, vh);
        ctx!.globalAlpha = 1;
      }

      if (!reducedRef.current) {
        const k = 1 - Math.pow(0.9, dt / 16.7);
        swayCur.x += (swayTgt.x - swayCur.x) * k;
        swayCur.y += (swayTgt.y - swayCur.y) * k;
      } else {
        swayCur.x = 0;
        swayCur.y = 0;
      }
      let shx = 0;
      let shy = 0;
      const shAge = t - shakeT0;
      if (shAge >= 0 && shAge < 0.6 && !reducedRef.current) {
        const amp = 6 * Math.exp(-shAge * 6.5);
        shx = Math.sin(shAge * 63) * amp;
        shy = Math.cos(shAge * 51) * amp;
      }
      st.setProperty("--sx", (swayCur.x + shx / 14).toFixed(4));
      st.setProperty("--sy", (swayCur.y + shy / 10).toFixed(4));
      st.setProperty("--rx", (-swayCur.y * 0.5).toFixed(3) + "deg");
      st.setProperty("--ry", (swayCur.x * 0.6).toFixed(3) + "deg");

      const wi = wiFor(p);
      if (wi !== lastWi) {
        const first = lastWi === -2;
        const dir = wi > lastWi ? 1 : -1;
        lastWi = wi;
        if (!first) dispatchWaypoint(wi, dir as 1 | -1);
      }

      titleTick++;
      if (titleTick % 40 === 0) {
        document.title = `▲ ${(alt / 1000).toFixed(1)} KM · SUGAM KASHYAP`;
      }

      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => {
      if (reducedRef.current || e.pointerType !== "mouse") return;
      swayTgt.x = (e.clientX / Math.max(1, vw)) * 2 - 1;
      swayTgt.y = (e.clientY / Math.max(1, vh)) * 2 - 1;
    };
    const onLeave = () => {
      swayTgt.x = 0;
      swayTgt.y = 0;
    };

    const coarse = window.matchMedia("(hover: none)").matches;
    let gyroBound = false;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (reducedRef.current || e.beta == null || e.gamma == null) return;
      swayTgt.x = clamp(e.gamma, -22, 22) / 22;
      swayTgt.y = clamp(e.beta, -18, 18) / 18;
    };
    const enableGyro = async () => {
      if (gyroBound || !coarse || reducedRef.current) return;
      try {
        const doe = window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        };
        if (typeof doe?.requestPermission === "function") {
          const res = await doe.requestPermission();
          if (res !== "granted") return;
        }
        gyroBound = true;
        window.addEventListener("deviceorientation", onOrient);
      } catch {}
    };
    const onTouchEnd = () => {
      void enableGyro();
    };

    measure();
    lastWi = wiFor(computeAscent(window.scrollY, scrollMax).progress);
    prevAlt = computeAscent(window.scrollY, scrollMax).alt;

    let roq = false;
    const ro = new ResizeObserver(() => {
      if (roq) return;
      roq = true;
      requestAnimationFrame(() => {
        roq = false;
        measure();
      });
    });
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    if (coarse) {
      document.documentElement.addEventListener("touchend", onTouchEnd, {
        passive: true,
      });
    }
    if (document.fonts?.ready) void document.fonts.ready.then(measure);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  return (
    <>
      <div className="sway-layer sway layer-sky" aria-hidden>
        <div className="sky-fill" />
        <div className="horizon-glow" />
        <div className="sun-glow" />
      </div>
      <div className="sway-layer sway layer-ground" aria-hidden>
        <svg
          className="ground-silhouette"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <path
            fill="#141c31"
            opacity="0.7"
            d="M0,242 L180,232 L360,240 L540,226 L720,238 L900,222 L1080,236 L1260,224 L1440,234 L1440,300 L0,300 Z"
          />
          <path
            fill="#0b1120"
            d="M0,214 L96,206 L210,212 L330,192 L458,204 L585,184 L712,198 L838,178 L965,192 L1092,172 L1218,188 L1330,180 L1440,192 L1440,300 L0,300 Z"
          />
          <g fill="#0b1120">
            <rect x="1064" y="118" width="5" height="86" />
            <rect x="1086" y="130" width="5" height="74" />
            <path d="M1060 204 L1094 204 L1090 196 L1064 196 Z" />
            <path d="M1066 156 L1090 156 L1087 149 L1069 149 Z" />
            <path d="M1070 132 L1086 132 L1084 126 L1072 126 Z" />
            <rect x="1074" y="96" width="4" height="24" />
            <path d="M1076 88 L1083 100 L1069 100 Z" />
          </g>
        </svg>
      </div>
      <div className="sway-layer sway layer-scene" aria-hidden>
        <canvas ref={canvasRef} className="scene-canvas" />
      </div>
      <div className="sway-layer sway layer-earth" aria-hidden>
        <div className="earth-disc" />
      </div>
    </>
  );
}
