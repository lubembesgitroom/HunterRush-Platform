export interface RoundData {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

export interface RoundResult extends RoundData {
  serverSeedHash: string;
  multiplier: number;
}