import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "hunterrush-gateway",
      version: "0.2.0",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });
}