"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

import {
  GameEvents,
  type Bet,
  type GameRound,
  type Player,
} from "@hunterrush/game-engine";

import { useBetStore } from "@/store/betStore";

const socket: Socket = io("http://localhost:4000", {
  transports: ["websocket"],
  autoConnect: true,
});

export type GamePhase =
  | "WAITING"
  | "BETTING"
  | "RUNNING"
  | "CRASHED"
  | "REVEAL";

export interface GameSnapshot {
  phase: GamePhase;
  multiplier: number;
  round: GameRound | null;
  roundHistory: GameRound[];
  players: Player[];
  playersOnline: number;
  activeBets: Bet[];
  totalWagered: number;
  countdownMs: number;
}

export interface UseGameResult {
  socket: Socket;
  connected: boolean;
  player: Player | null;
  balance: number;
  snapshot: GameSnapshot | null;
  multiplier: number;
  roundHash: string;

  placeBet(
    amount: number,
    autoCashout: number | null,
    panelId?: number,
  ): void;

  cashout(panelId?: number): void;
}

export function useGame(): UseGameResult {
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [balance, setBalance] = useState(50000);
  const [snapshot, setSnapshot] =
    useState<GameSnapshot | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [roundHash, setRoundHash] = useState("");

  const {
    createBet,
    activatePendingBets,
    cashout: storeCashout,
    losePendingBets,
    clearAllBets,
    resetPanel,
  } = useBetStore();

  useEffect(() => {
    //------------------------------------------------------
    // Connect
    //------------------------------------------------------

    const onConnect = () => {
      setConnected(true);

      socket.emit("player:join", {
        username: "Guest",
        balance: 50000,
      });

      socket.emit("game:snapshot");
    };

    const onDisconnect = () => {
      setConnected(false);
      setPlayer(null);
    };

    //------------------------------------------------------
    // Joined
    //------------------------------------------------------

    const onJoined = (data: {
      success: boolean;
      player: Player;
    }) => {
      setPlayer(data.player);
      setBalance(data.player.balance);
    };

    //------------------------------------------------------
    // Snapshot
    //------------------------------------------------------

    const onSnapshot = (
      state: GameSnapshot,
    ) => {
      setSnapshot(state);
      setMultiplier(state.multiplier);

      if (state.phase === "WAITING") {
        useBetStore.getState().clearAllBets();
      }

      if (state.phase === "BETTING") {
        const panelBets = useBetStore.getState().betsByPanel;
        Object.keys(panelBets).forEach((panelKey) => {
          const panelId = Number(panelKey);
          const panelBet = panelBets[panelId];

          if (!panelBet) return;

          if (panelBet.status === "CASHED_OUT" || panelBet.status === "LOST") {
            resetPanel(panelId);
          }
        });
      }
    };

    //------------------------------------------------------
    // Balance
    //------------------------------------------------------

    const onBalance = (data: {
      playerId: string;
      balance: number;
    }) => {
      setBalance(data.balance);

      setPlayer((prev) =>
        prev
          ? {
              ...prev,
              balance: data.balance,
            }
          : prev,
      );
    };

    //------------------------------------------------------
    // Round Hash
    //------------------------------------------------------

    const onHash = (data: {
      hash: string;
    }) => {
      setRoundHash(data.hash);
    };

    //------------------------------------------------------
    // Multiplier
    //------------------------------------------------------

    const onMultiplier = (data: {
      multiplier: number;
    }) => {
      setMultiplier(data.multiplier);

      setSnapshot((prev) =>
        prev
          ? {
              ...prev,
              multiplier: data.multiplier,
            }
          : prev,
      );
    };

    //------------------------------------------------------
    // Bet Accepted
    //------------------------------------------------------

    const onBetAccepted = (bet: Bet) => {
      createBet(
        bet.amount,
        bet.autoCashout,
        bet.panelId ?? 0,
        bet.id,
      );
    };

    //------------------------------------------------------
    // Round Started
    //------------------------------------------------------

    const onRoundStarted = () => {
      activatePendingBets();
    };

    //------------------------------------------------------
    // Cashout
    //------------------------------------------------------

    const onCashout = (data: {
      payout: number;
      multiplier: number;
      panelId?: number;
      betId?: string;
      playerId?: string;
    }) => {
      storeCashout(
        data.multiplier,
        data.payout,
        data.panelId ?? 0,
        data.betId,
      );
    };

    //------------------------------------------------------
    // Crash
    //------------------------------------------------------

    const onCrash = () => {
      losePendingBets();
    };

    //------------------------------------------------------
    // Register
    //------------------------------------------------------

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("player:joined", onJoined);

    socket.on(
      GameEvents.SNAPSHOT,
      onSnapshot,
    );

    socket.on(
      GameEvents.BALANCE_UPDATED,
      onBalance,
    );

    socket.on(
      GameEvents.ROUND_HASH_PUBLISHED,
      onHash,
    );

    socket.on(
      GameEvents.MULTIPLIER_UPDATED,
      onMultiplier,
    );

    socket.on(
      GameEvents.BET_ACCEPTED,
      onBetAccepted,
    );

    socket.on(
      GameEvents.ROUND_STARTED,
      onRoundStarted,
    );

    socket.on(
      GameEvents.PLAYER_CASHED_OUT,
      onCashout,
    );

    socket.on(
      GameEvents.ROUND_CRASHED,
      onCrash,
    );

    socket.on(
      GameEvents.PLAYER_ERROR,
      console.error,
    );

    socket.on(
      GameEvents.BET_ERROR,
      console.error,
    );

    socket.on(
      GameEvents.BET_REJECTED,
      console.error,
    );

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      socket.off("player:joined", onJoined);

      socket.off(
        GameEvents.SNAPSHOT,
        onSnapshot,
      );

      socket.off(
        GameEvents.BALANCE_UPDATED,
        onBalance,
      );

      socket.off(
        GameEvents.ROUND_HASH_PUBLISHED,
        onHash,
      );

      socket.off(
        GameEvents.MULTIPLIER_UPDATED,
        onMultiplier,
      );

      socket.off(
        GameEvents.BET_ACCEPTED,
        onBetAccepted,
      );

      socket.off(
        GameEvents.ROUND_STARTED,
        onRoundStarted,
      );

      socket.off(
        GameEvents.PLAYER_CASHED_OUT,
        onCashout,
      );

      socket.off(
        GameEvents.ROUND_CRASHED,
        onCrash,
      );

      socket.off(
        GameEvents.PLAYER_ERROR,
      );

      socket.off(
        GameEvents.BET_ERROR,
      );

      socket.off(
        GameEvents.BET_REJECTED,
      );
    };
  }, [activatePendingBets, clearAllBets, createBet, losePendingBets, storeCashout]);

  function placeBet(
    amount: number,
    autoCashout: number | null,
    panelId = 0,
  ) {
    if (!connected) return;
    if (!player) return;
    if (snapshot?.phase !== "BETTING")
      return;

    const panelBet = useBetStore.getState().betsByPanel[panelId];

    if (
      panelBet &&
      ["PENDING", "ACTIVE"].includes(panelBet.status)
    ) {
      return;
    }

    socket.emit("bet:place", {
      amount,
      autoCashout,
      panelId,
    });
  }

  function cashout(panelId = 0) {
    if (!connected) return;
    if (!player) return;

    const panelBet = useBetStore.getState().betsByPanel[panelId];

    if (
      !panelBet ||
      panelBet.status !== "ACTIVE"
    ) {
      return;
    }

    socket.emit("bet:cashout", { panelId });
  }

  return {
    socket,
    connected,
    player,
    balance,
    snapshot,
    multiplier,
    roundHash,
    placeBet,
    cashout,
  };
}