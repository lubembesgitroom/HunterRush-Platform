"use client";

import { useMemo } from "react";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";

export default function HunterAnimation() {
  const { multiplier, snapshot } = useGame();

  const phase = snapshot?.phase ?? "WAITING";

  const progress = useMemo(() => {
    return Math.max(
      0,
      Math.min(
        1,
        Math.log(multiplier) / Math.log(100),
      ),
    );
  }, [multiplier]);

  const left = 80 + progress * 720;

  const top = 340 - progress * 250;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",

          left,

          top,

          transform:
            phase === "CRASHED"
              ? "translate(-50%, -50%) rotate(90deg)"
              : "translate(-50%, -50%)",

          transition:
            "left 40ms linear, top 40ms linear, transform .3s ease",

          fontSize: 42,

          filter:
            phase === "RUNNING"
              ? `drop-shadow(0 0 12px ${theme.colors.primary})`
              : "none",

          zIndex: 10,
        }}
      >
        🏃
      </div>
    </div>
  );
}