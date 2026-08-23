export const SCRAMBLE_GLYPHS = "#/\\<>[]{}*+-_";

const active = new WeakMap<HTMLElement, () => void>();

export function scrambleText(
  el: HTMLElement,
  fin: string,
  duration = 600
): () => void {
  active.get(el)?.();
  let rafId = 0;
  let cancelled = false;
  const start = performance.now();
  const tick = (now: number) => {
    if (cancelled) return;
    const p = Math.min(1, (now - start) / Math.max(1, duration));
    const solved = Math.floor(p * fin.length);
    let out = "";
    for (let j = 0; j < fin.length; j++) {
      if (j < solved || fin[j] === " ") {
        out += fin[j];
      } else {
        out += SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
      }
    }
    el.textContent = out;
    if (p < 1) rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
  const cancel = () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (active.get(el) === cancel) active.delete(el);
  };
  active.set(el, cancel);
  return cancel;
}
