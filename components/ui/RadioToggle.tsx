"use client";

import { useEffect, useState } from "react";
import {
  getRadioPhase,
  installAmbientAutostart,
  RADIO_PHASE_EVENT,
  radioToggle,
  type RadioPhase,
} from "@/lib/radio";

export default function RadioToggle() {
  const [phase, setPhase] = useState<RadioPhase>(getRadioPhase());
  const [failed, setFailed] = useState(false);

  useEffect(() => installAmbientAutostart(), []);

  useEffect(() => {
    const sync = () => setPhase(getRadioPhase());
    window.addEventListener(RADIO_PHASE_EVENT, sync);
    return () => window.removeEventListener(RADIO_PHASE_EVENT, sync);
  }, []);

  const handle = () => {
    const res = radioToggle();
    setFailed(res.failed);
    setPhase(getRadioPhase());
  };

  return (
    <button
      id="radiobtn"
      type="button"
      aria-pressed={phase === "live"}
      onClick={handle}
      className={failed ? undefined : phase === "live" ? "on" : phase}
    >
      <span className="dot" aria-hidden />
      RADIO ·{" "}
      {failed
        ? "N/A"
        : phase === "standby"
          ? "STANDBY"
          : phase === "muted"
            ? "MUTED"
            : "LIVE"}
    </button>
  );
}
