"use client";

import { create } from "zustand";

export type BetStatus =
  | "IDLE"
  | "PENDING"
  | "ACTIVE"
  | "CASHED_OUT"
  | "LOST"
  | "FINISHED";

export interface ActiveBet {
  wager: number;
  autoCashout: number | null;
  payout: number;
  cashoutMultiplier: number | null;
  status: BetStatus;
}

interface BetStore {
  activeBet: ActiveBet | null;

  createBet: (
    wager: number,
    autoCashout: number | null,
  ) => void;

  activateBet: () => void;

  cashout: (
    multiplier: number,
    payout: number,
  ) => void;

  loseBet: () => void;

  finishRound: () => void;

  clearBet: () => void;
}

export const useBetStore =
  create<BetStore>((set) => ({
    activeBet: null,

    createBet: (
      wager: number,
      autoCashout: number | null,
    ) =>
      set({
        activeBet: {
          wager,
          autoCashout,
          payout: 0,
          cashoutMultiplier: null,
          status: "PENDING",
        },
      }),

    activateBet: () =>
      set((state) => {
        if (!state.activeBet) return state;

        return {
          activeBet: {
            ...state.activeBet,
            status: "ACTIVE",
          },
        };
      }),

    cashout: (
      multiplier: number,
      payout: number,
    ) =>
      set((state) => {
        if (!state.activeBet) return state;

        return {
          activeBet: {
            ...state.activeBet,
            payout,
            cashoutMultiplier: multiplier,
            status: "CASHED_OUT",
          },
        };
      }),

    loseBet: () =>
      set((state) => {
        if (!state.activeBet) return state;

        return {
          activeBet: {
            ...state.activeBet,
            status: "LOST",
          },
        };
      }),

    finishRound: () =>
      set((state) => {
        if (!state.activeBet) return state;

        return {
          activeBet: {
            ...state.activeBet,
            status: "FINISHED",
          },
        };
      }),

    clearBet: () =>
      set({
        activeBet: null,
      }),
  }));
