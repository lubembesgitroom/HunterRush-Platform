import { EventEmitter } from "node:events";
import type { GameRoundEvent } from "./types.js";

export interface GameEventMap {
  "round:created": GameRoundEvent;
  "betting:opened": GameRoundEvent;
  "round:started": GameRoundEvent;
  "round:crashed": GameRoundEvent;
  "round:revealed": GameRoundEvent;
}

export class EventBus extends EventEmitter {
  emitEvent<K extends keyof GameEventMap>(
    event: K,
    payload: GameEventMap[K],
  ): boolean {
    return this.emit(event, payload);
  }

  onEvent<K extends keyof GameEventMap>(
    event: K,
    listener: (payload: GameEventMap[K]) => void,
  ): this {
    this.on(event, listener);
    return this;
  }
}