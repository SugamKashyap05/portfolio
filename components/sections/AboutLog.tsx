"use client";

import LogEntry from "@/components/sections/LogEntry";
import { logAlts, site } from "@/lib/constants";

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
        Eight years building interfaces that stay calm when the data gets loud
        — real-time dashboards, canvas editors, and WebGL work for cultural
        institutions and design-led teams.
      </p>
      <ul className="xp">
        <li>
          <span className="xp-period">2023 — Now</span>
          <span className="xp-role">Senior Creative Developer · Studio Kurogane</span>
        </li>
        <li>
          <span className="xp-period">2021 — 2023</span>
          <span className="xp-role">Frontend Engineer · Hanamizu Labs</span>
        </li>
        <li>
          <span className="xp-period">2019 — 2021</span>
          <span className="xp-role">UI Engineer · Northlight</span>
        </li>
        <li>
          <span className="xp-period">2017 — 2019</span>
          <span className="xp-role">Freelance Developer · Independent</span>
        </li>
      </ul>
      <ul className="chips">
        <li>{site.location.toUpperCase()}</li>
        <li>{site.email.toUpperCase()}</li>
        <li>OPEN FOR SELECT CONTRACTS</li>
      </ul>
    </LogEntry>
  );
}
