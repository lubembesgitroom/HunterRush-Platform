export interface GameConfig {
  waitingTime: number;
  bettingTime: number;
  revealTime: number;
  tickRate: number;
}

export const DefaultGameConfig: GameConfig = {
  waitingTime: 2000,
  bettingTime: 8000,
  revealTime: 3000,
  tickRate: 50,
};