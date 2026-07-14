"use client";

import { useGame } from "@/hooks/useGame";

export default function GameStatus() {
  const {
    connected,
    multiplier,
    snapshot,
  } = useGame();

  const phase =
    snapshot?.phase ?? "WAITING";

  const players =
    snapshot?.playersOnline ?? 0;

  return (
    <div
      style={{
        background: "#151515",
        border: "1px solid #2d2d2d",
        borderRadius: 12,
        padding: 20,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 12,
            color: "#888",
          }}
        >
          STATUS
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {connected
            ? "CONNECTED"
            : "DISCONNECTED"}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            color: "#888",
          }}
        >
          PHASE
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {phase}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            color: "#888",
          }}
        >
          MULTIPLIER
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: "#00d26a",
          }}
        >
          {multiplier.toFixed(2)}×
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            color: "#888",
          }}
        >
          PLAYERS
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {players}
        </div>
      </div>
    </div>
  );
}