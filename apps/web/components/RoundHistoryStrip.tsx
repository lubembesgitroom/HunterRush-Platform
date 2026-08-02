"use client";

import { useGame } from "@/hooks/useGame";

export default function RoundHistoryStrip() {
  const { snapshot } = useGame();

  const history =
    snapshot?.roundHistory ?? [];

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        padding: "10px 4px",
        marginBottom: 10,
        scrollbarWidth: "none",
      }}
    >
      {history.map((round) => (
        <div
          key={round.id}
          style={{
            flex: "0 0 auto",
            color:
              round.crashPoint >= 10
                ? "#B84DFF"
                : round.crashPoint >= 2
                ? "#2EA8FF"
                : "#FF4D5A",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {round.crashPoint.toFixed(2)}×
        </div>
      ))}

      {history.length === 0 && (
        <span
          style={{
            color: "#777",
            fontSize: 15,
          }}
        >
          Waiting for rounds...
        </span>
      )}
    </div>
  );
}