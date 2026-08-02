export const GameEvents = {
  // Snapshot
  SNAPSHOT: "game:snapshot",

  // Round
  ROUND_HASH_PUBLISHED: "round:hash",
  ROUND_CREATED: "round:created",
  BETTING_OPENED: "betting:opened",
  ROUND_STARTED: "round:started",
  MULTIPLIER_UPDATED: "multiplier:updated",
  ROUND_CRASHED: "round:crashed",
  ROUND_REVEALED: "round:revealed",
  ROUND_FINISHED: "round:finished",
  WAITING_STARTED: "waiting:started",
  COUNTDOWN_UPDATED: "countdown:updated",
  HISTORY_UPDATED: "history:updated",
  ONLINE_COUNT: "online:count",

  // Player
  PLAYER_CONNECTED: "player:connected",
  PLAYER_DISCONNECTED: "player:disconnected",
  PLAYER_JOINED: "player:joined",
  PLAYER_CASHED_OUT: "player:cashedout",

  // Bets
  BET_PLACED: "bet:placed",
  BET_ACCEPTED: "bet:accepted",
  BET_CANCELLED: "bet:cancelled",
  BET_REJECTED: "bet:rejected",

  // Wallet
  BALANCE_UPDATED: "wallet:balance",

  // Errors
  PLAYER_ERROR: "player:error",
  BET_ERROR: "bet:error",
} as const;