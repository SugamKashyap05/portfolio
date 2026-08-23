"use client";

import LogEntry from "@/components/sections/LogEntry";
import GaugeRing from "@/components/ui/GaugeRing";
import { logAlts, skillGauges } from "@/lib/constants";

export default function SystemsCheck() {
  return (
    <LogEntry
      index="06"
      tag="SYSTEMS CHECK"
      alt={logAlts.systems}
      id="systems"
      label="SYSTEMS"
    >
      <h2 id="systems-title">Instrument calibration</h2>
      <p className="role">
        Barometric gauges, self-assessed and peer-reviewed — continuously
        recomputed in flight.
      </p>
      <div className="gauges">
        {skillGauges.map((g) => (
          <GaugeRing key={g.label} value={g.value} label={g.label} />
        ))}
      </div>
    </LogEntry>
  );
}
