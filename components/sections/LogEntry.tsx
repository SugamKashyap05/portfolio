"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function LogEntry({
  index,
  tag,
  alt,
  id,
  label,
  children,
}: {
  index: string;
  tag: string;
  alt: string;
  id: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="stage"
      data-waypoint
      data-label={label ?? `LOG ${index}`}
      data-alt={alt}
      aria-labelledby={`${id}-title`}
    >
      <motion.article
        id={id}
        className="log"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="loghead">
          <span className="tag">
            LOG {index} · {tag}
          </span>
          <span className="alt">ALT {alt}</span>
        </header>
        {children}
      </motion.article>
    </section>
  );
}
