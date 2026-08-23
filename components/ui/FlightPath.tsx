"use client";

import { useEffect, useRef } from "react";
import { ascentStore, centerFrac } from "@/lib/ascent";

const NS = "http://www.w3.org/2000/svg";

function svgEl(
  name: string,
  attrs: Record<string, string | number>,
  parent: SVGElement
) {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent.appendChild(e);
  return e as SVGElement;
}

export default function FlightPath() {
  const asideRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const aside = asideRef.current;
    const svg = svgRef.current;
    if (!aside || !svg) return;

    let ready = false;
    let L = 0;
    let basePath: SVGPathElement | null = null;
    let progPath: SVGPathElement | null = null;
    let markG: SVGGElement | null = null;
    let nodeEls: SVGCircleElement[] = [];
    let fracs: number[] = [];

    function build() {
      ready = false;
      svg!.innerHTML = "";
      if (window.innerWidth < 1024) return;
      const rect = svg!.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      const w = rect.width;
      const h = rect.height;
      svg!.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const x0 = 14;
      const y0 = h - 12;
      const x1 = w - 12;
      const y1 = 14;
      const cx = x1 + w * 0.9;
      const cy = y0 - h * 0.5;
      const d = `M ${x0} ${y0} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1} ${y1}`;

      basePath = svgEl("path", { d, class: "fp-base" }, svg!) as SVGPathElement;
      progPath = svgEl("path", { d, class: "fp-prog" }, svg!) as SVGPathElement;
      L = basePath.getTotalLength();
      progPath.style.strokeDasharray = String(L);
      progPath.style.strokeDashoffset = String(L);

      const nodesG = svgEl("g", {}, svg!);
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-waypoint]")
      );
      const sm = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      fracs = els.map((el) => centerFrac(el, window.innerHeight, sm));
      nodeEls = els.map((el, i) => {
        const pt = basePath!.getPointAtLength(L * fracs[i]);
        const c = svgEl(
          "circle",
          { cx: pt.x.toFixed(1), cy: pt.y.toFixed(1), r: 4, class: "fp-node" },
          nodesG
        ) as SVGCircleElement;
        const title = svgEl("title", {}, c);
        title.textContent = `${el.dataset.label ?? ""} · ALT ${el.dataset.alt ?? ""}`;
        return c;
      });

      markG = svgEl("g", { class: "fp-mark" }, svg!) as unknown as SVGGElement;
      svgEl("path", { d: "M0 -8 L5 7 L0 4 L-5 7 Z" }, markG);
      ready = true;
    }

    function update(p: number) {
      if (!ready || !progPath || !markG || !basePath) return;
      progPath.style.strokeDashoffset = String(L * (1 - p));
      const lp = Math.min(L, Math.max(0, L * p));
      const pt = basePath.getPointAtLength(lp);
      const pt2 = basePath.getPointAtLength(Math.min(L, lp + 2));
      const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI + 90;
      markG.setAttribute(
        "transform",
        `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})`
      );
      let curWi = -1;
      for (let i = 0; i < fracs.length; i++) {
        if (p >= fracs[i] - 1e-6) curWi = i;
      }
      nodeEls.forEach((c, i) => {
        c.classList.toggle("done", fracs[i] <= p);
        c.classList.toggle("cur", i === curWi);
      });
    }

    build();
    update(ascentStore.get().progress);

    const unsub = ascentStore.subscribe((s) => update(s.progress));

    let roq = false;
    const ro = new ResizeObserver(() => {
      if (roq) return;
      roq = true;
      requestAnimationFrame(() => {
        roq = false;
        build();
        update(ascentStore.get().progress);
      });
    });
    ro.observe(document.body);
    window.addEventListener("resize", build);
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        build();
        update(ascentStore.get().progress);
      });
    }

    return () => {
      unsub();
      ro.disconnect();
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <aside id="flightpath" ref={asideRef} aria-hidden>
      <svg ref={svgRef} />
    </aside>
  );
}
