import { createRound, type RoundResult } from "@hunterrush/provably-fair";

export class RoundManager {
  private currentRound: RoundResult | null = null;

  create(): RoundResult {
    this.currentRound = createRound();
    return this.currentRound;
  }

  getCurrent(): RoundResult | null {
    return this.currentRound;
  }

  clear(): void {
    this.currentRound = null;
  }

  hasRound(): boolean {
    return this.currentRound !== null;
  }
}