"use client";

import { useState } from "react";
import { isRadioEnabled, radioToggle } from "@/lib/radio";

export default function RadioToggle() {
  const [on, setOn] = useState(isRadioEnabled());
  const [failed, setFailed] = useState(false);

  const handle = () => {
    const res = radioToggle();
    setFailed(res.failed);
    setOn(res.enabled && !res.failed);
  };

  return (
    <button
      id="radiobtn"
      type="button"
      aria-pressed={on}
      onClick={handle}
      className={on ? "on" : undefined}
    >
      <span className="dot" aria-hidden />
      RADIO ·{" "}
      {failed ? "N/A" : on ? "LIVE" : "STANDBY"}
    </button>
  );
}
