"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

  placeBet: (
    amount: number,
    autoCashout: number | null,
  ) => void;
}

export function useGame(): UseGameResult {
  const [connected, setConnected] =
    useState(false);

  const [player, setPlayer] =
    useState<Player | null>(null);

  const [balance, setBalance] =
    useState(1000);

  const [snapshot, setSnapshot] =
    useState<GameSnapshot | null>(
      null,
    );

  const [multiplier, setMultiplier] =
    useState(1);

  const [roundHash, setRoundHash] =
    useState("");

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

    socket.on(
      "player:welcome",
      (
        incoming: Player,
      ) => {
        setPlayer(incoming);

        setBalance(
          incoming.balance,
        );
      },
    );

    socket.on(
      "game:snapshot",
      (
        state: GameSnapshot,
      ) => {
        setSnapshot(state);

        setMultiplier(
          state.multiplier,
        );
      },
    );

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
          data.playerId === player.id
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
            if (!previous) {
              return previous;
            }

            return {
              ...previous,
              multiplier:
                data.multiplier,
            };
          },
        );
      },
    );

    socket.on(
      "player:error",
      (
        error: {
          message: string;
        },
      ) => {
        console.error(
          error.message,
        );
      },
    );

    socket.on(
      "bet:error",
      (
        error: {
          message: string;
        },
      ) => {
        console.error(
          error.message,
        );
      },
    );

    socket.on(
      "bet:accepted",
      () => {
        socket.emit(
          "game:snapshot",
        );
      },
    );

    return () => {
      socket.off(
        "connect",
        onConnect,
      );

      socket.off(
        "disconnect",
        onDisconnect,
      );

      socket.removeAllListeners(
        "player:welcome",
      );

      socket.removeAllListeners(
        "game:snapshot",
      );

      socket.removeAllListeners(
        "wallet:balance",
      );

      socket.removeAllListeners(
        "round:hash",
      );

      socket.removeAllListeners(
        "multiplier:updated",
      );

      socket.removeAllListeners(
        "player:error",
      );

      socket.removeAllListeners(
        "bet:error",
      );

      socket.removeAllListeners(
        "bet:accepted",
      );
    };
  }, [player]);
    function placeBet(
    amount: number,
    autoCashout: number | null,
  ): void {
    if (!connected) {
      console.warn(
        "Socket is not connected.",
      );
      return;
    }

    if (!player) {
      console.warn(
        "Player not connected.",
      );
      return;
    }

    if (amount <= 0) {
      console.warn(
        "Invalid bet amount.",
      );
      return;
    }

    socket.emit(
      "bet:place",
      {
        amount,
        autoCashout,
      },
    );
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
  };
}