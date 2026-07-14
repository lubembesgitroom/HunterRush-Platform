"use client";

import CrashGraph from "./CrashGraph";
import CountdownOverlay from "./CountdownOverlay";
import HunterAnimation from "./HunterAnimation";
import MultiplierDisplay from "./MultiplierDisplay";
import PhaseOverlay from "./PhaseOverlay";

import { theme } from "@/theme/theme";

export default function GameCanvas() {
  return (
    <section
      style={{
        position: "relative",

        width: "100%",

        height: 460,

        overflow: "hidden",

        borderRadius: 20,

        background: theme.colors.surface,

        border: `1px solid ${theme.colors.border}`,

        boxShadow: theme.shadow.card,
      }}
    >
      {/* Background Grid & Flight Path */}
      <CrashGraph />

      {/* Hunter Character */}
      <HunterAnimation />

      {/* Live Multiplier */}
      <div
        style={{
          position: "absolute",

          top: "50%",

          left: "50%",

          transform: "translate(-50%, -50%)",

          zIndex: 20,
        }}
      >
        <MultiplierDisplay />
      </div>

      {/* Phase Banner */}
      <PhaseOverlay />

      {/* Betting Countdown */}
      <CountdownOverlay />
    </section>
  );
}