"use client";

import LogEntry from "@/components/sections/LogEntry";
import { logAlts, site } from "@/lib/constants";

export default function ContactFinal() {
  return (
    <LogEntry
      index="07"
      tag="FINAL TRANSMISSION"
      alt={logAlts.contact}
      id="contact"
      label="CONTACT"
    >
      <h2 id="contact-title">Kármán line crossed</h2>
      <p>
        Signal degrades beyond this point — the fastest way to reach me is
        directly. Currently taking on select contracts in real-time interfaces,
        WebGL, and creative engineering.
      </p>
      <div className="actions">
        <a className="btn" href={`mailto:${site.email}`}>
          EMAIL ↗
        </a>
        {site.socials.map((s) => (
          <a
            key={s.label}
            className="btn ghost"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.label.toUpperCase()} ↗
          </a>
        ))}
      </div>
      <footer className="colophon">
        <span>© 2026 {site.name.toUpperCase()}</span>
        <span>BUILT WITH NEXT.JS · NO PARALLAX HARMED</span>
        <span>ALTITUDE-VERIFIED TO 100 KM</span>
      </footer>
    </LogEntry>
  );
}
