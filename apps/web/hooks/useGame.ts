"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import type {
  Bet,
  GameRound,
  Player,
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

  cashout: () => void;
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

  const {
    createBet,
    activateBet,
    cashout: cashoutStore,
    loseBet,
    finishRound,
    clearBet,
  } = useBetStore();

  useEffect(() => {
    function onConnect() {
      setConnected(true);

      socket.emit("player:connect", {
        username: "Guest",
        balance: 1000,
      });

      socket.emit("game:snapshot");
    }

    function onDisconnect() {
      setConnected(false);
      setPlayer(null);
    }

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on(
      "player:welcome",
      (incoming: Player) => {
        setPlayer(incoming);
        setBalance(incoming.balance);
      },
    );

    socket.on(
      "game:snapshot",
      (state: GameSnapshot) => {
        setSnapshot(state);
        setMultiplier(state.multiplier);
      },
    );

    socket.on(
      "wallet:balance",
      (data: {
        playerId: string;
        balance: number;
      }) => {
        if (
          player &&
          data.playerId === player.id
        ) {
          setBalance(data.balance);

          setPlayer({
            ...player,
            balance: data.balance,
          });
        }
      },
    );

    socket.on(
      "round:hash",
      (data: {
        hash: string;
      }) => {
        setRoundHash(data.hash);
      },
    );

    socket.on(
      "multiplier:updated",
      (data: {
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
      },
    );

    socket.on(
  "bet:accepted",
  (bet: Bet) => {
    createBet(
      bet.amount,
      bet.autoCashout,
    );

    socket.emit(
      "game:snapshot",
    );
  },
);

    socket.on(
  "round:started",
  () => {
    activateBet();

    socket.emit(
      "game:snapshot",
    );
  },
);

    socket.on(
      "player:cashedout",
      (result: {
        payout: number;
        multiplier: number;
      }) => {
        cashoutStore(
          result.multiplier,
          result.payout,
        );
      },
    );

    socket.on(
  "round:crashed",
  () => {
    loseBet();

    socket.emit(
      "game:snapshot",
    );
  },
);

    

    socket.on(
      "player:error",
      (err: {
        message: string;
      }) => {
        console.error(err.message);
      },
    );

    socket.on(
      "bet:error",
      (err: {
        message: string;
      }) => {
        console.error(err.message);
      },
    );

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.removeAllListeners();
    };
  }, []);

   function placeBet(
  amount: number,
  autoCashout: number | null,
) {
  if (!connected) return;

  if (!player) return;

  if (
    snapshot?.phase !== "BETTING"
  ) {
    return;
  }

  socket.emit("bet:place", {
    amount,
    autoCashout,
  });
}

  function cashout() {
  if (!connected) return;

  if (!player) return;

  socket.emit("bet:cashout");
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
