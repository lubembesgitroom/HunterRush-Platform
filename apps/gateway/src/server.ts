import Fastify from "fastify";

import { attachGame } from "./game.js";
import { createSocketServer } from "./socket.js";

const app = Fastify({
  logger: true,
});

app.get("/", async () => ({
  service: "HunterRush Gateway",
  status: "running",
}));

app.get("/health", async () => ({
  status: "ok",
  service: "hunterrush-gateway",
  version: "0.2.0",
  timestamp: new Date().toISOString(),
}));

const io = createSocketServer(app.server);

attachGame(io);

const PORT = Number(process.env.PORT ?? 4000);

async function start() {
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log("");
    console.log("════════════════════════════════════");
    console.log("🚀 HunterRush Gateway Running");
    console.log(`HTTP      http://localhost:${PORT}`);
    console.log(`Socket.IO ws://localhost:${PORT}`);
    console.log("════════════════════════════════════");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();