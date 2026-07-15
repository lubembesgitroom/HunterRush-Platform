"use client";

import { useMemo } from "react";

import { useBetStore } from "@/store/betStore";

export function useBet() {
  const activeBet =
    useBetStore(
      (state) => state.activeBet,
    );

  const createBet =
    useBetStore(
      (state) => state.createBet,
    );

  const activateBet =
    useBetStore(
      (state) => state.activateBet,
    );

  const cashout =
    useBetStore(
      (state) => state.cashout,
    );

  const loseBet =
    useBetStore(
      (state) => state.loseBet,
    );

  const finishRound =
    useBetStore(
      (state) =>
        state.finishRound,
    );

  const clearBet =
    useBetStore(
      (state) => state.clearBet,
    );

  const hasActiveBet =
    useMemo(
      () =>
        activeBet !== null &&
        activeBet.status !==
          "FINISHED",
      [activeBet],
    );

  return {
    activeBet,

    hasActiveBet,

    createBet,

    activateBet,

    cashout,

    loseBet,

    finishRound,

    clearBet,
  };
}