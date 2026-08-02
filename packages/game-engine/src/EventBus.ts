import type { Bet } from "./BetManager.js";
import type { Player } from "./PlayerManager.js";
import type {
  GameRoundEvent,
  MultiplierEvent,
} from "./types.js";

/* ==========================================
   Event Payloads
========================================== */

export interface RoundHashEvent {
  hash: string;
}

export interface RoundRevealEvent
  extends GameRoundEvent {
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

/* ==========================================
   Event Map
========================================== */

export interface GameEventMap {
  // Round

  "round:hash": RoundHashEvent;

  "round:created": GameRoundEvent;

  "betting:opened": GameRoundEvent;

  "round:started": GameRoundEvent;

  "multiplier:updated": MultiplierEvent;

  "round:crashed": GameRoundEvent;

  "round:revealed": RoundRevealEvent;
  "waiting:started": { remainingMs: number };
  "countdown:updated": { remainingMs: number };
  "history:updated": unknown[];

  // Players

  "player:connected": PlayerEvent;

  "player:disconnected": PlayerEvent;

  // Bets

  "bet:placed": BetEvent;

  "bet:cancelled": BetEvent;

  "player:cashedout": CashoutEvent;

  // Wallet

  "wallet:balance": BalanceEvent;
}

/* ==========================================
   EventBus
========================================== */

export class EventBus {
  private listeners = new Map<
    keyof GameEventMap,
    Set<(payload: unknown) => void>
  >();

  private anyListeners = new Set<
    (
      event: keyof GameEventMap,
      payload: unknown,
    ) => void
  >();

  emitEvent<K extends keyof GameEventMap>(
    event: K,
    payload: GameEventMap[K],
  ): void {
    const listeners =
      this.listeners.get(event);

    if (listeners) {
      for (const listener of listeners) {
        listener(payload);
      }
    }

    for (const listener of this.anyListeners) {
      listener(event, payload);
    }
  }

  onEvent<K extends keyof GameEventMap>(
    event: K,
    listener: (
      payload: GameEventMap[K],
    ) => void,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(
        event,
        new Set(),
      );
    }

    this.listeners
      .get(event)!
      .add(
        listener as (
          payload: unknown,
        ) => void,
      );
  }

  offEvent<K extends keyof GameEventMap>(
    event: K,
    listener: (
      payload: GameEventMap[K],
    ) => void,
  ): void {
    this.listeners
      .get(event)
      ?.delete(
        listener as (
          payload: unknown,
        ) => void,
      );
  }

  onAny(
    listener: (
      event: keyof GameEventMap,
      payload: unknown,
    ) => void,
  ): void {
    this.anyListeners.add(listener);
  }

  offAny(
    listener: (
      event: keyof GameEventMap,
      payload: unknown,
    ) => void,
  ): void {
    this.anyListeners.delete(listener);
  }

  clear(): void {
    this.listeners.clear();
    this.anyListeners.clear();
  }

  listenerCount(
    event?: keyof GameEventMap,
  ): number {
    if (event) {
      return (
        this.listeners.get(event)?.size ?? 0
      );
    }

    let count = 0;

    for (const listeners of this.listeners.values()) {
      count += listeners.size;
    }

    return count;
  }
}