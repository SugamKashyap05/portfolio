"use client";

import LogEntry from "@/components/sections/LogEntry";
import { certifications, logAlts, nowBuilding, site } from "@/lib/constants";

export default function AboutLog() {
  return (
    <LogEntry
      index="01"
      tag="FLIGHT PLAN"
      alt={logAlts.about}
      id="about"
      label="ABOUT"
    >
      <h2 id="about-title">About the pilot</h2>
      <p>
        Full Stack Developer and AI Systems Engineer building production-grade
        agentic AI platforms and LLM-integrated web applications with Python,
        TypeScript, Next.js, NestJS, and FastAPI. Practical depth in RAG
        architecture, local LLM inference, MCP tooling, and AI workflow
        automation with n8n. Experienced across the full SDLC — architecture,
        backend API design, CI/CD deployment, and security testing.
      </p>
      <ul className="xp">
        <li>
          <span className="xp-period">Oct 2026 — Present</span>
          <span className="xp-role">
            Freelance Full Stack Developer · AATMA
          </span>
          <span className="xp-role">
            Built and deployed the All Assam Agar Traders &amp; Agaroil
            Manufacturers&apos; Association&apos;s first public institutional website
            with React 19, TypeScript, Vite, Tailwind CSS v4, and React Router.
            Delivered a multi-route information architecture, a 1905–2026
            timeline, scanned-publication flipbook readers, and a
            source-grounded content pipeline with accessibility and responsive
            quality checks.
          </span>
        </li>
        <li>
          <span className="xp-period">Jul 2025 — Oct 2025</span>
          <span className="xp-role">
            Freelance Full Stack Developer · Auranix Digital Private Ltd
          </span>
          <span className="xp-role">
            Built the company&apos;s production website and business
            email/notification infrastructure solo as its founding digital
            presence.
          </span>
        </li>
        <li>
          <span className="xp-period">2022 — 2026</span>
          <span className="xp-role">
            B.Tech, Computer Science &amp; Engineering · Lovely Professional
            University
          </span>
        </li>
        <li>
          <span className="xp-period">2019 — 2022</span>
          <span className="xp-role">Diploma · Sainath University</span>
        </li>
      </ul>
      <p className="role">NOW BUILDING</p>
      <div className="building-chip">
        <span className="livedot" />
        <span>
          {nowBuilding.name.toUpperCase()} ▸ {nowBuilding.note.toUpperCase()}
        </span>
      </div>
      <p className="role">CERTIFICATIONS</p>
      <ul className="chips">
        {certifications.map((c) => (
          <li key={c}>{c.toUpperCase()}</li>
        ))}
      </ul>
      <ul className="chips">
        <li>{site.location.toUpperCase()}</li>
        <li>{site.email.toUpperCase()}</li>
        <li>OPEN FOR SELECT CONTRACTS</li>
      </ul>
    </LogEntry>
  );
}
