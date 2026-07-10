import { generateSeeds } from "./seed.js";
import { hashServerSeed } from "./hash.js";
import { calculateCrashPoint } from "./crash.js";
import { nextNonce } from "./nonce.js";
import type { RoundResult } from "./types.js";

export function createRound(): RoundResult {
  const { serverSeed, clientSeed } = generateSeeds();

  const nonce = nextNonce();

  const serverSeedHash = hashServerSeed(serverSeed);

  const multiplier = calculateCrashPoint(
    serverSeed,
    clientSeed,
    nonce,
  );

  return {
    serverSeed,
    serverSeedHash,
    clientSeed,
    nonce,
    multiplier,
  };
}