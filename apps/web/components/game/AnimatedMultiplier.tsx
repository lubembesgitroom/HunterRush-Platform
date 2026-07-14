"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { theme } from "@/theme/theme";

interface AnimatedMultiplierProps {
  multiplier: number;
  phase: string;
}

export default function AnimatedMultiplier({
  multiplier,
  phase,
}: AnimatedMultiplierProps) {
  const [displayValue, setDisplayValue] =
    useState(1);

  const animationRef =
  useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      setDisplayValue((current) => {
        const difference =
          multiplier - current;

        if (
          Math.abs(difference) <
          0.001
        ) {
          return multiplier;
        }

        return (
          current +
          difference * 0.15
        );
      });

      animationRef.current =
        requestAnimationFrame(
          animate,
        );
    };
    animate();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [multiplier]);

  const color =
    useMemo(() => {
      if (phase === "CRASHED")
        return theme.colors.danger;

      if (displayValue >= 25)
        return "#FFD54F";

      if (displayValue >= 10)
        return "#B388FF";

      if (displayValue >= 5)
        return "#64B5F6";

      if (displayValue >= 2)
        return "#66BB6A";

      return theme.colors.primary;
    }, [displayValue, phase]);

  const glow =
    Math.min(
      displayValue * 4,
      50,
    );

  const scale =
    phase === "RUNNING"
      ? 1 +
        Math.sin(
          performance.now() /
            180,
        ) *
          0.04
      : 1;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: 72,

          fontWeight: 900,

          letterSpacing: -2,

          color,

          transform: `scale(${scale})`,

          transition:
            "color 300ms ease",

          textShadow: `
            0 0 ${glow}px ${color},
            0 0 ${glow * 2}px ${color}
          `,

          userSelect: "none",

          willChange:
            "transform",
        }}
      >
        {displayValue.toFixed(2)}×
      </div>
    </div>
  );
}