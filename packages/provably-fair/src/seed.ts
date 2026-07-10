import { randomBytes } from "node:crypto";

export interface RoundSeed {
  serverSeed: string;
  clientSeed: string;
}

export function generateServerSeed(): string {
  return randomBytes(32).toString("hex");
}

export function generateClientSeed(): string {
  return randomBytes(16).toString("hex");
}

export function generateSeeds(): RoundSeed {
  return {
    serverSeed: generateServerSeed(),
    clientSeed: generateClientSeed(),
  };
}