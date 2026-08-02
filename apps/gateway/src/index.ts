// apps/gateway/src/index.ts

import Fastify from "fastify";
import { Server } from "socket.io";

import { attachGame } from "./game.js";
import { registerRoutes } from "./routes.js";
import { config } from "./config.js";

async function bootstrap(): Promise<void> {
  const app = Fastify({
    logger: true,
  });

  await app.register(import("@fastify/cors"), {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  });

  const io = new Server(app.server, {
    cors: {
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    },
  });

  const engine = attachGame(io);

  await registerRoutes(app, engine);

  await app.listen({
    host: config.server.host,
    port: config.server.port,
  });

  app.log.info("");
  app.log.info("════════════════════════════════════");
  app.log.info("🚀 HunterRush Gateway Running");
  app.log.info(
    `HTTP      http://${config.server.host}:${config.server.port}`,
  );
  app.log.info(
    `Socket.IO ws://${config.server.host}:${config.server.port}`,
  );
  app.log.info("════════════════════════════════════");
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});