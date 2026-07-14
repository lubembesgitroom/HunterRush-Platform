"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGame } from "@/hooks/useGame";

const WIDTH = 900;
const HEIGHT = 420;
const PADDING = 36;

interface Point {
  x: number;
  y: number;
}

export default function CrashGraph() {
  const { snapshot } = useGame();

  const multiplier =
    snapshot?.multiplier ?? 1;

  const phase =
    snapshot?.phase ?? "WAITING";

  const animation =
  useRef<number | null>(null);

  const [displayMultiplier, setDisplayMultiplier] =
    useState(1);

  useEffect(() => {
    if (animation.current !== null) {
      cancelAnimationFrame(animation.current);
    }

    const animate = () => {
      setDisplayMultiplier((current) => {
        const delta = multiplier - current;

        if (Math.abs(delta) < 0.002) {
          return multiplier;
        }

        return current + delta * 0.18;
      });

      animation.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animation.current !== null) {
        cancelAnimationFrame(animation.current);
      }
    };
  }, [multiplier]);

  useEffect(() => {
    if (phase === "BETTING") {
      setDisplayMultiplier(1);
    }
  }, [phase]);

  const points =
    useMemo<Point[]>(() => {
      const result: Point[] = [];

      const max =
        Math.max(
          displayMultiplier,
          1,
        );

      const samples = 140;

      for (
        let i = 0;
        i <= samples;
        i++
      ) {
        const progress =
          i / samples;

        const value =
          1 +
          (max - 1) *
            progress;

        const x =
          PADDING +
          progress *
            (WIDTH -
              PADDING * 2);

        const normalized =
          Math.log(value) /
          Math.log(
            Math.max(max, 2),
          );

        const y =
          HEIGHT -
          PADDING -
          normalized *
            (HEIGHT -
              PADDING * 2);

        result.push({
          x,
          y,
        });
      }

      return result;
    }, [displayMultiplier]);

  const path = useMemo(() => {
    if (
      points.length === 0
    ) {
      return "";
    }

    return points
      .map((point, index) =>
        index === 0
          ? `M ${point.x} ${point.y}`
          : `L ${point.x} ${point.y}`,
      )
      .join(" ");
  }, [points]);

  const current =
    points[
      points.length - 1
    ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="graphGradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#00ff9d"
            />

            <stop
              offset="100%"
              stopColor="#44d6ff"
            />
          </linearGradient>

          <filter id="graphGlow">
            <feGaussianBlur
              stdDeviation="5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />

              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({
          length: 8,
        }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            x2={WIDTH}
            y1={
              (HEIGHT / 8) * i
            }
            y2={
              (HEIGHT / 8) * i
            }
            stroke="rgba(255,255,255,.05)"
          />
        ))}

        {Array.from({
          length: 10,
        }).map((_, i) => (
          <line
            key={`v-${i}`}
            y1={0}
            y2={HEIGHT}
            x1={
              (WIDTH / 10) * i
            }
            x2={
              (WIDTH / 10) * i
            }
            stroke="rgba(255,255,255,.05)"
          />
        ))}

        <path
          d={path}
          fill="none"
          stroke="url(#graphGradient)"
          strokeWidth={5}
          filter="url(#graphGlow)"
          strokeLinecap="round"
        />

        {current && (
          <>
            <circle
              cx={current.x}
              cy={current.y}
              r={9}
              fill="#ffffff"
            />

            <circle
              cx={current.x}
              cy={current.y}
              r={18}
              fill="rgba(68,214,255,.25)"
            />
          </>
        )}
      </svg>
    </div>
  );
}