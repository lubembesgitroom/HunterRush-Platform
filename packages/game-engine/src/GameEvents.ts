export const GameEvents = {
  ROUND_CREATED: "round:created",
  BETTING_OPENED: "betting:opened",
  ROUND_STARTED: "round:started",
  ROUND_CRASHED: "round:crashed",
  ROUND_REVEALED: "round:revealed",
} as const;

export type GameEvent =
  (typeof GameEvents)[keyof typeof GameEvents];