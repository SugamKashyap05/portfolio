"use client";

import LogEntry from "@/components/sections/LogEntry";
import { logAlts, projects } from "@/lib/constants";

export default function ProjectLogs() {
  return (
    <>
      {projects.map((p, i) => (
        <LogEntry
          key={p.id}
          index={String(i + 2).padStart(2, "0")}
          tag="PAYLOAD"
          alt={logAlts.projects[i]}
          id={`project-${p.id}`}
          label={p.title.toUpperCase()}
        >
          <h2 id={`project-${p.id}-title`}>{p.title}</h2>
          <p className="role">
            {p.subtitle} · {p.status} · {p.year}
          </p>
          <p>{p.description}</p>
          <ul className="chips">
            {p.tags.map((t) => (
              <li key={t}>{t.toUpperCase()}</li>
            ))}
          </ul>
          <p className="case-note">CASE STUDY AVAILABLE ON REQUEST · {p.title.toUpperCase()}</p>
        </LogEntry>
      ))}
    </>
  );
}
