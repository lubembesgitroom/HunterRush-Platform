"use client";

import type {
  HunterSpriteProps,
} from "./hunter.types";

export default function HunterSprite({
  animation,
}: HunterSpriteProps) {
  let emoji = "🧍";

  switch (animation.state) {
    case "COUNTDOWN":
      emoji = "🏃";
      break;

    case "RUNNING":
      emoji = "🏃";
      break;

    case "TRIP":
      emoji = "😵";
      break;

    case "FALL":
      emoji = "🤸";
      break;

    case "DOWN":
      emoji = "💀";
      break;

    case "RESET":
      emoji = "";
      break;

    default:
      emoji = "🧍";
  }

  const brightness =
    1 + animation.speed * 0.05;

  return (
    <div
      style={{
        position: "relative",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        width: 96,

        height: 96,

        fontSize: 64,

        filter: `
          brightness(${brightness})
          drop-shadow(0 6px 10px rgba(0,0,0,.45))
        `,

        userSelect: "none",

        pointerEvents: "none",

        transition:
          "filter 120ms linear",
      }}
    >
      {emoji}

      <div
        style={{
          position: "absolute",

          bottom: 6,

          width: 54,

          height: 12,

          borderRadius: "50%",

          background:
            "rgba(0,0,0,.30)",

          transform: `scale(${animation.shadowScale})`,

          transition:
            "transform 120ms linear",
        }}
      />
    </div>
  );
}