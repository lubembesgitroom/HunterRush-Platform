"use client";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";
import { typography } from "@/theme/typography";

export default function CountdownOverlay() {
  const { snapshot } = useGame();

  const phase = snapshot?.phase ?? "WAITING";
  const serverCountdownMs = snapshot?.countdownMs ?? 0;
  const countdownSeconds = Math.max(
    0,
    Math.ceil(serverCountdownMs / 1000),
  );

  if (phase !== "BETTING" && phase !== "WAITING") {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",

        top: "50%",

        left: "50%",

        transform: "translate(-50%, -50%)",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        pointerEvents: "none",

        zIndex: 30,
      }}
    >
      <div
        style={{
          color: theme.colors.textMuted,

          fontSize: typography.body.fontSize,

          letterSpacing: 2,

          textTransform: "uppercase",

          marginBottom: 12,
        }}
      >
        {phase === "WAITING"
          ? "Preparing Next Round"
          : "Round Starts In"}
      </div>

      <div
        style={{
          width: 120,

          height: 120,

          borderRadius: "50%",

          border: `4px solid ${theme.colors.info}`,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          background: "rgba(0,0,0,.45)",

          color: theme.colors.info,

          fontSize: 56,

          fontWeight: 900,

          boxShadow: `0 0 30px ${theme.colors.info}55`,

          transition: "all .25s ease",
        }}
      >
        {countdownSeconds}
      </div>
    </div>
  );
}