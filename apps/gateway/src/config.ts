// apps/gateway/src/config.ts

export const config = {
  app: {
    name: "HunterRush Gateway",
    version: "0.2.0",
  },

  server: {
    host: process.env.HOST ?? "0.0.0.0",
    port: Number(process.env.PORT ?? 4000),
  },

  cors: {
    origin: process.env.CORS_ORIGIN ?? "*",
    credentials: true,
  },
} as const;