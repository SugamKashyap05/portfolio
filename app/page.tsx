"use client";

import { MotionConfig } from "framer-motion";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Atmosphere from "@/components/atmosphere/Atmosphere";
import TelemetryHUD from "@/components/ui/TelemetryHUD";
import FlightPath from "@/components/ui/FlightPath";
import StaticFX from "@/components/ui/StaticFX";
import Preloader from "@/components/ui/Preloader";
import MissionStamp from "@/components/ui/MissionStamp";
import RadioToggle from "@/components/ui/RadioToggle";
import Hero from "@/components/sections/Hero";
import AboutLog from "@/components/sections/AboutLog";
import ProjectLogs from "@/components/sections/ProjectLogs";
import SystemsCheck from "@/components/sections/SystemsCheck";
import ContactFinal from "@/components/sections/ContactFinal";

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <Atmosphere />
      <StaticFX />
      <Preloader />
      <a className="brand" href="#hero">
        SK · CV-01
      </a>
      <TelemetryHUD />
      <MissionStamp />
      <FlightPath />
      <RadioToggle />
      <SmoothScroll>
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-void focus:px-4 focus:py-2 focus:text-sm focus:text-signal-ink"
        >
          Skip to content
        </a>
        <main id="content" className="sway sway-flow">
          <Hero />
          <AboutLog />
          <ProjectLogs />
          <SystemsCheck />
          <ContactFinal />
        </main>
      </SmoothScroll>
    </MotionConfig>
  );
}
