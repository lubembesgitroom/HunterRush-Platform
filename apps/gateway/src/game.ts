import { Server, Socket } from "socket.io";

import {
  GameEngine,
  GameEvents,
} from "@hunterrush/game-engine";

export function attachGame(
  io: Server,
): GameEngine {
  const engine = new GameEngine(); 
  function broadcastSnapshot(): void {
  io.emit(
    "game:snapshot",
    engine.getSnapshot(),
  );
}

  // ==========================================
  // Engine → Clients
  // ==========================================

  engine.events.onEvent(
    GameEvents.ROUND_HASH_PUBLISHED,
    (payload) => {
      io.emit(
        GameEvents.ROUND_HASH_PUBLISHED,
        payload,
      );
    },
  );

  engine.events.onEvent(
    GameEvents.ROUND_CREATED,
    (payload) => {
      io.emit(
        GameEvents.ROUND_CREATED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.BETTING_OPENED,
    (payload) => {
      io.emit(
        GameEvents.BETTING_OPENED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.ROUND_STARTED,
    (payload) => {
      io.emit(
        GameEvents.ROUND_STARTED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.MULTIPLIER_UPDATED,
    (payload) => {
      io.emit(
        GameEvents.MULTIPLIER_UPDATED,
        payload,
      );
    },
  );

  engine.events.onEvent(
    GameEvents.ROUND_CRASHED,
    (payload) => {
      io.emit(
        GameEvents.ROUND_CRASHED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.ROUND_REVEALED,
    (payload) => {
      io.emit(
        GameEvents.ROUND_REVEALED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.PLAYER_CONNECTED,
    (payload) => {
      io.emit(
        GameEvents.PLAYER_CONNECTED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.PLAYER_DISCONNECTED,
    (payload) => {
      io.emit(
        GameEvents.PLAYER_DISCONNECTED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.BET_PLACED,
    (payload) => {
      io.emit(
        GameEvents.BET_PLACED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.PLAYER_CASHED_OUT,
    (payload) => {
      io.emit(
        GameEvents.PLAYER_CASHED_OUT,
        payload,
      );
      broadcastSnapshot();
    },
  );

  engine.events.onEvent(
    GameEvents.BALANCE_UPDATED,
    (payload) => {
      io.emit(
        GameEvents.BALANCE_UPDATED,
        payload,
      );
      broadcastSnapshot();
    },
  );

  // ==========================================
  // Client → Engine
  // ==========================================

  io.on(
    "connection",
    (socket: Socket) => {
      console.log(
        `🔌 Client Connected: ${socket.id}`,
      );

      // -------------------------
      // Player Connect
      // -------------------------
socket.on(
  "game:snapshot",
  () => {
    socket.emit(
      "game:snapshot",
      engine.getSnapshot(),
    );
  },
);
      socket.on(
        "player:connect",
        (data: {
          username: string;
          balance?: number;
        }) => {
          try {
            const player =
              engine.connectPlayer(
                socket.id,
                data.username,
                data.balance ?? 1000,
              );

            socket.emit(
              "player:welcome",
              player,
            );

            console.log(
              `👤 ${player.username} joined.`,
            );
          } catch (error) {
            socket.emit(
              "player:error",
              {
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to connect player.",
              },
            );
          }
        },
      );

      // -------------------------
      // Place Bet
      // -------------------------

      socket.on(
        "bet:place",
        (data: {
          amount: number;
          autoCashout: number | null;
        }) => {
          try {
            const bet =
              engine.placeBet(
                socket.id,
                data.amount,
                data.autoCashout,
              );

            socket.emit(
              "bet:accepted",
              bet,
            );

            console.log(
              `💰 Bet Accepted | ${socket.id} | ${bet.amount}`,
            );
          } catch (error) {
            socket.emit(
              "bet:error",
              {
                message:
                  error instanceof Error
                    ? error.message
                    : "Unable to place bet.",
              },
            );

            console.log(
              `❌ Bet Rejected | ${socket.id}`,
            );
          }
        },
      );

      // -------------------------
      // Disconnect
      // -------------------------

      socket.on(
        "disconnect",
        () => {
          engine.disconnectPlayer(
            socket.id,
          );

          console.log(
            `❌ ${socket.id} disconnected.`,
          );
        },
      );
    },
  );

  engine.start();

  console.log(
    "🎮 HunterRush Game Engine attached.",
  );

  return engine;
}