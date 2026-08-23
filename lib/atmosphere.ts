export const MAX_ALT = 100000;

export type SkyStop = {
  a: number;
  top: [number, number, number];
  mid: [number, number, number];
  bot: [number, number, number];
};

const hx = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const stop = (
  a: number,
  top: string,
  mid: string,
  bot: string
): SkyStop => ({ a, top: hx(top), mid: hx(mid), bot: hx(bot) });

export const SKY_STOPS: SkyStop[] = [
  stop(0, "#46536f", "#8d8290", "#eebd8e"),
  stop(2500, "#3d5179", "#7f88a6", "#ffd9a3"),
  stop(7000, "#2e5fa6", "#6f9fd4", "#cfe3ef"),
  stop(14000, "#173f85", "#3f77bb", "#8fc0e6"),
  stop(24000, "#0b2354", "#1d4d97", "#4b86c9"),
  stop(42000, "#040b26", "#0a2c66", "#1d55a0"),
  stop(65000, "#01030f", "#04102e", "#0a2450"),
  stop(100000, "#000002", "#010409", "#030a18"),
];

export const clamp = (v: number, a: number, b: number) =>
  v < a ? a : v > b ? b : v;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const mix = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

export const rgbStr = (c: [number, number, number]) =>
  `rgb(${c[0]},${c[1]},${c[2]})`;

export function skyAt(alt: number): {
  top: [number, number, number];
  mid: [number, number, number];
  bot: [number, number, number];
} {
  let i = 0;
  while (i < SKY_STOPS.length - 2 && SKY_STOPS[i + 1].a < alt) i++;
  const s0 = SKY_STOPS[i];
  const s1 = SKY_STOPS[i + 1];
  const t = clamp((alt - s0.a) / (s1.a - s0.a), 0, 1);
  return {
    top: mix(s0.top, s1.top, t),
    mid: mix(s0.mid, s1.mid, t),
    bot: mix(s0.bot, s1.bot, t),
  };
}

export function isa(h: number): { hPa: number; tempC: number } {
  let tk: number;
  let p: number;
  if (h < 11000) {
    tk = 288.15 - 0.0065 * h;
    p = 101325 * Math.pow(tk / 288.15, 5.2561);
  } else if (h < 20000) {
    tk = 216.65;
    p = 22632 * Math.exp(-0.00015769 * (h - 11000));
  } else if (h < 32000) {
    tk = 216.65 + 0.001 * (h - 20000);
    p = 5474.9 * Math.pow(216.65 / tk, 34.1632);
  } else {
    tk = Math.max(186.9, 228.65 - 0.0028 * (h - 32000));
    p = 868.02 * Math.exp(-(h - 32000) / 7200);
  }
  return { hPa: p / 100, tempC: tk - 273.15 };
}

export const PHASES: Array<[number, string]> = [
  [0, "PRE-LAUNCH"],
  [300, "TROPOSPHERE ASCENT"],
  [11700, "CLOUDBREAK"],
  [20000, "STRATOSPHERE CRUISE"],
  [50000, "MESOSPHERE · NEAR SPACE"],
  [86000, "KÁRMÁN APPROACH"],
];

export function phaseAt(alt: number): string {
  let name = PHASES[0][1];
  for (const [threshold, label] of PHASES) {
    if (alt >= threshold) name = label;
  }
  return name;
}

export function fmtAlt(m: number): [string, string] {
  if (m < 9995) return [String(Math.round(m)), "M"];
  const km = m / 1000;
  return [km.toFixed(m < 30000 ? 2 : 1), "KM"];
}

export function fmtPressure(hPa: number): string {
  if (hPa >= 100) return hPa.toFixed(1);
  if (hPa >= 1) return hPa.toFixed(2);
  return hPa.toFixed(4);
}
