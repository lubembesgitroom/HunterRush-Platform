"use client";

import { useEffect, useState } from "react";

import { useGame } from "@/hooks/useGame";

import { theme } from "@/theme/theme";
import { typography } from "@/theme/typography";

export default function CountdownOverlay() {
  const { snapshot } = useGame();

  const phase = snapshot?.phase ?? "WAITING";

  // Temporary client countdown.
  // Later this will come from the server snapshot.
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (phase !== "BETTING") {
      return;
    }

    setCountdown(8);

    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  if (phase !== "BETTING") {
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
        Round Starts In
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
        {countdown}
      </div>
    </div>
  );
}