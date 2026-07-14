"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  HunterAnimation,
  HunterState,
} from "./hunter.types";

interface UseHunterProps {
  multiplier: number;
  phase: string;
}

export function useHunter({
  multiplier,
  phase,
}: UseHunterProps): HunterAnimation {
  const [state, setState] =
    useState<HunterState>("IDLE");

  // ------------------------------------------
  // State Machine
  // ------------------------------------------

  useEffect(() => {
    if (phase === "BETTING") {
      setState("COUNTDOWN");
      return;
    }

    if (phase === "RUNNING") {
      setState("RUNNING");
      return;
    }

    if (phase === "CRASHED") {
      setState("TRIP");

      const fall =
        setTimeout(() => {
          setState("FALL");
        }, 180);

      const down =
        setTimeout(() => {
          setState("DOWN");
        }, 700);

      const reset =
        setTimeout(() => {
          setState("RESET");
        }, 1500);

      const idle =
        setTimeout(() => {
          setState("IDLE");
        }, 1850);

      return () => {
        clearTimeout(fall);
        clearTimeout(down);
        clearTimeout(reset);
        clearTimeout(idle);
      };
    }
  }, [phase]);

  // ------------------------------------------
  // Visible Multiplier Driven Animation
  // ------------------------------------------

  const speed =
    useMemo(() => {
      if (state !== "RUNNING") {
        return 0;
      }

      return Math.min(
        1 +
          Math.log2(
            Math.max(
              multiplier,
              1,
            ),
          ) *
            0.45,
        3,
      );
    }, [
      multiplier,
      state,
    ]);

  const lean =
    useMemo(() => {
      if (state !== "RUNNING") {
        return 0;
      }

      return Math.min(
        4 +
          multiplier *
            0.35,
        12,
      );
    }, [
      multiplier,
      state,
    ]);

  const dust =
    useMemo(() => {
      if (state !== "RUNNING") {
        return 0;
      }

      return Math.min(
        multiplier /
          6,
        1,
      );
    }, [
      multiplier,
      state,
    ]);

  const backgroundSpeed =
    useMemo(() => {
      return speed * 45;
    }, [speed]);

  const groundSpeed =
    useMemo(() => {
      return speed * 120;
    }, [speed]);

  const shadowScale =
    useMemo(() => {
      switch (state) {
        case "RUNNING":
          return (
            1 +
            dust * 0.08
          );

        case "TRIP":
          return 1.18;

        case "FALL":
          return 1.26;

        default:
          return 1;
      }
    }, [
      dust,
      state,
    ]);

  const visible =
    state !== "RESET";

  return {
    state,

    speed,

    lean,

    dust,

    backgroundSpeed,

    groundSpeed,

    shadowScale,

    visible,
  };
}