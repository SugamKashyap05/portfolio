# Ryo Tanaka — Cinematic Japanese-Theme Portfolio

A single-page portfolio built with Next.js 14 (App Router, TypeScript strict), Tailwind CSS, Framer Motion, GSAP ScrollTrigger, React Three Fiber, and Lenis.

## Run

```bash
npm install
npm run dev
```

Build / check:

```bash
npm run build
npm run lint
npm run typecheck
```

## Design system

Palette tokens live in `tailwind.config.ts` and `app/globals.css` (CSS variables): `sumi`, `washi`, `aizome`, `vermillion`, `gold-leaf`, `mist-gray`. Vermillion is used only twice per viewport by design (CTA underline swap on hover). Typography: Shippori Mincho (serif headings) + Manrope (sans body), loaded via `next/font`. The single global easing is `cubic-bezier(0.16, 1, 0.3, 1)`, exported as `EASE_CINEMA` from `lib/motion.ts` and as Tailwind's `ease-cinema`.

Vertical decorative text (`writing-mode: vertical-rl`) appears exactly twice: hero right edge and contact left edge.

## Structure

```
app/            layout.tsx (fonts, metadata), page.tsx (assembly + intro), globals.css
components/
  hero/         Hero.tsx (copy, fallback logic) + HeroScene.tsx (R3F particles/fog/camera drift)
  about/        About.tsx (asymmetric, clip-path mask wipe) + Skills.tsx
  projects/     Projects.tsx (letterboxed scenes, GSAP parallax)
  timeline/     Timeline.tsx (gold-leaf line, SVG ink-dot markers)
  contact/      Contact.tsx + Footer.tsx
  ui/           Cursor, SmoothScroll (Lenis), Intro, Nav, SectionHeading, Reveal
lib/            constants.ts (content), motion.ts (variants/easing), hooks.ts (reduced-motion / low-power)
```

## Performance & accessibility

- R3F canvas is client-only (`dynamic`, `ssr: false`), mounted after intro, and its `frameloop` freezes to `"never"` when the hero leaves the viewport.
- Mobile / low-power / `prefers-reduced-motion` users get a static CSS gradient + CSS star-field instead of WebGL (`lib/hooks.ts`).
- `prefers-reduced-motion` also skips the intro, disables Lenis, GSAP parallax, and the custom cursor, and collapses CSS animation durations globally.
- Semantic landmarks, skip link, `aria-hidden` on all decorative layers, gold-leaf `:focus-visible` outlines.
- All images use `next/image` with AVIF/WebP preferred (`next.config.mjs`).

## Deviations from spec

1. **Body font — Manrope instead of Inter.** The spec offered "Inter or Manrope"; Manrope chosen. Inter is also an overused default, so Manrope gives the site a slightly more distinct voice while staying neutral.
2. **Cursor dot color.** Spec says ring-or-dot; implemented as a washi dot plus a thin trailing ring that shifts to gold on interactive hover — kept deliberately simple per the spec's "nothing more elaborate" constraint.
3. **Project descriptions on mobile.** The hover-reveal description is shown statically on `md+` and expands on hover; below `md` it is also visible (hover is unreliable on touch), implemented via `md:opacity-100` overrides rather than a separate mobile layout.
4. **Remote images.** Placeholder imagery is generated via the TRAE text-to-image endpoint; the host is allow-listed in `next.config.mjs`. Swap `lib/constants.ts` URLs for local assets in `public/` for production.
5. **Fonts via Google (`next/font`).** Shippori Mincho has no full Japanese subset in the Latin build — the small decorative Japanese strings render via system serif fallback. No visual breakage, but if you need full JP glyph coverage, self-host Noto Serif JP.
