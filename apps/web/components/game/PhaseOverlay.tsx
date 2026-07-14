"use client";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";
import { typography } from "@/theme/typography";

export default function PhaseOverlay() {
  const { snapshot } = useGame();

  const phase = snapshot?.phase ?? "WAITING";

  const config = {
    WAITING: {
      text: "WAITING FOR NEXT ROUND",
      color: theme.colors.textMuted,
    },

    BETTING: {
      text: "PLACE YOUR BETS",
      color: theme.colors.info,
    },

    RUNNING: {
      text: "ROUND LIVE",
      color: theme.colors.primary,
    },

    CRASHED: {
      text: "CRASHED",
      color: theme.colors.danger,
    },

    REVEAL: {
      text: "VERIFYING ROUND",
      color: theme.colors.warning,
    },
  }[phase] ?? {
    text: phase,
    color: theme.colors.text,
  };

  return (
    <div
      style={{
        position: "absolute",

        top: 24,

        left: "50%",

        transform: "translateX(-50%)",

        pointerEvents: "none",

        zIndex: 20,
      }}
    >
      <div
        style={{
          padding: "10px 24px",

          borderRadius: 999,

          background: "rgba(0,0,0,.55)",

          border: `1px solid ${config.color}`,

          color: config.color,

          fontWeight: 700,

          fontSize: typography.body.fontSize,

          letterSpacing: 1,

          textTransform: "uppercase",

          boxShadow: `0 0 20px ${config.color}33`,

          transition: "all .25s ease",
        }}
      >
        {config.text}
      </div>
    </div>
  );
}