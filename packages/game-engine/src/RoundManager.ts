import type { FairRound } from "./ProvablyFairService.js";
import type { GameRound } from "./types.js";

function generateId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export class RoundManager {
  private currentRound: GameRound | null = null;

  private history: GameRound[] = [];

  create(fair: FairRound): GameRound {
    const round: GameRound = {
      id: generateId(),
      createdAt: Date.now(),

      crashPoint: fair.crashPoint,

      serverSeed: fair.serverSeed,
      serverSeedHash: fair.serverSeedHash,
      clientSeed: fair.clientSeed,
      nonce: fair.nonce,
    };

    this.currentRound = round;

    return round;
  }

  getCurrent(): GameRound | null {
    return this.currentRound;
  }

  finish(): void {
    if (this.currentRound) {
      this.history.unshift({ ...this.currentRound });

      if (this.history.length > 20) {
        this.history.pop();
      }
    }

    this.currentRound = null;
  }

  getHistory(): GameRound[] {
    return [...this.history];
  }

  clear(): void {
    this.currentRound = null;
    this.history = [];
  }
}