import { createRound, type RoundResult } from "@hunterrush/provably-fair";

export class RoundManager {
  private currentRound: RoundResult | null = null;

  create(): RoundResult {
    this.currentRound = createRound();
    return this.currentRound;
  }

  current(): RoundResult | null {
    return this.currentRound;
  }

  crashPoint(): number {
    if (!this.currentRound) {
      throw new Error("No active round.");
    }

    return this.currentRound.multiplier;
  }

  clear(): void {
    this.currentRound = null;
  }

  hasRound(): boolean {
    return this.currentRound !== null;
  }
}