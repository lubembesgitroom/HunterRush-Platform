import { randomHex } from "./crypto.js";

export interface RoundSeed {
  serverSeed: string;
  clientSeed: string;
}

export function generateServerSeed(): string {
  return randomHex(32);
}

export function generateClientSeed(): string {
  return randomHex(16);
}

export function generateSeeds(): RoundSeed {
  return {
    serverSeed: generateServerSeed(),
    clientSeed: generateClientSeed(),
  };
}