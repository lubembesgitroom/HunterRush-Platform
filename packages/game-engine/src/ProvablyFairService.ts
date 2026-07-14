import {
  calculateCrashPoint,
  generateSeeds,
  hashServerSeed,
  nextNonce,
} from "@hunterrush/provably-fair";

export interface FairRound {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  crashPoint: number;
}

export class ProvablyFairService {
  createRound(): FairRound {
    const seeds = generateSeeds();

    const nonce = nextNonce();

    const serverSeedHash = hashServerSeed(
      seeds.serverSeed,
    );

    const crashPoint = calculateCrashPoint(
      seeds.serverSeed,
      seeds.clientSeed,
      nonce,
    );

    return {
      serverSeed: seeds.serverSeed,
      serverSeedHash,
      clientSeed: seeds.clientSeed,
      nonce,
      crashPoint,
    };
  }
}