"use client";

import AnimatedMultiplier from "./AnimatedMultiplier";

import { useGame } from "@/hooks/useGame";

export default function MultiplierDisplay() {
  const { snapshot } = useGame();

  const multiplier =
    snapshot?.multiplier ?? 1;

  const phase =
    snapshot?.phase ?? "WAITING";

  return (
    <div
      style={{
        position: "absolute",

        inset: 0,

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        pointerEvents: "none",

        zIndex: 20,
      }}
    >
      <AnimatedMultiplier
        multiplier={multiplier}
        phase={phase}
      />
    </div>
  );
}