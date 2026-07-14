import type { Bet } from "./BetManager.js";
import type { Player } from "./PlayerManager.js";
import type {
  GameRoundEvent,
  MultiplierEvent,
} from "./types.js";

/* ------------------------------------------------ */
/* Event Payloads                                   */
/* ------------------------------------------------ */

export interface RoundHashEvent {
  hash: string;
}

export interface RoundRevealEvent extends GameRoundEvent {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

export interface PlayerEvent {
  player: Player;
}

export interface BetEvent {
  bet: Bet;
}

export interface CashoutEvent {
  betId: string;
  playerId: string;
  multiplier: number;
  payout: number;
}

export interface BalanceEvent {
  playerId: string;
  balance: number;
}

/* ------------------------------------------------ */
/* Event Map                                        */
/* ------------------------------------------------ */

export interface GameEventMap {
  // -------------------------
  // Round lifecycle
  // -------------------------

  "round:hash": RoundHashEvent;

  "round:created": GameRoundEvent;

  "betting:opened": GameRoundEvent;

  "round:started": GameRoundEvent;

  "multiplier:updated": MultiplierEvent;

  "round:crashed": GameRoundEvent;

  "round:revealed": RoundRevealEvent;

  // -------------------------
  // Player lifecycle
  // -------------------------

  "player:connected": PlayerEvent;

  "player:disconnected": PlayerEvent;

  // -------------------------
  // Betting
  // -------------------------

  "bet:placed": BetEvent;

  "bet:cancelled": BetEvent;

  "player:cashedout": CashoutEvent;

  // -------------------------
  // Wallet
  // -------------------------

  "wallet:balance": BalanceEvent;
}

/* ------------------------------------------------ */
/* EventBus                                         */
/* ------------------------------------------------ */

export class EventBus {
  private readonly listeners = new Map<
    keyof GameEventMap,
    Set<(payload: unknown) => void>
  >();

  emitEvent<K extends keyof GameEventMap>(
    event: K,
    payload: GameEventMap[K],
  ): void {
    const listeners = this.listeners.get(event);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(payload);
    }
  }

  onEvent<K extends keyof GameEventMap>(
    event: K,
    listener: (payload: GameEventMap[K]) => void,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(
      listener as (payload: unknown) => void,
    );
  }

  offEvent<K extends keyof GameEventMap>(
    event: K,
    listener: (payload: GameEventMap[K]) => void,
  ): void {
    this.listeners.get(event)?.delete(
      listener as (payload: unknown) => void,
    );
  }

  clear(): void {
    this.listeners.clear();
  }
}