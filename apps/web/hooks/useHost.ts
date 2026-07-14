"use client";

import { useCallback, useEffect, useState } from "react";

import {
  notifyGameReady,
  onBalanceUpdated,
  onPlayerUpdated,
  openDeposit,
  requestBalance,
} from "@/lib/host";

interface HostPlayer {
  username: string;
  balance: number;
}

export interface UseHostResult {
  player: HostPlayer | null;

  balance: number;

  deposit: () => void;

  refreshBalance: () => void;

  notifyReady: () => void;
}

export function useHost(): UseHostResult {
  const [player, setPlayer] =
    useState<HostPlayer | null>(
      null,
    );

  const [balance, setBalance] =
    useState(0);

  /**
   * ---------------------------------------
   * Tell sportsbook the game is ready
   * ---------------------------------------
   */
  useEffect(() => {
    notifyGameReady();

    requestBalance();

    const unsubscribeBalance =
      onBalanceUpdated(
        (newBalance) => {
          setBalance(
            newBalance,
          );

          setPlayer(
            (
              previous,
            ) => {
              if (
                !previous
              ) {
                return {
                  username:
                    "Guest",
                  balance:
                    newBalance,
                };
              }

              return {
                ...previous,
                balance:
                  newBalance,
              };
            },
          );
        },
      );

    const unsubscribePlayer =
      onPlayerUpdated(
        (
          incomingPlayer,
        ) => {
          setPlayer(
            incomingPlayer,
          );

          setBalance(
            incomingPlayer.balance,
          );
        },
      );

    return () => {
      unsubscribeBalance();

      unsubscribePlayer();
    };
  }, []);

  /**
   * ---------------------------------------
   * Deposit
   * ---------------------------------------
   */

  const deposit =
    useCallback(() => {
      openDeposit();
    }, []);

  /**
   * ---------------------------------------
   * Refresh Wallet
   * ---------------------------------------
   */

  const refreshBalance =
    useCallback(() => {
      requestBalance();
    }, []);

  /**
   * ---------------------------------------
   * Notify Parent
   * ---------------------------------------
   */

  const notifyReady =
    useCallback(() => {
      notifyGameReady();
    }, []);

  return {
    player,

    balance,

    deposit,

    refreshBalance,

    notifyReady,
  };
}