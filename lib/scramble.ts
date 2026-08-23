export const SCRAMBLE_GLYPHS = "#/\\<>[]{}*+-_";

export function scrambleText(el: HTMLElement, fin: string, duration = 600) {
  const start = performance.now();
  const tick = (now: number) => {
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
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
