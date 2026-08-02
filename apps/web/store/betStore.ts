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
  panelId: number;
  betId?: string;
  wager: number;
  autoCashout: number | null;
  payout: number;
  cashoutMultiplier: number | null;
  status: BetStatus;
}

interface BetStore {
  activeBet: ActiveBet | null;
  betsByPanel: Record<number, ActiveBet | null>;

  createBet: (
    wager: number,
    autoCashout: number | null,
    panelId?: number,
    betId?: string,
  ) => void;

  activateBet: (panelId?: number) => void;

  cashout: (
    multiplier: number,
    payout: number,
    panelId?: number,
    betId?: string,
  ) => void;

  loseBet: (panelId?: number) => void;

  finishRound: (panelId?: number) => void;

  clearBet: (panelId?: number) => void;
  clearAllBets: () => void;
  activatePendingBets: () => void;
  losePendingBets: () => void;
  resetPanel: (panelId?: number) => void;
}

export const useBetStore = create<BetStore>((set) => ({
  activeBet: null,
  betsByPanel: {},

  createBet: (
    wager: number,
    autoCashout: number | null,
    panelId = 0,
    betId,
  ) =>
    set((state) => {
      const current = state.betsByPanel[panelId];
      const nextBet: ActiveBet = {
        panelId,
        betId: betId ?? current?.betId,
        wager,
        autoCashout,
        payout: current?.payout ?? 0,
        cashoutMultiplier: current?.cashoutMultiplier ?? null,
        status: "PENDING",
      };

      return {
        activeBet: nextBet,
        betsByPanel: {
          ...state.betsByPanel,
          [panelId]: nextBet,
        },
      };
    }),

  activateBet: (panelId = 0) =>
    set((state) => {
      const current = state.betsByPanel[panelId];

      if (!current) return state;

      const nextBet = {
        ...current,
        status: "ACTIVE" as const,
      };

      return {
        activeBet: nextBet,
        betsByPanel: {
          ...state.betsByPanel,
          [panelId]: nextBet,
        },
      };
    }),

  cashout: (
    multiplier: number,
    payout: number,
    panelId = 0,
    betId,
  ) =>
    set((state) => {
      const matchedEntry = betId
        ? Object.entries(state.betsByPanel).find(
            ([, bet]) => bet?.betId === betId,
          )
        : undefined;

      const targetPanelId = matchedEntry
        ? Number(matchedEntry[0])
        : panelId;

      const current = state.betsByPanel[targetPanelId];

      if (!current) return state;

      const nextBet = {
        ...current,
        betId: betId ?? current.betId,
        payout,
        cashoutMultiplier: multiplier,
        status: "CASHED_OUT" as const,
      };

      return {
        activeBet: nextBet,
        betsByPanel: {
          ...state.betsByPanel,
          [targetPanelId]: nextBet,
        },
      };
    }),

  loseBet: (panelId = 0) =>
    set((state) => {
      const current = state.betsByPanel[panelId];

      if (!current) return state;

      const nextBet = {
        ...current,
        status: "LOST" as const,
      };

      return {
        activeBet: nextBet,
        betsByPanel: {
          ...state.betsByPanel,
          [panelId]: nextBet,
        },
      };
    }),

  finishRound: (panelId = 0) =>
    set((state) => {
      const current = state.betsByPanel[panelId];

      if (!current) return state;
      const nextBet = {
        ...current,
        status: "FINISHED" as const,
      };

      return {
        activeBet: nextBet,
        betsByPanel: {
          ...state.betsByPanel,
          [panelId]: nextBet,
        },
      };
    }),

  clearBet: (panelId = 0) =>
    set((state) => {
      const nextBets = { ...state.betsByPanel };
      delete nextBets[panelId];

      return {
        activeBet: state.activeBet?.panelId === panelId ? null : state.activeBet,
        betsByPanel: nextBets,
      };
    }),

  clearAllBets: () =>
    set({
      activeBet: null,
      betsByPanel: {},
    }),

  resetPanel: (panelId = 0) =>
    set((state) => {
      const nextBets = { ...state.betsByPanel };
      delete nextBets[panelId];

      return {
        activeBet:
          state.activeBet?.panelId === panelId
            ? null
            : state.activeBet,
        betsByPanel: nextBets,
      };
    }),

  activatePendingBets: () =>
    set((state) => {
      const nextBets = Object.fromEntries(
        Object.entries(state.betsByPanel).map(([key, bet]) => {
          if (!bet || bet.status !== "PENDING") {
            return [key, bet];
          }

          return [key, { ...bet, status: "ACTIVE" as const }];
        }),
      );

      const activeBet =
        state.activeBet && state.activeBet.status === "PENDING"
          ? { ...state.activeBet, status: "ACTIVE" as const }
          : state.activeBet;

      return {
        activeBet,
        betsByPanel: nextBets,
      };
    }),

  losePendingBets: () =>
    set((state) => {
      const nextBets = Object.fromEntries(
        Object.entries(state.betsByPanel).map(([key, bet]) => {
          if (!bet || bet.status !== "ACTIVE") {
            return [key, bet];
          }

          return [key, { ...bet, status: "LOST" as const }];
        }),
      );

      return {
        activeBet:
          state.activeBet && state.activeBet.status === "ACTIVE"
            ? { ...state.activeBet, status: "LOST" as const }
            : state.activeBet,
        betsByPanel: nextBets,
      };
    }),
}));
