"use client";

import HunterSprite from "./HunterSprite";

import type {
  HunterAnimation,
} from "./hunter.types";

interface HunterAnimatorProps {
  animation: HunterAnimation;
}

export default function HunterAnimator({
  animation,
}: HunterAnimatorProps) {
  if (!animation.visible) {
    return null;
  }

  let rotation = 0;
  let translateY = 0;
  let scale = 1;
  let opacity = 1;

  switch (animation.state) {
    case "IDLE":
      translateY =
        Math.sin(
          Date.now() / 450,
        ) * 2;
      break;

    case "COUNTDOWN":
      translateY =
        Math.sin(
          Date.now() / 220,
        ) * 3;
      scale = 1.03;
      break;

    case "RUNNING":
      translateY =
        Math.sin(
          Date.now() /
            (120 /
              Math.max(
                animation.speed,
                1,
              )),
        ) * 5;

      rotation =
        -animation.lean;

      scale =
        1 +
        animation.speed *
          0.02;

      break;

    case "TRIP":
      rotation = 18;
      translateY = 8;
      scale = 1.04;
      break;

    case "FALL":
      rotation = 80;
      translateY = 24;
      scale = 0.96;
      break;

    case "DOWN":
      rotation = 90;
      translateY = 30;
      scale = 0.94;
      break;

    case "RESET":
      opacity = 0;
      break;
  }

  return (
    <div
      style={{
        position: "absolute",

        left: "22%",

        bottom: 88,

        transform: `
          translateY(${translateY}px)
          rotate(${rotation}deg)
          scale(${scale})
        `,

        opacity,

        transition:
          animation.state ===
          "RUNNING"
            ? "transform 60ms linear"
            : "all 220ms ease",

        transformOrigin:
          "center bottom",

        willChange:
          "transform, opacity",

        zIndex: 20,
      }}
    >
      <HunterSprite
        animation={
          animation
        }
      />
    </div>
  );
}