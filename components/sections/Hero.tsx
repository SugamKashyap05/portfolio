"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/constants";

export default function Hero() {
  return (
    <header className="stage hero" id="hero">
      <motion.p
        className="kicker"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="livedot" aria-hidden /> PAYLOAD CAM 02 · LIVE FEED
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {site.name}
      </motion.h1>
      <motion.p
        className="lede"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {site.tagline}. This portfolio is a single continuous ascent — from a
        misty dawn launch site to the Kármán line at 100 km. Every section is a
        waypoint logged along the way.
      </motion.p>
      <motion.p
        className="cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        SCROLL TO INITIATE ASCENT
        <span className="arrow" aria-hidden>
          ▾
        </span>
      </motion.p>
    </header>
  );
}
