import { Server, Socket } from "socket.io";
import {
  GameEngine,
  GameEvents,
} from "@hunterrush/game-engine";

export function attachGame(io: Server): GameEngine {
  const engine = new GameEngine();

  engine.start();

  // ----------------------------------------------------
  // Broadcast Helpers
  // ----------------------------------------------------

  const broadcastSnapshot = () => {
    io.emit(
      GameEvents.SNAPSHOT,
      engine.getSnapshot(),
    );
  };

  // ----------------------------------------------------
  // Engine -> Clients
  // ----------------------------------------------------

  engine.events.onAny((event, payload) => {
    console.log(`[gateway] ${event}`);
    io.emit(event, payload);

    switch (event) {
      case GameEvents.ROUND_CREATED:
      case GameEvents.BETTING_OPENED:
      case GameEvents.ROUND_STARTED:
      case GameEvents.MULTIPLIER_UPDATED:
      case GameEvents.ROUND_CRASHED:
      case GameEvents.ROUND_REVEALED:
      case GameEvents.BET_PLACED:
      case GameEvents.PLAYER_CASHED_OUT:
      case GameEvents.BALANCE_UPDATED:
      case GameEvents.PLAYER_CONNECTED:
      case GameEvents.PLAYER_DISCONNECTED:
        broadcastSnapshot();
        break;
    }
  });

  // ----------------------------------------------------
  // Socket Connections
  // ----------------------------------------------------

  io.on("connection", (socket: Socket) => {
    console.log(`🟢 ${socket.id} connected`);

    // Send current game state
    socket.emit(
      GameEvents.SNAPSHOT,
      engine.getSnapshot(),
    );

    // --------------------------------------------------
    // Join
    // --------------------------------------------------

    socket.on(
      "player:join",
      ({
        username,
        balance,
      }: {
        username: string;
        balance?: number;
      }) => {
        try {
          const player =
            engine.connectPlayer(
              socket.id,
              username,
              balance ?? 50000,
            );

          socket.emit("player:joined", {
            success: true,
            player,
          });

          socket.emit(
            GameEvents.BALANCE_UPDATED,
            {
              playerId: player.id,
              balance: player.balance,
            },
          );

          socket.emit(
            GameEvents.SNAPSHOT,
            engine.getSnapshot(),
          );

          broadcastSnapshot();
        } catch (error) {
          socket.emit(
            GameEvents.PLAYER_ERROR,
            {
              message:
                error instanceof Error
                  ? error.message
                  : "Unable to join.",
            },
          );
        }
      },
    );

    // --------------------------------------------------
    // Place Bet
    // --------------------------------------------------

    socket.on(
      "bet:place",
      ({
        amount,
        autoCashout,
        panelId,
      }: {
        amount: number;
        autoCashout: number | null;
        panelId?: number;
      }) => {
        try {
          const bet =
            engine.placeBet(
              socket.id,
              amount,
              autoCashout,
              panelId,
            );

          socket.emit(
            GameEvents.BET_ACCEPTED,
            bet,
          );

          broadcastSnapshot();
        } catch (error) {
          socket.emit(
            GameEvents.BET_REJECTED,
            {
              message:
                error instanceof Error
                  ? error.message
                  : "Bet rejected.",
            },
          );
        }
      },
    );

    // --------------------------------------------------
    // Manual Cashout
    // --------------------------------------------------

    socket.on(
      "bet:cashout",
      ({ panelId }: { panelId?: number } = {}) => {
        try {
          engine.cashout(socket.id, panelId);

          broadcastSnapshot();
        } catch (error) {
          socket.emit(
            GameEvents.BET_ERROR,
            {
              message:
                error instanceof Error
                  ? error.message
                  : "Cashout failed.",
            },
          );
        }
      },
    );

    // --------------------------------------------------
    // Snapshot Request
    // --------------------------------------------------

    socket.on(
      "game:snapshot",
      () => {
        socket.emit(
          GameEvents.SNAPSHOT,
          engine.getSnapshot(),
        );
      },
    );

    // --------------------------------------------------
    // Disconnect
    // --------------------------------------------------

    socket.on(
      "disconnect",
      () => {
        console.log(
          `🔴 ${socket.id} disconnected`,
        );

        engine.disconnectPlayer(
          socket.id,
        );

        broadcastSnapshot();
      },
    );
  });

  return engine;
}