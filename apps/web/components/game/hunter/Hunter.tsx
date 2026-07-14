"use client";

import { useMemo } from "react";

import BackgroundScroller from "./BackgroundScroller";
import DustTrail from "./DustTrail";
// Fallback inline Ground component in case external module is missing.
// Keeps the same API: <Ground speed={number} />
function Ground({
  speed,
}: {
  speed: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 120,
        pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent)",
        transform: `translateZ(0) translateY(${Math.min(0, -speed * 2)}px)`,
      }}
    />
  );
}
import HunterAnimator from "./HunterAnimator";
import { useHunter } from "./useHunter";

import type {
  HunterProps,
} from "./hunter.types";

export default function Hunter({
  multiplier,
  phase,
}: HunterProps) {
  const animation =
    useHunter({
      multiplier,
      phase,
    });

  const speedMultiplier =
    useMemo(() => {
      return Math.max(
        1,
        animation.speed,
      );
    }, [animation.speed]);

  return (
    <div
      style={{
        position: "absolute",

        inset: 0,

        overflow: "hidden",

        pointerEvents: "none",

        zIndex: 10,
      }}
    >
      {/* ==========================
          PARALLAX BACKGROUND
      ========================== */}

      <BackgroundScroller
        speed={
          animation.backgroundSpeed
        }
      />

      {/* ==========================
          GROUND
      ========================== */}

      <Ground
        speed={
          animation.groundSpeed
        }
      />

      {/* ==========================
          DUST
      ========================== */}

      <DustTrail
        intensity={
          animation.dust
        }
      />

      {/* ==========================
          HUNTER
      ========================== */}

      <HunterAnimator
        animation={
          animation
        }
      />

      {/* ==========================
          SPEED LINES
      ========================== */}

      {animation.state ===
        "RUNNING" && (
        <>
          {Array.from({
            length: Math.min(
              8,
              Math.floor(
                speedMultiplier * 3,
              ),
            ),
          }).map((_, index) => (
            <div
              key={index}
              style={{
                position:
                  "absolute",

                left: `${
                  8 +
                  index * 12
                }%`,

                top: `${
                  20 +
                  ((index * 9) %
                    55)
                }%`,

                width:
                  40 +
                  animation.speed *
                    8,

                height: 2,

                background:
                  "rgba(255,255,255,.15)",

                borderRadius: 999,

                transform:
                  "rotate(-8deg)",

                opacity:
                  0.2 +
                  animation.speed *
                    0.1,

                animation:
                  "hunterSpeedLines 350ms linear infinite",

                animationDelay: `${
                  index * 70
                }ms`,
              }}
            />
          ))}
        </>
      )}

      {/* ==========================
          GLOBAL ANIMATION
      ========================== */}

      <style jsx>{`
        @keyframes hunterSpeedLines {
          from {
            transform: translateX(0)
              rotate(-8deg);

            opacity: 0.45;
          }

          to {
            transform: translateX(-120px)
              rotate(-8deg);

            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}