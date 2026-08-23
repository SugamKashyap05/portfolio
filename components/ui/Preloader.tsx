"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "ascent-launched";
const BOOT_LINES = ["SYSTEMS NOMINAL", "FUELING COMPLETE", "GUIDANCE LOCKED"];
const TICKS = ["T-3", "T-2", "T-1"];
const STEP_MS = [70, 270, 470, 700, 1000, 1300];
const IGNITION_MS = 1540;
const EXIT_MS = 1660;
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";

function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / 7) * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) =>
            ch === " " || i < settled
              ? ch
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          )
          .join("")
      );
      if (settled >= text.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [text]);

  return <span>{out}</span>;
}

export default function Preloader() {
  const [active, setActive] = useState(true);
  const [step, setStep] = useState(0);
  const [ignited, setIgnited] = useState(false);
  const timersRef = useRef<number[]>([]);
  const prevOverflowRef = useRef("");
  const lockedRef = useRef(false);

  useLayoutEffect(() => {
    const unlock = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      document.body.style.overflow = prevOverflowRef.current;
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.sessionStorage.getItem(SESSION_KEY)
    ) {
      setActive(false);
      return;
    }

    lockedRef.current = true;
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers = timersRef.current;
    STEP_MS.forEach((ms, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), ms));
    });
    timers.push(
      window.setTimeout(() => {
        setIgnited(true);
        window.sessionStorage.setItem(SESSION_KEY, "1");
      }, IGNITION_MS)
    );
    timers.push(window.setTimeout(() => setActive(false), EXIT_MS));

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      unlock();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (!lockedRef.current) return;
        lockedRef.current = false;
        document.body.style.overflow = prevOverflowRef.current;
      }}
    >
      {active && (
        <motion.div
          id="preloader"
          aria-hidden
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
        >
          <div className="pre-readout">
            <div className="pre-label">
              <span>CV-01 · ASCENT SEQUENCE</span>
              <span className="pre-dot" />
            </div>
            <div className="pre-lines">
              {BOOT_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  className="pre-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.16 }}
                >
                  {step > i && <Scramble text={line} />}
                </motion.p>
              ))}
            </div>
            <div className="pre-ticks">
              {TICKS.map((tick, i) => (
                <motion.span
                  key={tick}
                  className="pre-tick"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: step >= 4 + i ? 1 : 0, y: step >= 4 + i ? 0 : 4 }}
                  transition={{ duration: 0.14 }}
                >
                  {tick}
                </motion.span>
              ))}
            </div>
            <AnimatePresence>
              {ignited && (
                <motion.p
                  className="pre-ignition"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.12 }}
                >
                  IGNITION
                </motion.p>
              )}
            </AnimatePresence>
            <div className="pre-track">
              <motion.div
                className="pre-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: IGNITION_MS / 1000, ease: "linear" }}
              />
            </div>
          </div>
          {ignited && <div className="pre-flash" />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
