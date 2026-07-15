"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import {
  useBetStore,
} from "@/store/betStore";

import type {
  Bet,
  GameRound,
  Player,
} from "@hunterrush/game-engine";

const socket: Socket = io(
  "http://localhost:4000",
  {
    transports: ["websocket"],
    autoConnect: true,
  },
);

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
}

export interface UseGameResult {
  socket: Socket;

  connected: boolean;

  player: Player | null;

  balance: number;

  snapshot: GameSnapshot | null;

  multiplier: number;

  roundHash: string;

  cashout: () => void;

  placeBet: (
    amount: number,
    autoCashout: number | null,
  ) => void;

  cashOut: () => void;
}
function cashout(): void {

  if (!connected) return;

  socket.emit(
    "bet:cashout",
  );

}

export function useGame(): UseGameResult {

  const [connected, setConnected] =
    useState(false);

  const [player, setPlayer] =
    useState<Player | null>(null);

  const [balance, setBalance] =
    useState(1000);

  const [snapshot, setSnapshot] =
    useState<GameSnapshot | null>(null);

  const [multiplier, setMultiplier] =
    useState(1);

  const [roundHash, setRoundHash] =
    useState("");

  //----------------------------------
  // Bet Store
  //----------------------------------

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
      (state) => state.finishRound,
    );

  const clearBet =
    useBetStore(
      (state) => state.clearBet,
    );

  //----------------------------------
  // Socket Events
  //----------------------------------

  useEffect(() => {

    function onConnect() {

      setConnected(true);

      socket.emit(
        "player:connect",
        {
          username: "Guest",
          balance: 1000,
        },
      );

      socket.emit(
        "game:snapshot",
      );

    }

    function onDisconnect() {

      setConnected(false);

      setPlayer(null);

    }

    socket.on(
      "connect",
      onConnect,
    );

    socket.on(
      "disconnect",
      onDisconnect,
    );

    //----------------------------------
    // Player
    //----------------------------------

    socket.on(
      "player:welcome",
      (incoming: Player) => {

        setPlayer(
          incoming,
        );

        setBalance(
          incoming.balance,
        );

      },
    );

    //----------------------------------
    // Snapshot
    //----------------------------------

    socket.on(
      "game:snapshot",
      (
        incoming: GameSnapshot,
      ) => {

        setSnapshot(
          incoming,
        );

        setMultiplier(
          incoming.multiplier,
        );

      },
    );

    //----------------------------------
    // Wallet
    //----------------------------------

    socket.on(
      "wallet:balance",
      (
        data: {
          playerId: string;
          balance: number;
        },
      ) => {

        if (
          player &&
          player.id ===
            data.playerId
        ) {

          setBalance(
            data.balance,
          );

          setPlayer({
            ...player,
            balance:
              data.balance,
          });

        }

      },
    );

    //----------------------------------
    // Round Hash
    //----------------------------------

    socket.on(
      "round:hash",
      (
        data: {
          hash: string;
        },
      ) => {

        setRoundHash(
          data.hash,
        );

      },
    );

    //----------------------------------
    // Betting Open
    //----------------------------------

    socket.on(
      "betting:opened",
      () => {

        clearBet();

      },
    );

    //----------------------------------
    // Round Started
    //----------------------------------

    socket.on(
      "round:started",
      () => {

        activateBet();

      },
    );

    //----------------------------------
    // Multiplier
    //----------------------------------

    socket.on(
      "multiplier:updated",
      (
        data: {
          multiplier: number;
        },
      ) => {

        setMultiplier(
          data.multiplier,
        );

        setSnapshot(
          (previous) => {

            if (!previous)
              return previous;

            return {
              ...previous,
              multiplier:
                data.multiplier,
            };

          },
        );

      },
    );

    //----------------------------------
    // Cashout
    //----------------------------------

    socket.on(
      "player:cashedout",
      (
        data: {
          payout: number;
          multiplier: number;
        },
      ) => {

        cashout(
          data.multiplier,
          data.payout,
        );

      },
    );

    //----------------------------------
    // Crash
    //----------------------------------

    socket.on(
      "round:crashed",
      () => {

        if (
          activeBet &&
          activeBet.status ===
            "ACTIVE"
        ) {

          loseBet();

        }

      },
    );

    //----------------------------------
    // Reveal
    //----------------------------------

    socket.on(
      "round:revealed",
      () => {

        finishRound();

      },
    );

    //----------------------------------
    // Bet Accepted
    //----------------------------------

    socket.on(
      "bet:accepted",
      () => {

        socket.emit(
          "game:snapshot",
        );

      },
    );

    //----------------------------------
    // Errors
    //----------------------------------

    socket.on(
      "bet:error",
      console.error,
    );

    socket.on(
      "player:error",
      console.error,
    );

    return () => {

      socket.removeAllListeners();

    };

  }, [
    player,
    activeBet,
    activateBet,
    cashout,
    loseBet,
    finishRound,
    clearBet,
  ]);

  //----------------------------------
  // Place Bet
  //----------------------------------

  function placeBet(
    amount: number,
    autoCashout: number | null,
  ) {

    if (!connected)
      return;

    if (!player)
      return;

    createBet(
      amount,
      autoCashout,
    );

    socket.emit(
      "bet:place",
      {
        amount,
        autoCashout,
      },
    );

  }

  //----------------------------------
  // Manual Cashout
  //----------------------------------

  function cashOut() {

    socket.emit(
      "bet:cashout",
    );

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
