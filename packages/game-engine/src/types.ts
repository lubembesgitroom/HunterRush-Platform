import type { RoundResult } from "@hunterrush/provably-fair";

export interface StateTransition {
  from: string;
  to: string;
  timestamp: number;
}

export interface GameRoundEvent {
  round: RoundResult;
}

export interface MultiplierEvent {
  multiplier: number;
}