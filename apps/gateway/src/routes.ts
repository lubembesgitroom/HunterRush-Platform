// apps/gateway/src/routes.ts

import type { FastifyInstance } from "fastify";

import { config } from "./config.js";
import type { GameEngine } from "@hunterrush/game-engine";

export async function registerRoutes(
  app: FastifyInstance,
  engine: GameEngine,
): Promise<void> {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: config.app.name,
      version: config.app.version,
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  });

  app.get("/snapshot", async () => {
    return engine.getSnapshot();
  });

  app.get("/history", async () => {
    return engine.getRoundHistory();
  });

  app.get("/players", async () => {
    return engine.getConnectedPlayers();
  });
}