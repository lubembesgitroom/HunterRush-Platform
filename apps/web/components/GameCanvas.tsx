"use client";

import { useGame } from "@/hooks/useGame";

import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";

export default function GameCanvas() {
  const {
    multiplier,
    snapshot,
  } = useGame();

  const phase =
    snapshot?.phase ?? "WAITING";

  const round =
    snapshot?.round;

  const phaseColor = {
    WAITING: "#757575",
    BETTING: "#2196F3",
    RUNNING: "#00C853",
    CRASHED: "#F44336",
    REVEAL: "#FF9800",
  }[phase] ?? "#757575";

  return (
    <Panel>
      <div
        style={{
          position: "relative",
          minHeight: 460,
          borderRadius: 18,

          background:
            "radial-gradient(circle at top,#1e293b,#111827 60%,#09090b)",

          overflow: "hidden",

          display: "flex",

          flexDirection: "column",

          justifyContent: "space-between",

          padding: 32,
        }}
      >
        {/* Top Bar */}

        <div
          style={{
            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <Badge color={phaseColor}>
            {phase}
          </Badge>

          <div
            style={{
              color: "#9CA3AF",

              fontSize: 14,
            }}
          >
            Round{" "}
            {round
              ? round.id.slice(0, 8)
              : "--------"}
          </div>
        </div>

        {/* Canvas */}

        <div
          style={{
            flex: 1,

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,

              fontWeight: 900,

              color:
                phase === "RUNNING"
                  ? "#00E676"
                  : "#FFFFFF",

              textShadow:
                phase === "RUNNING"
                  ? "0 0 30px rgba(0,230,118,.45)"
                  : "none",

              transition: "all .15s linear",
            }}
          >
            {multiplier.toFixed(2)}×
          </div>

          <div
            style={{
              marginTop: 24,

              width: 180,

              height: 180,

              borderRadius: "50%",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              background:
                "rgba(255,255,255,.04)",

              border:
                "1px solid rgba(255,255,255,.08)",

              color: "#888",

              fontWeight: 700,
            }}
          >
            Hunter X
            <br />
            Animation
          </div>
        </div>

        {/* Bottom */}

        <div
          style={{
            display: "flex",

            justifyContent: "space-between",

            color: "#9CA3AF",

            fontSize: 14,
          }}
        >
          <span>
            Live Multiplier
          </span>

          <span>
            Crash Point Hidden
          </span>
        </div>
      </div>
    </Panel>
  );
}