export interface GameRound {
  id: string;

  createdAt: number;

  crashPoint: number;

  serverSeed: string;

  serverSeedHash: string;

  clientSeed: string;

  nonce: number;
}

export interface GameRoundEvent {
  round: GameRound;
}

export interface MultiplierEvent {
  multiplier: number;
}