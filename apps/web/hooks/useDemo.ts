"use client";

import { useMemo } from "react";

import {
  useDemoStore,
  type GameMode,
} from "@/store/demoStore";

export interface UseDemoResult {
  mode: GameMode;

  isDemo: boolean;

  isReal: boolean;

  demoBalance: number;

  walletBalance: number;

  switchToDemo: () => void;

  switchToReal: () => void;

  setDemoBalance: (
    balance: number,
  ) => void;

  increaseDemoBalance: (
    amount: number,
  ) => void;

  decreaseDemoBalance: (
    amount: number,
  ) => void;

  resetDemo: () => void;
}

export function useDemo(): UseDemoResult {
  const mode = useDemoStore(
    (state) => state.mode,
  );

  const demoBalance =
    useDemoStore(
      (state) =>
        state.demoBalance,
    );

  const switchToDemo =
    useDemoStore(
      (state) =>
        state.switchToDemo,
    );

  const switchToReal =
    useDemoStore(
      (state) =>
        state.switchToReal,
    );

  const setDemoBalance =
    useDemoStore(
      (state) =>
        state.setDemoBalance,
    );

  const increaseDemoBalance =
    useDemoStore(
      (state) =>
        state.increaseDemoBalance,
    );

  const decreaseDemoBalance =
    useDemoStore(
      (state) =>
        state.decreaseDemoBalance,
    );

  const resetDemo =
    useDemoStore(
      (state) =>
        state.resetDemo,
    );

  const walletBalance =
    useMemo(
      () => demoBalance,
      [demoBalance],
    );

  return {
    mode,

    isDemo:
      mode === "DEMO",

    isReal:
      mode === "REAL",

    demoBalance,

    walletBalance,

    switchToDemo,

    switchToReal,

    setDemoBalance,

    increaseDemoBalance,

    decreaseDemoBalance,

    resetDemo,
  };
}