export const GameEvents = {
  // -----------------------------
  // Round Lifecycle
  // -----------------------------

  ROUND_HASH_PUBLISHED: "round:hash",

  ROUND_CREATED: "round:created",

  BETTING_OPENED: "betting:opened",

  ROUND_STARTED: "round:started",

  MULTIPLIER_UPDATED: "multiplier:updated",

  ROUND_CRASHED: "round:crashed",

  ROUND_REVEALED: "round:revealed",

  // -----------------------------
  // Player Lifecycle
  // -----------------------------

  PLAYER_CONNECTED: "player:connected",

  PLAYER_DISCONNECTED: "player:disconnected",

  // -----------------------------
  // Betting
  // -----------------------------

  BET_PLACED: "bet:placed",

  BET_CANCELLED: "bet:cancelled",

  PLAYER_CASHED_OUT: "player:cashedout",

  // -----------------------------
  // Wallet
  // -----------------------------

  BALANCE_UPDATED: "wallet:balance",
} as const;

export type GameEvent =
  (typeof GameEvents)[keyof typeof GameEvents];