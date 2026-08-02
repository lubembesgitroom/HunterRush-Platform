"use client";

import { create } from "zustand";

export type GameMode =
  | "REAL"
  | "DEMO";

interface DemoStore {
  mode: GameMode;

  demoBalance: number;

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

const DEFAULT_DEMO_BALANCE =
  50000;

export const useDemoStore =
  create<DemoStore>(
    (set) => ({
      mode: "REAL",

      demoBalance:
        DEFAULT_DEMO_BALANCE,

      switchToDemo: () =>
        set({
          mode: "DEMO",
        }),

      switchToReal: () =>
        set({
          mode: "REAL",
        }),

      setDemoBalance: (
        balance,
      ) =>
        set({
          demoBalance:
            Math.max(
              0,
              balance,
            ),
        }),

      increaseDemoBalance:
        (amount) =>
          set((state) => ({
            demoBalance:
              state.demoBalance +
              Math.max(
                0,
                amount,
              ),
          })),

      decreaseDemoBalance:
        (amount) =>
          set((state) => ({
            demoBalance:
              Math.max(
                0,
                state.demoBalance -
                  Math.max(
                    0,
                    amount,
                  ),
              ),
          })),

      resetDemo: () =>
        set({
          demoBalance:
            DEFAULT_DEMO_BALANCE,
        }),
    }),
  );