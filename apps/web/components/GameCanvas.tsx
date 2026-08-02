"use client";

import GameArena from "@/components/animation/GameArena";

export default function GameCanvas() {
  return (
    <div
      style={{
        width: "100%",
        height: 280,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <GameArena />
    </div>
  );
}