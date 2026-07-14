import { randomUUID } from "node:crypto";

import type { FairRound } from "./ProvablyFairService.js";
import type { GameRound } from "./types.js";

export class RoundManager {
  private currentRound: GameRound | null = null;

  private history: GameRound[] = [];

  create(fair: FairRound): GameRound {
    const round: GameRound = {
      id: randomUUID(),
      createdAt: Date.now(),

      crashPoint: fair.crashPoint,

      serverSeed: fair.serverSeed,
      serverSeedHash: fair.serverSeedHash,
      clientSeed: fair.clientSeed,
      nonce: fair.nonce,
    };

    this.currentRound = round;

    this.history.unshift(round);

    if (this.history.length > 20) {
      this.history.pop();
    }

    return round;
  }

  getCurrent(): GameRound | null {
    return this.currentRound;
  }

  finish(): void {
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